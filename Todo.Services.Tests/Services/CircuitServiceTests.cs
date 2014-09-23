using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using Todo.Data.Infrastructure;
using Todo.Data.Repositories;
using Todo.Model.Models;
using Moq;
using NUnit.Framework;
using ExamStatus = Todo.Model.Models.ExamStatus;

namespace Todo.Services.Tests.Services
{
    [TestFixture]
    public class CircuitServiceShould
    {
        [Test]
        public void GetStationInfoByPracticeId()
        {
            var repository = new Mock<ICircuitRepository>();
            repository.Setup(x => x.GetPracticeById(1)).Returns(new Practice {Id = 1, Name = "Practice"}).Verifiable();
            var examPatientRepository = new Mock<IExamPatientRepository>();
            examPatientRepository.Setup(x=>x.GetNotCompletedExams()).Returns(GetLeftExamPatients()).Verifiable();
            examPatientRepository.Setup(x => x.GetTodayCompletedExams())
                .Returns(GetCompletedExamPatients())
                .Verifiable();
            var service = new CircuitService(repository.Object, examPatientRepository.Object, new Mock<IUnitOfWork>().Object);
            var result = service.GetStationInfoByPracticeId(1);
            Assert.IsNotNull(result);
            repository.Verify(x=>x.GetPracticeById(1), Times.Once);
            examPatientRepository.Verify(x=>x.GetNotCompletedExams(), Times.Once);
            examPatientRepository.Verify(x=>x.GetTodayCompletedExams(), Times.Once);
            Assert.AreEqual(1, result.LeftExams);
            Assert.AreEqual(1, result.CompletedExams);
        }

        private List<ExamPatient> GetCompletedExamPatients()
        {
            return new List<ExamPatient>
            {
                new ExamPatient
                {
                    Status = ExamStatus.Cerrado,
                    DateTime = DateTime.Today,
                    Protocol = new Protocol{Practices = new Collection<Practice>{new Practice{Id=3}}}
                },
                new ExamPatient
                {
                    Status = ExamStatus.Cerrado,
                    DateTime = DateTime.Today,
                    Protocol = new Protocol {Practices = new Collection<Practice> {new Practice {Id = 1}}},
                    Results = new Collection<PracticeResult>{new PracticeResult{Practice = new Practice{Id = 1}}}
                }
            };
        }

        private List<ExamPatient> GetLeftExamPatients()
        {
            return new List<ExamPatient>
            {
                new ExamPatient
                {
                    Status = ExamStatus.EnAtencion,
                    Protocol = new Protocol{Practices = new Collection<Practice>{new Practice{Id=3}}}
                },
                new ExamPatient
                {
                    Status = ExamStatus.NoAtendido,
                    Protocol = new Protocol {Practices = new Collection<Practice> {new Practice {Id = 1}}}
                }
            };
        }
    }


}
