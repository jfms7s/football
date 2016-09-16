(function () {
    'use strict';
    angular.module('app')
        .factory('FixtureService',FixtureService);

    FixtureService.$inject = ['$http','Configs'];
    function FixtureService($http,Configs) {

        return {
            getAll              : getAll,
            getAllByCompetition : getAllByCompetition,
            getAllByTeam        : getAllByTeam,
            get                 : get
        };

        /**
         *
         * @param {Number} id Id of the competition
         * @param {String} [timeFrame] Sets the distance from the current day to fetch fixtures max n|p0-99
         * @param {String} [matchday] Day the match happen (format:d+)
         * @returns Promise<Array<Object>> Returns a promise containing the list of competitions
         */
        function getAllByCompetition(id,timeFrame,matchday) {
            return $http({
                method  : "GET",
                url     : `${Configs.apiUrl}/v1/competitions/${id}/fixtures`,
                params  : {
                    timeFrame,
                    matchday
                }
            }).then(response =>response.data);;
        }

        /**
         *
         * @param {Number} id Id of the team
         * @param {String} [timeFrame] Sets the distance from the current day to fetch fixtures max n|p0-99
         * @param {String} [season] Season of the competition (format:/d/d/d/d)
         * @param {String} [venue] Defines the venue of a fixture. Default is unset and means to return all fixtures. (format:home|away)
         * @returns Promise<Array<Object>> Returns a promise containing the list of competitions
         */
        function getAllByTeam(id,timeFrame,season,venue) {
            return $http({
                method  : "GET",
                url     : `${Configs.apiUrl}/v1/teams/${id}/fixtures/`,
                params  : {
                    timeFrame,
                    season,
                    venue
                }
            }).then(response =>response.data);
        }
        /**
         *
         * @param {String} [timeFrame] Sets the distance from the current day to fetch fixtures
         * @param {String} [league] league-codes (format:[\w\d]{2,4}(,[\w\d]{2,4})*)
         * @returns Promise<Array<Object>> Returns a promise containing the list of competitions
         */
        function getAll(timeFrame,league) {
            return $http({
                method  : "GET",
                url     : `${Configs.apiUrl}/v1/fixtures/`,
                params  : {
                    timeFrame,
                    league
                }
            }).then(response =>response.data)
                .then(dto=>{
                    dto.fixtures=dto.fixtures.map(fixture=>{
                        fixture.competition = (+fixture._links.competition  .href.match(/\/(\d+)/)[1]);
                        fixture.homeTeam    = (+fixture._links.homeTeam     .href.match(/\/(\d+)/)[1]);
                        fixture.awayTeam    = (+fixture._links.awayTeam     .href.match(/\/(\d+)/)[1]);
                        return fixture;
                    });

                    return dto;
                });
        }

        /**
         *
         * @param {Number} id Id of the fixture
         * @param {Number} head2head Define the the number of former games to be analyzed in the head2head node. Defaults to 10.
         * @returns Promise<Object> Returns a promise containing a competition
         */
        function get(id,head2head) {
            return $http({
                method  :"GET",
                url     :`${Configs.apiUrl}/v1/fixtures/${id}`,
                params  : {
                    head2head
                }
            }).then(response =>response.data);
        }
    }

})();
