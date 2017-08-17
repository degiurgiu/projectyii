$(function() {
	//hide "Save" button in fieldstab if no any field mapping defined.
	$('body').bind('ajaxComplete', function() {
		if($('#importfields li').length) $('#button-section').show(0);
		else $('#button-section').hide(0);
	});

	jQuery('#exportinterface-save-button, .exportinterface-save').live('click',function(){
		$('#exportinterface-form').appendInputs('#fieldstab .scrollable li');
		$('#exportinterface-form').submit();
		;});

	$.fn.exportinterfaceform = function(settings) {
		var $form = $(this);
		if(settings.model) $form.model = settings.model;
		else $form.model = 'ExportInterface';
		function hideEl(element) {
			for(var el in element) $('#'+$form.model+''+element[el]).parents('tr').hide(0);
		}
		function toggleConnectionType(el) {
			var $this = $(el);
			if($this.val()=='0') { //auth type localhost
				$('#'+$form.model+'_connectionName, #'+$form.model+'_connectionEmailTo, #'+$form.model+'_hiddenHelperKey, #'+$form.model+'_connectionPassword,#'+$form.model+'_connectionUser, input[id^="'+$form.model+'_connectionAuthType"]',$form).parents('tr').hide(0);
				$('#'+$form.model+'_connectionPath',$form).parents('tr').show(0);
			} else if($this.val()=='1') { //conn type ftp
				$('#'+$form.model+'_connectionEmailTo,input[id^='+$form.model+'_connectionAuthType],#'+$form.model+'_hiddenHelperKey',$form).parents('tr').hide(0);
				$('#'+$form.model+'_connectionName,#'+$form.model+'_connectionPath,#'+$form.model+'_connectionUser,#'+$form.model+'_connectionPassword',$form).parents('tr').show(0);
			} else if($this.val()=='2') { //conn type sftp
				$('#'+$form.model+'_connectionEmailTo',$form).parents('tr').hide(0);
				$('#'+$form.model+'_connectionName,#'+$form.model+'_connectionPath,#'+$form.model+'_connectionUser,#'+$form.model+'_connectionPassword,#'+$form.model+'_hiddenHelperKey,#'+$form.model+'_connectionAuthType_0',$form).parents('tr').show(0);
			$('input[name="'+$form.model+'[connectionAuthType]"]:checked').trigger('change');
			} else if($this.val()=='3') { //conn type is email
				$('#'+$form.model+'_connectionName,#'+$form.model+'_hiddenHelperKey,#'+$form.model+'_connectionPath,#'+$form.model+'_connectionPassword,#'+$form.model+'_connectionAuthType_0,#'+$form.model+'_connectionUser',$form).parents('tr').hide(0);
				$('#'+$form.model+'_connectionEmailTo',$form).parents('tr').show(0);

			}
		}
		function toggleAuthType(el) {
			var $this = $(el);
			if($this.val()=='0') {
				$form.find('#'+$form.model+'_hiddenHelperKey').parents('tr').hide(0);
				$form.find('#'+$form.model+'_connectionPassword').parents('tr').show(0);
			} else if($this.val()=='1') {
				$form.find('#'+$form.model+'_hiddenHelperKey').parents('tr').show(0);
				$form.find('#'+$form.model+'_connectionPassword').parents('tr').hide(0);
			}
		}
		$form.type = $('select[id$=_type]',$form);
		$form.type.unbind().bind('change', function() {
			$this = $(this);
			if(jQuery(this).val()=='0') {
				$('tr.only_new').show();
				$('tr.organization_id').show();
				$('tr.assign_to',$this.parents('.form-section')).each(function() {
					$(this).remove();
				});
			} else if(jQuery(this).val()=='1') {
				$('tr.only_new').hide();
				$('tr.organization_id').show();
				$('select[id$=organization_id]',$this.parents('.form-section')).val(0);
			} else if(jQuery(this).val()=='2') {
				$('tr.only_new').hide();
				$('tr.organization_id').hide();
				//$('select[id$=organization_id]',$this.parents('.form-section')).val(0);
			}
		});
		$form.orgList = $form.find('select[id$=organization_id]');
		$form.orgList.unbind('change').bind('change', function(){
			$this = $(this);
			$('tr.assign_to',$this.parents('table')).each(function() {
				$(this).remove();
			});
			if($form.type.val()=='0') return;
			if($form.prop('id')=='newexportinterface-form') isNew = 1;
			else isNew = 0;
			$.ajax({
				url: settings.userListUrl,
				data: {'organization_id':$this.val(),
				'isNew':isNew},
				success: function(data,textStatus,jqXHR){
					$(data).insertAfter($this.parents('tr'));
				}
			});

		});
		$form.find('select[id$=_connectionType]').unbind().bind('change', function() {
			toggleConnectionType(this);
		});
		$form.find('input[id*='+$form.model+'_connectionAuthType]').unbind().bind('change',function() {
			toggleAuthType(this);
		});
		if($form.prop('id')=='newexportinterface-form') {
			$('.box_add').unbind('click').bind('click',function(){
				$form.find('select[id$=_connectionType]').trigger('change');
			});
		}
		if($form.prop('id')=='exportinterface-form') {
			$form.ajaxSuccess(function(){
				$form.find('.diffbuttonset').buttonset();
				$form.find('select[id$=_connectionType]').trigger('change');
			});
		}
		$('.diffbuttonset',$form).buttonset();
	};
});
