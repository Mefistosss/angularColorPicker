acp.directive('acpLine', ['$compile', '$window', 'acpLib', function($compile, $window, acpLib) {
    var rgb = function (canvas, h, w) {
            var gradient, hue, color, canvas, gradient1;
            
            canvas = canvas.getContext("2d");

            gradient = canvas.createLinearGradient( w / 2, h, w / 2, 0);
         
            hue = [
                [255,0,0],
                [255,255,0],
                [0,255,0],
                [0,255,255],
                [0,0,255],
                [255,0,255],
                [255,0,0]
            ];
        
            for (var i = 0; i <= 6; i++){   
                color = 'rgb('+hue[i][0]+','+hue[i][1]+','+hue[i][2]+')';
                gradient.addColorStop(i*1/6, color);
            }
            canvas.fillStyle = gradient;
            canvas.fillRect(0,0, w ,h);  
        };

    return {
        restrict: 'A',
        template: '<div class="arrows">' +
                    '<div id="left-arrow"></div>' +
                    '<div id="right-arrow"></div>' +
                '</div>' +
                '<canvas width="20" height="180" class="cLine"></canvas>',
        link: function(scope, element, attrs) {
            var pos, tmp = 0,
                arrows = element[0].childNodes[0],
                line = {
                    width: 20,
                    height: 180,
                    node: element[0].childNodes[1]
                },
                getColor = function (e) {
                    var top, rgb;
                       
                    top = acpLib.mouse.pageY(e) - pos;
                    top = (top < 0 )? 0 : top;
                    top = (top > line.height )? line.height  : top;
             
                    arrows.style.top = top - 2 + 'px';
                    tmp =  Math.round(top / ( line.height / 360 ));
                    tmp = Math.abs(tmp - 360);
                    tmp = (tmp == 360) ? 0 : tmp;
              
                    scope.instance.hue = tmp;

                    rgb = acpLib.hsv_rgb(tmp, scope.instance.picker.S, scope.instance.picker.V);
                    scope.$apply(function() {
                        scope.instance.blockBGColor = 'rgb(' + acpLib.hsv_rgb(tmp, 100, 100) + ')';
                        scope.instance.rgb = 'rgb(' + rgb + ')';
                        scope.instance.hex = '#' + acpLib.convertRgbToHex(rgb);
                        scope.$emit('acpEvent');
                    });
                },
                setPosition = function(h) {
                    var top = 180 - 180 / (360 / h);
                    
                    arrows.style.top = top - 2 + 'px';
                    scope.instance.hue = h;
                    scope.instance.blockBGColor = 'rgb(' + acpLib.hsv_rgb(h, 100, 100) + ')';
                },
                move = function(e) {
                    getColor(e);
                },
                mouseUp = function(e) {
                    e.preventDefault();
                    ae($window.document).unbind('mousemove', move);
                    ae($window.document).unbind('mouseup', mouseUp);
                };

            line.node.width = line.width;
            line.node.height = line.height;
           
            rgb(line.node, line.height, line.width);

            ae(arrows).bind('mousedown', function(e) {
                if (1 === e.which) {
                    e.preventDefault();
                    scope.instance.none = false;
                    pos = acpLib.obj.positY(line.node);
                    ae($window.document).bind('mouseup', mouseUp);
                    ae($window.document).bind('mousemove', move);
                }
            });

            ae(arrows.node).bind('click', getColor);

            ae(line.node).bind('click', function(e) {
                scope.instance.none = false;
                getColor(e);
            });

            ae(line.node).bind('mousedown', function(e) {
                if (1 === e.which) {
                    e.preventDefault();
                    pos = acpLib.obj.positY(line.node);
                    ae($window.document).bind('mouseup', mouseUp);
                    ae($window.document).bind('mousemove', move);
                }
            });

            scope.$watch('instance.hsv', function(v) {
                if (v && v.length > 0) {
                    if ('none' === v) {
                        v = [359, 0, 0];
                    }
                    setPosition(v[0]);
                }
            });
        }
    };
}]);