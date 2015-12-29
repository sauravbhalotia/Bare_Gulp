(function() {
    'use strict';

    angular
        .module('sampleModule')
        .controller('Controller', Controller);

    Controller.$inject = ['dependencies'];

    /* @ngInject */
    function Controller(dependencies) {
        var vm = this;
        vm.title = 'Controller';
        activate();

        ////////////////

        function activate() {
        }
    }
})();