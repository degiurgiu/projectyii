<?php
/* @var $this AlbumController */
/* @var $data Album */
?>

<div class="view albumsquer">

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



    </script>