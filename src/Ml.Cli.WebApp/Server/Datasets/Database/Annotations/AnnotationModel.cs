﻿using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ml.Cli.WebApp.Server.Datasets.Database.Annotations;

[Table("T_Annotation", Schema = "sch_ECOTAG")]
public class AnnotationModel
{
    [Key] 
    [Column("ANO_Id")] 
    public Guid Id { get; set; }
    
    [Column("FLE_Id")] 
    public Guid FileId { get; set; }
    
    public FileModel File { get; set; }
    
    [Column("ANO_TimeStamp")]
    public long TimeStamp { get; set; }
    
    [Column("PRJ_Id")]
    public Guid ProjectId { get; set; }
    
    [Column("ANO_CreatorNameIdentifier")]
    public string CreatorNameIdentifier { get; set; }
    
    [Column("ANO_ExpectedOutput")]
    public string ExpectedOutput { get; set; }
}
