(function () {
    'use strict';
    angular.module('app')
        .factory('CompetitionService',CompetitionService);

    CompetitionService.$inject = ["$http",'Configs'];
    function CompetitionService($http,Configs) {
        return {
            getAll  : getAll,
            get     : get
        };

        /**
         *
         * @param {String} [season] Season of the competition (format:/d/d/d/d)
         * @returns Promise<Array<Object>> Returns a promise containing the list of competitions
         */
        function getAll(season) {
            return $http({
                method  : "GET",
                url     : `${Configs.apiUrl}/v1/competitions/`,
                params  : {
                    season
                }
            });
        }

        /**
         *
         * @param {Number} id Id of the competition
         * @returns Promise<Object> Returns a promise containing a competition
         */
        function get(id) {
            return $http({
                method  :"GET",
                url     :`${Configs.apiUrl}/v1/competitions/${id}`,
            });
        }
    }

})();
