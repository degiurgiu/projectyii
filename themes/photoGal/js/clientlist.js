var selected_client_id = null;
var info_widget_url = null

function onClientSelectionChanged(config, client_id) {
	var id = $.fn.yiiGridView.getSelection(config.id);
	var clientDetail = $('.clientdetail');
	var infoTab = $('.infos');

	if (!id.length && !client_id) 
		return;
	
	if (id.length)
		selected_client_id = id;
	else
		selected_client_id = client_id;
	
	info_widget_url = config.urlInfoTab;
	$('#client_email_dlg').dialog('destroy').remove();
	
	$.fn.yiiGridView.block('clientlist');
	$.ajax({
		url: config.urlClientTab,
		data: {	id:selected_client_id },
		success: function(data) {
			$('.portlet.clientdetail').hide();
			clientDetail.show();
			infoTab.show();
			jQuery('.portlet-content',clientDetail).html(data);
			$('input[id^=Client_client_type]:checked').trigger('change');
			$('input[name$="shDiff]"]:checked').trigger('change');
			$('input[name$="corDiff]"]:checked').trigger('change');
			$('input[id^=Client_start_delivery_type]:checked').trigger('click');
			setTimeout('$.scrollTo(".clientdetail", {duration:500, offset:-10})', 200);
		},
		beforeSend: function() {
			jQuery('.portlet-content',clientDetail).html('');
			$('.portlet.clientdetail').hide();
		},
		complete: function(){$.fn.yiiGridView.unblock('clientlist')}
	});
	reloadInfoWidget(true);
}

function loadClient(id){
	selected_client_id = id;
	
}

function reloadInfoWidget(clearBeforeSubmit){
	if (clearBeforeSubmit) {
		$('.portlet-content', $('.infos')).html(''); 
		$('.portlet.infos').hide();
	}
	$.ajax({
		url: info_widget_url,
		data: {	id:selected_client_id },
		success: function(data) { $('.portlet.infos').show(); $('.portlet-content', $('.infos')).html(data); }
	});
}

$(function() {
	$("input[id^=Client_client_type]").live("change",function() {
		//var f = $(this).parents('.portlet-separator')[0];
		var obj = $(this);
		var form = obj.closest('form');
		var formSection = obj.parents('.portlet-separator').next('.form-section');
		var privateSection = formSection.find('.privatedata').hide(0);
		var commercialSection = formSection.find('.commercialdata').hide(0);
		var wegSection = formSection.find('.wegdata').hide(0);
		var value = obj.attr('value');
		if (value==0) {
			privateSection.show(0);
			form.find('[name$="conditions_check]"]').closest('tr').show();
			form.find('.immo').hide();
		} else if(value==1) {
			commercialSection.show(0);
			form.find('[name$="conditions_check]"]').closest('tr').hide();
			form.find('.immo').hide();
		} else if(value==2) {
			commercialSection.show(0);
			form.find('[name$="conditions_check]"]').closest('tr').show();
			form.find('.immo').show();
		}
	});
});

