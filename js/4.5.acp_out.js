acp.directive('acpOut', ['$compile', function($compile) {
    return {
        restrict: 'A',
        scope: false,
        link: function(scope, element, attrs) {
            scope.$watch('instance.rgb', function(v) {
                element.css('background-color', v);
            });
        }
    };
}]);