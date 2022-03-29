import React from 'react';
import Overview from './Overview';
import Label from './LabelsList';
import Users from './Users';
import Title from '../../../TitleBar';
import ActionBar from './ActionBar';
import './Page.scss';

const Page = ({ project, dataset, users, group, annotationStatus }) => (
  <div className="ft-project-page">
    <Title title={project.name} subtitle={`Project de type ${project.annotationType}`} goTo={"/projects"} goTitle={"Projets"} />
    <ActionBar projectId={project.id} isAnnotationClosed={annotationStatus == null ? true :  annotationStatus.isAnnotationClosed} />
    <div className="ft-project-page__informationsContainer">
      <Overview project={project} dataset={dataset} group={group} users={users}  />
      <div className="ft-rowLabelDataset">
          <Label labels={project.labels && project.labels.length > 0 ? project.labels : []} />
          <Users users={users} numberAnnotationsByUsers={annotationStatus == null ? [] : annotationStatus.numberAnnotationsByUsers} />
      </div>
    </div>
  </div>
);

export default Page;
