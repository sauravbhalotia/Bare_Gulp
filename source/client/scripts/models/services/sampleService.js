(function() {
    'use strict';

    angular
        .module('module')
        .service('Service', Service);

    Service.$inject = ['dependencies'];

    /* @ngInject */
    function Service(dependencies) {
        this.func = func;

        ////////////////

        function func() {
        }
    }
})();