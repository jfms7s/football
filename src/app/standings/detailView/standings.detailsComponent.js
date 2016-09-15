angular.module('app.standings', [])
    .component('standingsDetails', {
        templateUrl: 'app/standings/detailView/standings.details.html',
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