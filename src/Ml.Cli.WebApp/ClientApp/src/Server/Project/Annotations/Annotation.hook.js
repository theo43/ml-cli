﻿import {resilienceStatus} from "../../shared/Resilience";
import {useHistory, useParams} from "react-router";
import {useEffect, useReducer, useRef} from "react";
import {fetchAnnotate, fetchProject, fetchReserveAnnotations} from "../Project.service";
import {reducer} from "./Annotation.reducer";

export const initialState = {
    status: resilienceStatus.LOADING,
    project: {
        labels: [],
        users: [],
        name: "-",
        annotationType: ""
    },
    annotations: {
        reservationStatus: resilienceStatus.SUCCESS,
        annotationStatus: resilienceStatus.SUCCESS,
        items: [],
        isReservationFinished: false
    }
};
export const init = (fetch, dispatch) => async projectId => {
    const response = await fetchProject(fetch)(projectId);
    let data;
    if(response.status === 403 || response.status >= 500){
        data = {
            project: null,
            status: response.status === 403 ? resilienceStatus.FORBIDDEN : resilienceStatus.ERROR
        };
    } else {
        const project = await response.json();
        data = {
            project,
            status: resilienceStatus.SUCCESS
        };
    }

    dispatch({type: 'init', data});
};

export const reserveAnnotationAsync = (fetch, dispatch, history) => async (projectId, documentId, currentItems, status, environment) => {
    const currentItemsLength = currentItems.length;
    if (status === resilienceStatus.LOADING) {
        return;
    }
    dispatch({type: 'reserve_annotation_start'});

    let fileId = null;
    if (documentId !== "end" && documentId !== "start") {
        fileId = documentId;
    }

    const response = await fetchReserveAnnotations(fetch)(projectId, fileId);
    let data;
    if (response.status === 403 || response.status >= 500) {
        data = {
            status: response.status === 403 ? resilienceStatus.FORBIDDEN : resilienceStatus.ERROR,
            items: [],
        }
        dispatch({type: 'reserve_annotation', data});
        return;
    } 
    
    const annotations = await response.json();
    const annotationLength = annotations.length;
    const promises=[];
    let firstFullfilledFileId = null;
    for (let i = 0; i < annotationLength; i++) {
        const annotation = annotations[i];
        const itemFound = currentItems.find(ci => ci.fileId === annotation.fileId);
        if(itemFound){
            continue;
        }
        const url = `projects/${projectId}/files/${annotation.fileId}`;
        const responsePromise = fetch(url, {method: 'GET'}).then(async response => {
            if (response.status === 403 || response.status >= 500) return;
            const blob = await response.blob();
            annotation.blobUrl = window.URL.createObjectURL(blob);
            data = {
                status: resilienceStatus.LOADING,
                items: [annotation],
            };
            if(!firstFullfilledFileId){
                firstFullfilledFileId = annotation.fileId;
            }
            dispatch({type: 'reserve_annotation', data});
        });
        promises.push(responsePromise);
        const reserveHttpCallInParallel = environment?.datasets?.reserveHttpCallInParallel ?? 2; 
        if(promises.length >= reserveHttpCallInParallel)
        {
            await Promise.allSettled(promises);
            promises.length = 0;
        }
    }
    await Promise.allSettled(promises);
    data = {
        status: resilienceStatus.SUCCESS,
        items: [],
    }
    dispatch({type: 'reserve_annotation', data});
    
    if (currentItemsLength === 0 && annotationLength === 0) {
        const url = "end";
        history.replace(url);
    } else if (fileId == null && currentItemsLength === 0 && annotationLength > 0 && firstFullfilledFileId) {
        const url = `${firstFullfilledFileId}`;
        history.replace(url);
    }
};
export const annotate = (fetch, dispatch, history) => async (projectId, fileId, annotation, annotationId, nextUrl, status) => {
    if (status === resilienceStatus.LOADING ||status === resilienceStatus.POST) {
        return;
    }
    history.push(nextUrl);
    dispatch({type: 'annotate_start'});
    const response = await fetchAnnotate(fetch)(projectId, fileId, annotationId, annotation);
    let data;
    if (response.status >= 500 || response.status === 403) {
        data = {
            status: response.status === 403 ? resilienceStatus.FORBIDDEN : resilienceStatus.ERROR,
            annotation,
            fileId,
        }
    } else {
        const id = !annotationId ? await response.json() : annotationId;
        data = {
            status: resilienceStatus.SUCCESS,
            annotation: {id, expectedOutput: annotation},
            fileId
        }
    }
    dispatch({type: 'annotate', data});
};

function useInterval(callback, delay) {
    const savedCallback = useRef();

    // Remember the latest function.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

export const usePage = (fetch, environment) => {
    const {projectId, documentId} = useParams();
    const history = useHistory();
    const [state, dispatch] = useReducer(reducer, initialState);
    
    useEffect(() => {
        if (state.status === resilienceStatus.LOADING) {
            init(fetch, dispatch)(projectId)
                .then(() => reserveAnnotationAsync(fetch, dispatch, history)(projectId, documentId, state.annotations.items, state.annotations.reservationStatus, environment));
        } 
    }, [documentId]);

    useInterval(() => {
        if(state.annotations.reservationStatus === resilienceStatus.LOADING){
            return;
        }
        const items = state.annotations.items;
        const currentItem = items.find((item) => item.fileId === documentId);
        const currentIndex = !currentItem ? -1 : items.indexOf(currentItem);
        const reserveBeforeEndIndex = environment?.datasets?.reserveBeforeEndIndex ?? 10;
        if (currentIndex + reserveBeforeEndIndex >= items.length) {
            reserveAnnotationAsync(fetch, dispatch, history)(projectId, null, state.annotations.items, state.annotations.reservationStatus, environment)
        }
    }, 5000);

    const items = state.annotations.items;
    const itemSize = items.length;

    const currentItem = items.find((item) => item.fileId === documentId);
    const currentIndex = !currentItem ? -1 : items.indexOf(currentItem);
    let previousUrl = null;
    let nextUrl = null;

    let hasNext = false;
    let hasPrevious = false
    if (currentIndex >= 0) {
        hasPrevious = currentIndex > 0
        if (currentIndex > 0) {
            previousUrl = `${items[currentIndex - 1].fileId}`;
        }
        hasNext = currentIndex + 1 < itemSize
        const nextDocumentId = hasNext ? items[currentIndex + 1].fileId : "end";
        nextUrl = `${nextDocumentId}`;
    }

    const onSubmit = (annotation) => {
        annotate(fetch, dispatch, history)(projectId, currentItem.fileId, annotation, currentItem.annotation.id, nextUrl, state.annotations.annotationStatus);
    };
    const onNext = () => {
        history.push(nextUrl);
    };
    const onPrevious = () => {
        history.push(previousUrl);
    };

    return {state, currentItem: currentItem, onSubmit, onNext, onPrevious, hasPrevious, hasNext, documentId};
};