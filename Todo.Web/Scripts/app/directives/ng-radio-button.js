var directives = angular.module('Todo.directives');
directives.directive("ngRadioButton", function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            ngModel: '=',

        },
        link: function (scope, element, attrs, ctrl) {
            if (attrs.value == scope.ngModel) {
                element.addClass('active');
            }
            scope.$watch('ngModel', function (model) {
                if (attrs.value != scope.ngModel) {
                    element.removeClass('active');
                }
            });
            element.bind('click', function () {
                if (!element.hasClass('active')) {
                    scope.$apply(function () {
                        scope.ngModel = attrs.value;
                    });
                }
            });
        }
    };
})