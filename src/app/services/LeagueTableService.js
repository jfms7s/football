(function () {
    'use strict';
    angular.module('app')
        .factory("LeagueTableService",LeagueTableService);

    LeagueTableService.$inject = ['$http','Configs'];
    function LeagueTableService($http,Configs) {
        return {
            get : get
        };

        /**
         *
         * @param {Number} competitionsId Id of the competition
         * @param {String} [matchday] Day the match happen (format:d+)
         * @returns Promise<Object> Returns a promise containing a LeagueTable
         */
        function get(competitionsId,matchday) {
            return $http({
                method  :"GET",
                url     :`${Configs.apiUrl}/v1/competitions/${competitionsId}/leagueTable`,
                params  :{
                    matchday
                }
            }).then(response =>response.data)
                .then(leagueTable=>{
                    if(leagueTable.standing){
                        leagueTable.standing=leagueTable.standing.map(ele=>{
                            ele.teamId=(+ele._links.team.href.match(/\/(\d+)/)[1]);
                            return ele;
                        })
                    }
                    return leagueTable;
                });
        }
    }

})();
