(function() {
    'use strict';

    angular
        .module('sampleModule')
        .directive('directive', sampleDirective);

    sampleDirective.$inject = ['dependencies'];

    /* @ngInject */
    function sampleDirective(dependencies) {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            bindToController: true,
            controller: Controller,
            controllerAs: 'vm',
            link: link,
            restrict: 'A',
            scope: {
            }
        };
        return directive;

        function link(scope, element, attrs) {
        }
    }

    /* @ngInject */
    function Controller() {

    }
})();