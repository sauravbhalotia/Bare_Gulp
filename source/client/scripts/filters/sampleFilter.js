(function() {
    'use strict';

    angular
        .module('module')
        .filter('filter', filter);

    function filter() {
        return filterFilter;

        ////////////////

        function filterFilter(params) {
            return params;
        }
    }

})();