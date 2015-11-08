jQuery.extend({

  ViewCommand: function($element) {
    //a reference to ourselves
    var thisView = this;
    // what is listening to this view
    var listeners = new Array();
    
    var commandsTimer;

    $element.append($("<input type='button' value='  Edit General Data  ' id='edit-general-data'></input>").click(function(){
      thisView.notifyClickEditGeneralData();
    }));
    $element.append($("<input type='button' value='  Edit Lunch Box Data  ' id='edit-lunch-box-data'></input>").click(function(){
      thisView.notifyClickEditLunchBoxData();
    }));
    $element.append($("<input type='button' value='  Edit Student Data  ' id='edit-student-data'></input>").click(function(){
      thisView.notifyClickEditStudentData();
    }));
    $element.append($("<input type='button' value='  Email Data  ' id='email-data'></input>").click(function(){
      thisView.notifyClickEmail();
    }));

    var showCommands = function() {
      $element.children().show();
      clearTimeout(commandsTimer);
    }
    
    var hideCommands = function() {
      commandsTimer = setTimeout(function() { $element.children().hide() }, 1000);
    }

    $element.children().hide()
    $element.hover(showCommands,hideCommands);

    // add an event listener to this view
    this.addListener = function(list){
      listeners.push(list);
    }

    // click event - Edit General Data
    this.notifyClickEditGeneralData = function(){
      $.each(listeners, function(i) {
        listeners[i].clickEditGeneralData();
      });
    }

    // click event - Edit Lunch Box Data
    this.notifyClickEditLunchBoxData = function(){
      $.each(listeners, function(i) {
        listeners[i].clickEditLunchBoxData();
      });
    }

    // click event - Edit Student Data
    this.notifyClickEditStudentData = function(){
      $.each(listeners, function(i) {
        listeners[i].clickEditStudentData();
      });
    }

    // click event - Email
    this.notifyClickEmail = function(){
      $.each(listeners, function(i) {
        listeners[i].clickEmail();
      });
    }

  },

  // this view's event listeners
  ViewListener: function(list) {
    if(!list) list = {};
    return $.extend({
      clickEditGeneralData: function() {},
      clickEditLunchBoxData: function() {},
      clickEditStudentData: function() {},
      clickEmail: function() {},
    }, list);
  }

});