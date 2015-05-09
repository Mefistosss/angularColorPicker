acp.directive('acpControlPanel', ['$compile', '$window', 'acpLib', function($compile, $window, acpLib) {
    return {
        restrict: 'A',
        template: '<button class="close-button">X</button>',
        link: function(scope, element, attrs) {
            var button = element[0].childNodes[0],
                wind = element.parent().parent()[0],
                elWidth = element.parent()[0].offsetWidth,
                elHeight = element.parent()[0].offsetHeight,
                pWidth = wind.offsetWidth,
                pHeight = wind.offsetHeight,
                startPointX = 0,
                startPointY = 0,
                parPointX = 0,
                parPointY = 0,
                move = function(e) {
                    var top, left;
                    parPointX = acpLib.obj.positX(element.parent().parent()[0]);
                    parPointY = acpLib.obj.positY(element.parent().parent()[0]);

                    top = acpLib.mouse.pageY(e) - startPointY - parPointY;
                    left = acpLib.mouse.pageX(e) - startPointX - parPointX;

                    top < 0 && (top = 0);
                    left < 0 && (left = 0); 
                    if (left + elWidth > pWidth) {
                        left = pWidth - elWidth;
                    }

                    if (top + elHeight > pHeight) {
                        top = pHeight - elHeight;
                    }

                    element.parent().css({
                        'top': top + 'px',
                        'left': left + 'px'
                    });
                },

                mouseUp = function(e) {
                    element.css('cursor', '');
                    ae($window.document).unbind('mousemove', move);
                    ae($window.document).unbind('mouseup', mouseUp);
                };

            element.bind('mousedown', function(e) {
                if (1 === e.which) {
                    e.preventDefault();
                    element.css('cursor', 'move');
                    startPointX = acpLib.mouse.pageX(e) - acpLib.obj.positX(element[0]);
                    startPointY = acpLib.mouse.pageY(e) - acpLib.obj.positY(element[0]);
                    ae($window.document).bind('mouseup', mouseUp);
                    ae($window.document).bind('mousemove', move);
                }
            });

            angular.element(button).bind('click', function(e) {
                scope.$emit('closeColorPickerEvent');
            });
        }
    };
}]);