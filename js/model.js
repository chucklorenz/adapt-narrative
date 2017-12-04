define([
    'core/js/adapt',
    'core/js/models/componentModel'
], function(Adapt, ComponentModel) {

    var Narrative = ComponentModel.extend({

        defaults: function() {
            return _.extend({}, _.result(ComponentModel.prototype, "defaults"), {
                _currentIndex: 0,
                _loop: true,
                _nextIconClass: "",
                _backIconClass: "",
                counterText: " {{{inc _currentIndex}}} / {{{_items.length}}} "
            });
        },

        initialize: function() {
            ComponentModel.prototype.initialize.apply(this, arguments);
            this.translateLegacyItems();
            this.checkItemsComplete();
        },

        translateLegacyItems: function() {

            var items = this.get("_items");

            // turn _graphic.src into _graphic._src
            items.forEach(function(item) {
                var graphic = item._graphic;
                if (!graphic) return;
                if (graphic.src) graphic._src = graphic.src;
            });

        },

        checkItemsComplete: function() {

            var items = this.get("_items");
            var currentIndex = this.get("_currentIndex");
            items[currentIndex]._isVisited = true;

            var isComplete = !_.find(items, function(item) {
                if (!item._isVisited) return item;
            });

            if (!isComplete) return;

            this.setCompletionStatus();
        }

    });

    return Narrative;
});
