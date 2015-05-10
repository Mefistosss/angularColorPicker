acp.directive('acpWindow', ['acpLib', 'acpModel', function(acpLib, acpModel) {
    return {
        restrict: 'A',
        scope: true,
        template:   '<div class="control-panel" acp-control-panel></div>' +
                    '<div class="main-panel" acp-main-panel></div>',
        link: function(scope, element, attrs) {
            scope.instance = acpModel.getInstance(attrs.name);
            scope.checkboxChange = function() {
                var inst = scope.instance;
                inst.picker.V = 100;
                inst.picker.S = 100;
                inst.hue = 0;

                if (inst.none) {
                    inst.rgb = '';
                    inst.hex = '';
                    inst.hsv = 'none';
                    inst.blockBGColor = 'red';
                } else {
                    inst.rgb = 'rgb(0,0,0)';
                    inst.hex = '#000';
                    inst.hsv = acpLib.rgb_hsv(acpLib.pareseRgb(inst.rgb));
                    inst.blockBGColor = 'rgb(' + acpLib.hsv_rgb(0, 100, 100) + ')';
                }
                scope.$emit('ecpEvent');
            }
        }
    };
}]);