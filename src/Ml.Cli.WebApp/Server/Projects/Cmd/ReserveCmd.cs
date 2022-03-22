﻿using System.Collections.Generic;
using System.Threading.Tasks;
using Ml.Cli.WebApp.Server.Datasets.Database;
using Ml.Cli.WebApp.Server.Groups.Database.Users;
using Ml.Cli.WebApp.Server.Projects.Database.Project;

namespace Ml.Cli.WebApp.Server.Projects.Cmd;

public class ReserveCmd
{
    private const string UserNotInGroup = "UserNotInGroup";
    private const string UserNotFound = "UserNotFound";
    public const string DatasetNotFound = "DatasetNotFound";
    private readonly DatasetsRepository _datasetsRepository;
    private readonly IProjectsRepository _projectsRepository;
    private readonly AnnotationRepository _annotationRepository;
    private readonly IUsersRepository _usersRepository;

    public ReserveCmd(IUsersRepository usersRepository, 
        DatasetsRepository datasetsRepository, 
        IProjectsRepository projectsRepository,
        AnnotationRepository annotationRepository)
    {
        _usersRepository = usersRepository;
        _datasetsRepository = datasetsRepository;
        _projectsRepository = projectsRepository;
        _annotationRepository = annotationRepository;
    }

    public async Task<ResultWithError<IList<ReserveOutput>, ErrorResult>> ExecuteAsync(string projectId, string fileId,
        string nameIdentifier)
    {
        var commandResult = new ResultWithError<IList<ReserveOutput>, ErrorResult>();
        var user = await _usersRepository.GetUserBySubjectWithGroupIdsAsync(nameIdentifier);
        if (user == null) return commandResult.ReturnError(UserNotFound);
        
        var projectResult = await _projectsRepository.GetProjectAsync(projectId, user.GroupIds);
        if (!projectResult.IsSuccess) return commandResult.ReturnError(projectResult.Error.Key);

        var project = projectResult.Data;
        var datasetId = project.DatasetId;
        var datasetInfo = await _datasetsRepository.GetDatasetInfoAsync(datasetId);
        if (datasetInfo == null) return commandResult.ReturnError(DatasetNotFound);
        if (!user.GroupIds.Contains(datasetInfo.GroupId)) return commandResult.ReturnError(UserNotInGroup);

        var reservations  = await _annotationRepository.ReserveAsync(projectId, datasetId, fileId, project.NumberCrossAnnotation);
        commandResult.Data = reservations;
        return commandResult;
    }
}