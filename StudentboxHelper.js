var studentboxArray = [];

var studentboxData = [
  ["0","DEFAULT"],
  ["1","Hot Lunch:"],
  ["2","Sandwich Central:"],
  ["3","Alternate Grille:"],
  ["4","Home Lunch:"]
];

var StudentboxHelper = {
  createStudentboxes: function() {
    for( var i = 0; i <= studentboxData.length-1; i++ ) {
      studentboxObj = new studentbox();
      studentboxObj.id = studentboxData[i][0];
      studentboxObj.label = studentboxData[i][1];
      studentboxObj.element = $(document.createElement('div'));
      studentboxObj.element.append('<div class="clear"></div>');
      studentboxObj.element.attr('id', 'student-box-'+studentboxObj.id);
      if( studentboxObj.id != 0 ) {
        studentboxObj.element.addClass('lunch-box');
        var htmlStr = '';
        htmlStr += '<span class="notSortable student-box-label">'+studentboxObj.label+'</span>';
        htmlStr += '<span class="notSortable student-box-space">&nbsp;&nbsp;</span>';
        htmlStr += '<span class="notSortable student-box-count">'+studentboxObj.count+'</span>';
        htmlStr += '<div class="container student-box"></div>';
        studentboxObj.element.html(htmlStr);
      } else {
        studentboxObj.element.addClass('student-box');
      }
      studentboxArray.push(studentboxObj);
    }
  },
  addStudentboxes: function() {
    for( var i = 0; i <= studentboxArray.length-1; i++ ) {
      if( studentboxArray[i].id == 0 ) {
        $('#student-container').children('.clear').before(studentboxArray[i].element);
        DocHelper.makeSortable(studentboxArray[i].element);
      } else {
        $('#lunch-container').children('.clear').before(studentboxArray[i].element);
        DocHelper.makeSortable(studentboxArray[i].element.children('.student-box'));
      }
    }
  },
  updateCounts: function() {
    for( var i = 0; i <= studentboxArray.length-1; i++ ) {
      var studentboxSelector = $(studentboxArray[i].element);
      var n = studentboxSelector.children('.student-box').children('.student').length;
      studentboxArray[i].count = n;
      studentboxSelector.children('.student-box-count').html(studentboxArray[i].count);
    }
  }
}