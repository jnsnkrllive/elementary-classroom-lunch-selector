jQuery.extend({

  ModelGeneral: function() {
    // a reference to ourselves
    var thisModel = this;
    // what is listening to this model
    var listeners = new Array();
    // local cache of data
    var cacheGeneralData = new Array();

    // public function to load the data for this model
    this.loadGeneralData = function() {
      thisModel.notifyLogMessage(">> Begin Loading General Data...");
      $.ajax({
        url: 'data/general.json',
        type: 'GET',
        dataType: 'json',
        timeout: 1000,
        error: function(jqXHR, textStatus, errorThrown) {
          thisModel.notifyLogMessage(">> loadGeneralData Error: " + textStatus + " | " + errorThrown);
        },
        success: function(data, textStatus, jqXHR) {
          loadGeneralDataResponse(data);
          thisModel.notifyLogMessage(">> loadGeneralData Success: " + textStatus);
          thisModel.notifyLoadGeneralDataComplete();
        }
      });
    }

    // private function to process the response from the data load
    function loadGeneralDataResponse(allGeneralData) {
      $.each(allGeneralData, function(index, thisGeneralData) {
        var duplicate = $.grep(cacheGeneralData, function(e) { return e.id == thisGeneralData.id; });
        if (duplicate.length == 0) {
          cacheGeneralData.push(thisGeneralData);
          console.log("Loaded GeneralData: " + thisGeneralData.id + " IS " + thisGeneralData.value);
        } else {
          console.log("Skipped GeneralData: " + thisGeneralData.id + " IS " + thisGeneralData.value);
        }
      });
    }
    
    this.getWindowModalEditGeneralData = function() {
      // Construct the HTML Form
      var htmlStr = "";
      htmlStr += "<form id='edit-general-data-form' name='edit-data-form' action='' method='get' onSubmit='return false;'>";
      htmlStr += "<input type='button' name='buttonSave' id='saveData' value='Save Data'>";
      htmlStr += "<br /><br />";
      htmlStr += "<table>";
      $.each(cacheGeneralData, function(i) {
        var thisGeneralData = cacheGeneralData[i];
        var thisLabel = "";
        switch (thisGeneralData.id) {
          case "district":
            thisLabel = "District:";
            break;
          case "school":
            thisLabel = "School:";
            break;
          case "teacherName":
            thisLabel = "Teacher Name:";
            break;
          case "teacherEmail":
            thisLabel = "Teacher Email:";
            break;
          case "classroom":
            thisLabel = "Classroom:";
            break;
          case "gradelevel":
            thisLabel = "Grade Level:";
            break;
          case "kitchenEmail":
            thisLabel = "Kitchen Email:";
            break;
          default:
            break;
        }
        htmlStr += "<tr>";
        htmlStr += "<td class='label'><label for='" + thisGeneralData.id + "'>" + thisLabel + "</label></td>";
        htmlStr += "<td class='input'><input type='text' name='" + thisGeneralData.id + "' class='general-value' value='" + thisGeneralData.value + "'></td>";
        htmlStr += "</tr>";
      });
      htmlStr += "</table>";
      htmlStr += "</form>";
      return htmlStr;
    }

    // public function to return content for email preview modal window
    this.getWindowModalEmail = function(cacheLunchBoxData) {
      // Define General Information for Email
      var thisDistrict = "";
      var thisSchool = "";
      var thisTeacherName = "";
      var thisTeacherEmail = "";
      var thisClassroom = "";
      var thisGradeLevel = "";
      var thisRecipientEmail = "";
      $.each(cacheGeneralData, function(i) {
        var thisGeneralData = cacheGeneralData[i];
        switch (thisGeneralData.id) {
          case "district":
            thisDistrict = thisGeneralData.value;
            break;
          case "school":
            thisSchool = thisGeneralData.value;
            break;
          case "teacherName":
            thisTeacherName = thisGeneralData.value;
            break;
          case "teacherEmail":
            thisTeacherEmail = thisGeneralData.value;
            break;
          case "classroom":
            thisClassroom = thisGeneralData.value;
            break;
          case "gradelevel":
            thisGradeLevel = thisGeneralData.value;
            break;
          case "kitchenEmail":
            thisRecipientEmail = thisGeneralData.value;
            break;
          default:
            break;
        }
      });
      // Get Today's Date and Format It
      var monthNames = new Array("January","February","March","April","May","June",
                                 "July","August","September","October","November","December");
      var today = new Date();
      var month = today.getMonth();
      var day = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
      var year = today.getFullYear();
      var dateToday = monthNames[month] + " " + day + ", " + year;
      // Construct the Standard Email Message Text
      var stdMsg = "";
      stdMsg += "Date: " + dateToday + "\n";
      stdMsg += "District: " + thisDistrict + "\n";
      stdMsg += "School: " + thisSchool + "\n";
      stdMsg += "Teacher: " + thisTeacherName + "\n";
      stdMsg += "Classroom: " + thisClassroom + "\n";
      stdMsg += "Grade Level: " + thisGradeLevel + "\n";
      stdMsg += "\n";
      $.each(cacheLunchBoxData, function(i) {
        var thisLunchBox = cacheLunchBoxData[i];
        if (thisLunchBox.id != 0) {
          stdMsg += thisLunchBox.label + ": " + thisLunchBox.count + "\n";
        }
      });
      // Construct the HTML Form
      var htmlStr = "";
      htmlStr += "<form id='email-form' name='email-form' action='' method='get' onSubmit='return false;'>";
      htmlStr += "<input type='button' name='buttonSubmit' id='submitEmail' value='Submit Email'>";
      htmlStr += "<br /><br />";
      htmlStr += "<label for='recipientEmail'>Email Recipient: </label>";
      htmlStr += "<br />";
      htmlStr += "<input type='email' name='recipientEmail' id='recipientEmail' style='width: 400px;' value='" + thisRecipientEmail + "'>";
      htmlStr += "<br />";
      htmlStr += "<br /><br />";
      htmlStr += stdMsg.replace(/(\r\n|\n|\r)/gm, "<br />");
      htmlStr += "<br /><br />";
      htmlStr += "<label for='customMsg'>Additional Message: </label>";
      htmlStr += "<br />";
      htmlStr += "<textarea name='customMsg' id='customMessage' style='width: 400px; height: 100px;'></textarea>";
      htmlStr += "<input type='hidden' name='teacherEmail' id='teacherEmail' value='" + thisTeacherEmail + "'>";
      htmlStr += "<input type='hidden' name='stdMsg' id='standardMessage' value='" + stdMsg + "'>";
      htmlStr += "</form>";
      return htmlStr;
    }

    // public function to get cached data
    this.getCacheGeneralData = function() {
      return cacheGeneralData;
    }

    // public function to clear all cached data in this model
    this.clearAll = function(){
      cacheStudents = new Array();
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
    this.notifyLoadGeneralDataComplete = function() {
      $.each(listeners, function(i){
        listeners[i].loadGeneralDataComplete();
      });
    }
  },

  // this model's listeners
  ModelListener: function(list) {
    if(!list) list = {};
    return $.extend({
      logMessage: function() {},
      loadGeneralDataComplete: function() {},
    }, list);
  }

});