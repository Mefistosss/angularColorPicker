acp.directive('angularColorPicker', ['$compile', '$document', 'acpModel',
    function($compile, $document, acpModel) {
    return {
        restrict: 'A',
        scope: {},
        require: '?ngModel',
        link: function(scope, element, attrs, ngModel) {
            var container = ae('<div>'),
                click = function(e) {
                    ae($document[0].body).append(container[0]);
                    $compile(container)(scope);
                    acpModel.instance = scope;
                },
                mouseDown = function(e) {
                    var target = e.target;
                };
            container.addClass('color-picker');
            container.attr('acp-window', '');

            scope.setColor = function() {

            };
            if (attrs.ngModel) {

            }
            element.bind('click', click);
            $document.bind('mousedown', mouseDown);
        }
    };
}]);