<?php
/* @var $this TestControlerController */

$this->breadcrumbs=array(
	'Test Controler',
);

?>
<h1><?php echo $this->id . '/' . $this->action->id; ?></h1>

<?php
/* @var $this AlbumController */
/* @var $data Album */
?>
 
   <button class="toimage">Try it now</button>
  <p id="javascript2" onclick="myFunction()">on click press desplay activate a function and change the text</p>
  <button onclick="myFunction1()">Try it</button>

  <p id="javascript3">alert promt with confirmation for try it</p>
<div class="view albumsquer">
<div onmouseover="mOver(this)" onmouseout="mOut(this)" 
style="background-color:#D94A38;width:120px;height:20px;padding:40px;">
Hover Me</div>
   
  
</div>
  <p id="javascript"></p>
 
<script>
    //to repet javascript DOM, BOM, FUNCTIONS 
    
    $(document).ready(function(){
        $button=$('.toimage');
    $button.click(function(){
       // $(".albumsquer").hide();
    });
    
  
    var txt1 = "<b>I </b>";                   // Create element with HTML
    var txt2 = $("<i></i>").text("love ");    // Create with jQuery
    var txt3 = document.createElement("b");   // Create with DOM
    txt3.innerHTML = "jQuery! <br/>";
    $button.click(function(){
    $("#javascript").append(txt1, txt2, txt3);      // Insert new elements after img
    });
});

var carName = "Volvo";// use in myfunction
//myFunction();
var x = 16 + 4 + "Volvo";// print variable
var d = new Date();// curent data
function myFunction() {
    document.getElementById("javascript2").innerHTML =
    "I can display " + carName;
}
var person = {
    firstName : "John",
    lastName  : "Doe",
    age       : 50,
    eyeColor  : "blue"
};
function toCelsius(f) {
    return (5/9) * (f-32);
}
document.getElementById("javascript").innerHTML =
person.firstName + " is " + person.age + " years old."+"<br/> temperatura: "+toCelsius(81)+" celsius"+"<br/> print a variable  "+ x +"<br/> curent data "+ d;
function mOver(obj) {// mouse hover
    obj.innerHTML = "Thank You"
}

function mOut(obj) {
    obj.innerHTML = "Mouse Over Me"
}

function myFunction1() {
    var txt;
    if (confirm("Press a button!") == true) {
        txt = "You pressed OK!";
    } else {
        txt = "You pressed Cancel!";
    }
    document.getElementById("javascript3").innerHTML = txt;
    }
</script>
