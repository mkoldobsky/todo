using System.Collections.Generic;
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

        [Test]
        public void GetAll()
        {
            var service = new Mock<IUserService>();
            service.Setup(x => x.GetAll()).Returns(new List<ApplicationUser> { new ApplicationUser { Names = "Test" } });
            var userStore = new Mock<IUserStore<ApplicationUser>>();
            var roleStore = new Mock<IRoleStore<IdentityRole, string>>();
            var userManager = new UserManager<ApplicationUser>(userStore.Object);
            var controller = new AccountController(service.Object, userManager, new Mock<ICircuitService>().Object);
            var users = controller.Get() as OkNegotiatedContentResult<List<UserViewModel>>;
            Assert.IsNotNull(users);
            Assert.AreEqual(1, users.Content.Count);
            Assert.AreEqual("Test", users.Content[0].names);
        }

        [Test]
        public void GetActiveUsers()
        {
            var service = new Mock<IUserService>();
            service.Setup(x => x.GetActiveUsers()).Returns(new List<ApplicationUser> { new ApplicationUser { Names = "Test", Active = true} });
            var userStore = new Mock<IUserStore<ApplicationUser>>();
            var roleStore = new Mock<IRoleStore<IdentityRole, string>>();
            var userManager = new UserManager<ApplicationUser>(userStore.Object);
            var controller = new AccountController(service.Object, userManager, new Mock<ICircuitService>().Object);
            var users = controller.GetActiveUsers() as OkNegotiatedContentResult<List<UserViewModel>>;
            Assert.IsNotNull(users);
            Assert.AreEqual(1, users.Content.Count);
            Assert.AreEqual("Test", users.Content[0].names);
            Assert.AreEqual(true, users.Content[0].active);
        }


     

    }
}
