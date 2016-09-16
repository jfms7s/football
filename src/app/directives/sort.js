(function () {
    'use strict';
    angular.module('app')
        .directive("sort",function() {
            return {
                require:"^^table",
                restrict: 'A',
                scope: true,
                link:function (scope, element, attrs, controller) {
                    var name = null;
                    attrs.$observe("sort",function (value) {
                        name=value;
                        if(name){
                            element.addClass("un-sorted");
                        }
                    });

                    element.on("click",function (event) {
                        scope.$apply(function () {
                            name && controller.sortBy(name);
                        });
                    });
                    scope.$watch(function () {
                        return {name:controller.sortType,reverse:controller.sortReverse}
                    },
                        function (value) {
                            element.removeClass("sorted-reverse sorted un-sorted");console.log(name);
                            if(name===null){
                                return;
                            }
                            if(value.name === name){
                                element.addClass(value.reverse&&"sorted-reverse"||"sorted");
                            }else{
                                element.addClass("un-sorted");
                            }

                        }
                    ,true)

                }
            };
        });
})();
