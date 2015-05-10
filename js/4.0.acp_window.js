acp.directive('acpWindow', ['acpLib', 'acpModel', function(acpLib, acpModel) {
    return {
        restrict: 'A',
        scope: true,
        template:   '<div class="control-panel" acp-control-panel></div>' +
                    '<div class="main-panel" acp-main-panel></div>',
        link: function(scope, element, attrs) {
            scope.instance = acpModel.getInstance(attrs.name);
        }
    };
}]);