acp.directive('acpMainPanel', ['$compile', function($compile) {
    return {
        restrict: 'A',
        template:   '<div class="line-piker" acp-line></div>' +
                    '<div class="block-picker" acp-block="blockBGColor"></div>' +
                    '<div class="out-color" acp-out></div>' +
                    '<div class="text">' +
                        '<span>{{instance.rgb}}</span></br>' +
                        '<span>{{instance.hex}}</span></br>' +
                        'none: <input ng-model="instance.none" type="checkbox" ng-change="instance.checkboxChange()">' +
                    '</div>'
    };
}]);