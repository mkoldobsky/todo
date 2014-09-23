﻿using System.Collections.Generic;
using System.Web.Http.Results;
using Todo.API.Controllers;
using Todo.API.Mappers;
using Todo.API.ViewModels;
using Todo.Model.Models;
using Todo.Services;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Moq;
using NUnit.Framework;

namespace Todo.API.Test
{
    [TestFixture]
    public class AccountControllerShould
    {
        [TestFixtureSetUp]
        public void Setup()
        {
            AutoMapperConfiguration.Configure();
            
        }


    }
}
