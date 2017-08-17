<?php
/* @var $this AlbumController */
/* @var $data Album */
?>
 <p id="javascript"></p>
 
  <p id="javascript2" onclick="myFunction()">on click press desplay activate a function and change the text</p>
  <button onclick="myFunction1()">Try it</button>
  <p id="javascript3">alert promt with confirmation for try it</p>

<div class="view albumsquer">
<div onmouseover="mOver(this)" onmouseout="mOut(this)" 
style="background-color:#D94A38;width:120px;height:20px;padding:40px;">
Mouse Over e</div>
    <h2><?php echo CHtml::encode($data->name);?></h2>
    <?php 
    if ($data->photos)  
        echo CHtml::link(
                    CHtml::image($data->photos[0]->getThumb(),CHtml::encode($data->photos[0]->alt_text),array('class'=>'toimage')),
                    $this->createUrl('view',array('id'=>$data->id))
                    );
    ?> 
    <div class="nav">
        <?php echo implode(' ', $data->tagLinks); ?>
    </div>
  
</div>
 
<script>
    //to repet javascript DOM, BOM, FUNCTIONS 
    $button=$('.toimage');
    $(document).ready(function(){
    $button.click(function(){
       // $(".albumsquer").hide();
    });
    
  
    var txt1 = "<b>I </b>";                   // Create element with HTML
    var txt2 = $("<i></i>").text("love ");    // Create with jQuery
    var txt3 = document.createElement("b");   // Create with DOM
    txt3.innerHTML = "jQuery!";
    $button.click(function(){
    $(".albumsquer").append(txt1, txt2, txt3);      // Insert new elements after img
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
