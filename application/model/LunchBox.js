jQuery.extend({

  ModelLunchBox: function() {
    // a reference to ourselves
    var thisModel = this;
    // what is listening to this model
    var listeners = new Array();
    // local cache of data
    var cacheLunchBoxData = new Array();

    // public function to load the data for this model
    this.loadLunchBoxes = function(){
      thisModel.notifyLogMessage(">> Begin Loading Lunch Boxes...");
      $.ajax({
        url: 'data/lunchboxes.json',
        type: 'GET',
        dataType: 'json',
        timeout: 1000,
        error: function(jqXHR, textStatus, errorThrown) {
          thisModel.notifyLogMessage(">> loadLunchBoxes Error: " + textStatus + " | " + errorThrown);
        },
        success: function(data, textStatus, jqXHR) {
          loadLunchBoxResponse(data);
          thisModel.notifyLogMessage(">> loadLunchBoxes Success: " + textStatus);
          thisModel.notifyLoadLunchBoxesComplete();
        }
      });
    }

    // private function to process the response from the data load
    function loadLunchBoxResponse(allLunchBoxes) {
      $.each(allLunchBoxes, function(index, thisLunchBox) {
        var duplicate = $.grep(cacheLunchBoxData, function(e) { return e.id == thisLunchBox.id; });
        if (duplicate.length == 0) {
          cacheLunchBoxData.push(thisLunchBox);
          console.log("Loaded LunchBox: " + thisLunchBox.id + " " + thisLunchBox.label);
          createLunchBoxElement(thisLunchBox);
        } else {
          console.log("Skipped LunchBox: " + thisLunchBox.id + " " + thisLunchBox.label);
        }
      });
    }

    // private function to create an element based on the loaded data
    function createLunchBoxElement(thisLunchBox) {
      thisLunchBox.elementId = 'lunch-box-'+thisLunchBox.id;
      var thisElement = $(document.createElement('div'));
      thisElement.attr('id', thisLunchBox.elementId);
      thisElement.append('<div class="clear"></div>');
      if (thisLunchBox.id != 0) {
        thisElement.addClass('lunch-box');
        if (isOdd(thisLunchBox.id)) {
          thisElement.addClass('odd');
        } else {
          thisElement.addClass('even');
        }
        thisElement.children('.clear').before('<span class="notSortable student-box-label">'+thisLunchBox.label+':</span>');
        thisElement.children('.clear').before('<span class="notSortable student-box-space">&nbsp;&nbsp;</span>');
        thisElement.children('.clear').before('<span class="notSortable student-box-count">'+thisLunchBox.count+'</span>');
      }
      thisElement.children('.clear').before('<div class="container student-box"></div>');
      if (thisLunchBox.id == 0) {
        $('#student-container').children('.clear').before(thisElement);
        makeSortable(thisElement.children('.student-box'));
      } else {
        $('#lunch-box-container').children('.clear').before(thisElement);
        makeSortable(thisElement.children('.student-box'));
      }
      thisModel.addClickLunchBox(thisLunchBox);
    }

    // public function to add a click event listener to the element of an object
    this.addClickLunchBox = function(thisLunchBox) {
      $('#' + thisLunchBox.elementId).click(function() {
        thisModel.notifyClickLunchBox(thisLunchBox);
      });
    }

    // private function to count the students in each lunch box
    function countLunchBox(thisLunchBox, silent) {
      var thisLunchBoxElement = $('#' + thisLunchBox.elementId);
      var oldCount = thisLunchBox.count;
      var newCount = thisLunchBoxElement.children('.student-box').children('.student').length;
      thisLunchBox.count = newCount;
      thisLunchBoxElement.children('.student-box-count').html(thisLunchBox.count);
      if (!silent) {
        console.log("Counted LunchBox: " + thisLunchBox.id + " " + thisLunchBox.label + " changed from " + oldCount + " to " + newCount);
      }
    }

    // private function to sort the students in each lunch box
    function sortLunchBox(thisLunchBox, silent) {
      var thisLunchBoxElement = $('#' + thisLunchBox.elementId);
      thisLunchBoxElement.children().children('.student').tsort({order:"asc"});
      if (!silent) {
        console.log("Sorted LunchBox: " + thisLunchBox.id + " " + thisLunchBox.label);
      }
    }

    // public function to update the properties for each object
    this.updateLunchBoxes = function() {
      thisModel.notifyLogMessage(">> Begin Updating Lunch Boxes...");
      $.each(cacheLunchBoxData, function(i) {
        var thisLunchBox = cacheLunchBoxData[i];
        var thisLunchBoxElement = $('#' + thisLunchBox.elementId);
        var oldCount = thisLunchBox.count;
        var newCount = thisLunchBoxElement.children('.student-box').children('.student').length;
        if (oldCount != newCount) {
          countLunchBox(thisLunchBox, false);
        }
        if (newCount > 0) {
          sortLunchBox(thisLunchBox, false);
        }
      });
      thisModel.notifyLogMessage(">> updateLunchBoxes Complete");
    }

    // public function to generate form to edit this model's data
    this.getWindowModalEditLunchBoxData = function() {
      // Construct the HTML Form
      var htmlStr = "";
      htmlStr += "<form id='edit-lunch-box-data-form' name='edit-data-form' action='' method='get' onSubmit='return false;'>";
      htmlStr += "<input type='button' name='buttonSave' id='saveData' value='Save Data'>";
      htmlStr += "<br /><br />";
      htmlStr += "<table>";
      htmlStr += "<tr>";
      htmlStr += "<td class='label thin'>ID</td>";
      htmlStr += "<td class='label'>Label</td>";
      htmlStr += "<td class='label thin'>Count</td>";
      htmlStr += "</tr>";
      $.each(cacheLunchBoxData, function(i) {
        var thisLunchBoxData = cacheLunchBoxData[i];
        htmlStr += "<tr>";
        if (thisLunchBoxData.id == 0) {
          htmlStr += "<td class='input'><input type='text' name='lunchBox-id' class='lunchBox-id' value='" + thisLunchBoxData.id + "' readonly></td>";
          htmlStr += "<td class='input'><input type='text' name='lunchBox-label' class='lunchBox-label' value='" + thisLunchBoxData.label + "' readonly></td>";
          htmlStr += "<td class='input'><input type='text' name='lunchBox-count' class='lunchBox-count' value='" + thisLunchBoxData.count + "' readonly></td>";
        } else {
          htmlStr += "<td class='input'><input type='text' name='lunchBox-id' class='lunchBox-id' value='" + thisLunchBoxData.id + "'></td>";
          htmlStr += "<td class='input'><input type='text' name='lunchBox-label' class='lunchBox-label' value='" + thisLunchBoxData.label + "'></td>";
          htmlStr += "<td class='input'><input type='text' name='lunchBox-count' class='lunchBox-count' value='" + thisLunchBoxData.count + "' readonly></td>";
          htmlStr += "<td class='removeRow'>Remove</td>";
          htmlStr += "<td class='insertRow'>Insert</td>";
        }
        htmlStr += "</tr>";
      });
      htmlStr += "<tr>";
      htmlStr += "<td></td>";
      htmlStr += "<td></td>";
      htmlStr += "<td></td>";
      htmlStr += "<td></td>";
      htmlStr += "<td class='insertRow'>Insert</td>";
      htmlStr += "</tr>";
      htmlStr += "</table>";
      htmlStr += "</form>";
      return htmlStr;
    }

    this.editLunchBoxDataFormInsert = function() {
      var htmlStr = "";
      htmlStr += "<tr>";
      htmlStr += "<td class='input'><input type='text' name='lunchBox-id' class='lunchBox-id' value=''></td>";
      htmlStr += "<td class='input'><input type='text' name='lunchBox-label' class='lunchBox-label' value=''></td>";
      htmlStr += "<td class='input'><input type='text' name='lunchBox-count' class='lunchBox-count' value='0' readonly></td>";
      htmlStr += "<td class='removeRow'>Remove</td>";
      htmlStr += "<td class='insertRow'>Insert</td>";
      htmlStr += "</tr>";
      return htmlStr;
    }

    // private function to determine if a number is odd or even
    function isOdd(num) {
      return num % 2;
    }

    // private function to make an element sortable
    function makeSortable(element) {
      $(element).sortable( {
        cancel: '.notSortable',
        connectWith: '.student-box',
        receive: function(event, ui) {
          thisModel.updateLunchBoxes();
        },
        update: function(event, ui) {
          $.each(cacheLunchBoxData, function(i) {
            var thisLunchBox = cacheLunchBoxData[i];
            sortLunchBox(thisLunchBox, true);
          });
        },
      } );
    }

    // public function to get cached data
    this.getCacheLunchBoxData = function() {
      return cacheLunchBoxData;
    }

    // public function to clear all cached data in this model
    this.clearLunchBoxData = function(){
      cacheLunchBoxData = new Array();
    }

    // public function to add a listener to this model
    this.addListener = function(list) {
      listeners.push(list);
    }

    // public function to notify of a log a message
    this.notifyLogMessage = function(str) {
      $.each(listeners, function(i){
        listeners[i].logMessage(str);
      });
    }

    // public function to notify of the successful loading of data
    this.notifyLoadLunchBoxesComplete = function(str) {
      $.each(listeners, function(i){
        listeners[i].loadLunchBoxesComplete(str);
      });
    }

    // public function to notify of a click on a lunch box object
    this.notifyClickLunchBox = function(thisLunchBox) {
      $.each(listeners, function(i){
        listeners[i].clickLunchBox(thisLunchBox);
      });
    }
  },

  // this model's listeners
  ModelListener: function(list) {
    if(!list) list = {};
    return $.extend({
      logMessage: function() {},
      loadLunchBoxesComplete: function() {},
      clickLunchBox: function() {}
    }, list);
  }

});