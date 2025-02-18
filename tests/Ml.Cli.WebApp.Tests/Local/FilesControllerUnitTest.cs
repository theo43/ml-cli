﻿using System;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Win32.SafeHandles;
using Ml.Cli.FileLoader;
using Ml.Cli.WebApp.Local;
using Ml.Cli.WebApp.Local.Paths;
using Moq;
using Xunit;

namespace Ml.Cli.WebApp.Tests
{
    public class FilesControllerUnitTest
    {
        [Fact]
        public void ShouldReturnFile()
        {
            var fileValue = "C:\\someFolderWith+Sign\\{fileName}.png";
            
            var basePath = new Mock<BasePath>("");
            basePath.Setup(mock => mock.IsPathSecure(It.IsAny<string>())).Returns(true);
            
            var fileLoader = new Mock<IFileLoader>();
            fileLoader.Setup(mock => mock.OpenRead("C:\\someFolderWith+Sign\\{fileName}.png"))
                .Returns(new MemoryStream());
            
            var filesController = new FilesController(fileLoader.Object, basePath.Object);

            var result = filesController.ShowFile(Convert.ToBase64String(Encoding.UTF8.GetBytes(fileValue))) as FileStreamResult;
            Assert.Equal("image/png", result.ContentType);
        }
    }
}