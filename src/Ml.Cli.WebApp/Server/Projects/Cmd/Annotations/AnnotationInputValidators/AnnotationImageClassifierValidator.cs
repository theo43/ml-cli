﻿using System.Linq;
using Ml.Cli.WebApp.Server.Projects.Database;

namespace Ml.Cli.WebApp.Server.Projects.Cmd.Annotations.AnnotationInputValidators;

public record AnnotationImageClassifier
{
    public string Label { get; set; }
}

public static class AnnotationImageClassifierValidator
{
    public static bool Validate(AnnotationImageClassifier annotationImageClassifier, ProjectDataModel project)
    {
        return project.Labels.Any(element => element.Name == annotationImageClassifier.Label);
    }
}