'use strict';

constructorApp.service('pickerLib', function() {
    return {
        pareseRgb: function(rgb) {
            var result = [];
            if ('none' !== rgb) {
                rgb = rgb.split('(')[1];
                rgb = rgb.split(')')[0];
                rgb = rgb.split(',');
                angular.forEach(rgb, function(v) {
                    result.push(parseInt(v));
                });
                return result;
            } else {
                return rgb;
            }
        },
        obj: {
            positX: function(b) {
                var a, c;
                a = 0;
                c = b.getBoundingClientRect();
                b = document.body;
                a = document.documentElement;
                a = c.left + (a.scrollLeft || b && b.scrollLeft || 0) - (a.clientLeft || b.sclientLeft || 0);
                return Math.round(a);
            },
            positY: function(b) {
                var a, c;
                a = 0;
                c = b.getBoundingClientRect();
                b = document.body;
                a = document.documentElement;
                a = c.top + (a.scrollTop || b && b.scrollTop || 0) - (a.clientTop || b.sclientTop || 0);
                return Math.round(a);
            }
        },
        mouse: {
            pageX: function(b) {
                var a, c, d;
                d = b || event;
                return null == d.pageX && null != d.clientX ? (a = document.body, c = document.documentElement, b = c.scrollLeft || a && a.scrollLeft || 0, b = d.clientX + b - (c.clientLeft || a.clientLeft || 0)) : d.pageX;
            },
            pageY: function(b) {
                var a, c, d;
                d = b || event;
                return null == d.pageX && null != d.clientX ? (a = document.body, c = document.documentElement, b = c.scrollTop || a && a.scrollTop || 0, b = d.clientY + b - (c.clientTop || a.clientTop || 0)) : d.pageY;
            }
        },
        hsv_rgb: function (H,S,V){
            var f , p, q , t, lH;
            var R, G, B;
       
            S /= 100;
            V /= 100;
         
            lH = Math.floor(H / 60);

            f = H / 60 - lH;
            p = V * (1 - S); 
            q = V * (1 - S * f);
            t = V * (1 - (1 - f) * S);
          
            switch (lH) {
                case 0: R = V; G = t; B = p; break;
                case 1: R = q; G = V; B = p; break;
                case 2: R = p; G = V; B = t; break;
                case 3: R = p; G = q; B = V; break;
                case 4: R = t; G = p; B = V; break;
                case 5: R = V; G = p; B = q; break;
            }

            return [parseInt(R * 255), parseInt(G * 255), parseInt(B * 255)];
        },
        rgb_hsv: function(rgb) {
            var hsv = [],
                h, s, v, min,
                cr, cg, cb;
            if (rgb && rgb.length > 0) {
                v = Math.max(rgb[0], rgb[1], rgb[2]);
                min = Math.min(rgb[0], rgb[1], rgb[2]);

                if (0 === v) {
                    s = 0;
                } else {
                    s = (v - min) / v;
                }

                if (0 === s) {
                    // неопределенность
                    h = 359;
                } else {
                    cr = (v - rgb[0]) / (v - min);
                    cg = (v - rgb[1]) / (v - min);
                    cb = (v - rgb[2]) / (v - min);

                    if (rgb[0] === v) {
                        h = cb - cg;
                    }

                    if (rgb[1] === v) {
                        h = 2 + cr - cb;
                    }
                    if (rgb[2] === v) {
                        h = 4 + cg - cr;
                    }
                    h = h * 60;

                    // приведение к положительным
                    if (h < 0) {
                        h = h + 360;
                    }
                }
                hsv.push(h);
                hsv.push(s);
                hsv.push(v);
            }
            return hsv;
        }
    }
});
constructorApp.directive('colorPicker', ['$compile', 'pickerLib', function($compile, pickerLib) {
    return {
        restrict: 'A',
        scope: {},
        template: '<div class="control-panel" control-panel></div>' +
                    '<div class="main-panel" main-panel></div>',
        controller: function($scope, $element, $attrs) {
            $scope.blockBGColor = 'red';
            $scope.rgb = 'rgb(255,255,255)';
            $scope.hex = '#ffffff';
            $scope.hue = 0;
            $scope.none = false;
            $scope.picker = {
                V: 100,
                S: 100
            };

            $scope.checkboxChange = function() {
                $scope.picker.V = 100;
                $scope.picker.S = 100;
                $scope.hue = 0;

                if ($scope.none) {
                    $scope.rgb = '';
                    $scope.hex = '';
                    $scope.hsv = 'none';
                    $scope.blockBGColor = 'red';
                } else {
                    $scope.rgb = 'rgb(0,0,0)';
                    $scope.hex = '#000';
                    $scope.hsv = pickerLib.rgb_hsv(pickerLib.pareseRgb($scope.rgb));
                    $scope.blockBGColor = 'rgb(' + pickerLib.hsv_rgb(0, 100, 100) + ')';
                }

                $scope.$emit('colorPickerEvent', {
                    rgb: $scope.rgb,
                    cleanRgb: '0,0,0',
                    hex: $scope.hex
                });
            };
        },
        link: function(scope, element, attrs) {
            scope.$on('setColorPickerColorEvent', function(e, args) {
                var rgb = pickerLib.pareseRgb(args.color);
                scope.rgb = args.color;
                if ('none' === rgb) {
                    scope.rgb = '';
                    scope.hex = '';
                    scope.hsv = 'none';
                    scope.hue = 0;
                    scope.picker.V = 100;
                    scope.picker.S = 100;
                    scope.blockBGColor = 'red';
                    scope.none = true;
                } else {
                    scope.hex = '#' + (rgb[0].toString(16) + '' + rgb[1].toString(16) + '' + rgb[2].toString(16));
                    scope.hsv = pickerLib.rgb_hsv(rgb);
                    scope.none = false;
                }
            });

            // $compile(element.contents())(scope);
        }
    };
}]);

