var studentArray = [];

var studentData = [
  ["1","Alexander","Adams","#01"],
  ["2","Morgan","Andrus","#02"],
  ["3","Shay","Bean","#03"],
  ["4","Emily","Chung","#04"],
  ["5","Chantell","Cody","#05"],
  ["6","Daunte","Couch","#06"],
  ["7","Mackenzie","Ensign","#07"],
  ["8","David","Feliciano","#08"],
  ["9","Brittnay","Gessner","#09"],
  ["10","Jessica","Gierke","#10"],
  ["11","Samuel","Halliday","#11"],
  ["12","David","Harte","#12"],
  ["13","Cole","Ison","#13"],
  ["14","Sarah","Knechtel","#14"],
  ["15","Draven","Lewis","#15"],
  ["16","Emily","Linzell","#16"],
  ["17","Shelby","McLaughlin","#17"],
  ["18","Evan","Morelock","#18"],
  ["19","Haylee","Navarre","#19"],
  ["20","Jadyn","Omey","#20"],
  ["21","Zachery","Ross","#21"],
  ["22","Jared","Schmidt","#22"],
  ["23","Anthony","Sherman","#23"],
  ["24","Molly","Smith","#24"],
  ["25","Chloe","Spradlin","#25"],
  ["26","Hailey","Strimpel","#26"],
  ["27","Kayla","Vanover","#27"],
  ["28","Gavin","VanSickle","#28"],
  ["29","Jordan","Webber","#29"],
];

var StudentHelper = {
  createStudents: function() {
    for( var i = 0; i <= studentData.length-1; i++ ) {
      studentObj = new student();
      studentObj.id = studentData[i][0];
      studentObj.nameFirst = studentData[i][1];
      studentObj.nameLast = studentData[i][2];
      studentObj.display = studentData[i][3];
      studentObj.element = $(document.createElement('div'));
      studentObj.element.html(studentObj.display);
      studentObj.element.addClass('student');
      studentObj.element.attr('id', 'student-'+studentObj.id);
      studentArray.push(studentObj);
    }
  },
  addStudents: function() {
    for( var i = 0; i <= studentArray.length-1; i++ ) {
      $('#student-container').children('.student-box').children('.clear').before(studentArray[i].element);
    }
  }
}