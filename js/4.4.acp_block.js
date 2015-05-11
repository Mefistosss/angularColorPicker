acp.directive('acpBlock', ['$compile', '$window', 'acpLib', 'acpOptions', function($compile, $window, acpLib, acpOptions) {
    return {
        restrict: 'A',
        template: '<img src="' + acpOptions.imgPath + '">' +
                    '<div class="circle"></div>',
        link: function(scope, element, attrs) {
            var block = element[0],
                circle = block.childNodes[1],
                bPstX, bPstY, bWi, bHe, cW, cH, pxY, pxX,
                getColor = function (e) {      
                    var rgb, top, left, S, V;
                    
                    element.bind('dragstart', function() {
                        return false;
                    });

                    element.bind('onselectstart', function() {
                        return false;
                    });

                    left = acpLib.mouse.pageX(e) - bPstX - cW/2;
                    left = (left < 0) ? 0 : left;
                    left = (left > bWi) ? bWi  : left;

                    ae(circle).css('left', left + 'px');

                    S = Math.ceil(left / pxX);
        
                    top = acpLib.mouse.pageY(e) - bPstY - cH/2;
                    top = (top > bHe) ? bHe : top;
                    top = (top < 0) ? 0 : top;
                    
                    ae(circle).css('top', top + 'px');
                    
                    V = Math.ceil(Math.abs(top / pxY - 100));

                    // ae(circle).css('border-color', V < 50 ? '#fff' : '#000');
                    
                    scope.instance.picker.S = S;
                    scope.instance.picker.V = V;

                    rgb = acpLib.hsv_rgb(scope.instance.hue, S, V);
                    scope.$apply(function() {
                        scope.instance.rgb = 'rgb(' + rgb + ')';
                        scope.instance.hex = '#' + (rgb[0].toString(16) + '' + rgb[1].toString(16) + '' + rgb[2].toString(16));
                        scope.$emit('acpEvent');
                    });
                },
                setPosition = function(hsv) {
                    var top = bHe - bHe / (255 / hsv[2]),
                        left = bWi / (1 / hsv[1]);

                    ae(circle).css({
                        'top': top + 'px',
                        'left': left + 'px'
                    });
                },
                move = function(e) {
                    bPstX = acpLib.obj.positX(block);
                    bPstY = acpLib.obj.positY(block);
                    getColor(e);
                },
                mouseUp = function(e) {
                    e.preventDefault();
                    ae($window.document).unbind('mousemove', move);
                    ae($window.document).unbind('mouseup', mouseUp);
                };

            scope.$watch('instance.blockBGColor', function(v) {
                element.css('background-color', v);
            });

            cW = circle.offsetWidth;
            cH = circle.offsetHeight;
            bWi = block.offsetWidth - cW;
            bHe = block.offsetHeight - cH;
            pxY = bHe / 100;
            pxX = bWi / 100;

            element.bind('click', function(e) {
                getColor(e);
            });

            element.bind('mousedown', function(e) {
                if (1 === e.which) {
                    e.preventDefault();
                    scope.instance.none = false;
                    move(e);
                    ae($window.document).bind('mouseup', mouseUp);
                    ae($window.document).bind('mousemove', move);
                }
            });

            scope.$watch('instance.hsv', function(v) {
                if (v && v.length > 0) {
                    if ('none' === v) {
                        v = [359, 0, 0];
                    }
                    setPosition(v);
                }
            });
        }
    };
}]);