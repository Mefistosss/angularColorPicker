acp.directive('angularColorPicker', ['$compile', '$document', 'acpModel', 'acpLib',
    function($compile, $document, acpModel, acpLib) {
    return {
        restrict: 'A',
        scope: {},
        require: '?ngModel',
        link: function(scope, element, attrs, ngModel) {
            var id = attrs.id || 'angular-color-picker-' + Date.now(),
                instance, ngModelFlag = false,
                container = ae('<div>'),
                type,

                click = function(e) {
                    var value;
                    instance = acpModel.newInstance(id);
                    ae($document[0].body).append(container[0]);
                    if (attrs.ngModel, ngModel.$valid, value =  acpLib.cleanString(ngModel.$viewValue)) {
                        // TODO hex
                        var rgb = acpLib.pareseRgb(value);
                        instance.rgb = value;
                        if ('none' === rgb) {
                            instance.rgb = '';
                            instance.hex = '';
                            instance.hsv = 'none';
                            instance.hue = 0;
                            instance.picker.V = 100;
                            instance.picker.S = 100;
                            instance.blockBGColor = 'red';
                            instance.none = true;
                        } else {
                            instance.hex = '#' + (rgb[0].toString(16) + '' + rgb[1].toString(16) + '' + rgb[2].toString(16));
                            instance.hsv = acpLib.rgb_hsv(rgb);
                            instance.none = false;
                        }
                        ngModelFlag = true;
                    }
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
                    ngModelFlag = false;
                    container.remove();
                };
            container.addClass('color-picker');
            container.attr('acp-window', '');
            container.attr('name', id);

            type = acpLib.cleanString(attrs.angularColorPicker);

            if ('rgb' !== type || 'hex' !== type) {
                type = 'rgb';
            }

            scope.$on('ecpEvent', function(e) {
                e.stopPropagation();
                // instance.rgb
                // instance.cleanRgb TODO
                // instance.hex
                if (ngModelFlag) {
                    ngModel.$setViewValue(instance[type]);
                }
            });
            element.bind('click', click);
            $document.bind('mousedown', mouseDown);
        }
    };
}]);