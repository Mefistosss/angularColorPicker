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
                type, r = /rgb/,

                click = function(e) {
                    var value, rgb;
                    instance = acpModel.newInstance(id);
                    ae($document[0].body).append(container[0]);
                    if (attrs.ngModel, ngModel.$valid, value = acpLib.cleanString(ngModel.$viewValue)) {
                        rgb = r.test(value) ? acpLib.pareseRgb(value) : acpLib.pareseHex(value);
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
                            instance.hex = '#' + acpLib.convertRgbToHex(rgb);
                            instance.hsv = acpLib.rgb_hsv(rgb);
                            instance.none = false;
                        }
                        ngModelFlag = true;
                    }
                    $document.bind('mousedown', mouseDown);
                    $compile(container)(scope);
                },
                close = function() {
                    acpModel.removeInstance(id);
                    ngModelFlag = false;
                    $document.unbind('mousedown', mouseDown);
                    container.remove();
                },
                mouseDown = function(e) {
                    var target = e.target;
                    while (target && target !== container[0]) {
                        target = target.parentNode;
                    }
                    if (target === container[0]) {
                        return;
                    }
                    close();    
                };
            container.addClass('angular-color-picker');
            container.attr('acp-window', '');
            container.attr('name', id);

            type = acpLib.cleanString(attrs.angularColorPicker);

            if ('rgb' !== type && 'hex' !== type) {
                type = 'rgb';
            }

            scope.$on('acpEvent', function(e) {
                e.stopPropagation();
                if (ngModelFlag) {
                    ngModel.$setViewValue(instance[type]);
                }
            });
            scope.$on('closeAcp', function(e) {
                e.stopPropagation();
                close();
            });
            element.bind('click', click);
            element.bind('$destroy', function(e) {
                element.unbind('click', click);
                $document.unbind('mousedown', mouseDown);
            });
        }
    };
}]);