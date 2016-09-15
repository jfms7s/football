(function () {
    'use strict';
    angular.module('app')
        .factory("TeamService",TeamService);

    TeamService.$inject = ['$http','Configs'];
    function TeamService($http,Configs) {
        return {
            getAllByCompetition : getAllByCompetition,
            get                 : get
        };

        /**
         *
         * @param {Number} id Id of the competition
         * @returns Promise<Array<Object>> Returns a promise containing the list of Teams
         */
        function getAllByCompetition(id) {
            return $http({
                method  : "GET",
                url     : `${Configs.apiUrl}/v1/competitions/${id}/teams`
            });
        }

        /**
         *
         * @param {Number} id Id of the team
         * @returns Promise<Object> Returns a promise containing a team
         */
        function get(id) {
            return $http({
                method  : "GET",
                url     : `${Configs.apiUrl}/v1/teams/${id}`
            });
        }
    }

})();
