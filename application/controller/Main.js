jQuery.extend({

  ControlMain: function(modelGeneral, modelLunchBox, modelStudent, viewCommand, viewLunchBox, viewStudent, viewWindowModal) {
    //a reference to ourselves
    var thisControl = this;

    //listen to the views
    var vlist = $.ViewListener({
      clickEditGeneralData: function() {
        var htmlStr = modelGeneral.getWindowModalEditGeneralData();
        viewWindowModal.windowModalShow(htmlStr);
        $("#saveData").click(function(){
          //saveGeneralData();
        });
      },
      clickEditLunchBoxData: function() {
        var htmlStr = modelLunchBox.getWindowModalEditLunchBoxData();
        viewWindowModal.windowModalShow(htmlStr);
        $("#saveData").click(function(){
          //saveLunchBoxData();
        });
        $(".insertRow").click(function() {
          var htmlStr = modelLunchBox.editLunchBoxDataFormInsert();
          $(this).parent('tr').before(htmlStr);
          $(".removeRow").click(function() {
            $(this).parent('tr').remove();
          });
        });
        $(".removeRow").click(function() {
          $(this).parent('tr').remove();
        });
      },
      clickEditStudentData: function() {
        var htmlStr = modelStudent.getWindowModalEditStudentData();
        viewWindowModal.windowModalShow(htmlStr);
        $("#saveData").click(function() {
          //saveStudentData();
        });
        $(".insertRow").click(function() {
          var htmlStr = modelStudent.editStudentDataFormInsert();
          $(this).parent('tr').before(htmlStr);
          $(".removeRow").click(function() {
            $(this).parent('tr').remove();
          });
        });
        $(".removeRow").click(function() {
          $(this).parent('tr').remove();
        });
      },
      clickEmail: function() {
        var cacheLunchBoxData = modelLunchBox.getCacheLunchBoxData();
        var htmlStr = modelGeneral.getWindowModalEmail(cacheLunchBoxData);
        viewWindowModal.windowModalShow(htmlStr);
        $("#submitEmail").click(function(){
          submitEmail();
        });
      },
    });
    viewCommand.addListener(vlist);
    viewLunchBox.addListener(vlist);
    viewStudent.addListener(vlist);
    viewWindowModal.addListener(vlist);

    // listen to the models
    var mlist = $.ModelListener({
      logMessage: function(str) {
        console.log(str);
      },
      loadGeneralDataComplete: function() {
        modelLunchBox.loadLunchBoxes();
      },
      loadStudentsComplete: function() {
        modelLunchBox.updateLunchBoxes();
      },
      loadLunchBoxesComplete: function() {
        modelStudent.loadStudents();
      },
      clickStudent: function(thisStudent) {
        if ($('#'+thisStudent.elementId).hasClass("selected")) {
          $('.student.selected').toggleClass("selected");
        } else {
          $(".student.selected").removeClass("selected");
          $('#'+thisStudent.elementId).addClass("selected");
        }
      },
      clickLunchBox: function(thisLunchBox) {
        if ($('.student.selected').length != 0 ) {
          var thisLunchBoxElement = $('#'+thisLunchBox.elementId);
          if (thisLunchBoxElement.children('.student-box').children('.student.selected').length == 0) {
            thisLunchBoxElement.children(".student-box").append($(".student.selected"));
            $(".student.selected").removeClass("selected");
            var currentCount = thisLunchBoxElement.children('.student-box-count').html();
            var actualCount = thisLunchBoxElement.children('.student-box').children('.student').length;
            if (currentCount != actualCount) {
              modelLunchBox.updateLunchBoxes();
            }
          }
        }
      },

    });
    modelGeneral.addListener(mlist);
    modelLunchBox.addListener(mlist);
    modelStudent.addListener(mlist);

    this.init = function() {
      modelGeneral.loadGeneralData();

      $(window).resize(function() {
        viewWindowModal.windowModalSize();
      });

      $(".student").addClass("ui-widget ui-widget-content ui-helper-clearfix ui-corner-all")
        .find(".student-header")
        .addClass("ui-widget-header ui-corner-all")
        .prepend("<span class='ui-icon ui-icon-minusthick'></span>")
        .end()
        .find(".student-content");
      $(".lunch-box").disableSelection();
    };
    this.init();


    function submitEmail() {
      console.log(">> Begin Submitting Email");
      var teacherEmailVal = $("#teacherEmail").val();
      var recipientEmailVal = $("#recipientEmail").val();
      var standardMessageVal = $("#standardMessage").val();
      var customMessageVal = $("#customMessage").val();
      var messageVal = standardMessageVal + "\n" + "- - - - - - - - - -" + "\n\n" + customMessageVal;
      var thisData = {
        teacherEmail: teacherEmailVal,
        recipientEmail: recipientEmailVal,
        message: messageVal
      };
      var windowModalElement = $('#modal-window');
      $.ajax({
        type: "POST",
        url: "submitEmail.php",
        data: thisData,
        error: function(jqXHR, textStatus, errorThrown) {
          htmlStr = "<div class='submitEmailError'>Email Submit Error</div>";
          windowModalElement.html(htmlStr);
          console.log(">> submitEmail Error: " + textStatus + " | " + errorThrown);
        },
        success: function(data, textStatus, jqXHR) {
          if (data.status != 'error') {
            windowModalElement.html("Email Submit Success");
            console.log(">> submitEmail Success: " + textStatus);
          } else {
            htmlStr = "<div class='submitEmailError'>Email Submit Failure</div>";
            windowModalElement.html(htmlStr);
            console.log(">> submitEmail Failed: " + "soft error");
          }
        }
      });
    }

    function saveGeneralData() {
      console.log("TODO:  Save General Data");
      var inputs = $('#edit-general-data-form').find('input:not(:button)');
      var thisData = [];
      $.each(inputs, function(i) {
        var thisObject = {};
        thisObject.id = inputs[i].name;
        thisObject.value = inputs[i].value;
        thisData.push(thisObject);
      });
      var windowModalElement = $('#modal-window');
      $.ajax({
        type: "POST",
        url: "saveGeneralData.php",
        data: {jsonString: JSON.stringify(thisData, null, '\t')},
        error: function(jqXHR, textStatus, errorThrown) {
          htmlStr = "<div class='saveDataError'>Data Save Error</div>";
          windowModalElement.html(htmlStr);
          console.log(">> saveGeneralData Error: " + textStatus + " | " + errorThrown);
        },
        success: function(data, textStatus, jqXHR) {
          if (data.status != 'error') {
            windowModalElement.html("Data Save Success");
            console.log(">> saveGeneralData Success: " + textStatus);
          } else {
            htmlStr = "<div class='saveDataError'>Data Save Failure</div>";
            windowModalElement.html(htmlStr);
            console.log(">> saveGeneralData Failed: " + "soft error");
          }
        }
      });
    }
    
    function saveLunchBoxData() {
      console.log("TODO:  Save Lunch Box Data");
      var thisData = {
      };
      var windowModalElement = $('#modal-window');
      $.ajax({
        type: "POST",
        url: "saveLunchBoxData.php",
        data: thisData,
        error: function(jqXHR, textStatus, errorThrown) {
          htmlStr = "<div class='saveDataError'>Data Save Error</div>";
          windowModalElement.html(htmlStr);
          console.log(">> saveGeneralData Error: " + textStatus + " | " + errorThrown);
        },
        success: function(data, textStatus, jqXHR) {
          if (data.status != 'error') {
            windowModalElement.html("Data Save Success");
            console.log(">> saveGeneralData Success: " + textStatus);
          } else {
            htmlStr = "<div class='saveDataError'>Data Save Failure</div>";
            windowModalElement.html(htmlStr);
            console.log(">> saveGeneralData Failed: " + "soft error");
          }
        }
      });
    }

    function saveStudentData() {
      console.log("TODO:  Save Student Data");
      var thisData = {
      };
      var windowModalElement = $('#modal-window');
      $.ajax({
        type: "POST",
        url: "saveStudentData.php",
        data: thisData,
        error: function(jqXHR, textStatus, errorThrown) {
          htmlStr = "<div class='saveDataError'>Data Save Error</div>";
          windowModalElement.html(htmlStr);
          console.log(">> saveGeneralData Error: " + textStatus + " | " + errorThrown);
        },
        success: function(data, textStatus, jqXHR) {
          if (data.status != 'error') {
            windowModalElement.html("Data Save Success");
            console.log(">> saveGeneralData Success: " + textStatus);
          } else {
            htmlStr = "<div class='saveDataError'>Data Save Failure</div>";
            windowModalElement.html(htmlStr);
            console.log(">> saveGeneralData Failed: " + "soft error");
          }
        }
      });
    }
  }

});

