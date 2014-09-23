using System.Collections.Generic;
using Todo.Model.Models;
using Todo.Services.Validators;
using Moq;
using NUnit.Framework;

namespace Todo.Services.Tests.Validators
{
    [TestFixture]
    public class LengthValidatorShould
    {
        [Test]
        public void ValidateWhenNoLengthValidators()
        {
            var service = new Mock<ICircuitService>();
            service.Setup(x => x.GetLengthValidatorsByFormName("test")).Returns(new Dictionary<string, int>()).Verifiable();
            var values = new Dictionary<string, string>();
            values["key1"] = "value1";
            values["key2"] = "value2";
            var validator = new LengthValidator(service.Object);
            var result = validator.Validate("test", values);
            Assert.IsNotNull(result);
            Assert.AreEqual(0, result.Count);
            service.Verify(x => x.GetLengthValidatorsByFormName("test"), Times.Once);
        }

        [Test]
        public void ValidateWhenAllFieldsValidate()
        {
            var service = new Mock<ICircuitService>();
            service.Setup(x => x.GetLengthValidatorsByFormName("test")).Returns(new Dictionary<string, int>{{"key1", 6}, {"key2", 3}}).Verifiable();
            var values = new Dictionary<string, string>();
            values["key1"] = "value1";
            values["key2"] = "val";
            var validator = new LengthValidator(service.Object);
            var result = validator.Validate("test", values);
            Assert.IsNotNull(result);
            Assert.AreEqual(0, result.Count);
            service.Verify(x => x.GetLengthValidatorsByFormName("test"), Times.Once);
        }

        [Test]
        public void NotValidateWhenLengthNotValidate()
        {
            var service = new Mock<ICircuitService>();
            service.Setup(x => x.GetLengthValidatorsByFormName("test")).Returns(new Dictionary<string, int> { { "key1", 3 }, { "key2", 3 } }).Verifiable();
            var values = new Dictionary<string, string>();
            values["key1"] = "value1";
            values["key2"] = "val";
            var validator = new LengthValidator(service.Object);
            var result = validator.Validate("test", values);
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Count);
            service.Verify(x => x.GetLengthValidatorsByFormName("test"), Times.Once);
            Assert.AreEqual("El campo key1 tiene más de 3 caracteres.", result[0].Message);
            Assert.AreEqual(MessageType.Error, result[0].MessageType);
        }
    }
}
