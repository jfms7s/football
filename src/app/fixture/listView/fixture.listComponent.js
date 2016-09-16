angular.module('app.fixture')
    .component('fixtureList', {
        templateUrl: 'app/fixture/listView/fixture.list.html',
        controllerAs:"vm",
        controller: ['FixtureService',
            function (FixtureService) {
                var ctrl = this;
                ctrl.fixtures = null;

                ctrl.sortType    = null;
                ctrl.sortReverse = false;

                ctrl.sortBy = function (name) {
                    if(ctrl.sortType === name){
                        ctrl.sortReverse = !ctrl.sortReverse;
                    }else{
                        ctrl.sortType    = name;
                        ctrl.sortReverse = false;
                    }
                };

                ctrl.isSorted = function (name) {
                    if(ctrl.sortType === name){
                        return ctrl.sortReverse;
                    }
                    return -1;
                };

                ctrl.$routerOnActivate = function(next) {
                    if(next.params.teamId){
                        return FixtureService.getAllByTeam(next.params.teamId).then(function(fixtures) {
                            ctrl.fixtures = fixtures;
                        });
                    }

                    if(next.params.competitionId){
                        return FixtureService.getAllByCompetition(next.params.competitionId).then(function(fixtures) {
                            ctrl.fixtures = fixtures;
                        });
                    }

                    return FixtureService.getAll().then(function(fixtures) {
                        ctrl.fixtures = fixtures;
                    });
                };
        }]
    });