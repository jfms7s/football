angular.module('app.team')
    .component('teamList', {
        templateUrl: 'app/team/listView/team.list.html',
        controllerAs:"vm",
        controller: ['TeamService',
            function (TeamService) {
                var ctrl = this;
                ctrl.teams = null;

                ctrl.$routerOnActivate = function(next) {
                    return TeamService.getAllByCompetition(next.params.id).then(function(teams) {
                        ctrl.teams = teams;
                    });
                };
        }]
    });