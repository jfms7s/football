(function () {
	'use strict';
	angular.module('app')
		.value('$routerRootComponent', 'app')
		.component('app', {
			template:'<ng-outlet><ng-outlet>',
			controller: ['CompetitionService',
				function (CompetitionService) {
					var ctrl = this;
					ctrl.competitions = null;

					ctrl.$routerOnActivate = function() {
						return CompetitionService.getAll().then(function(competitions) {
							ctrl.competitions = competitions;
						});
					}
				}
			],
			$routeConfig: [
				{ path: '/leagues'					,name:"CompetitionList"			, component: 'competitionList' 		,useAsDefault: true },
				{ path: '/leagues/:id'				,name:"CompetitionDetails"		, component: 'competitionDetails' 	},
				{ path: '/leagues/:id/:matchDay'	,name:"CompetitionDetailsbyDay"	, component: 'competitionDetails' 	},
				{ path: '/leagues/:id/teams'		,name:"CompetitionTeams"		, component: 'teamList' 			},
				{ path: '/teams/:id'				,name:"TeamDetails"				, component: 'teamDetails' 			},
				{ path: '/fixture'					,name:"FixtureList"				, component: 'fixtureList' 			},
			]
		});
})();
