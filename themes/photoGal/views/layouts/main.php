<?php /* @var $this Controller */ 
$p = Yii::app()->theme->baseUrl.'/';
$c = Yii::app()->theme->baseUrl.'/css/'.Yii::app()->params['cssTheme'].'/';
$cs = Yii::app()->clientScript;
$cs->scriptMap = array(
	'jquery-ui.css'=>$c.'jquery-ui.css',
	'pager.css'=>$c.'blank.css',
	'styles.css'=>$c.'blank.css',
	'jquery.yiitab.css'=>$c.'blank.css',
	'jquery-ui.min.js'=>$p.'js/jquery-ui.min.js',
	'jquery-ui-i18n.min.js'=>$p.'js/jquery-ui-i18n.min.js',
//	'jquery.ba-bbq.min.js'=>$p.'js/jquery.ba-bbq.min.js',
	'jquery.ba-bbq.js'=>$p.'js/jquery.ba-bbq.js',
	'jquery.yiiactiveform.js'=>$p.'js/jquery.yiijoulesform.js',
	'jquery.yiigridview.js'=>$p.'js/jquery.yiigridview.js',
	'yiigridview.helpers.js'=>$p.'js/yiigridview.helpers.js',
	'jquery.yiilistview.js'=>$p.'js/jquery.yiilistview.js',
	'jquery.yiitab.js'=>$p.'js/jquery.yiitab.js',
	'jquery.js' => $p.'js/jquery.min.js',
	'jquery.min.js' => $p.'js/jquery.min.js',
);

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
    <?php
$cs->registerCssFile(Yii::app()->theme->baseUrl.'/js/select2-3.5.2/select2.css');
$cs->registerCssFile(Yii::app()->theme->baseUrl.'/js/imperavi-redactor/redactor.css'); // the Imperavi Redactor theme style

$cs->registerScriptFile($p.'js/jquery.min.js', CClientScript::POS_HEAD); // update to jquery 2.1.1
$cs->registerScriptFile($p.'js/jquery-migrate-1.2.1.min.js', CClientScript::POS_HEAD); // using jquery migrate for deprecated function support

$cs->registerScriptFile($p.'js/jquery-ui.min.js', CClientScript::POS_HEAD);
$cs->registerScriptFile($p.'js/script.js', CClientScript::POS_HEAD);
$cs->registerScriptFile($p.'js/jquery.cookie.js', CClientScript::POS_HEAD);
$cs->registerScriptFile($p.'js/jquery.ba-bbq.js', CClientScript::POS_HEAD);

$cs->registerScriptFile($p.'js/jquery.ui.datepicker-de.js', CClientScript::POS_HEAD);
$cs->registerScriptFile($p.'js/jquery.yiiactiveform.js', CClientScript::POS_HEAD);
//
$cs->registerScriptFile($p.'js/jquery.floatThead.min.js', CClientScript::POS_HEAD);
$cs->registerScriptFile($p.'js/jquery.yiigridview.js', CClientScript::POS_HEAD);
$cs->registerScriptFile($p.'js/yiigridview.helpers.js', CClientScript::POS_HEAD);

$cs->registerScriptFile('jquery.yiitab.js', CClientScript::POS_HEAD);
$cs->registerScriptFile($p.'js/loader.js', CClientScript::POS_HEAD);
$cs->registerScriptFile($p.'js/jquery.blockUI.js', CClientScript::POS_HEAD);
$cs->registerScriptFile($p.'js/jquery.yiilistview.js', CClientScript::POS_HEAD);
$cs->registerScriptFile($p.'js/jquery.maskedinput.js', CClientScript::POS_HEAD);
$cs->registerScriptFile($p.'js/jquery.scrollTo.1.4.2.min.js', CClientScript::POS_HEAD);
$cs->registerScriptFile($p.'js/jquery.form.js', CClientScript::POS_HEAD);
$cs->registerScriptFile($p.'js/select2-3.5.2/select2.min.js', CClientScript::POS_HEAD);
$cs->registerScriptFile($p.'js/select2-3.5.2/select2_locale_de.js', CClientScript::POS_HEAD);
$cs->registerScriptFile($p.'js/jquery.autosize.min.js', CClientScript::POS_HEAD);

