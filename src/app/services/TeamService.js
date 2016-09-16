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
            }).then(response =>response.data)
                .then(competitionTeams=>{

                    competitionTeams.teams=competitionTeams.teams.map(team=>{
                        team.teamId=(+team._links.self.href.match(/\/(\d+)/)[1]);
                        return team;
                    });

                    return competitionTeams;
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
            }).then(response =>response.data);
        }
    }

})();
