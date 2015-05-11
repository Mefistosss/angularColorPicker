(function() {
    'use strict';
var acp = angular.module('angularColorPicker', []),

    ae = angular.element,
    each = angular.forEach;

acp.value('acpOptions', {
    // set the path to the bgGradient.png
    'imgPath': '../img/bgGradient.png',
    'startPosition': {
        'x': 'center',
        'y': 'center'
    }
});
acp.service('acpLib', function() {
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
        pareseHex: function(hex) {
            var result = [], l, count = 2, step = 2, pos = 0;
            if ('none' !== hex) {
                hex = hex.replace('#', '');
                l = hex.length;
                if (6 === l || 3 === l) {
                    if (3 === l) {
                        count = 1;
                        step = 1;
                    }
                    while(l !== pos) {
                        result.push(parseInt(hex.substr(pos, count), 16));
                        pos += step;
                    }
                } else {
                    result = [255, 255, 255];
                }
                return result;
            } else {
                return hex;
            }
        },
        cleanString: function(str) {
            return str.replace(/\s+/g, '');
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
        convertRgbToHex: function(rgb) {
            return  ('0' + parseInt(rgb[0],10).toString(16)).slice(-2) +
                    ('0' + parseInt(rgb[1],10).toString(16)).slice(-2) +
                    ('0' + parseInt(rgb[2],10).toString(16)).slice(-2);
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
                    // uncertainty
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

                    // leading to positive
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
acp.factory('acpModel', function() {
    var colorPickers = [],

    api = {
        checkInstance: function(name) {
            return (name && colorPickers[name]);
        },
        getInstance: function(name) {
            return colorPickers[name];
        },
        removeInstance: function(name) {
            if (api.checkInstance(name)) {
                delete colorPickers[name];
            }
        },
        newInstance: function(name) {
            api.removeInstance(name);
            return colorPickers[name] = {
                blockBGColor: 'red',
                rgb: 'rgb(255,255,255)',
                hex: '#ffffff',
                hue: 0,
                none: false,
                picker: {
                    V: 100,
                    S: 100
                }
            };
        }
    };
    return api;
});
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
                            instance.hex = '#' + (rgb[0].toString(16) + '' + rgb[1].toString(16) + '' + rgb[2].toString(16));
                            instance.hsv = acpLib.rgb_hsv(rgb);
                            instance.none = false;
                        }
                        ngModelFlag = true;
                    }
                    $compile(container)(scope);
                },
                close = function() {
                    acpModel.removeInstance(id);
                    ngModelFlag = false;
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
            container.addClass('color-picker');
            container.attr('acp-window', '');
            container.attr('name', id);

            type = acpLib.cleanString(attrs.angularColorPicker);

            if ('rgb' !== type && 'hex' !== type) {
                type = 'rgb';
            }

            scope.$on('acpEvent', function(e) {
                e.stopPropagation();
                // instance.rgb
                // instance.cleanRgb TODO
                // instance.hex
                if (ngModelFlag) {
                    ngModel.$setViewValue(instance[type]);
                }
            });
            scope.$on('closeAcp', function(e) {
                e.stopPropagation();
                close();
            });
            element.bind('click', click);
            $document.bind('mousedown', mouseDown);
        }
    };
}]);
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
                scope.$emit('acpEvent');
            }
        }
    };
}]);
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

            element.bind('mousedown', function(e) {
                if (1 === e.which && e.target !== button) {
                    e.preventDefault();
                    element.css('cursor', 'move');
                    startPointX = acpLib.mouse.pageX(e) - acpLib.obj.positX(element[0]);
                    startPointY = acpLib.mouse.pageY(e) - acpLib.obj.positY(element[0]);
                    ae($window.document).bind('mouseup', mouseUp);
                    ae($window.document).bind('mousemove', move);
                }
            });
            ae(button).bind('click', function(e) {
                scope.$emit('closeAcp');
            });
        }
    };
}]);
acp.directive('acpMainPanel', ['$compile', function($compile) {
    return {
        restrict: 'A',
        template:   '<div class="line-piker" acp-line></div>' +
                    '<div class="block-picker" acp-block="blockBGColor"></div>' +
                    '<div class="out-color" acp-out></div>' +
                    '<div class="text">' +
                        '<span>{{instance.rgb}}</span></br>' +
                        '<span>{{instance.hex}}</span></br>' +
                        'none: <input ng-model="instance.none" type="checkbox" ng-change="checkboxChange()">' +
                    '</div>'
    };
}]);
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
                        scope.instance.hex = '#' + (rgb[0].toString(16) + '' + rgb[1].toString(16) + '' + rgb[2].toString(16));
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

                        scope.instance.hex = '#' + acpLib.convertRgbToHex(rgb);
                        // scope.instance.hex = '#' + (rgb[0].toString(16) + '' + rgb[1].toString(16) + '' + rgb[2].toString(16));
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
acp.directive('acpOut', ['$compile', function($compile) {
    return {
        restrict: 'A',
        scope: false,
        link: function(scope, element, attrs) {
            scope.$watch('instance.rgb', function(v) {
                element.css('background-color', v);
            });
        }
    };
}]);
})();