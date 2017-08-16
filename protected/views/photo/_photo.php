<div class="photo">
tses
    <div class="imgWrap">
	<?php echo CHtml::image(Yii::app()->baseUrl.$data->getUrl(), CHtml::encode($data->alt_text)); ?>
    </div>
    <div class="caption show">
	<?php echo CHtml::encode($data->caption); ?>
    </div>

</div>