constructorApp.directive('controlPanel', ['$compile', '$window', 'pickerLib', function($compile, $window, pickerLib) {
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
                    parPointX = pickerLib.obj.positX(element.parent().parent()[0]);
                    parPointY = pickerLib.obj.positY(element.parent().parent()[0]);

                    top = pickerLib.mouse.pageY(e) - startPointY - parPointY;
                    left = pickerLib.mouse.pageX(e) - startPointX - parPointX;

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
                    angular.element($window.document).unbind('mousemove', move);
                    angular.element($window.document).unbind('mouseup', mouseUp);
                };

            element.bind('mousedown', function(e) {
                if (1 === e.which) {
                    e.preventDefault();
                    element.css('cursor', 'move');
                    startPointX = pickerLib.mouse.pageX(e) - pickerLib.obj.positX(element[0]);
                    startPointY = pickerLib.mouse.pageY(e) - pickerLib.obj.positY(element[0]);
                    angular.element($window.document).bind('mouseup', mouseUp);
                    angular.element($window.document).bind('mousemove', move);
                }
            });

            angular.element(button).bind('click', function(e) {
                scope.$emit('closeColorPickerEvent');
            });
        }
    };
}]);


constructorApp.directive('mainPanel', ['$compile', function($compile) {
    return {
        restrict: 'A',
        template: '<div class="line-piker" line-color-picker></div>' +
                    '<div class="block-picker" block-color-picker="blockBGColor"></div>' +
                    '<div class="out-color" out-color-picker></div>' +
                    '<div class="text">' +
                        '<span>{{rgb}}</span></br>' +
                        '<span>{{hex}}</span></br>' +
                        'none: <input ng-model="none" type="checkbox" ng-change="checkboxChange()">' +
                    '</div>'
    };
}]);

