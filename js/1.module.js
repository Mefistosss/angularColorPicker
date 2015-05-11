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