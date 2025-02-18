﻿import React, {useEffect, useState} from "react";
import {fetchGetData,utf8_to_b64} from "../FetchHelper";
import JsonEditorContainer from "./JsonEditor/JsonEditor.container";

export const getDataPaths = async data => {
    if (data.status === 200) {
        const hardDriveLocations = await data.json();
        return hardDriveLocations.map(element => {
            return `api/local/files/${utf8_to_b64(element)}`;
        });
    } else {
        return [];
    }
};

export const getImages = async (item, stringsMatcher, direction, fetch) => {
    const id = 
        "fileName=" +item.fileName + "&stringsMatcher="+ (!stringsMatcher ? item.right.FrontDefaultStringsMatcher : stringsMatcher) +"&directory=" + (direction === "left" ? item.left.ImageDirectory : item.right.ImageDirectory);
    
    const fetchResult = await fetchGetData(fetch)("api/local/datasets/"+ utf8_to_b64(id));
    return getDataPaths(fetchResult);
};

const ImagesLoader = ({item, stringsMatcher, direction, fetch, expectedOutput, onSubmit, MonacoEditor}) => {

    const [state, setState] = useState({
        fileUrls: []
    });

    useEffect(() => {
        let isMounted = true;
        getImages(item, stringsMatcher, direction, fetch)
            .then(urls => {
                if(isMounted){
                    setState({fileUrls: urls});
                }
        });
        return () => {
            isMounted = false;
        }
    }, [stringsMatcher]);

    return <JsonEditorContainer
        expectedOutput={expectedOutput}
        urls={state.fileUrls}
        onSubmit={onSubmit}
        MonacoEditor={MonacoEditor}
    />;
};

export default ImagesLoader;