constructorApp.directive('lineColorPicker', ['$compile', '$window', 'pickerLib', function($compile, $window, pickerLib) {
    var grd = function (canvas, h, w){
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
                       
                    top = pickerLib.mouse.pageY(e) - pos;
                    top = (top < 0 )? 0 : top;
                    top = (top > line.height )? line.height  : top;
             
                    arrows.style.top = top - 2 + 'px';
                    tmp =  Math.round(top / ( line.height / 360 ));
                    tmp = Math.abs(tmp - 360);
                    tmp = (tmp == 360) ? 0 : tmp;
              
                    scope.hue = tmp;

                    rgb = pickerLib.hsv_rgb(tmp, scope.picker.S, scope.picker.V);
                    scope.$apply(function() {
                        scope.blockBGColor = 'rgb(' + pickerLib.hsv_rgb(tmp, 100, 100) + ')';
                        scope.rgb = 'rgb(' + rgb + ')';
                        scope.hex = '#' + (rgb[0].toString(16) + '' + rgb[1].toString(16) + '' + rgb[2].toString(16));
                        scope.$emit('colorPickerEvent', {
                            rgb: scope.rgb,
                            cleanRgb: rgb + '',
                            hex: scope.hex
                        });
                    });
                },
                setPosition = function(h) {
                    var top = 180 - 180 / (360 / h);
                    
                    arrows.style.top = top - 2 + 'px';
                    scope.hue = h;
                    scope.blockBGColor = 'rgb(' + pickerLib.hsv_rgb(h, 100, 100) + ')';
                },
                move = function(e) {
                    getColor(e);
                },
                mouseUp = function(e) {
                    e.preventDefault();
                    angular.element($window.document).unbind('mousemove', move);
                    angular.element($window.document).unbind('mouseup', mouseUp);
                };

            line.node.width = line.width;
            line.node.height = line.height;
           
            grd(line.node, line.height, line.width);

            angular.element(arrows).bind('mousedown', function(e) {
                if (1 === e.which) {
                    e.preventDefault();
                    scope.none = false;
                    pos = pickerLib.obj.positY(line.node);
                    angular.element($window.document).bind('mousemove', move);
                }
            });

            angular.element(arrows.node).bind('click', getColor);

            angular.element(line.node).bind('click', function(e) {
                scope.none = false;
                getColor(e);
            });

            angular.element(line.node).bind('mousedown', function(e) {
                if (1 === e.which) {
                    e.preventDefault();
                    pos = pickerLib.obj.positY(line.node);
                    angular.element($window.document).bind('mouseup', mouseUp);
                    angular.element($window.document).bind('mousemove', move);
                }
            });

            scope.$watch('hsv', function(v) {
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

constructorApp.directive('blockColorPicker', ['$compile', '$window', 'pickerLib', function($compile, $window, pickerLib) {
    return {
        restrict: 'A',
        scope: false,
        template: '<img src="img/bgGradient.png">' +
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

                    left = pickerLib.mouse.pageX(e) - bPstX - cW/2;
                    left = (left < 0) ? 0 : left;
                    left = (left > bWi) ? bWi  : left;

                    angular.element(circle).css('left', left + 'px');

                    S = Math.ceil(left / pxX);
        
                    top = pickerLib.mouse.pageY(e) - bPstY - cH/2;
                    top = (top > bHe) ? bHe : top;
                    top = (top < 0) ? 0 : top;
                    
                    angular.element(circle).css('top', top + 'px');
                    
                    V = Math.ceil(Math.abs(top / pxY - 100));

                    // angular.element(circle).css('border-color', V < 50 ? '#fff' : '#000');
                    
                    scope.picker.S = S;
                    scope.picker.V = V;

                    rgb = pickerLib.hsv_rgb(scope.hue, S, V);
                    scope.$apply(function() {
                        scope.rgb = 'rgb(' + rgb + ')';
                        scope.hex = '#' + (rgb[0].toString(16) + '' + rgb[1].toString(16) + '' + rgb[2].toString(16));
                        scope.$emit('colorPickerEvent', {
                            rgb: scope.rgb,
                            cleanRgb: rgb + '',
                            hex: scope.hex
                        });
                    });
                },
                setPosition = function(hsv) {
                    var top = bHe - bHe / (255 / hsv[2]),
                        left = bWi / (1 / hsv[1]);

                    angular.element(circle).css({
                        'top': top + 'px',
                        'left': left + 'px'
                    });
                },
                move = function(e) {
                    bPstX = pickerLib.obj.positX(block);
                    bPstY = pickerLib.obj.positY(block);
                    getColor(e);
                },
                mouseUp = function(e) {
                    e.preventDefault();
                    angular.element($window.document).unbind('mousemove', move);
                    angular.element($window.document).unbind('mouseup', mouseUp);
                };

            scope.$watch('blockBGColor', function(v) {
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
                    scope.none = false;
                    move(e);
                    angular.element($window.document).bind('mouseup', mouseUp);
                    angular.element($window.document).bind('mousemove', move);
                }
            });

            scope.$on('setColorPickerColorEvent', function(e, args) {
                scope.rgb = args.color;
            });

            scope.$watch('hsv', function(v) {
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

constructorApp.directive('outColorPicker', ['$compile', function($compile) {
    return {
        restrict: 'A',
        scope: false,
        link: function(scope, element, attrs) {
            scope.$watch('rgb', function(v) {
                element.css('background-color', v);
            });
        }
    };
}]);