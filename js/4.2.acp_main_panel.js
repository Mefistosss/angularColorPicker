acp.directive('acpMainPanel', ['$compile', function($compile) {
    return {
        restrict: 'A',
        // scope: {},
        template:   '<div class="line-piker" acp-line></div>' +
                    '<div class="block-picker" acp-block="blockBGColor"></div>' +
                    '<div class="out-color" acp-out></div>' +
                    '<div class="text">' +
                        '<span>{{rgb}}</span></br>' +
                        '<span>{{hex}}</span></br>' +
                        'none: <input ng-model="none" type="checkbox" ng-change="checkboxChange()">' +
                    '</div>',
        link: function(scope, element, attrs) {
            scope.$on('', function(e) {
                // e.stopPropagation();
            });
        }
    };
}]);