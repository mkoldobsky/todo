using System;
using System.Collections.Generic;
using System.Web.Http.Results;
using Todo.API.Controllers;
using Todo.API.Mappers;
using Todo.API.ViewModels;
using Todo.Model.Models;
using Todo.Services;
using Moq;
using NUnit.Framework;

namespace Todo.API.Test
{
    [TestFixture]
    public class AgendaControllerShould
    {
        [TestFixtureSetUp]
        public void Setup()
        {
            AutoMapperConfiguration.Configure();
        }

        [Test]
        public void GetDateCapacityAndScheduleCapacity()
        {
            var service = new Mock<ITodoService>();
            service.Setup(x => x.GetByDate(DateTime.Today))
                .Returns(new List<Schedule> {new Schedule {Capacity = 10}, new Schedule {Capacity = 20}});
            var controller = new AgendaController(service.Object);
            var result = controller.Get(DateTime.Today) as OkNegotiatedContentResult<DateViewModel>;
            Assert.IsNotNull(result);
            Assert.AreEqual(30, result.Content.capacity);
            Assert.AreEqual(10, result.Content.schedules[0].capacity);
            Assert.AreEqual(20, result.Content.schedules[1].capacity);
        }

        [Test]
        public void GetScheduleRemainsAndScheduleRemains()
        {
            var service = new Mock<ITodoService>();
            service.Setup(x => x.GetByDate(DateTime.Today))
                .Returns(new List<Schedule>
                {
                    new Schedule {Capacity = 10, Prospects = new List<Prospect> {new Prospect {Name = "Prospect1"}}},
                    new Schedule {Capacity = 20}
                });
            var controller = new AgendaController(service.Object);
            var result = controller.Get(DateTime.Today) as OkNegotiatedContentResult<DateViewModel>;
            Assert.IsNotNull(result);
            Assert.AreEqual(29, result.Content.remains);
            Assert.AreEqual(9, result.Content.schedules[0].remains);
            Assert.AreEqual(20, result.Content.schedules[1].remains);
        }

        [Test]
        public void GetScheduleCompanyNames()
        {
            var service = new Mock<ITodoService>();
            service.Setup(x => x.GetByDate(DateTime.Today))
                .Returns(new List<Schedule>
                {
                    new Schedule {Capacity = 10, Prospects = new List<Prospect> {new Prospect {Name = "Prospect1", Company = new Company{Name = "Company"}}}},
                    new Schedule {Capacity = 20}
                });
            var controller = new AgendaController(service.Object);
            var result = controller.Get(DateTime.Today) as OkNegotiatedContentResult<DateViewModel>;
            Assert.IsNotNull(result);
            Assert.AreEqual("Company", result.Content.schedules[0].prospects[0].companyName);
            Assert.AreEqual(9, result.Content.schedules[0].remains);
            Assert.AreEqual(20, result.Content.schedules[1].remains);
        }

        [Test]
        public void GetMonthSchedule()
        {
            var today = DateTime.Today;
            var service = new Mock<ITodoService>();
            service.Setup(x => x.GetByDate(today.AddDays(-1)))
                .Returns(new List<Schedule>
                {
                    new Schedule {Capacity = 10, Prospects = new List<Prospect> {new Prospect {Name = "Prospect1", Company = new Company{Name = "Company"}}}},
                    new Schedule {Capacity = 20}
                });
            service.Setup(x => x.GetByDate(today))
                .Returns(new List<Schedule>
                {
                    new Schedule {Capacity = 20},
                    new Schedule {Capacity = 20}
                });
            var controller = new AgendaController(service.Object);
            var result = controller.Get(today.Month, today.Year) as OkNegotiatedContentResult<List<DateViewModel>>;
            Assert.IsNotNull(result);
            Assert.AreEqual(42, result.Content.Count);
            Assert.AreEqual(0, result.Content[0].remains);
            //Assert.AreEqual(29, result.Content[today.Day - 2].remains);
            //Assert.AreEqual(40, result.Content[today.Day - 1].remains);
        }

        [Test]
        public void GetEmptyDayWhenNotFound()
        {
            var service = new Mock<ITodoService>();
            service.Setup(x => x.GetByDate(DateTime.Today))
                .Returns(new List<Schedule>());
            var controller = new AgendaController(service.Object);
            var result = controller.Get(DateTime.Today) as OkNegotiatedContentResult<DateViewModel>;
            Assert.IsNotNull(result);
            Assert.AreEqual(0, result.Content.remains);
            Assert.AreEqual(0, result.Content.capacity);
            Assert.AreEqual(0, result.Content.schedules[0].remains);
            Assert.AreEqual(0, result.Content.schedules[0].capacity);
            Assert.AreEqual(0, result.Content.schedules[1].remains);
            Assert.AreEqual(0, result.Content.schedules[1].capacity);
            Assert.AreEqual("Mañana", result.Content.schedules[0].name);
            Assert.AreEqual("Tarde", result.Content.schedules[1].name);

        }

        [Test]
        public void DeleteProspect()
        {
            var service = new Mock<ITodoService>();
            service.Setup(x => x.DeleteProspect(It.IsAny<Prospect>())).Returns(true).Verifiable();
            var controller = new AgendaController(service.Object);
            var result = controller.Delete(new ProspectViewModel{companyId = 1, scheduleId = 1, name = "Prospect"}) as OkNegotiatedContentResult<bool>;
            Assert.IsNotNull(result);
            service.Verify(x=>x.DeleteProspect(It.IsAny<Prospect>()), Times.Once);
            Assert.AreEqual(true, result.Content);
        }

        [Test]
        public void UpdateCapacityOnExistingSchedule()
        {
            var viewModel = new CapacityViewModel{capacity =  10, id = 1};
            var service = new Mock<ITodoService>();
            service.Setup(x => x.UpdateCapacity(It.IsAny<Schedule>())).Returns(true).Verifiable();
            var controller = new AgendaController(service.Object);
            var result = controller.Update(viewModel) as OkNegotiatedContentResult<bool>;
            Assert.IsNotNull(result);
            Assert.IsTrue(result.Content);
            service.Verify(x=>x.UpdateCapacity(It.IsAny<Schedule>()), Times.Once);
        }
    }
}
