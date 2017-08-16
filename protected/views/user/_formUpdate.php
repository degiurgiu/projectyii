<?php
/* @var $this UserController */
/* @var $model User */
/* @var $form CActiveForm */
?>

<div class="form">

<?php $form=$this->beginWidget('CActiveForm', array(
	'id'=>'user-form',
	// Please note: When you enable ajax validation, make sure the corresponding
	// controller action is handling ajax validation correctly.
	// There is a call to performAjaxValidation() commented in generated controller code.
	// See class documentation of CActiveForm for details on this.
	'enableAjaxValidation'=>false,
)); ?>

	<p class="note">Fields with <span class="required">*</span> are required.</p>

	<?php echo $form->errorSummary($model); ?>

	<div class="row">
		<?php echo $form->labelEx($model,'email'); ?>
		<?php echo $form->textField($model,'email',array('size'=>60,'maxlength'=>256)); ?>
		<?php echo $form->error($model,'email'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'url'); ?>
		<?php echo $form->textField($model,'url',array('size'=>60,'maxlength'=>256)); ?>
		<?php echo $form->error($model,'url'); ?>
	</div>

	<?php if(Yii::app()->user->isAdmin()){ ?>
        <div class="row">
                       <?php echo $form->labelEx($model,'role'); ?>
                       <?php echo CHtml::activeDropDownList($model, 'role', 
                               CHtml::listData(
                        Rol::model()->findAll('id','rol_number','role'),
                                       'rol_number',
                                       'role'),
                               array('empty' => '(Select)')
                               );
                       ?>
            <?php echo $form->error($model,'role'); ?>
	    </div>
        <?php }?>
	<div class="row">
		<?php echo $form->labelEx($model,'firstname'); ?>
		<?php echo $form->textField($model,'firstname',array('size'=>60,'maxlength'=>256)); ?>
		<?php echo $form->error($model,'firstname'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'lastname'); ?>
		<?php echo $form->textField($model,'lastname',array('size'=>60,'maxlength'=>256)); ?>
		<?php echo $form->error($model,'lastname'); ?>
	</div>

	 <div class="row">
		    <?php echo $form->labelEx($model,'passwordSave'); ?>
		    <?php echo $form->passwordField($model,'passwordSave',array('size'=>60,'maxlength'=>256)); ?>
		    <?php echo $form->error($model,'passwordSave'); ?>
	    </div>
	    <div class="row">
		    <?php echo $form->labelEx($model,'repeatPassword'); ?>
		    <?php echo $form->passwordField($model,'repeatPassword',array('size'=>60,'maxlength'=>256)); ?>
		    <?php echo $form->error($model,'repeatPassword'); ?>
	    </div>

	<div class="row">
		<?php echo $form->labelEx($model,'status'); ?>
		<?php echo $form->textField($model,'status'); ?>
		<?php echo $form->error($model,'status'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'last_login_time'); ?>
		<?php echo $form->textField($model,'last_login_time'); ?>
		<?php echo $form->error($model,'last_login_time'); ?>
	</div>
<!--
	<div class="row">
		<?php //echo $form->labelEx($model,'create_dt'); ?>
		<?php //echo $form->textField($model,'create_dt'); ?>
		<?php //echo $form->error($model,'create_dt'); ?>
	</div>-->

	<div class="row buttons">
		<?php echo CHtml::submitButton($model->isNewRecord ? 'Create' : 'Save'); ?>
	</div>

<?php $this->endWidget(); ?>

</div><!-- form -->