$cs->registerScriptFile($p.'js/common.js', CClientScript::POS_HEAD);
$cs->registerScriptFile($p.'js/jquery.tinysort.min.js', CClientScript::POS_HEAD);
$cs->registerScriptFile($p.'js/jquery.jsearchable.js', CClientScript::POS_HEAD);
$cs->registerScriptFile($p.'js/jquery.jtaggable.js', CClientScript::POS_HEAD);
$cs->registerScriptFile($p.'js/jquery.jtaggable.model.js', CClientScript::POS_HEAD);

$cs->registerScriptFile(Yii::app()->theme->baseUrl.'/js/imperavi-redactor/redactor.js', CClientScript::POS_END); // the imperavi redactor js
$cs->registerScriptFile(Yii::app()->theme->baseUrl.'/js/imperavi-redactor/lang/de.js', CClientScript::POS_END);  // the imperavi redactor language definitions for deutsch
?>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="language" content="en" />

	<!-- blueprint CSS framework -->
        
	<link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/screen.css" media="screen, projection" />
	<link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/print.css" media="print" />
	<!--[if lt IE 8]>
	<link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/ie.css" media="screen, projection" />
	<![endif]-->

	<link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/main.css" />
	<link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/form.css" />

	<link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->theme->getBaseUrl(); ?>/css/bootstrap.css" media="screen, projection" />
	<link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->theme->getBaseUrl(); ?>/css/screen.css" media="screen, projection" />
	<link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->theme->getBaseUrl(); ?>/css/form.css" media="screen, projection" />
	
	<title><?php echo CHtml::encode($this->pageTitle); ?></title>
</head>

<body>

<div class="container" id="page">

	<div id="header">
	    <div id="logo"><?php echo CHtml::encode(Yii::app()->name); ?></div>
	    <div id="login">
		    <?php 
			if (Yii::app()->user->isGuest) {
				$userMenu=array(
					array('label'=>'Login', 'url'=>array('/site/login'), 'visible'=>Yii::app()->user->isGuest)
					);
			} else {
			    $userMenu=array(
				array('label'=>'Welcome '.Yii::app()->user->firstname),
				array('label'=>'My Albums', 'url'=>'/album/admin'),
                              
				array('label'=>'Settings', 'url'=>array('/user/update','id'=>Yii::app()->user->id)),
				array('label'=>'Logout ('.Yii::app()->user->name.')', 'url'=>array('/site/logout'), 'visible'=>!Yii::app()->user->isGuest)
				);
			}
			$this->widget('zii.widgets.CMenu',array(
			    'items'=>$userMenu,
			    'htmlOptions'=>array('class'=>'userMenu')
			));
			?>
		    
	    </div>
	</div><!-- header -->
	
	<div id="mainmenu">
		<?php $this->widget('zii.widgets.CMenu',array(
			'items'=>array(
				array('label'=>'Home', 'url'=>array('/album/index')),
				array('label'=>'About', 'url'=>array('/site/page', 'view'=>'about')),
                              array('label'=>'Test Javascript', 'url'=>array('/test/index'), 'visible'=>Yii::app()->user->isAdmin()),
                             array('label'=>'Album', 'url'=>array('/album/'), 'visible'=>Yii::app()->user->isAdmin()),
                                array('label'=>'Photo', 'url'=>array('/photo/'), 'visible'=>Yii::app()->user->isAuthor()),
				
				array('label'=>'Contact', 'url'=>array('/site/contact')),
			),
		)); ?>
	</div><!-- mainmenu -->
	<?php if(isset($this->breadcrumbs)):?>
		<?php $this->widget('zii.widgets.CBreadcrumbs', array(
			'links'=>$this->breadcrumbs,
		)); ?><!-- breadcrumbs -->
	<?php endif?>

	<?php echo $content; ?>

	<div class="clear"></div>

	<div id="footer">
		Copyright &copy; <?php echo date('Y'); ?> by My Company.<br/>
		All Rights Reserved.<br/>
		<?php echo Yii::powered(); ?>
	</div><!-- footer -->

</div><!-- page -->

<script src="<?php echo Yii::app()->theme->getBaseUrl(); ?>/js/bootstrap.js" type="text/javascript"></script>
</body>
</html>
