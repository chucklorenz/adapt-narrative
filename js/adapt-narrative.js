define([
    'core/js/adapt',
    './view',
    './model'
], function(Adapt, View, Model) {

    return Adapt.register('narrative', {
        view: View,
        model: Model
    });

});
