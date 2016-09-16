'use strict';
// Source: src/app/app.js

(function () {
    angular.module('app', ['ng', 'ui.bootstrap', 'ngComponentRouter', 'app.team', 'app.competition', 'app.fixture']);
})();

// Source: src/app/appConf.js

(function () {
    angular.module('app').config(['$httpProvider', '$locationProvider', 'ConfigsProvider', function ($httpProvider, $locationProvider, ConfigsProvider) {
        $locationProvider.html5Mode(true);
        $httpProvider.defaults.headers.get = { 'X-Auth-Token': ConfigsProvider.getApiKey() };
    }]);
})();

// Source: src/app/appRoutes.js
(function () {
    angular.module('app').value('$routerRootComponent', 'app').component('app', {
        template: '<ng-outlet><ng-outlet>',
        controller: ['CompetitionService', function (CompetitionService) {
            var ctrl = this;
            ctrl.competitions = null;

            ctrl.$routerOnActivate = function () {
                return CompetitionService.getAll().then(function (competitions) {
                    ctrl.competitions = competitions;
                });
            };
        }],
        $routeConfig: [{ path: '/leagues', name: "CompetitionList", component: 'competitionList', useAsDefault: true }, { path: '/leagues/:id', name: "CompetitionDetails", component: 'competitionDetails' }, { path: '/leagues/:id/:matchDay', name: "CompetitionDetailsbyDay", component: 'competitionDetails' }, { path: '/leagues/:id/teams', name: "CompetitionTeams", component: 'teamList' }, { path: '/teams/:id', name: "TeamDetails", component: 'teamDetails' }, { path: '/fixture', name: "FixtureList", component: 'fixtureList' }]
    });
})();

// Source: src/app/appRun.js
(function () {
    angular.module('app');
})();

// Source: src/app/competition/competition.js
(function () {
    angular.module('app.competition', []);
})();

// Source: src/app/competition/detailsView/competition.detailsComponent.js
angular.module('app.competition').component('competitionDetails', {
    templateUrl: 'app/competition/detailsView/competition.details.html',
    controllerAs: "vm",
    controller: ["$q", '$rootRouter', 'CompetitionService', 'LeagueTableService', function ($q, $rootRouter, CompetitionService, LeagueTableService) {
        var ctrl = this;
        ctrl.competition = null;
        ctrl.leagueTable = null;
        ctrl.groups = null;
        ctrl.group = null;
        ctrl.matchDay = null;
        ctrl.matchDays = null;

        ctrl.filterByMatchDay = filterByMatchDay;

        ctrl.$routerOnActivate = function (next) {
            return $q.all([CompetitionService.get(next.params.id).then(function (competition) {
                ctrl.competition = competition;
                return competition;
            }).then(function (competition) {
                ctrl.matchDays = Array.apply(null, { length: competition.numberOfMatchdays }).map(Number.call, Number);
                return competition;
            }), LeagueTableService.get(next.params.id, next.params.matchDay).then(function (leagueTable) {
                ctrl.leagueTable = leagueTable;
                return leagueTable;
            }).then(function (leagueTable) {
                ctrl.matchDay = +leagueTable.matchday;
                return leagueTable;
            }).then(function (leagueTable) {
                ctrl.groups = leagueTable.standing && [] || Object.keys(leagueTable.standings);
                return ctrl.groups;
            }).then(function (groups) {
                return ctrl.group = ctrl.groups[0] || null;
            })]);
        };

        function filterByMatchDay(matchDay) {
            $rootRouter.navigate(['CompetitionDetailsbyDay', { id: ctrl.competition.id, matchDay: matchDay }]);
        }
    }],
    $routeConfig: []
});
// Source: src/app/competition/listView/competition.listComponent.js
angular.module('app.competition').component('competitionList', {
    templateUrl: 'app/competition/listView/competition.list.html',
    controllerAs: "vm",
    controller: ['CompetitionService', function (CompetitionService) {
        var ctrl = this;
        ctrl.competitions = null;

        ctrl.$routerOnActivate = function () {
            return CompetitionService.getAll().then(function (competitions) {
                ctrl.competitions = competitions;
            });
        };
    }]
});
// Source: src/app/fixture/fixture.js
(function () {
    angular.module('app.fixture', []);
})();

