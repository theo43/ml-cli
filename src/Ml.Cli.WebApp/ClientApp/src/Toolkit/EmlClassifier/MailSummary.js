﻿import {LoaderModes, MultiSelect} from "@axa-fr/react-toolkit-all";
import React from "react";
import {EmlMode} from "./EmlMode";

const SideAttachements = ({attachments, level=0}) =>{
    if(!attachments){
        return null;
    }
    return <ul>
        {attachments.map((attachment) => {
            return <li style={{backgroundColor:attachment.isVisibleScreen ? "#82b1ff6e": ""} } key={`side_attachment_${attachment.id}`}>
                <span><a href={`${window.location.toString().replace(location.hash,"")}#${attachment.id}`}>{attachment.filename}{attachment.loaderMode === LoaderModes.get ? " (chargement)":""}</a></span>
                {attachment.mail && <SideAttachements attachments={attachment.mail.attachments} level={level+1} />}
            </li>
        })}
    </ul>
}

const MailSummary = ({ mode, ...args}) => {
    
    if(mode === EmlMode.ocr){
        return <MailSummaryOcr {...args}  />
    }
   
    return <MailSummaryClassifier {...args}  />
}

const MailSummaryClassifier = ({attachment, state, setState, labels, title="Mail principal", mainTitle="Mail"}) => {

    let options = [
        { value: 'fun', label: 'For fun' },
        { value: 'work', label: 'For work' },
        { value: 'drink', label: 'For drink' },
        { value: 'sleep', label: 'For sleep' },
        { value: 'swim', label: 'For swim' },
    ];

    if(labels){
        options = labels.map((label) => {
            return {
                "value": label.name,
                "label": label.name
            };
        });
    }

    const onChangeClassification = (event) => {
        const label = event.value;
        setState({...state, annotation : {label}});
    }

    const mail = attachment.mail;
    return <div className={"eml__summary"} >
        <h3>{mainTitle}</h3>
        <ul style={{backgroundColor:attachment.isVisibleScreen ? "#82b1ff6e": ""} }>
            <li>
                <span><a href={`${window.location.toString().replace(location.hash,"")}#${attachment.id}`}>{title}</a></span>
            </li>
        </ul>
        <MultiSelect
            name={"Annotation"}
            onChange={onChangeClassification}
            value={state.annotation.label}
            options={options}
            autoFocus={true}
        />
        { (mail && mail.attachments && mail.attachments.length >0) && <>
            <h4>Pièces jointes</h4>
            <SideAttachements attachments={mail.attachments} />
        </>}
    </div>
}

const MailSummaryOcr = ({attachment, state, setState, labels=[], title="Mail principal", mainTitle="Mail"}) => {
    
    const onChange = (event, label) => {
        setState({...state, annotation : {...state.annotation,[label.name]: event.target.value}});
    }

    const mail = attachment.mail;
    return <div className={"eml__summary"} >
        <h3>{mainTitle}</h3>
        <ul style={{backgroundColor:attachment.isVisibleScreen ? "#82b1ff6e": ""} }>
            <li>
                <span><a href={`${window.location.toString().replace(location.hash,"")}#${attachment.id}`}>{title}</a></span>
            </li>
        </ul>
        {labels.map(label => {
            const userInputValue = state.annotation[label.name];
            const value = userInputValue ? userInputValue : '';
            return (
                <div key={label.name}>
                    <p className="eml__summary-labels-label">{label.name}</p>
                    <textarea
                        name={label.name}
                        value={value}
                        onChange={e => onChange(e, label)}
                        className="eml__summary-labels-textarea"/>
                </div>
            );
        })}
        { (mail && mail.attachments && mail.attachments.length >0) && <>
            <h4>Pièces jointes</h4>
            <SideAttachements attachments={mail.attachments} />
        </>}
    </div>
}

export default MailSummary;