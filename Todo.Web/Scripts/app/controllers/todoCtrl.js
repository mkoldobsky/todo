var controllers = angular.module('todo.controllers');
controllers.controller('agendaController', ['$scope', 'toaster', 'agendaService', 'companyService', '$modal', '$timeout', function ($scope, toaster, agendaService, companyService, $modal, $timeout) {
    "use strict";
    
    $scope.activeDay = true;
    $scope.activeWeek = false;
    $scope.activeMonth = false;
    $scope.turnos = [{ name: 'Todos', id: -1 }, { name: 'Mañana', id: 0 }, { name: 'Tarde', id: 1 }];
    $scope.weekDays = { 'Sunday': 'Domingo',  'Monday': 'Lunes',  'Tuesday': 'Martes',  'Wednesday': 'Miércoles',  'Thursday': 'Jueves',  'Friday': 'Viernes',  'Saturday': 'Sábado' };
    $scope.currentDate = new Date();
    $scope.selectedDate = ($scope.currentDate.getMonth() + 1) + '-' + $scope.currentDate.getDate() + '-' + $scope.currentDate.getFullYear();
    $scope.currentWeekDate = moment();
    $scope.currentMonthDate = moment();

    companyService.getAll().then(function (result) {
        $scope.companies = result.data;
    });


    var updateAgenda = function () {
        agendaService.getDate($scope.selectedDate).then(function (result) {
            var data = result.data;
            $scope.date = data;
            $scope.changeTurno();
            $timeout(updateAgenda, 10000);

        });
    };

    var getMonth = function (dateAsMoment) {
        agendaService.getMonth(dateAsMoment.format('M'), dateAsMoment.format('YYYY')).then(function (result) {
            $scope.month = result.data;
            console.log(result.data);
            $scope.nameMonth = dateAsMoment.format('MMMM');
            $scope.yearMonth = dateAsMoment.format('YYYY');
            $scope.weeks = new Array(7);
            for (var i = 0; i < 6; i++) {
                $scope.weeks[i] = new Array(7);
            }
            _.each($scope.month, function (element, index) {
                
                element.disabled = moment(element.date).format('MMMM') != $scope.nameMonth;
                $scope.weeks[Math.floor(index / 7)][(index % 7)] = element;
            });
        });
    };

    var getWeek = function (date) {
        agendaService.getWeek(date.date(), date.month() + 1, date.year()).then(function(result) {
            $scope.week = result.data;
            var first = moment($scope.week[0].date);
            var last = moment($scope.week[6].date);

            $scope.firstDayOfWeek = first.format('D');
            $scope.lastDayOfWeek = last.format('D');

            $scope.firstMonthWeek = first.format('MMMM');
            $scope.lastMonthWeek = last.format('MMMM');
            $scope.yearWeek = first.format('YYYY');
        });
    };

    updateAgenda();

    $timeout(updateAgenda, 10000);

    $scope.showNextDate = function () {
        var current = $scope.currentDate;
        current.setDate(current.getDate(current) + 1);
        $scope.currentDate = current;
        $scope.selectedDate = ($scope.currentDate.getMonth() + 1) + '-' + $scope.currentDate.getDate() + '-' + $scope.currentDate.getFullYear();
        updateAgenda($scope.selectedDate);
    };

    $scope.showPreviousDate = function () {
        var current = $scope.currentDate;
        current.setDate(current.getDate(current) - 1);
        $scope.currentDate = current;
        $scope.selectedDate = ($scope.currentDate.getMonth() + 1) + '-' + $scope.currentDate.getDate() + '-' + $scope.currentDate.getFullYear();
        updateAgenda($scope.selectedDate);

    };
    
    $scope.showDate = function (date) {
        $scope.currentDate = new Date(date);
        $scope.selectedDate = moment(date).format('MM-D-YYYY');
        $scope.activeDay = true;
        $scope.activeWeek = false;
        $scope.activeMonth = false;
        updateAgenda($scope.selectedDate);
    };

    $scope.showPreviousWeek = function () {
        var currentWeekDate = moment($scope.currentWeekDate._d).subtract('days', 7);
        $scope.currentWeekDate = currentWeekDate;
        getWeek(currentWeekDate);
    };

    $scope.showNextWeek = function () {
        var currentWeekDate = moment($scope.currentWeekDate._d).add('days', 7);
        $scope.currentWeekDate = currentWeekDate;
        getWeek(currentWeekDate);
    };

    $scope.showPreviousMonth = function () {
        $scope.currentMonthDate = moment($scope.currentMonthDate).subtract('months', 1);
        getMonth($scope.currentMonthDate);
    };

    $scope.showNextMonth = function () {
        $scope.currentMonthDate = moment($scope.currentMonthDate).add('months', 1);
        getMonth($scope.currentMonthDate);
    };

    $scope.showDay = function () {
        $scope.activeDay = true;
        $scope.activeWeek = false;
        $scope.activeMonth = false;
    };
    $scope.showWeek = function () {
        getWeek($scope.currentWeekDate);
        $scope.activeDay = false;
        $scope.activeWeek = true;
        $scope.activeMonth = false;
    };
    $scope.showMonth = function () {
        getMonth($scope.currentMonthDate);
        $scope.activeDay = false;
        $scope.activeWeek = false;
        $scope.activeMonth = true;
    };

    $scope.changeCapacity = function (newCapacity) {
        if (isNaN(newCapacity) || newCapacity > 999) {
            toaster.pop('error', 'Error', 'La capacidad debe ser un número no mayor a 999');
            return;
        }
        if (newCapacity < 0) {
            toaster.pop('error', 'Error', 'La capacidad no puede ser menor que cero.');
            return;
        }
        var turno = $scope.selectedTurno.name;
        var turnoToUpdate = _.where($scope.date.schedules, { name:  turno});
        if (turnoToUpdate[0] == undefined) {
            turnoToUpdate[0] = { id: 0, capacity: 0, remains: 0, prospects:[] };
        }
        if (newCapacity < (turnoToUpdate[0].capacity - turnoToUpdate[0].remains)) {
            toaster.pop('error', 'Error', 'La capacidad no puede ser menor a los turnos dados. Elimine turnos antes de cambiar la capacidad.');
            return;
        }
        if (turnoToUpdate[0].id == 0) {
            agendaService.createSchedule({ name: turno, capacity: newCapacity, date: $scope.date.date });
        } else {
            agendaService.updateCapacity(turnoToUpdate[0].id, newCapacity);
        }

        turnoToUpdate[0].capacity = newCapacity;
        turnoToUpdate[0].remains = parseInt(newCapacity) - parseInt(turnoToUpdate[0].prospects.length);
        $scope.newCapacity = 0;
        $scope.changeTurno();
        updateAgenda($scope.selectedDate);
        toaster.pop('info', 'Información', "Capacidad actualizada.");
    };

    $scope.changeTurno = function () {
        var data = $scope.date;
        if ($scope.selectedTurno == undefined || $scope.selectedTurno.id == -1) {
            data.capacity = data.capacity;
            data.remains = data.remains;
        } else {
            var turno = data.schedules[$scope.selectedTurno.id];
            if (turno != undefined) {
                data.capacity = turno.capacity;
                data.remains = turno.remains;
            } else {
                data.capacity = 0;
                data.remains = 0;
            }
        }
    };

    $scope.deleteProspect = function(prospect) {
        agendaService.deleteProspect(prospect);
        updateAgenda($scope.selectedDate);
        toaster.pop('info', 'Información', "Turno eliminado.");
    };

    $scope.modifyProspect = function(prospect) {
        var modalInstance = $modal.open({
            templateUrl: '/Views/Agenda/add-prospect.html',
            controller: modifyProspectInstanceCtrl,
            resolve: {
                companies: function () {
                    return $scope.companies;
                },
                newProspect: function () {
                    return prospect;
                },
                prospect: function(){
                    return prospect;
                },
                date: function () {
                    return $scope.date;
                },
                selectedTurno: function () {
                    return $scope.selectedTurno;
                },
                selectedCompany: function () {
                    return $scope.selectedCompany;
                }
            }
        });

        modalInstance.result.then(function () {
            toaster.pop('info', 'Información', "Turno modificado.");
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };

    $scope.addProspect = function () {
        $scope.prospect = {};
        var modalInstance = $modal.open({
            templateUrl: '/Views/Agenda/add-prospect.html',
            controller: addProspectInstanceCtrl,
            resolve: {
                companies: function () {
                    return $scope.companies;
                },
                newProspect: function () {
                    return $scope.prospect;
                },
                date: function () {
                    return $scope.date;
                },
                selectedTurno: function () {
                    return $scope.selectedTurno;
                },
                selectedCompany: function () {
                    return $scope.selectedCompany;
                }
            }
        });

        modalInstance.result.then(function () {
            toaster.pop('info', 'Información', "Turno agregado.");
            updateAgenda($scope.selectedDate);
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };
    $scope.addMultipleProspects = function () {
        $scope.newProspects = [];
        var modalInstance = $modal.open({
            templateUrl: '/Views/Agenda/add-multiple-prospects.html',
            controller: addMultipleProspectsInstanceCtrl,
            //size: 'lg',
            resolve: {
                companies: function () {
                    return $scope.companies;
                },
                newProspects: function () {
                    return $scope.newProspects;
                },
                date: function () {
                    return $scope.date;
                },
                selectedTurno: function () {
                    return $scope.selectedTurno;
                },
                selectedCompany: function () {
                    return $scope.selectedCompany;
                }
            }
        });

        modalInstance.result.then(function () {
            updateAgenda($scope.selectedDate);
            toaster.pop('info', 'Información', "Turnos agregados.");
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };
}]);

var addProspectInstanceCtrl = function ($scope, $modalInstance, toaster, agendaService, companies, date, selectedTurno, selectedCompany) {
    $scope.companies = companies;
    $scope.newProspect = {};
    $scope.date = date;
    $scope.selectedTurno = selectedTurno;
    $scope.selectedCompany = selectedCompany;
    $scope.clean = function () {
        $scope.newProspect = {};
    };

    $scope.saveProspect = function () {
        if ($scope.newProspect.selectedCompany == undefined) {
            toaster.pop('error', 'Error', 'Empresa inexistente.');
            return;
        }
        if ($scope.newProspect.selectedCompany.originalObject == undefined) {
            toaster.pop('error', 'Error', 'Empresa inexistente.');
            return;
        }
        if ($scope.newProspect.prospect == undefined) {
            toaster.pop('error', 'Error', 'Debe agregar el nombre del paciente en el turno');
            return;
        }
        if ($scope.newProspect.prospect == '') {
            toaster.pop('error', 'Error', 'Debe agregar el nombre del paciente en el turno');
            return;
        }
        var schedule = $scope.date.schedules[$scope.selectedTurno.id];
        if (schedule.id == 0) {
            agendaService.createSchedule({ name: "Mañana", capacity: schedule.capacity, date: $scope.date.date });
            agendaService.createSchedule({ name: "Tarde", capacity: schedule.capacity, date: $scope.date.date });
        }
        agendaService.createProspect({ companyId: $scope.newProspect.selectedCompany.originalObject.id, scheduleId: schedule.id, name: $scope.newProspect.prospect });
        $modalInstance.close($scope.newProspect);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};

var modifyProspectInstanceCtrl = function ($scope, $modalInstance, toaster, agendaService, companies, date, selectedTurno, selectedCompany, prospect) {
    console.log(prospect);
    $scope.companies = companies;
    $scope.prospect = prospect;
    $scope.newProspect = { prospect: prospect.name, selectedCompany: { originalObject: { name: prospect.companyName }}};
    $scope.date = date;
    $scope.selectedTurno = selectedTurno;
    $scope.selectedCompany = selectedCompany;
    $scope.clean = function () {
        $scope.newProspect = prospect;
    };

    $scope.saveProspect = function () {
        if ($scope.newProspect.selectedCompany == undefined) {
            toaster.pop('error', 'Error', 'Empresa inexistente.');
            return;

        }
        if ($scope.newProspect.prospect == '') {
            toaster.pop('error', 'Error', 'Debe agregar el nombre del paciente en el turno');
            return;
        }
        var schedule = $scope.date.schedules[$scope.selectedTurno.id];
        var company = _.where($scope.companies, { name: $scope.newProspect.selectedCompany.originalObject.name });

        agendaService.updateProspect({ id: $scope.prospect.id, companyId: company[0].id, scheduleId: schedule.id, name: $scope.newProspect.prospect });
        $modalInstance.close($scope.newProspect);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};

var addMultipleProspectsInstanceCtrl = function ($scope, $modalInstance, newProspects, agendaService, companies, date, selectedTurno, selectedCompany) {
    $scope.companies = companies;
    $scope.newProspects = newProspects;
    $scope.date = date;
    $scope.selectedTurno = selectedTurno;
    $scope.newProspect = {};
    $scope.clean = function () {
        $scope.newProspects = [];
        $scope.newProspect.prospect = '';
    };

    $scope.addProspect = function(newProspect) {
        $scope.newProspects.push(newProspect.prospect);
        $scope.newProspect.prospect = '';
    };
    
    $scope.saveProspect = function (newProspect) {
        var schedule = $scope.date.schedules[$scope.selectedTurno.id];
        if (schedule.id == 0) {
            agendaService.createSchedule({ name: "Mañana", capacity: schedule.capacity, date: $scope.date.date });
            agendaService.createSchedule({ name: "Tarde", capacity: schedule.capacity, date: $scope.date.date });

        }
        if ($scope.newProspects.length > schedule.remains) {
            toaster.pop('warning', 'Alerta!', 'No existe capacidad sufifciente para agregar los turnos.');
            return;
        }
        _.each($scope.newProspects, function(element, index) {
            agendaService.createProspect({ companyId: newProspect.selectedCompany.originalObject.id, scheduleId: schedule.id, name: element });

        });
        $modalInstance.close($scope.newProspect);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};