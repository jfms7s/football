angular.module('app.team')
    .component('teamDetails', {
        templateUrl: 'app/team/detailsView/team.details.html',
        controllerAs:"vm",
        controller: ["$q",'$rootRouter','TeamService','PlayerService',
            function ($q , $rootRouter,  TeamService , PlayerService) {
                var ctrl = this;

                ctrl.team = null;
                ctrl.teamPlayers = null;

                ctrl.$routerOnActivate = function(next) {
                    return $q.all([
                        TeamService.get(next.params.id).then(team=>{
                            ctrl.team = team;
                            return team;
                        }),
                        PlayerService.getAllByTeam(next.params.id).then(teamPlayers=>{
                            ctrl.teamPlayers = teamPlayers;
                            return teamPlayers;
                        })
                    ]);
                };

        }],
        $routeConfig: [
        ]
    });