// Source: src/app/fixture/listView/fixture.listComponent.js
angular.module('app.fixture').component('fixtureList', {
    templateUrl: 'app/fixture/listView/fixture.list.html',
    controllerAs: "vm",
    controller: ['FixtureService', function (FixtureService) {
        var ctrl = this;
        ctrl.fixtures = null;

        ctrl.$routerOnActivate = function (next) {
            return FixtureService.getAll(next.params.id).then(function (fixtures) {
                ctrl.fixtures = fixtures;
            });
        };
    }]
});
// Source: src/app/providers/ConfigsProvider.js
(function () {
    angular.module("app").provider("Configs", Configs);

    Configs.$inject = [];
    function Configs() {

        var _apiUrl_ = "http://api.football-data.org/";
        var _apiKey_ = "293eb02126bd4780b14c49af3ff7c4a0";

        return {
            setApiUrl: setApiUrl,
            getApiUrl: getApiUrl,
            setApiKey: setApiKey,
            getApiKey: getApiKey,
            $get: function $get() {
                return {
                    get apiUrl() {
                        return _apiUrl_;
                    },
                    get apiKey() {
                        return _apiKey_;
                    }
                };
            }
        };

        /**
         * Get api url
         *
         * @returns {String}
         */
        function getApiUrl() {
            return _apiUrl_;
        }

        /**
         * Get api key
         *
         * @returns {String}
         */
        function getApiKey() {
            return _apiKey_;
        }

        /**
         * Set the url for the Api url
         *
         * @param {String} url
         */
        function setApiUrl(url) {
            _apiUrl_ = url;
        }

        /**
         * Set the url for the Api key
         *
         * @param {String} key
         */
        function setApiKey(key) {
            _apiKey_ = key;
        }
    }
})();

// Source: src/app/services/CompetitionService.js
(function () {
    angular.module('app').factory('CompetitionService', CompetitionService);

    CompetitionService.$inject = ["$http", 'Configs'];
    function CompetitionService($http, Configs) {
        return {
            getAll: getAll,
            get: get
        };

        /**
         *
         * @param {String} [season] Season of the competition (format:/d/d/d/d)
         * @returns Promise<Array<Object>> Returns a promise containing the list of competitions
         */
        function getAll(season) {
            return $http({
                method: "GET",
                url: Configs.apiUrl + '/v1/competitions/',
                params: {
                    season: season
                }
            }).then(function (response) {
                return response.data;
            });
        }

        /**
         *
         * @param {Number} id Id of the competition
         * @returns Promise<Object> Returns a promise containing a competition
         */
        function get(id) {
            return $http({
                method: "GET",
                url: Configs.apiUrl + '/v1/competitions/' + id
            }).then(function (response) {
                return response.data;
            });
        }
    }
})();

