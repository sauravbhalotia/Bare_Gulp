(function() {
    'use strict';

    angular
        .module('module')
        .factory('factory', factory);

    factory.$inject = ['dependencies'];

    /* @ngInject */
    function factory(dependencies) {
        var service = {
            func: func
        };
        return service;

        ////////////////

        function func() {
        }
    }
})();