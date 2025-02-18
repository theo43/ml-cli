﻿import {useEffect, useState} from "react";
import {Loader, LoaderModes} from "@axa-fr/react-toolkit-all";
import convertPdfToImagesAsync from "../Pdf/pdf";

function PdfAttachment({blob, id, onChange}){
    const [state, setState] = useState({
        files: [],
        loaderMode: LoaderModes.none,
    });
    useEffect(() => {
        let isMounted = true;
        setState({
            ...state,
            files: [],
            loaderMode: LoaderModes.get,
        });
        onChange("loading", {id, loaderMode: LoaderModes.get});
        convertPdfToImagesAsync([ window.location.origin+"/pdf.2.13.216.min.js"],  window.location.origin+"/pdf.2.13.216.worker.min.js")(blob).then(files => {
            if(isMounted) {
                setState({
                    ...state,
                    files: files,
                    loaderMode: LoaderModes.none,
                });
                onChange("loading", {id, loaderMode: LoaderModes.none});
            }
        });
        return () => {
            isMounted = false;
        };
    }, [id]);
    return (<Loader mode={state.loaderMode} text={"Your browser is extracting the pdf to png images"}>
            <div>
                {state.files.map((file, index) =><div className="eml__attachment-image-container" key={index.toString()}>
                    <span className="eml__attachment-image-title" >p{index}</span>
                    <img  src={file}  alt="pdf page" className="eml__attachment-image" />
                </div>)}
            </div>
    </Loader>);
}

export default PdfAttachment;