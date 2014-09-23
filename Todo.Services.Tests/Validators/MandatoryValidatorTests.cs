using System.Collections.Generic;
using Todo.Model.Models;
using Todo.Services.Validators;
using Moq;
using NUnit.Framework;

namespace Todo.Services.Tests.Validators
{
    [TestFixture]
    public class MandatoryValidatorShould
    {
        [Test]
        public void GetInfoMessageWhenNotFieldsToValidate()
        {
            var service = new Mock<ICircuitService>();
            service.Setup(x => x.GetMandatoryFieldsByFormName("test")).Returns(new List<string>()).Verifiable();
            var values = new Dictionary<string, string>();
            values["key1"] = "value1";
            values["key2"] = "value2";
            var validator = new MandatoryValidator(service.Object);
            var result = validator.Validate("test", values);
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Count);
            service.Verify(x => x.GetMandatoryFieldsByFormName("test"), Times.Once);
            Assert.AreEqual("No hay campos obligatorios", result[0].Message);
            Assert.AreEqual(MessageType.Info, result[0].MessageType);

        }

        [Test]
        public void ValidateWhenContainsAllMandatoryFields()
        {
            var service = new Mock<ICircuitService>();
            service.Setup(x => x.GetMandatoryFieldsByFormName("test")).Returns(new List<string> { "key1", "key2" }).Verifiable();
            var values = new Dictionary<string, string>();
            values["key1"] = "value1";
            values["key2"] = "value2";
            var validator = new MandatoryValidator(service.Object);
            var result = validator.Validate("test", values);
            Assert.IsNotNull(result);
            Assert.AreEqual(0, result.Count);
            service.Verify(x => x.GetMandatoryFieldsByFormName("test"), Times.Once);
        }

        [Test]
        public void NotValidateWhenNotContainsAllMandatoryFields()
        {
            var service = new Mock<ICircuitService>();
            service.Setup(x => x.GetMandatoryFieldsByFormName("test")).Returns(new List<string> { "key1", "key2" }).Verifiable();
            var values = new Dictionary<string, string>();
            values["key1"] = "value1";
            var validator = new MandatoryValidator(service.Object);
            var result = validator.Validate("test", values);
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Count);
            service.Verify(x => x.GetMandatoryFieldsByFormName("test"), Times.Once);
            Assert.AreEqual("El campo obligatorio key2 no está completo", result[0].Message);
        }
    }
}
