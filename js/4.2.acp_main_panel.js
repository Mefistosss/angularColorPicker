acp.directive('acpMainPanel', ['$compile', function($compile) {
    return {
        restrict: 'A',
        template:   '<div class="acp-line-piker" acp-line></div>' +
                    '<div class="acp-block-picker" acp-block="blockBGColor"></div>' +
                    '<div class="acp-out-color" acp-out></div>' +
                    '<div class="acp-text">' +
                        '<span>{{instance.rgb}}</span></br>' +
                        '<span>{{instance.hex}}</span></br>' +
                        'none: <input ng-model="instance.none" type="checkbox" ng-change="checkboxChange()">' +
                    '</div>'
    };
}]);