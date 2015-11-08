jQuery.extend({

  ModelStudent: function() {
    //a reference to ourselves
    var thisModel = this;
    // what is listening to this model
    var listeners = new Array();
    //local cache of data
    var cacheStudentData = new Array();

    // public function to load the data for this model
    this.loadStudents = function(){
      thisModel.notifyLogMessage(">> Begin Loading Students...");
      $.ajax({
        url: 'data/students.json',
        type: 'GET',
        dataType: 'json',
        timeout: 1000,
        error: function(jqXHR, textStatus, errorThrown) {
          thisModel.notifyLogMessage(">> loadStudents Error: " + textStatus + " | " + errorThrown);
        },
        success: function(data, textStatus, jqXHR) {
          loadStudentResponse(data);
          thisModel.notifyLogMessage(">> loadStudents Success: " + textStatus);
          thisModel.notifyLoadStudentsComplete();
        }
      });
    }

    // private function to process the response from the data load
    function loadStudentResponse(allStudents) {
      $.each(allStudents, function(index, thisStudent) {
        var duplicate = $.grep(cacheStudentData, function(e) { return e.id == thisStudent.id; });
        if (duplicate.length == 0) {
          cacheStudentData.push(thisStudent);
          console.log("Loaded Student: " + thisStudent.id + " " + thisStudent.nameFirst + " " + thisStudent.nameLast);
          createStudentElement(thisStudent);
        } else {
          console.log("Skipped Student: " + thisStudent.id + " " + thisStudent.nameFirst + " " + thisStudent.nameLast);
        }
      });
    }

    // private function to create an element based on the loaded data
    function createStudentElement(thisStudent) {
      thisStudent.elementId = 'student-' + thisStudent.id;
      var thisElement = $(document.createElement('div'));
      thisElement.attr('id', thisStudent.elementId);
      thisElement.addClass('student');
      thisElement.html(thisStudent.id);
      $('#student-container').children().children('.student-box').append(thisElement);
      thisModel.addClickStudent(thisStudent);
    }

    // public function to add a click event listener to the element of an object
    this.addClickStudent = function(thisStudent) {
      $('#' + thisStudent.elementId).click(function() {
        thisModel.notifyClickStudent(thisStudent);
      });
    }

    // public function to generate form to edit this model's data
    this.getWindowModalEditStudentData = function() {
      // Construct the HTML Form
      var htmlStr = "";
      htmlStr += "<form id='edit-student-data-form' name='edit-data-form' action='' method='get' onSubmit='return false;'>";
      htmlStr += "<input type='button' name='buttonSave' id='saveData' value='Save Data'>";
      htmlStr += "<br /><br />";
      htmlStr += "<table>";
      htmlStr += "<tr>";
      htmlStr += "<td class='label'>ID</td>";
      htmlStr += "<td class='label'>First Name</td>";
      htmlStr += "<td class='label'>Last Name</td>";
      htmlStr += "</tr>";
      $.each(cacheStudentData, function(i) {
        var thisStudentData = cacheStudentData[i];
        htmlStr += "<tr>";
        htmlStr += "<td class='input'><input type='text' name='student-id' class='student-id' value='" + thisStudentData.id + "'></td>";
        htmlStr += "<td class='input'><input type='text' name='student-label' class='student-label' value='" + thisStudentData.nameFirst + "'></td>";
        htmlStr += "<td class='input'><input type='text' name='student-count' class='student-count' value='" + thisStudentData.nameLast + "'></td>";
        htmlStr += "<td class='removeRow'>Remove</td>";
        htmlStr += "<td class='insertRow'>Insert</td>";
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

    this.editStudentDataFormInsert = function() {
      var htmlStr = "";
      htmlStr += "<tr>";
      htmlStr += "<td class='input'><input type='text' name='student-id' class='student-id' value=''></td>";
      htmlStr += "<td class='input'><input type='text' name='student-label' class='student-label' value=''></td>";
      htmlStr += "<td class='input'><input type='text' name='student-count' class='student-count' value=''></td>";
      htmlStr += "<td class='removeRow'>Remove</td>";
      htmlStr += "<td class='insertRow'>Insert</td>";
      htmlStr += "</tr>";
      return htmlStr;
    }

    // public function to get cached data
    this.getCacheStudentData = function() {
      return cacheStudentData;
    }

    // public function to clear all cached data in this model
    this.clearStudentData = function(){
      cacheStudentData = new Array();
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
    this.notifyLoadStudentsComplete = function() {
      $.each(listeners, function(i){
        listeners[i].loadStudentsComplete();
      });
    }

    // public function to notify of a click on a student object
    this.notifyClickStudent = function(thisStudent) {
      $.each(listeners, function(i) {
        listeners[i].clickStudent(thisStudent);
      });
    }
  },

  // this model's listeners
  ModelListener: function(list) {
    if(!list) list = {};
    return $.extend({
      logMessage: function() {},
      loadStudentsComplete: function() {},
      clickStudent: function() {},
    }, list);
  }

});