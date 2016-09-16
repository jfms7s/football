angular.module('app.fixture')
    .component('fixtureList', {
        templateUrl: 'app/fixture/listView/fixture.list.html',
        controllerAs:"vm",
        controller: ['FixtureService',
            function (FixtureService) {
                var ctrl = this;
                ctrl.fixtures = null;

                ctrl.$routerOnActivate = function(next) {
                    return FixtureService.getAll(next.params.id).then(function(fixtures) {
                        ctrl.fixtures = fixtures;
                    });
                };
        }]
    });