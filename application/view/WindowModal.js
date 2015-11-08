jQuery.extend({

  ViewWindowModal: function($element) {
    //a reference to ourselves
    var thisView = this;
    // what is listening to this view
    var listeners = new Array();

    this.windowModalSize = function() {
      var windowHeight = window.innerHeight;
      var windowWidth = window.innerWidth;
      var windowModalElement = $('#modal-window');
      var windowShadowElement = $('#shadow-window');
      var windowModalHeight = Math.max(windowHeight / 2, 100);
      var windowModalWidth = windowWidth - 100;
      var windowModalLeft = (windowWidth - windowModalWidth) / 2;
      var windowModalTop = 0.05 * windowHeight;
      windowModalElement.outerHeight(windowModalHeight);
      windowModalElement.outerWidth(windowModalWidth);
      windowModalElement.css('top', windowModalTop);
      windowModalElement.css('left', windowModalLeft);
    }

    this.windowModalShow = function(htmlStr) {
      //console.log(">> Begin Showing Modal Window");
      thisView.windowModalSize();
      var windowModalElement = $('#modal-window');
      var windowShadowElement = $('#shadow-window');
      windowModalElement.html(htmlStr);
      windowModalElement.css('display', 'block');
      windowShadowElement.css('display', 'block');
      windowShadowElement.click(function(){
        thisView.windowModalHide();
      });
      //console.log(">> windowModalShow Complete");
    }

    this.windowModalHide = function() {
      //console.log(">> Begin Hiding Lightbox");
      var windowModalElement = $('#modal-window');
      var windowShadowElement = $('#shadow-window');
      var htmlStr = "";
      windowModalElement.html(htmlStr);
      windowModalElement.css('display', 'none');
      windowShadowElement.css('display', 'none');
      windowShadowElement.unbind("click");
      //console.log(">> windowModalHide Complete");
    }

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