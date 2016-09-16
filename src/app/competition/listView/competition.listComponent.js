angular.module('app.competition')
    .component('competitionList', {
        templateUrl: 'app/competition/listView/competition.list.html',
        controllerAs:"vm",
        controller: ['CompetitionService',
            function (CompetitionService) {
                var ctrl = this;
                ctrl.competitions = null;

                ctrl.$routerOnActivate = function() {
                return CompetitionService.getAll().then(function(competitions) {
                    ctrl.competitions = competitions;
                });
            }
        }]
    });