using Todo.Data.Infrastructure;
using Todo.Data.Repositories;
using Todo.Model.Models;
using Moq;
using NUnit.Framework;

namespace Todo.Services.Tests.Services
{
    [TestFixture]
    public class AgendaServiceShould
    {
        [Test]
        public void CreateNewProspect()
        {
            var prospect = new Prospect { Companyid = 1, Name = "Prospect", ScheduleId = 1 };
            var company = new Company { Id = 1, Name = "Company" };
            var schedule = new Schedule { Capacity = 20, Id = 1 };
            var prospectToSave = prospect;
            prospectToSave.Company = company;
            prospectToSave.Schedule = schedule;
            var prospectSaved = new Prospect
            {
                Company = company,
                Schedule = schedule,
                Id = 1,
                Name = "Prospect",
                ScheduleId = 1
            };
            var scheduleRepository = new Mock<IScheduleRepository>();
            var prospectRepository = new Mock<IProspectRepository>();
            var companyRepository = new Mock<ICompanyRepository>();
            scheduleRepository.Setup(x => x.GetById(1)).Returns(schedule).Verifiable();
            companyRepository.Setup(x => x.GetById(1)).Returns(company).Verifiable();
            prospectRepository.Setup(x => x.Add(prospect)).Returns(prospectSaved).Verifiable();
            var unitOfWork = new Mock<IUnitOfWork>();
            unitOfWork.Setup(x => x.SaveChanges()).Verifiable();
            var service = new TodoService(scheduleRepository.Object, prospectRepository.Object,
                companyRepository.Object, unitOfWork.Object);

            var result = service.CreateProspect(prospect);

            Assert.IsNotNull(result);
            scheduleRepository.Verify(x => x.GetById(1), Times.Once);
            companyRepository.Verify(x => x.GetById(1), Times.Once);
            prospectRepository.Verify(x => x.Add(prospectToSave), Times.Once);
            Assert.AreEqual(1, result.Id);
            unitOfWork.Verify(x => x.SaveChanges(), Times.Once);

        }

        [Test]
        public void DeleteProspect()
        {
            var prospect = new Prospect { Companyid = 1, ScheduleId = 1, Name = "Prospect", Id = 1 };
            var scheduleRepository = new Mock<IScheduleRepository>();
            var prospectRepository = new Mock<IProspectRepository>();
            prospectRepository.Setup(x => x.Delete(It.IsAny<Prospect>())).Verifiable();
            prospectRepository.Setup(x => x.GetById(1))
                .Returns(prospect)
                .Verifiable();
            var companyRepository = new Mock<ICompanyRepository>();
            var unitOfWork = new Mock<IUnitOfWork>();
            unitOfWork.Setup(x => x.SaveChanges()).Verifiable();
            var service = new TodoService(scheduleRepository.Object, prospectRepository.Object,
                companyRepository.Object, unitOfWork.Object);

            var result = service.DeleteProspect(prospect);

            Assert.IsTrue(result);
            prospectRepository.Verify(x => x.GetById(1), Times.Once);
            prospectRepository.Verify(x => x.Delete(It.IsAny<Prospect>()), Times.Once);
            unitOfWork.Verify(x => x.SaveChanges(), Times.Once);
        }

        [Test]
        public void CreateSchedule()
        {
            var schedule = new Schedule();
            var scheduleRepository = new Mock<IScheduleRepository>();
            var scheduleSaved = new Schedule { Id = 1 };
            scheduleRepository.Setup(x => x.Add(schedule)).Returns(scheduleSaved).Verifiable();
            var prospectRepository = new Mock<IProspectRepository>();
            var companyRepository = new Mock<ICompanyRepository>();
            var unitOfWork = new Mock<IUnitOfWork>();
            unitOfWork.Setup(x => x.SaveChanges()).Verifiable();
            var service = new TodoService(scheduleRepository.Object, prospectRepository.Object,
              companyRepository.Object, unitOfWork.Object);

            var result = service.CreateSchedule(schedule);
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Id);
            scheduleRepository.Verify(x => x.Add(schedule), Times.Once);
            unitOfWork.Verify(x => x.SaveChanges(), Times.Once);
        }

        [Test]
        public void UpdateCapacity()
        {
            var schedule = new Schedule { Capacity = 20, Id = 1 };
            var scheduleRepository = new Mock<IScheduleRepository>();
            scheduleRepository.Setup(x => x.GetById(1)).Returns(new Schedule { Capacity = 10, Id = 1 }).Verifiable();
            scheduleRepository.Setup(x => x.Update(schedule)).Verifiable();
            var prospectRepository = new Mock<IProspectRepository>();
            var companyRepository = new Mock<ICompanyRepository>();
            var unitOfWork = new Mock<IUnitOfWork>();
            unitOfWork.Setup(x => x.SaveChanges()).Verifiable();
            var service = new TodoService(scheduleRepository.Object, prospectRepository.Object,
              companyRepository.Object, unitOfWork.Object);

            var result = service.UpdateCapacity(schedule);
            Assert.IsNotNull(result);
            Assert.IsTrue(result);
            scheduleRepository.Verify(x=>x.GetById(1), Times.Once);
            scheduleRepository.Verify(x => x.Update(It.IsAny<Schedule>()), Times.Once);
            unitOfWork.Verify(x => x.SaveChanges(), Times.Once);

        }
    }
}
