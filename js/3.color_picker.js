acp.directive('angularColorPicker', ['$compile', '$document', 'acpModel',
    function($compile, $document, acpModel) {
    return {
        restrict: 'A',
        scope: {},
        require: '?ngModel',
        link: function(scope, element, attrs, ngModel) {
            var id = attrs.id || 'angular-color-picker-' + Date.now(),
                container = ae('<div>'),
                click = function(e) {
                    acpModel.newInstance(id);
                    ae($document[0].body).append(container[0]);
                    $compile(container)(scope);
                },
                mouseDown = function(e) {
                    var target = e.target;
                    while (target && target !== container[0]) {
                        target = target.parentNode;
                    }
                    if (target === container[0]) {
                        return;
                    }
                    acpModel.removeInstance(id);
                    container.remove();
                };
            container.addClass('color-picker');
            container.attr('acp-window', '');
            container.attr('name', id);

            if (attrs.ngModel) {
                console.log(ngModel);
            }
            element.bind('click', click);
            $document.bind('mousedown', mouseDown);
        }
    };
}]);