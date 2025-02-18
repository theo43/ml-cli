import React from 'react';
import Title from '../../../../TitleBar';
import Stepper from '../../../shared/Stepper';
import { TextInput, SelectInput, Button, MultiSelectInput } from '@axa-fr/react-toolkit-all';
import {CheckboxInput, CheckboxModes} from "@axa-fr/react-toolkit-form-input-checkbox";
import HelpButton from '@axa-fr/react-toolkit-help';
import '@axa-fr/react-toolkit-alert/dist/alert.scss';
import '@axa-fr/react-toolkit-popover/dist/popover.scss';
import './New.scss';
import {NAME, CLASSIFICATION, TYPE, GROUP, DATASETS_IMPORT, IMPORTED_DATASET_NAME} from './constants';

const groupsAsOptions = (groups) => groups && groups.length > 0 ? groups.map(group => ({ label: group.name, value: group.id })) : [];

const datasetsAsOptions = (datasets) => datasets && datasets.length > 0 ? datasets.map(dataset => ({label: dataset.substring(dataset.indexOf('/') + 1), value: dataset})) : [];

const datasetsImportOptions = [
    {
        key:"checkbox_areDatasetsImported",
        id:"are_datasets_imported_checkbox",
        value:"datasetsValue",
        label:"Importer depuis un blob :",
        disabled: false
    }
];

const New = ({ fields, onChange, hasSubmit, onSubmit, groups, optionsDatasets }) => (
  <>
      <Title title=" Nouveau dataset" goTo="/datasets" goTitle="Datasets" />
    <Stepper title="Nouveau dataset" link="/datasets/new" />
    <div className="af-form">
      <form className="container" name="newDataset">
        <h1 className="af-title--content">Nouveau dataset</h1>
        <article className="af-panel">
          <section className="af-panel__content af-panel__content--new-dataset">
            <TextInput
              label="Nom"
              name={NAME}
              id={NAME}
              onChange={onChange}
              helpMessage="Ex: cni-dataset"
              forceDisplayMessage={hasSubmit}
              messageType="error"
              {...fields[NAME]}
            />
              <MultiSelectInput
                label="Equipe"
                name={GROUP}
                id={GROUP}
                onChange={onChange}
                options={groupsAsOptions(groups)}
                forceDisplayMessage={hasSubmit}
                messageType="error"
                {...fields[GROUP]}/>
            <SelectInput
              label="Type"
              name={TYPE}
              id={TYPE}
              helpMessage="Ex : Image, Text"
              onChange={onChange}
              options={[
                { value: 'Image', label: 'Images (.jpg, .png, jpeg)' },
                { value: 'Document', label: 'Documents (.txt, .eml, .tiff, .pdf, .doc, etc.)' },
                { value: 'Text', label: 'Text (.txt)' }, 
                { value: 'Eml', label: 'Mail (.eml)' },
              ]}
              forceDisplayMessage={hasSubmit}
              messageType="error"
              {...fields[TYPE]}
            > 
                <HelpButton mode="click" classModifier="classifications">
                    <h2>Informations sur les criticités</h2>
                    <ul>
                        <li>
                            <span> <b>Images</b> : .jpg, .png, jpeg</span>
                        </li>
                        <li>
                            <span><b>Documents</b>: .txt, .eml, .msg, .jpg, .png, jpeg, .tiff, .tif, .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .rtf, .odt, .ods, .odp, .zip</span>
                        </li>
                        <li>
                            <span><b>Text</b>: .txt</span>
                        </li>
                        <li>
                            <span><b>Eml</b>: .eml</span>
                        </li>
                    </ul>
                </HelpButton>
            </SelectInput>
            <SelectInput
              label="Classification"
              name={CLASSIFICATION}
              id={CLASSIFICATION}
              helpMessage="Ex : Critique"
              onChange={onChange}
              options={[
                { value: 'Public', label: 'Publique' },
                { value: 'Internal', label: 'Interne' },
                { value: 'Confidential', label: 'Confidentiel' },
                { value: 'Critical', label: 'Critique' },
              ]}
              forceDisplayMessage={hasSubmit}
              messageType="error"
              {...fields[CLASSIFICATION]}>
              <HelpButton mode="click" classModifier="classifications">
               <h2>Informations sur les criticités</h2>
                  <ul>
                      <li>
                          <span> <b>Public</b> : Une information créée délibérément pour le public, ou spécifiquement conçue pour diffusion dans le public</span>
                      </li>
                      <li>
                          <span><b>Interne</b>: Une information accessible à l'ensemble ou à une large partie des salariés qui n'est pas destinée à des personnes extérieures</span>
                      </li>
                      <li>
                          <span><b>Confidentiel</b>: Une information dont l'accès est limité à un auditoire spécifique</span>
                      </li>
                      <li>
                          <span><b>Critique</b>: Veillez contacter votre manager.</span>
                      </li>
                  </ul>
              </HelpButton>
            </SelectInput>
            <CheckboxInput
              name={DATASETS_IMPORT}
              id={DATASETS_IMPORT}
              mode={CheckboxModes.toggle}
              label="Importer depuis un blob : "
              onChange={onChange}
              options={datasetsImportOptions}
              {...fields[DATASETS_IMPORT]}
            />
            <SelectInput
                label="Dataset à importer : "
                name={IMPORTED_DATASET_NAME}
                id={IMPORTED_DATASET_NAME}
                onChange={onChange}
                forceDisplayMessage={hasSubmit}
                messageType="error"
                options={datasetsAsOptions(optionsDatasets)}
                forceDisplayPlaceholder={true}
                {...fields[IMPORTED_DATASET_NAME]}
            />
          </section>
        </article>
        <Button classModifier="hasiconRight confirm" id="myForm" onClick={onSubmit}>
          <span className="af-btn-text">Valider</span>
          <i className="glyphicon glyphicon-arrowthin-right" />
        </Button>
      </form>
    </div>
  </>
);

export default New;
