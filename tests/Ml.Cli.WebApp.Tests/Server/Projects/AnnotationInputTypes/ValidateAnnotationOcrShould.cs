﻿using System.Collections.Generic;
using Microsoft.Extensions.Logging;
using Ml.Cli.WebApp.Server.Projects.Cmd;
using Ml.Cli.WebApp.Server.Projects.Cmd.Annotations;
using Ml.Cli.WebApp.Server.Projects.Cmd.Annotations.AnnotationInputValidators;
using Ml.Cli.WebApp.Server.Projects.Database;
using Moq;
using Xunit;

namespace Ml.Cli.WebApp.Tests.Server.Projects.AnnotationInputTypes;

public class ValidateAnnotationOcrShould
{
    [Fact]
    public void ShouldValidateLabels()
    {
        var (project, logger) = InitProjectDataWithLogger();
        var jsonAnnotationOcr =
            "{\"width\": 100, \"height\": 200, \"type\": \"png\", \"labels\": {\"someLabel\": \"dzkqzdqs\", \"otherLabel\": \"dzjqsd\"}}";
        Assert.True(AnnotationInputValidator.ValidateExpectedOutput(jsonAnnotationOcr, project, logger));
    }

    [Fact]
    public void ShouldInvalidateLabels()
    {
        var (project, logger) = InitProjectDataWithLogger();
        var jsonAnnotationOcr =
            "{\"width\": 100, \"height\": 200, \"type\": \"png\", \"labels\": {\"wrongLabelName\": \"dzkqzdqs\", \"otherLabel\": \"dzjqsd\"}}";
        Assert.False(AnnotationInputValidator.ValidateExpectedOutput(jsonAnnotationOcr, project, logger));
    }

    public static (ProjectDataModel project, ILogger<SaveAnnotationCmd> logger) InitProjectDataWithLogger()
    {
        var logger = Mock.Of<ILogger<SaveAnnotationCmd>>();
        var project = new ProjectDataModel()
        {
            AnnotationType = "Ocr",
            Labels = new List<LabelDataModel>()
            {
                new()
                {
                    Name = "someLabel"
                },
                new()
                {
                    Name = "otherLabel"
                }
            }
        };
        return (project, logger);
    }
}