// Source: src/app/services/FixtureService.js
(function () {
    angular.module('app').factory('FixtureService', FixtureService);

    FixtureService.$inject = ['$http', 'Configs'];
    function FixtureService($http, Configs) {

        return {
            getAll: getAll,
            getAllByCompetition: getAllByCompetition,
            getAllByTeam: getAllByTeam,
            get: get
        };

        /**
         *
         * @param {Number} id Id of the competition
         * @param {String} [timeFrame] Sets the distance from the current day to fetch fixtures max n|p0-99
         * @param {String} [matchday] Day the match happen (format:d+)
         * @returns Promise<Array<Object>> Returns a promise containing the list of competitions
         */
        function getAllByCompetition(id, timeFrame, matchday) {
            return $http({
                method: "GET",
                url: Configs.apiUrl + '/v1/competitions/' + id + '/fixtures',
                params: {
                    timeFrame: timeFrame,
                    matchday: matchday
                }
            }).then(function (response) {
                return response.data;
            });;
        }

        /**
         *
         * @param {Number} id Id of the team
         * @param {String} [timeFrame] Sets the distance from the current day to fetch fixtures max n|p0-99
         * @param {String} [season] Season of the competition (format:/d/d/d/d)
         * @param {String} [venue] Defines the venue of a fixture. Default is unset and means to return all fixtures. (format:home|away)
         * @returns Promise<Array<Object>> Returns a promise containing the list of competitions
         */
        function getAllByTeam(id, timeFrame, season, venue) {
            return $http({
                method: "GET",
                url: Configs.apiUrl + '/v1/teams/' + id + '/fixtures/',
                params: {
                    timeFrame: timeFrame,
                    season: season,
                    venue: venue
                }
            }).then(function (response) {
                return response.data;
            });
        }
        /**
         *
         * @param {String} [timeFrame] Sets the distance from the current day to fetch fixtures
         * @param {String} [league] league-codes (format:[\w\d]{2,4}(,[\w\d]{2,4})*)
         * @returns Promise<Array<Object>> Returns a promise containing the list of competitions
         */
        function getAll(timeFrame, league) {
            return $http({
                method: "GET",
                url: Configs.apiUrl + '/v1/fixtures/',
                params: {
                    timeFrame: timeFrame,
                    league: league
                }
            }).then(function (response) {
                return response.data;
            }).then(function (dto) {
                dto.fixtures = dto.fixtures.map(function (fixture) {
                    fixture.competition = +fixture._links.competition.href.match(/\/(\d+)/)[1];
                    fixture.homeTeam = +fixture._links.homeTeam.href.match(/\/(\d+)/)[1];
                    fixture.awayTeam = +fixture._links.awayTeam.href.match(/\/(\d+)/)[1];
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
        function get(id, head2head) {
            return $http({
                method: "GET",
                url: Configs.apiUrl + '/v1/fixtures/' + id,
                params: {
                    head2head: head2head
                }
            }).then(function (response) {
                return response.data;
            });
        }
    }
})();

// Source: src/app/services/LeagueTableService.js
(function () {
    angular.module('app').factory("LeagueTableService", LeagueTableService);

    LeagueTableService.$inject = ['$http', 'Configs'];
    function LeagueTableService($http, Configs) {
        return {
            get: get
        };

        /**
         *
         * @param {Number} competitionsId Id of the competition
         * @param {String} [matchday] Day the match happen (format:d+)
         * @returns Promise<Object> Returns a promise containing a LeagueTable
         */
        function get(competitionsId, matchday) {
            return $http({
                method: "GET",
                url: Configs.apiUrl + '/v1/competitions/' + competitionsId + '/leagueTable',
                params: {
                    matchday: matchday
                }
            }).then(function (response) {
                return response.data;
            }).then(function (leagueTable) {
                if (leagueTable.standing) {
                    leagueTable.standing = leagueTable.standing.map(function (ele) {
                        ele.teamId = +ele._links.team.href.match(/\/(\d+)/)[1];
                        return ele;
                    });
                }
                return leagueTable;
            });
        }
    }
})();

// Source: src/app/services/PlayerService.js
(function () {
    angular.module('app').factory("PlayerService", PlayerService);

    PlayerService.$inject = ['$http', 'Configs'];
    function PlayerService($http, Configs) {
        return {
            getAllByTeam: getAllByTeam
        };

        /**
         *
         * @param {Number} id Id of the team
         * @returns Promise<Array<Object>> Returns a promise containing the list of players
         */
        function getAllByTeam(id) {
            return $http({
                method: "GET",
                url: Configs.apiUrl + '/v1/teams/' + id + '/players'
            }).then(function (response) {
                return response.data;
            });
        }
    }
})();

// Source: src/app/services/TeamService.js
(function () {
    angular.module('app').factory("TeamService", TeamService);

    TeamService.$inject = ['$http', 'Configs'];
    function TeamService($http, Configs) {
        return {
            getAllByCompetition: getAllByCompetition,
            get: get
        };

        /**
         *
         * @param {Number} id Id of the competition
         * @returns Promise<Array<Object>> Returns a promise containing the list of Teams
         */
        function getAllByCompetition(id) {
            return $http({
                method: "GET",
                url: Configs.apiUrl + '/v1/competitions/' + id + '/teams'
            }).then(function (response) {
                return response.data;
            }).then(function (competitionTeams) {

                competitionTeams.teams = competitionTeams.teams.map(function (team) {
                    team.teamId = +team._links.self.href.match(/\/(\d+)/)[1];
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
                method: "GET",
                url: Configs.apiUrl + '/v1/teams/' + id
            }).then(function (response) {
                return response.data;
            });
        }
    }
})();

// Source: src/app/team/team.js
(function () {
    angular.module('app.team', []);
})();

// Source: src/app/team/detailsView/team.detailsComponent.js
angular.module('app.team').component('teamDetails', {
    templateUrl: 'app/team/detailsView/team.details.html',
    controllerAs: "vm",
    controller: ["$q", '$rootRouter', 'TeamService', 'PlayerService', function ($q, $rootRouter, TeamService, PlayerService) {
        var ctrl = this;

        ctrl.team = null;
        ctrl.teamPlayers = null;

        ctrl.$routerOnActivate = function (next) {
            return $q.all([TeamService.get(next.params.id).then(function (team) {
                ctrl.team = team;
                return team;
            }), PlayerService.getAllByTeam(next.params.id).then(function (teamPlayers) {
                ctrl.teamPlayers = teamPlayers;
                return teamPlayers;
            })]);
        };
    }],
    $routeConfig: []
});
// Source: src/app/team/listView/team.listComponent.js
angular.module('app.team').component('teamList', {
    templateUrl: 'app/team/listView/team.list.html',
    controllerAs: "vm",
    controller: ['TeamService', function (TeamService) {
        var ctrl = this;
        ctrl.teams = null;

        ctrl.$routerOnActivate = function (next) {
            return TeamService.getAllByCompetition(next.params.id).then(function (teams) {
                ctrl.teams = teams;
            });
        };
    }]
});
//# sourceMappingURL=app.js.map
//# sourceMappingURL=app.js.map
