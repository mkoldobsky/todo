var controllers = angular.module('Todo.controllers');
controllers.controller('circuitController', ['$scope', '$rootScope', '$location', '$routeParams', 'toaster', 'navigate', 'modalService', 'patientService', 'circuitService', function ($scope, $rootScope, $location, $routeParams, toaster, navigate, modalService, patientService, circuitService) {
    'use strict';

    var enableTabs = function () {
        $scope.visibleAuditoria = false;
        $scope.visibleAudiometria = false;
        $scope.visibleClinico = false;
        $scope.visibleRadiologia = false;
        $scope.visibleEspirometria = false;
        $scope.visiblePsicologia = false;
        $scope.visibleLaboratorio = false;
        $scope.visibleCardiologia = false;
        $scope.visibleOftamologia = false;
        $scope.visibleOdontologia = false;
        $scope.visibleAuditoria = false;
        $scope.activeAudiometria = false;
        $scope.activeClinico = false;
        $scope.activeRadiologia = false;
        $scope.activeEspirometria = false;
        $scope.activePsicologia = false;
        $scope.activeLaboratorio = false;
        $scope.activeCardiologia = false;
        $scope.activeOftamologia = false;
        $scope.activeOdontologia = false;
        var station = $rootScope.user.stations.selectedStation;
        switch (station) {
            case 'Auditoría':
                $scope.visibleAuditoria = true;
                $scope.visibleAudiometria = true;
                $scope.visibleClinico = true;
                $scope.visibleRadiologia = true;
                $scope.visibleEspirometria = true;
                $scope.visiblePsicologia = true;
                $scope.visibleLaboratorio = true;
                $scope.visibleCardiologia = true;
                $scope.visibleOftamologia = true;
                $scope.visibleOdontologia = true;
                $scope.visibleAuditoria = true;
                $scope.activeAuditoria = true;
                break;
            case 'Clínico':
                $scope.visibleAudiometria = true;
                $scope.visibleClinico = true;
                $scope.visibleRadiologia = true;
                $scope.visibleEspirometria = true;
                $scope.visiblePsicologia = true;
                $scope.visibleLaboratorio = true;
                $scope.visibleCardiologia = true;
                $scope.visibleOftamologia = true;
                $scope.visibleOdontologia = true;
                $scope.visibleAuditoria = true;
                $scope.activeClinico = true;
                break;
            case 'Radiología':
                $scope.visibleRadiologia = true;
                $scope.activeRadiologia = true;
                break;
            case 'Espirometría':
                $scope.visibleEspirometria = true;
                $scope.activeEspirometria = true;
                break;
            case 'Psicología':
                $scope.visiblePsicologia = true;
                $scope.activePsicologia = true;
                break;
            case 'Laboratorio':
                $scope.visibleLaboratorio = true;
                $scope.activeLaboratorio = true;
                break;
            case 'Cardiología':
                $scope.visibleCardiologia = true;
                $scope.activeCardiologia = true;
                break;
            case 'Oftalmología':
                $scope.visibleOftamologia = true;
                $scope.activeOftamologia = true;
                break;
            case 'Odontología':
                $scope.visibleOdontologia = true;
                $scope.activeOdontologia = true;
                break;


            default:
        }
    };

    var getStationInfo = function (patientId, examId, practiceId) {
        return circuitService.getStationInfo({ patientId: patientId, examId: examId, practiceId: practiceId }).then(function (result) {
            $scope.station = result.data;
            var patient = $scope.station.patient;
            patient.documentTypeName = patient.documentType === 0 ? 'DNI' : patient.documentType === 1 ? 'CE' : 'Pasaporte';
            patient.sex = patient.sex === 0 ? 'Masculino' : 'Femenino';
            patient.age = moment().diff(patient.birthday, 'years');
            $scope.station.empo = $scope.station.examType == 0;
            $scope.station.emoa = $scope.station.examType == 1;
            $scope.station.emor = $scope.station.examType == 2;

            $scope.station.selectedForm = $scope.station.forms[0];
            var triaje = $scope.station.triaje;
            var imc = parseFloat(triaje.weight) / (parseFloat(triaje.height.replace(',', '.')) * parseFloat(triaje.height.replace(',', '.')));
            $scope.station.triaje.imc = imc.toFixed(2);
            $scope.station.selectedForm.data = JSON.parse($scope.station.forms[0].values);
            _.each($scope.station.forms, function (element, index) {
                element.url = '/Views/Circuit/Forms/' + element.url;
            });
        });
    };

    var init = function () {
        $scope.examTypes = [{ number: 0, name: 'Examen Médico Preocupacional' }, { number: 1, name: 'Examen Médico Periódico Anual' }, { number: 2, name: 'Examen Médico Ocupacional Retiro' }];
        $scope.documentTypes = [{ number: 0, name: 'DNI' }, { number: 1, name: 'CE' }, { number: 2, name: 'Pasaporte' }];
        $scope.empo = false;
        $scope.emoa = false;
        $scope.emor = false;

        $scope.selectedForm = undefined;
        $scope.showForm = $routeParams.patientId != undefined;
        $scope.newForm = $scope.showForm;
        $scope.edited = false;
        $scope.showMultipleForms = false;
        $scope.searchResults = [];
        $scope.print = false;
        enableTabs();

        if ($scope.showForm) {
            getStationInfo($routeParams.patientId, $routeParams.examId, $routeParams.practiceId).then(function (result) {
                circuitService.startPractice($scope.station).then(function (result) {
                    toaster.pop('info', 'Información', 'Atendiendo el paciente ' + $scope.station.patient.names);
                });
            });
        }
    };

    init();

    $scope.search = function () {
        console.log($scope.filter.documentType.number, $scope.filter.documentNumber);
        var station = $rootScope.user.stations.selectedStation;
        $scope.showForm = false;
        $scope.showMultipleForms = false;
        station.selectedForm = {};
        patientService.getStationExamsByDocument($scope.filter.documentType.number, $scope.filter.documentNumber, station).then(function (result) {
            var exams = result.data;
            _.each(exams, function (element, index) {
                var exam = element;
                var patient = element.patient;
                exam.name = patient.names + ' ' + patient.fatherLastName + ' ' + patient.motherLastName;
                exam.documentType = patient.documentType === 0 ? 'DNI' : patient.documentType === 1 ? 'CE' : 'Pasaporte';
                exam.documentNumber = patient.documentNumber;
                exam.type = exam.examType == 0 ? 'Examen Médico Preocupacional' : exam.examType == 1 ? 'Examen Médico Periódico Anual' : 'Examen Médico Ocupacional Retiro';
                $scope.searchResults.push(element);
            });

        }).catch(function (error) {
            toaster.pop('warning', 'Alerta', 'No se encontraron resultados para su búsqueda');
        });
    };

    $scope.clean = function () {
        $scope.searchResults = [];
        $scope.filter = {};

    };
    $scope.selectExam = function (exam) {
        $scope.searchResults = [];
        $scope.filter = {};
        toaster.pop('info', 'Info', 'Abrir el examen del paciente ' + exam.name + ' con fecha ' + exam.dateTime);
        $scope.showForm = true;
        getStationInfo(exam.patient.id, exam.id, exam.practice.id);

    };

    $scope.finish = function (station) {
        if (!$scope.edited) {
            if ($scope.newForm) {
                navigate.toDashboard();
                $rootScope.$broadcast('navigateToDashboard');
            } else {
                $scope.showForm = false;
                $scope.station = {};
                $scope.searchResults = [];
                $scope.filter = {};
            }
            return;
        }

        circuitService.validateForm(station).then(function (result) {
            save($scope.station);
            if ($scope.newForm) {
                navigate.toDashboard();
                $rootScope.$broadcast('navigateToDashboard');
            } else {
                $scope.showForm = false;
                $scope.station = {};
                $scope.searchResults = [];
                $scope.filter = {};
            }
        }).catch(function (error) {
            var modalOptions = {
                closeButtonText: 'Cancelar',
                actionButtonText: 'Grabar',
                headerText: 'Formulario no validado',
                bodyText: 'Está seguro que quiere grabar el formulario? No se satisfacen todas las validaciones'
            };

            modalService.showModal({}, modalOptions).then(function (result) {
                save($scope.station);
                if ($scope.newForm) {
                    navigate.toDashboard();
                    $rootScope.$broadcast('navigateToDashboard');
                } else {
                    $scope.showForm = false;
                    $scope.station = {};
                    $scope.searchResults = [];
                    $scope.filter = {};
                }
            }, function () {
                return;
            });

        });
    };

    $scope.close = function (station) {
        if (!$scope.edited) {
            if ($scope.newForm) {
                navigate.toDashboard();
                $rootScope.$broadcast('navigateToDashboard');
            } else {
                $scope.showForm = false;
                $scope.station = {};
                $scope.searchResults = [];
                $scope.filter = {};
            }
            return;
        }

        circuitService.validateForm(station).then(function (result) {
            close($scope.station);

            if ($scope.newForm) {
                navigate.toDashboard();
                $rootScope.$broadcast('navigateToDashboard');
            } else {
                $scope.showForm = false;
                $scope.station = {};
                $scope.searchResults = [];
                $scope.filter = {};
            }
        }).catch(function (error) {
            var modalOptions = {
                closeButtonText: 'Cancelar',
                actionButtonText: 'Grabar',
                headerText: 'Formulario no validado',
                bodyText: 'Está seguro que quiere grabar el formulario? No se satisfacen todas las validaciones'
            };

            modalService.showModal({}, modalOptions).then(function (result) {
                save($scope.station);
                circuitService.closeForm(station);
                if ($scope.newForm) {
                    navigate.toDashboard();
                    $rootScope.$broadcast('navigateToDashboard');
                } else {
                    $scope.showForm = false;
                    $scope.station = {};
                    $scope.searchResults = [];
                    $scope.filter = {};
                }
            }, function () {
                return;
            });

        });
    };

    $scope.save = function (station) {
        if ($scope.edited) {
            save($scope.station);
        }
        if ($scope.newForm) {
            circuitService.revertPracticeStatus(station);
            navigate.toDashboard();
            $rootScope.$broadcast('navigateToDashboard');
        } else {
            $scope.showForm = false;
            $scope.station = {};
            $scope.searchResults = [];
            $scope.filter = {};
        }
        return;
    };

    $scope.edited = function () {
        $scope.edited = true;
    };

    $scope.cancel = function (station) {
        if ($scope.edited) {
            var modalOptions = {
                closeButtonText: 'Cancelar',
                actionButtonText: 'Perder modificaciones',
                headerText: 'Cancelar edición ' + station.practice.name + '?',
                bodyText: 'Está seguro que quiere cancelar la edición? Perderá las modificaciones'
            };

            modalService.showModal({}, modalOptions).then(function (result) {
                if ($scope.newForm) {
                    circuitService.revertPracticeStatus(station);
                    navigate.toDashboard();
                    $rootScope.$broadcast('navigateToDashboard');
                } else {
                    $scope.showForm = false;
                    $scope.station = {};
                    $scope.searchResults = [];
                    $scope.filter = {};
                }
                toaster.pop('info', 'Info', 'Edición cancelada');
            }, function () { return; });
        } else {
            if ($scope.newForm) {
                navigate.toDashboard();
                $rootScope.$broadcast('navigateToDashboard');
            } else {
                $scope.showForm = false;
                $scope.station = {};
                $scope.searchResults = [];
                $scope.filter = {};
            }
            toaster.pop('info', 'Info', 'Edición cancelada');

        }

    };

    var save = function (station) {
        console.log(station);
        circuitService.saveForm(station).then(function (result) {
            toaster.pop('info', 'Info', 'Formulario grabado con exito');
        });
    };

    var close = function (station) {
        circuitService.saveForm(station).then(function (result) {
            toaster.pop('info', 'Info', 'Formulario grabado con exito');
            circuitService.closeForm(station).then(function (r) {
                toaster.pop('info', 'Info', 'Formulario cerrado con exito');
            });
        });
    };
}]);
