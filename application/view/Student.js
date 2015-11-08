jQuery.extend({

  ViewStudent: function($element) {
    //a reference to ourselves
    var thisView = this;
    // what is listening to this view
    var listeners = new Array();

    $element.append($('<div class="clear"></div>'));

    // add an event listener to this view
    this.addListener = function(list){
      listeners.push(list);
    }
  },

  // this view's event listeners
  ViewListener: function(list) {
    if(!list) list = {};
    return $.extend({
    }, list);
  }

});