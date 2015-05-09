acp.directive('acpWindow', ['$compile', 'acpLib', function($compile, acpLib) {
    return {
        restrict: 'A',
        template:   '<div class="control-panel" acp-control-panel></div>' +
                    '<div class="main-panel" acp-main-panel></div>',
        link: function(scope, element, attrs) {
            scope.blockBGColor = 'red';
            scope.rgb = 'rgb(255,255,255)';
            scope.hex = '#ffffff';
            scope.hue = 0;
            scope.none = false;
            scope.picker = {
                V: 100,
                S: 100
            };

            scope.checkboxChange = function() {
                scope.picker.V = 100;
                scope.picker.S = 100;
                scope.hue = 0;

                if (scope.none) {
                    scope.rgb = '';
                    scope.hex = '';
                    scope.hsv = 'none';
                    scope.blockBGColor = 'red';
                } else {
                    scope.rgb = 'rgb(0,0,0)';
                    scope.hex = '#000';
                    scope.hsv = acpLib.rgb_hsv(acpLib.pareseRgb(scope.rgb));
                    scope.blockBGColor = 'rgb(' + acpLib.hsv_rgb(0, 100, 100) + ')';
                }

                scope.$emit('colorPickerEvent', {
                    rgb: scope.rgb,
                    cleanRgb: '0,0,0',
                    hex: scope.hex
                });
            };

            // scope.$on('setColorPickerColorEvent', function(e, args) {
            //     var rgb = acpLib.pareseRgb(args.color);
            //     scope.rgb = args.color;
            //     if ('none' === rgb) {
            //         scope.rgb = '';
            //         scope.hex = '';
            //         scope.hsv = 'none';
            //         scope.hue = 0;
            //         scope.picker.V = 100;
            //         scope.picker.S = 100;
            //         scope.blockBGColor = 'red';
            //         scope.none = true;
            //     } else {
            //         scope.hex = '#' + (rgb[0].toString(16) + '' + rgb[1].toString(16) + '' + rgb[2].toString(16));
            //         scope.hsv = acpLib.rgb_hsv(rgb);
            //         scope.none = false;
            //     }
            // });

            // $compile(element.contents())(scope);
        }
    };
}]);