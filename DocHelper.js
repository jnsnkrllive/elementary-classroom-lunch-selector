var DocHelper = {
  setup: function() {
    StudentboxHelper.createStudentboxes();
    $(window).on('load',StudentboxHelper.addStudentboxes);
    StudentHelper.createStudents();
    $(window).on('load',StudentHelper.addStudents);
    $(window).on('load',this.init);
  },
  makeSortable: function(element) {
    $(element).sortable( {
      cancel: '.notSortable',
      connectWith: '.student-box',
      receive: function( event, ui ) {
        StudentboxHelper.updateCounts();
      }
    } );
  },
  init: function() {
    $( ".student" ).addClass( "ui-widget ui-widget-content ui-helper-clearfix ui-corner-all" )
      .find( ".student-header" )
      .addClass( "ui-widget-header ui-corner-all" )
      .prepend( "<span class='ui-icon ui-icon-minusthick'></span>")
      .end()
      .find( ".student-content" );
    $( ".lunch-box" ).disableSelection();
  }
};

