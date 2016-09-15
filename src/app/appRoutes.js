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
				{ path: '/standings'	, component: 'standingsDetails' ,useAsDefault: true },
				{ path: '/standings/:id', component: 'stanginsComponent' }
			]
		});
})();
