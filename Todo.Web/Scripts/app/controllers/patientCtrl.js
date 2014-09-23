var controllers = angular.module('Todo.controllers');

controllers.controller('patientController', ['$scope', '$rootScope', '$timeout', 'navigate', 'toaster', 'commonService', 'patientService', 'companyService', 'circuitService', function ($scope, $rootScope, $timeout, navigate, toaster, commonService, patientService, companyService, circuitService) {
    'use strict';

    var getAllCountries = function () {
        commonService.getAllCountries().then(function (result) {
            $scope.countries = result.data;
            console.log(result.data);
        });
    };

    var getAllCompanies = function () {
        companyService.getAll().then(function (result) {
            $scope.companies = result.data;
        });
    };

    var getAllProtocols = function () {
        commonService.getAllProtocols().then(function (result) {
            $scope.protocols = result.data;
            console.log($scope.protocols);
        });
    };

    var getPractices = function () {
        circuitService.getPractices().then(function (result) {
            $scope.practices = result.data;
            _.each($scope.practices, function (element, index) {
                if (element.hasExams == true) {
                    _.each(element.exams, function (exam, j) {
                        exam.ticked = false;
                    });
                }
            });
            console.log($scope.practices);
        });
    };

    var init = function() {
        $scope.activeData = true;
        $scope.activeProtocol = false;
        $scope.activeShowWaybill = false;
        $scope.newPatient = { practices: [], exams: [] };

        $scope.documentTypes = [{ number: 0, name: 'DNI' }, { number: 1, name: 'CE' }, { number: 2, name: 'Pasaporte' }];
        $scope.sexs = [{ name: 'Masculino', number: 0 }, { name: 'Femenino', number: 1 }];
        $scope.examTypes = [{ number: 0, name: 'Examen Médico Preocupacional' }, { number: 1, name: 'Examen Médico Periódico Anual' }, { number: 2, name: 'Examen Médico Ocupacional Retiro' }];
        $scope.maritalStatuses = [{ id: 0, name: 'Soltero' }, { id: 1, name: 'Casado' }, { id: 2, name: 'Viudo' }, { id: 3, name: 'Divorciado' }, { id: 4, name: 'Conviviente' }];
        $scope.instructionLevels = [
            { id: 0, name: 'Analfabeto' }, { id: 1, name: 'Primaria Incompleta' }, { id: 2, name: 'Primaria Completa' }, { id: 3, name: 'Secundaria Incompleta' }, { id: 4, name: 'Secundaria Completa' },
            { id: 5, name: 'Técnico Incompleto' }, { id: 6, name: 'Técnico Completo' }, { id: 7, name: 'Universitario Incompleto' }, { id: 8, name: 'Universitario Completo' }, { id: 9, name: 'Posgrado' }
        ];
        $scope.format = 'dd/MM/yyyy';

        getAllCountries();
        getAllCompanies();
        getAllProtocols();
        getPractices();
    }


    init();

    $scope.showData = function () {
        $scope.activeData = true;
        $scope.activeProtocol = false;

    };

    $scope.showProtocol = function () {
        $scope.activeData = false;
        $scope.activeProtocol = true;

    };

    $scope.protocolChanged = function() {
        $scope.newPatient.editedProtocolName = $scope.newPatient.protocol.name;
        $scope.newPatient.practices = [];
        console.log($scope.newPatient.protocol);
        _.each($scope.newPatient.protocol.practices, function (element, index) {
            $scope.newPatient.practices[element.id] = true;
        });
    };

    $scope.calculateAge = function (birthday) {
        $scope.newPatient.age = getAge(birthday);
    };
    $scope.open = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;

    };
    $scope.savePatient = function (newPatient) {
        if (newPatient == undefined) {
            toaster.pop('error', 'Error', 'Los datos de la admisión son obligatorios');
            return;
        }
        if (isNaN(newPatient.documentNumber)) {
            toaster.pop('error', 'Error', 'El número de documento debe ser un número.');
            return;
        }
        if (newPatient.documentNumber > 9999999999) {
            toaster.pop('error', 'Error', 'El número de documento debe tener 10 dígitos o menos.');
            return;
        }
        if (newPatient.age < 18 || newPatient.age > 100) {
            toaster.pop('error', 'Error', 'La edad tiene que ser mayor a 18 años y menor a 100.');
            return;
        }
        if (newPatient.names === undefined) {
            toaster.pop('error', 'Error', 'El nombre es obligatorio');
            return;
        }
        if (!isNaN(newPatient.names)) {
            toaster.pop('error', 'Error', 'El nombre no puede ser un número');
            return;
        }
        if (newPatient.fatherLastName === undefined) {
            toaster.pop('error', 'Error', 'El apellido paterno es obligatorio');
            return;
        }
        if (!isNaN(newPatient.fatherLastName)) {
            toaster.pop('error', 'Error', 'El apellido paterno no puede ser un número');
            return;
        }
        if (!isNaN(newPatient.motherLastName)) {
            toaster.pop('error', 'Error', 'El apellido materno no puede ser un número');
            return;
        }

        if (newPatient.protocol === undefined) {
            toaster.pop('error', 'Error', 'Debe seleccionar un protocolo.');
            return;
        }
        if (newPatient.examType === undefined) {
            toaster.pop('error', 'Error', 'Debe seleccionar un tipo de examen.');
            return;
        }
        if (newPatient.selectedCompany === undefined) {
            toaster.pop('error', 'Error', 'Debe seleccionar una empresa.');
            return;
        }
        if (newPatient.job === undefined) {
            toaster.pop('error', 'Error', 'Debe completar el puesto de trabajo');
            return;
        }
        if (newPatient.birthdayLocation === undefined) {
            toaster.pop('error', 'Error', 'Debe completar el lugar de nacimiento');
            return;
        }
        if (newPatient.birthdayCountry === undefined) {
            toaster.pop('error', 'Error', 'Debe Seleccionar el país de nacimiento');
            return;
        }
        if (newPatient.maritalStatus === undefined) {
            toaster.pop('error', 'Error', 'Debe Seleccionar el estado civil');
            return;
        }

        var sex = newPatient.sex;
        var documentType = newPatient.documentType;
        newPatient.documentType = documentType.number;
        newPatient.sex = sex.number;
        newPatient.birthday = newPatient.birthday.split('/').reverse().join('/');
        console.log(newPatient);

        var editedProtocol = { id: newPatient.protocol.id, name: newPatient.editedProtocolName, Practices: newPatient.practices, Exams: newPatient.exams };
        console.log(editedProtocol);
        patientService.verifyAndCreateProtocol(editedProtocol).then(function (protocol) {
            if (newPatient.id) {
                patientService.updatePatient(newPatient).then(function (result) {
                    toaster.pop("info", "Información", "Paciente actualizado correctamente");
                    var patient = result.data;
                    var admision = { company: $scope.selectedCompany.originalObject, job: newPatient.job, protocol: protocol.data, patient: patient, examType: newPatient.examType };
                    patientService.createAdmision(admision).then(function (res) {
                        toaster.pop("info", "Información", "Admisión creada correctamente");
                        $scope.patient = patient;
                        $scope.activeShowWaybill = true;
                    });
                });
            } else {
                patientService.createPatient(newPatient).then(function (result) {
                    var patient = result.data;
                    $scope.patient = patient;
                    $scope.newPatient.sex = sex;
                    $scope.newPatient.documentType = documentType;
                    toaster.pop("info", "Información", "Paciente creado correctamente");
                    var admision = { company: newPatient.selectedCompany.originalObject, job: newPatient.job, protocol: protocol.data, patient: patient, examType: newPatient.examType.number };
                    patientService.createAdmision(admision).then(function (res) {
                        toaster.pop("info", "Información", "Admisión creada correctamente");
                        $scope.activeShowWaybill = true;
                    });
                });
            }

        });

    };

    $scope.clean = function () {
        $scope.patient = {};
        $scope.newPatient = { practices: [], exams: [] };
        $scope.activeShowWaybill = false;
    };

    $scope.showWaybill = function (patientId) {
        if (!$scope.activeShowWaybill) {
            return;
        }
        console.log($scope.patient);
        navigate.toWaybill($scope.patient.id);
    };

    $scope.verifyPatient = function (newPatient) {
        patientService.getByDocument({ type: newPatient.documentType.number, number: newPatient.documentNumber }).then(function (result) {
            var patient = result.data;
            patient.documentType = $scope.documentTypes[patient.documentType];
            patient.sex = $scope.sexs[patient.sex];
            patient.fullName = patient.names + ' ' + patient.fatherLastName + ' ' + (patient.motherLastName !== null ? patient.motherLastName : '');
            patient.age = getAge(patient.birthday);
            patient.birthday = moment(patient.birthday).format('D/M/YYYY');
            patient.birthdayCountry = $scope.countries[patient.birthdayCountry.id - 1];
            
            console.log(patient);
            $scope.newPatient = patient;
            $scope.patient = patient;
            $scope.activeShowWaybill = true;
            toaster.pop("info", "Información", "Paciente encontrado.");
        }).catch(function (errorResponse) {
            if (errorResponse.status === 404) {
                toaster.pop('warning', "Alerta", "No se ha encontrado un registro con ese nro.de documento");
            }
        });
    };

    $scope.saveTriaje = function (id, triaje) {
        if (triaje == undefined) {
            toaster.pop('error', 'Error', 'Los datos del triaje son obligatorios');
            return;
        }
        if (isNaN(triaje.weight)) {
            toaster.pop('error', 'Error', 'El peso debe ser un número');
            return;
        }
        if (triaje.height === undefined || isNaN(triaje.height.replace(',', '.'))) {
            toaster.pop('error', 'Error', 'La talla debe ser un número');
            return;
        }
        if (isNaN(triaje.satPercentage)) {
            toaster.pop('error', 'Error', 'La SAT% debe ser un número');
            return;
        }
        if (isNaN(triaje.temperature)) {
            toaster.pop('error', 'Error', 'La temperatura debe ser un número');
            return;
        }
        if (isNaN(triaje.respiratoryRate)) {
            toaster.pop('error', 'Error', 'La frecuencia respiratoria debe ser un número');
            return;
        }

        if (isNaN(triaje.heartRate)) {
            toaster.pop('error', 'Error', 'La frecuencia cardíaca debe ser un número');
            return;
        }
        triaje.patient = { id: id };
        patientService.createTriaje(triaje).then(function (result) {
            console.log(result);
            toaster.pop("info", "Información", "Triaje guardado correctamente");
        }).catch(function (errorResponse) {
            if (errorResponse.status === 404) {
                toaster.pop('error', "Error", "No se ha encontrado un registro con ese nro.de documento o el paciente no tiene admisiones");
            }
        });
    };

    $scope.cleanTriaje = function () {
        $scope.newPatient = {};
        $scope.triaje = {};
    };

    $scope.getIMC = function (triaje) {
        console.log(triaje);
        var imc = parseFloat(triaje.weight) / (parseFloat(triaje.height.replace(',', '.')) * parseFloat(triaje.height.replace(',', '.')));
        $scope.triaje.imc = imc.toFixed(2);
    };

}]);

function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString.split('/').reverse().join('/'));
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}