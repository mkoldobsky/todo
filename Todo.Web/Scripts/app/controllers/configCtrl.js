var controllers = angular.module('Todo.controllers');
controllers.controller('configController', ['$scope', '$rootScope', '$location', 'toaster', 'userMngrSvc', 'commonService', 'circuitService', 'companyService', '$modal', function ($scope, $rootScope, $location, toaster, userMngrSvc, commonService, circuitService, companyService, $modal) {
    "use strict";


    var getActiveUsers = function () {
        userMngrSvc.getActiveUsers()
            .then(function (result) {
                var users = result.data;
                _.each(users, function (element, index) {
                    element.documentTypeName = element.documentType === 0 ? 'DNI' : element.documentType === 1 ? 'CE' : 'Pasaporte';
                });
                $scope.users = users;
                $scope.filteredUsers = $scope.users;
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
        });
    };

    var getCompanies = function () {
        companyService.getAll().then(function (result) {
            $scope.companies = result.data;
            $scope.filteredCompanies = $scope.companies;
        });
    };

    var getProtocols = function () {
        commonService.getAllProtocols().then(function (result) {
            $scope.protocols = result.data;
            $scope.filteredProtocols = $scope.protocols;
        });
    };


    var init = function () {
        $scope.documentTypes = [{ number: 0, name: 'DNI' }, { number: 1, name: 'CE' }, { number: 2, name: 'Pasaporte' }];
        var user = $rootScope.user;
        $scope.showTabCompanies = _.contains(user.roles, 'AdministrativoEmpresas');
        $scope.showTabProtocols = _.contains(user.roles, 'AdministrativoProtocolos');
        $scope.activeCompanies = $scope.showTabCompanies;
        $scope.activeProtocols = $scope.showTabProtocols;
        $scope.configTab = $scope.showTabCompanies ? "/Views/Admin/companies.html" : "/Views/Admin/protocols.html";
        getActiveUsers();
        getPractices();
        getCompanies();
        getProtocols();
    };

    init();

    $scope.search = function (filter) {
        if (filter == undefined) {
            $scope.filteredUsers = $scope.users;
            return;
        }
        if (filter.documentType && filter.documentNumber && filter.names && filter.fatherLastName && filter.motherLastName) {
            $scope.filteredUsers = $scope.users;
            return;

        }
        $scope.filteredUsers = [];
        _.each($scope.users, function (element, index) {
            if (filter.documentType !== undefined) {
                if (element.documentType === filter.documentType.number && _.str.include(element.documentNumber, filter.documentNumber)) {
                    $scope.filteredUsers.push(element);
                }
            } else {
                if (filter.names !== undefined) {
                    if (_.str.include(element.names.toUpperCase(), filter.names.toUpperCase())) {
                        $scope.filteredUsers.push(element);
                    }
                }
            }
            if (filter.fatherLastName !== undefined && element.fatherLastName !== undefined) {
                if (_.str.include(element.fatherLastName.toUpperCase(), filter.fatherLastName.toUpperCase())) {
                    $scope.filteredUsers.push(element);
                }
            }
            if (filter.motherLastName !== undefined && element.motherLastName !== undefined) {
                if (_.str.include(element.motherLastName.toUpperCase(), filter.motherLastName.toUpperCase())) {
                    $scope.filteredUsers.push(element);

                }
            }
        });
    };

    $scope.searchCompanies = function (filter) {
        if (filter == undefined) {
            $scope.filteredCompanies = $scope.companies;
            return;
        }
        if (filter.ruc && filter.name) {
            $scope.filteredCompanies = $scope.companies;
            return;
        }

        $scope.filteredCompanies = [];
        _.each($scope.companies, function (element, index) {
            if (element.ruc === filter.ruc) {
                $scope.filteredCompanies.push(element);
            }
            if (filter.name !== undefined) {
                if (_.str.include(element.name.toUpperCase(), filter.name.toUpperCase())) {
                    $scope.filteredCompanies.push(element);
                }
            }
        });
    };

    $scope.searchProtocols = function (filter) {
        if (filter == undefined) {
            $scope.filteredProtocols = $scope.protocols;
            return;
        }
        if (filter.name == undefined) {
            $scope.filteredProtocols = $scope.protocols;
            return;
        }
        if (filter.name.length > 70) {
            toaster.pop('error', 'Error', 'El nombre debe tener menos de 70 caracteres');
            return;
        }

        $scope.filteredProtocols = [];
        _.each($scope.protocols, function (element, index) {
            if (filter.name !== undefined) {
                if (_.str.include(element.name.toUpperCase(), filter.name.toUpperCase())) {
                    $scope.filteredProtocols.push(element);
                }
            }
        });
        if ($scope.filteredProtocols.length == 0) {
            toaster.pop('warning', 'Alerta', 'No se han encontrado registros. \nPor favor, ingrese nuevamente un dato para la búsqueda');
        }
        $scope.filter.name = '';
    };

    $scope.showUsers = function () {
        $scope.configTab = "/Views/Admin/users.html";
        $scope.activeUsers = true;
        $scope.activeCompanies = false;
        $scope.activeProtocols = false;
    };
    $scope.showCompanies = function () {
        $scope.configTab = "/Views/Admin/companies.html";
        $scope.activeUsers = false;
        $scope.activeCompanies = true;
        $scope.activeProtocols = false;
    };
    $scope.showProtocols = function () {
        $scope.configTab = "/Views/Admin/protocols.html";
        $scope.activeUsers = false;
        $scope.activeCompanies = false;
        $scope.activeProtocols = true;
    };

    $scope.newUser = { practices: [], exams: [], active: true };

    $scope.showNewUser = function (size) {

        var modalInstance = $modal.open({
            templateUrl: '/Views/Admin/new-user.html',
            controller: CreateModalInstanceCtrl,
            size: 'lg',
            resolve: {
                newUser: function () {
                    return $scope.newUser;
                }
            }
        });

        modalInstance.result.then(function (newUser) {
            toaster.pop('info', 'Información', "Usuario creado correctamente.");
            getActiveUsers();
            $scope.newUser = { practices: [], exams: [] };
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };

    $scope.showNewCompany = function () {
        var modalInstance = $modal.open({
            templateUrl: '/Views/Admin/new-company.html',
            controller: CreateCompanyModalInstanceCtrl,
            size: 'lg',
            resolve: {
                newCompany: function () {
                    return {};
                }
            }
        });

        modalInstance.result.then(function (newUser) {
            toaster.pop('info', 'Información', "Empresa creada correctamente.");
            getCompanies();
            $scope.newCompany = {};
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };

    $scope.verifyRuc = function (ruc) {
        console.log(ruc);
        companyService.getByRuc(ruc).then(function (result) {
            var company = result.data;
            toaster.pop('warning', 'Alerta', 'Existe empresa con el RUC ingresado.');

        }).catch(function (errorResponse) {
            if (errorResponse.status === 404) {
                toaster.pop('info', "Info", "Empresa no registrada.");
            }
        });
    };

    $scope.reset = function (user) {
        user.ShouldChangePassword = true;
        userMngrSvc.updateUser(user).then(function (result) {
            toaster.pop('info', 'Información', 'Usuario reseteado.\nEl usuario debe cambiar la contraseña la próxima vez que se conecte');

        });
    };

    $scope.deactivate = function (user) {
        user.active = false;
        userMngrSvc.updateUser(user).then(function (result) {
            toaster.pop('info', 'Información', "Usuario desactivado.");
            getActiveUsers();

        });
    };

    $scope.deactivateCompany = function (company) {
        company.active = false;
        companyService.updateCompany(company).then(function (result) {
            toaster.pop('info', 'Información', "Empresa desactivada.");
            getCompanies();

        });
    };

    $scope.deactivateProtocol = function (protocol) {
        protocol.active = false;
        commonService.updateProtocol(protocol).then(function (result) {
            toaster.pop('info', 'Información', "Protocolo desactivado.");
            getProtocols();

        });
    };

    $scope.modify = function (user) {
        userMngrSvc.getRoles(user.id).then(function (result) {
            user.roles = result.data.Result;
            _.each(user.roles, function(element, index) {
                user.adminCompany = element == "AdministrativoEmpresas";
                user.adminProtocols = element == "AdministrativoProtocolos";
                user.config = element == "Config";
                user.admision = element == "Admisión";
                user.agenda = element == "Agenda";
                user.triaje = element == "Triaje";
                user.dashboard = element == "Dashboard";
                user.circuit = element == "Circuito";
            });
          
            console.log(user);
            var modalInstance = $modal.open({
                templateUrl: '/Views/Admin/new-user.html',
                controller: ModifyModalInstanceCtrl,
                size: 'lg',
                resolve: {
                    user: function () {
                        return user;
                    },
                    documentTypes: function() {
                        return $scope.documentTypes;
                    }
                }
            });

            modalInstance.result.then(function (user) {
                toaster.pop('info', 'Información', "Usuario modificado correctamente.");
                getActiveUsers();
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        });
    };

    $scope.modifyCompany = function (company) {

        var modalInstance = $modal.open({
            templateUrl: '/Views/Admin/new-company.html',
            controller: ModifyCompanyModalInstanceCtrl,
            size: 'lg',
            resolve: {
                company: function () {
                    return company;
                }
            }
        });

        modalInstance.result.then(function (user) {
            toaster.pop('info', 'Información', "Usuario modificado correctamente.");
            getActiveUsers();
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };
    $scope.showNewProtocol = function () {
        var modalInstance = $modal.open({
            templateUrl: '/Views/Admin/new-protocol.html',
            controller: CreateProtocolModalInstanceCtrl,
            size: 'lg',
            resolve: {
                newProtocol: function () {
                    return { practices: [] };
                },
                practices: function () {
                    return $scope.practices;
                }
            }
        });

        modalInstance.result.then(function (newUser) {
            toaster.pop('info', 'Información', "Protocolo creado correctamente.");
            getProtocols();
            $scope.newProtocol = {
                practices: []
            };
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };
}]);

var CreateModalInstanceCtrl = function ($scope, $modalInstance, toaster, userMngrSvc, newUser) {
    $scope.newUser = newUser;

    $scope.activeProfile = true;

    $scope.showProfile = function () {
        $scope.activeProfile = true;
        $scope.activePermissions = false;
    };

    $scope.showPermissions = function () {
        $scope.activePermissions = true;
        $scope.activeProfile = false;
    };

    $scope.clean = function () {
        $scope.newUser = { practices: [], exams: [], active: true };
    };

    $scope.saveUser = function () {
        console.log(newUser);
        if (newUser == undefined) {
            toaster.pop('error', 'Error', 'Los datos del usuario son obligatorios');
            return;
        }
        if (isNaN(newUser.documentNumber)) {
            toaster.pop('error', 'Error', 'El número de documento debe ser un número.');
            return;
        }
        if (newUser.documentNumber > 9999999999) {
            toaster.pop('error', 'Error', 'El número de documento debe tener 10 dígitos o menos.');
            return;
        }
        if (newUser.names === undefined) {
            toaster.pop('error', 'Error', 'El nombre es obligatorio');
            return;
        }
        if (newUser.names.length > 20) {
            toaster.pop('error', 'Error', 'El nombre no puede contener mas de 20 caracteres.');
            return;
        }
        if (newUser.fatherLastName === undefined) {
            toaster.pop('error', 'Error', 'El apellido paterno es obligatorio');
            return;
        }
        if (newUser.fatherLastName.length > 20) {
            toaster.pop('error', 'Error', 'El apellido paterno no puede contener mas de 20 caracteres.');
            return;
        }
        if (newUser.username.length > 20) {
            toaster.pop('error', 'Error', 'El nombre de usuario no puede contener mas de 20 caracteres.');
            return;
        }

        if (newUser.motherLastName.length > 20) {
            toaster.pop('error', 'Error', 'El apellido materno no puede contener mas de 20 caracteres.');
            return;
        }

        if (newUser.password !== newUser.confirmPassword) {
            toaster.pop('error', 'Error', "Las contraseñas no coinciden.");
            return;
        }
        if (newUser.password.length > 10 || newUser.password.length < 6) {
            toaster.pop('error', 'Error', 'La contraseña debe tener entre 6 y 10 caracteres.');
            return;
        }

        if (!newUser.admin && !newUser.agenda && !newUser.admision && !newUser.triaje && !newUser.dashboard && !newUser.circuit && !newUser.config) {
            toaster.pop('error', 'Error', "Debe seleccionar al menos un menú.");
            return;
        }
        if (newUser.circuit) {
            newUser.dashboard = true;
        }
        newUser.documentTypeId = newUser.documentType.number;
        newUser.shouldChangePassword = true;
        newUser.active = true;
        userMngrSvc.registerUser(newUser).$promise
            .then(function (data) {
                $modalInstance.close($scope.newUser);
                $scope.newUser = {};
            }).catch(function (error) {
                if (error.status === 400) {
                    console.log(error);
                    toaster.pop('error', 'Error', error.data.Message);
                    return;
                } else {
                    toaster.pop('error', 'Error', "Un error ocurrió. Repita la operación luego de un tiempo.");
                    return;
                }
            });

    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};

var CreateCompanyModalInstanceCtrl = function ($scope, $modalInstance, toaster, commonService, companyService, newCompany) {
    var getDepartments = function () {
        commonService.getDepartmentsGraph().then(function (result) {
            $scope.departments = result.data;
            console.log(result.data);
        });
    };
    getDepartments();
    $scope.states = [];
    $scope.districts = [];
    $scope.newCompany = newCompany;

    $scope.departmentChanged = function () {
        var selectedDepartment = $scope.newCompany.department;
        console.log($scope.newCompany.department);
        $scope.states = selectedDepartment.states;
    };

    $scope.stateChanged = function () {
        var selectedState = $scope.newCompany.state;
        $scope.districts = selectedState.districts;
    };

    $scope.clean = function () {
        $scope.newCompany = {};
    };

    $scope.saveCompany = function () {
        if (newCompany === undefined) {
            toaster.pop('error', 'Error', 'Los datos de la empresa son obligatorios');
            return;
        }
        if (isNaN(newCompany.ruc)) {
            toaster.pop('error', 'Error', 'El RUC debe ser un número.');
            return;
        }
        if (newCompany.ruc > 99999999999) {
            toaster.pop('error', 'Error', 'El número de RUC debe tener 11 dígitos o menos.');
            return;
        }
        if (newCompany.name === undefined) {
            toaster.pop('error', 'Error', 'La Razón Social es obligatoria');
            return;
        }
        if (newCompany.name.length > 60) {
            toaster.pop('error', 'Error', 'La Razón Social no puede contener mas de 60 caracteres.');
            return;
        }

        newCompany.active = true;
        companyService.createCompany(newCompany)
            .then(function (data) {
                $modalInstance.close(data);
                $scope.newCompany = {};
            }).catch(function (error) {
                if (error.status === 400) {
                    toaster.pop('error', 'Error', "Empresa existente");
                    return;
                } else {
                    toaster.pop('error', 'Error', "Un error ocurrió. Repita la operación luego de un tiempo.");
                    return;
                }
            });

    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};

var CreateProtocolModalInstanceCtrl = function ($scope, $modalInstance, toaster, commonService, companyService, newProtocol, practices) {
    $scope.newProtocol = newProtocol;
    $scope.practices = practices;
    $scope.selectedExams = {};
    console.log(practices);

    $scope.clean = function () {
        $scope.newProtocol = { practices: [] };
    };

    $scope.saveProtocol = function () {
        console.log(practices);
        console.log($scope.selectedExams);
        if (newProtocol === undefined) {
            toaster.pop('error', 'Error', 'Los datos del protocolo son obligatorios');
            return;
        }
        if (newProtocol.name === undefined) {
            toaster.pop('error', 'Error', 'El nombre es obligatorio');
            return;
        }
        if (newProtocol.name.length > 70) {
            toaster.pop('error', 'Error', 'El nombre debe tener menos de 70 caracteres');
            return;
        }

        var protocol = { active: true, name: newProtocol.name, practices: [] };

        for (var i = 0; i < newProtocol.practices.length; i++) {
            var element = newProtocol.practices[i];
            console.log(element);
            if (element && element == true) {
                var practice = _.where(practices, { id: i });
                if (practice.length > 0) {
                    var practiceToAdd = { name: practice[0].name, id: i };
                    if (practice[0].hasExams == true) {
                        practiceToAdd.hasExams = true;
                        var exams = [];
                        for (var j = 0; j < practice[0].exams.length; j++) {
                            var exam = practice[0].exams[j];
                            if (exam.ticked == true) {
                                exams.push({ name: exam.name });
                            }
                            practiceToAdd.exams = exams;
                        };
                    }
                    protocol.practices.push(practiceToAdd);
                }
            }
        };
        commonService.createProtocol(protocol)
            .then(function (data) {
                $modalInstance.close(data);
                $scope.newProtocol = { practices: [] };
            }).catch(function (error) {
                if (error.status === 400) {
                    toaster.pop('error', 'Error', error.data.Message);
                    return;
                } else {
                    toaster.pop('error', 'Error', "Un error ocurrió. Repita la operación luego de un tiempo.");
                    return;
                }
            });

    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};


var ModifyModalInstanceCtrl = function ($scope, $modalInstance, toaster, userMngrSvc, user, documentTypes) {
    $scope.documentTypes = documentTypes;
    $scope.user = angular.copy(user);
    $scope.newUser = angular.copy(user);
    $scope.newUser.documentType = documentTypes[0];
    console.log($scope.newUser);
    $scope.activeProfile = true;

    $scope.showProfile = function () {
        $scope.activeProfile = true;
        $scope.activePermissions = false;
    };

    $scope.showPermissions = function () {
        $scope.activePermissions = true;
        $scope.activeProfile = false;
    };

    $scope.clean = function () {
        $scope.newUser = angular.copy($scope.user);
    };

    $scope.saveUser = function () {
        var newUser = $scope.newUser;

        console.log(newUser);

        if (newUser.password !== newUser.confirmPassword) {
            toaster.pop('error', 'Error', "Las contraseñas no coinciden.");
            return;
        }
        if (!newUser.admin && !newUser.agenda && !newUser.admision && !newUser.triaje && !newUser.dashboard && !newUser.circuit) {
            toaster.pop('error', 'Error', "Debe seleccionar al menos un menú.");
            return;
        }
        if (newUser.circuit) {
            newUser.dashboard = true;
        }
        newUser.documentTypeId = newUser.documentType.number;
        if (newUser.password != undefined) {
            newUser.shouldChangePassword = true;
        }
        
        userMngrSvc.updateUser(newUser)
            .then(function (data) {
                $modalInstance.close($scope.newUser);
            }).catch(function (error) {
                if (error.status === 400) {
                    toaster.pop('error', 'Error', "Nombre de usuario existente");
                    return;
                } else {
                    toaster.pop('error', 'Error', "Un error ocurrió. Repita la operación luego de un tiempo.");
                    return;
                }
            });

    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};

var ModifyCompanyModalInstanceCtrl = function ($scope, $modalInstance, toaster, commonService, companyService, company) {
    console.log(company);
    $scope.departmentChanged = function () {
        var selectedDepartment = $scope.newCompany.department;
        $scope.states = selectedDepartment.states;
    };

    $scope.stateChanged = function () {
        var selectedState = $scope.newCompany.state;
        $scope.districts = selectedState.districts;
    };

    var getDepartments = function () {
        commonService.getDepartmentsGraph().then(function (result) {
            $scope.departments = result.data;
            $scope.company = company;
            $scope.newCompany = company;
            $scope.departmentChanged();
            $scope.stateChanged();
        });
    };
    getDepartments();




    $scope.clean = function () {
        $scope.newCompany = $scope.company;
    };

    $scope.saveCompany = function () {
        if (isNaN($scope.newCompany.ruc)) {
            toaster.pop('error', 'Error', 'El RUC debe ser un número.');
            return;
        }
        if ($scope.newCompany.ruc > 99999999999) {
            toaster.pop('error', 'Error', 'El número de RUC debe tener 11 dígitos o menos.');
            return;
        }
        if ($scope.newCompany.name === undefined) {
            toaster.pop('error', 'Error', 'La Razón Social es obligatoria');
            return;
        }
        if ($scope.newCompany.name.length > 60) {
            toaster.pop('error', 'Error', 'La Razón Social no puede contener mas de 60 caracteres.');
            return;
        }
        companyService.updateCompany($scope.newCompany)
            .then(function (data) {
                $modalInstance.close(data);
            }).catch(function (error) {
                if (error.status === 400) {
                    toaster.pop('error', 'Error', "Empresa existente");
                    return;
                } else {
                    toaster.pop('error', 'Error', "Un error ocurrió. Repita la operación luego de un tiempo.");
                    return;
                }
            });

    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};

