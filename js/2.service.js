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