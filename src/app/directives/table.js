(function () {
    'use strict';
    angular.module('app')
        .directive("table",function() {
            return {
                restrict: 'E',
                scope: true,
                controllerAs:"sort",
                controller:function () {
                    var ctrl = this;
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
                }
            };
        });
})();
