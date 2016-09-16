angular.module('app.competition')
    .component('competitionDetails', {
        templateUrl: 'app/competition/detailsView/competition.details.html',
        controllerAs:"vm",
        controller: ["$q",'$rootRouter','CompetitionService','LeagueTableService',
            function ($q , $rootRouter, CompetitionService , LeagueTableService) {
                var ctrl = this;
                ctrl.competitionId = null;
                ctrl.competition = null;
                ctrl.leagueTable = null;
                ctrl.groups = null;
                ctrl.group = null;
                ctrl.matchDay = null;
                ctrl.matchDays = null;

                ctrl.filterByMatchDay = filterByMatchDay;

                ctrl.$routerOnActivate = function(next) {
                    ctrl.competitionId = next.params.id;
                    return $q.all([
                        CompetitionService.get(next.params.id).then(competition=>{
                            ctrl.competition = competition;
                            return competition;
                        }).then(competition=>{
                            ctrl.matchDays=Array.apply(null, {length: competition.numberOfMatchdays}).map(Number.call, Number);
                            return competition;
                        }),
                        LeagueTableService.get(next.params.id,next.params.matchDay).then(leagueTable=>{
                            ctrl.leagueTable = leagueTable;
                            return leagueTable;
                        }).then(leagueTable=>{
                            ctrl.matchDay=(+leagueTable.matchday);
                            return leagueTable;
                        }).then(leagueTable=>{
                            ctrl.groups=leagueTable.standing && [] || Object.keys(leagueTable.standings);
                            return ctrl.groups;
                        }).then(groups=>(
                            ctrl.group=ctrl.groups[0]||null)
                        )
                    ]);
                };

                function filterByMatchDay(matchDay) {
                    $rootRouter.navigate(['CompetitionDetailsbyDay',{id:ctrl.competition.id,matchDay}]);
                }
        }],
        $routeConfig: [
        ]
    });