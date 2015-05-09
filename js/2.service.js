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
acp.factory('acpModel', function() {
    return {
        instance: null
    }
});