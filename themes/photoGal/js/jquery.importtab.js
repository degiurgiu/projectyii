;(function($) {
	$.fn.useruploadimport = function(settings) {
		var $form = $(this);
		var $file = $('input[type=file]',$form);
		var $iframe = $('iframe#uploadimport_target');
		var $progress = $('div#uploadimport_progress');
		var $result = $('div#uploadimport_result');
		var $error = $('div#uploadimport_error');
		//var $fields = $('div#fields ul#importfields');
		//$.ajax({
				//url: settings.step2url,
				//success: function(data) {
					//$fields.html(data);
				//}
		//});
		$form.submit(function(){
			if($file.val()!='') {
				$iframe.unbind('load').one('load',function() {
					var json = $iframe.contents().find('body').html();
					var data = eval("("+json+")");  //var data = jQuery.parseJSON(json);

					if(data.hasOwnProperty('ExportInterface_userUploadImport')) {
						$file.parents('div.row').addClass('error');
						$('p',$error).html(data.ExportInterface_userUploadImport[0]);
						$error.slideDown('fast');

					} else if(data.success) {
						//$file.parents('div.row').removeClass('error');
						$form[0].reset();
						$('.flash-success p').html('Success '+data.count+' Imported');
						$('.flash-success').show();
					}
				});
			} else {
				$file.parents('div.row').addClass('error');
				return false;
			}
		});
	}
})(jQuery)
