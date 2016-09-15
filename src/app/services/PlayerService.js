(function () {
    'use strict';
    angular.module('app')
        .factory("PlayerService",PlayerService);

    PlayerService.$inject = ['$http','Configs'];
    function PlayerService($http,Configs) {
        return {
            getAllByTeams : getAllByTeams,
        };

        /**
         *
         * @param {Number} id Id of the team
         * @returns Promise<Array<Object>> Returns a promise containing the list of players
         */
        function getAllByTeams(id) {
            return $http({
                method  : "GET",
                url     : `${Configs.apiUrl}/v1/teams/${id}/players`
            });
        }
    }

})();
