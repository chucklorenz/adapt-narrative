define([
    'core/js/adapt',
    'core/js/views/componentView',
    'libraries/jquery.attrs'
], function(Adapt, ComponentView) {

    var Narrative = ComponentView.extend({

        events: {
            "click .back": "onBackClick",
            "click .next": "onNextClick",
        },

        preRender: function() {},

        postRender: function() {
            this.setReadyStatus();

            _.bindAll(this, "onSwipe");
            this.$(".items-container").on({
                "swipeleft": this.onSwipe,
                "swiperight": this.onSwipe
            });
        },

        onSwipe: function(event) {
            event.preventDefault();
            switch (event.type) {
                case "swiperight":
                    this.onBackClick(null, true);
                    break;
                case "swipeleft":
                    this.onNextClick(null, true);
                    break;
            }
        },

        reRender: function() {

            var $rendered = $(Handlebars.templates[this.constructor.template](this.model.toJSON()));

            var replaceSelectors = [ 
                'button.back', 
                'button.next',
                '.counter'
            ];

            replaceSelectors.forEach(function(selector) {
                var $source = $rendered.find(selector);
                var $dest = this.$(selector);
                if (!$source.length) $dest.remove();
                else $dest.replaceWith($source);
            }.bind(this));

            var updateAttributes = [
                ".items-inner",
                ".texts-inner"
            ];

            updateAttributes.forEach(function(selector) {
                var $source = $rendered.find(selector);
                var $dest = this.$(selector);
                if (!$source.length) return;
                if (!$dest.length) return;

                $dest.attrs($source.attrs());

            }.bind(this));


        },

        onBackClick: function(event, isSwipe) {
            this.moveIndex(-1, isSwipe);
        },

        onNextClick: function(event, isSwipe) {
            this.moveIndex(1, isSwipe);
        },

        moveIndex: function(indexes, isSwipe) {
            var currentIndex = this.model.get("_currentIndex") || 0;
            var items = this.model.get("_items").length;
            currentIndex+=indexes;

            var loop = this.model.get("_loop");

            if (currentIndex < 0) {
                if (loop && !isSwipe) currentIndex = items-1;
                else currentIndex = 0;
            } else if (currentIndex >= items) {
                if (loop && !isSwipe) currentIndex = 0;
                else currentIndex = items-1;
            }

            this.model.set("_currentIndex", currentIndex);
            this.model.checkItemsComplete();
            this.reRender();
        },

        remove: function() {
            this.$(".items-container").off({
                "swipeleft": this.onSwipe,
                "swiperight": this.onSwipe
            });
            ComponentView.prototype.remove.call(this);
        }

    },{
        template: 'narrative'
    });

    return Narrative;
});
