acp.directive('acpControlPanel', ['$compile', '$window', 'acpLib', 'acpOptions', function($compile, $window, acpLib, acpOptions) {
    return {
        restrict: 'A',
        template: '<button class="close-button">X</button>',
        link: function(scope, element, attrs) {
            var button = element[0].childNodes[0],
                elWidth = element.parent()[0].offsetWidth,
                elHeight = element.parent()[0].offsetHeight,
                pWidth = $window.document.documentElement.clientWidth,
                pHeight = $window.document.documentElement.clientHeight,
                startPointX = 0,
                startPointY = 0,
                _x, _y,
                x = acpOptions.startPosition.x,
                y = acpOptions.startPosition.y,

                move = function(e) {
                    var top, left;

                    top = acpLib.mouse.pageY(e) - startPointY;
                    left = acpLib.mouse.pageX(e) - startPointX;

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
                    if (1 === e.which) {
                        element.css('cursor', '');
                        ae($window.document).unbind('mousemove', move);
                        ae($window.document).unbind('mouseup', mouseUp);    
                    }
                },
                mouseDown = function(e) {
                    if (1 === e.which && e.target !== button) {
                        e.preventDefault();
                        element.css('cursor', 'move');
                        startPointX = acpLib.mouse.pageX(e) - acpLib.obj.positX(element[0]);
                        startPointY = acpLib.mouse.pageY(e) - acpLib.obj.positY(element[0]);
                        ae($window.document).bind('mouseup', mouseUp);
                        ae($window.document).bind('mousemove', move);
                    }    
                },
                click = function(e) {
                    scope.$emit('closeAcp');
                };
            if (x !== 'center') {
                _x = parseFloat(x);
                if (isNaN(_x) || undefined === _x) {
                    x = 'center';
                }
            }
            if (y !== 'center') {
                _y = parseFloat(y);
                if (isNaN(_y) || undefined === _y) {
                    y = 'center';
                }
            }

            element.parent().css({
                'top': (y === 'center') ? (pHeight / 2 - elHeight / 2) + 'px' : y,
                'left': (x === 'center') ? (pWidth / 2 - elWidth / 2) + 'px' : x
            });

            element.bind('mousedown', mouseDown);
            ae(button).bind('click', click);

            element.bind('$destroy', function(e) {
                ae(button).unbind('click', click);
                ae($window.document).unbind('mousemove', move);
                ae($window.document).unbind('mouseup', mouseUp); 
                element.unbind('mousedown', mouseDown);
            });
        }
    };
}]);