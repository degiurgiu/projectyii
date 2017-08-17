;(function($) {
	jQuery('#importfields').sortable('destroy').sortable({
		opacity: 0.6,
		scrollSpeed: 50,
		handle: 'div.hand'
	}).disableSelection();

	$.fn.boolColumns = function(settings) {
		jQuery('select[name*="tableField"]').die('change');
		jQuery('select[name*="tableField"]').live('change', function() {
			$li = jQuery(this).closest('li');
			$li.find('.boolvalues').empty();
			$this = jQuery(this);
			$index = $this.prop('name').match(/\[(.*)\]/)[1];
			//console.log(boolcolumns);
			//console.log(dateColumns);
			//console.log(dateFormats);
			//console.log(dividedColumns);

			if($this.val() == '0') {
				//$customValueInput = $('<div class="fieldvalue"><label for="customValue['+$index+']">&nbsp;</label><div class="tablefield_value"><input type=text class="corner2px customvalue" name="customValue['+$index+']"></div></div>');
				var $customValueInput = $('<div class="fieldvalue"><span class="inputwrapper"><input type="text" class="customvalue" name="customValue['+$index+']" /></span></div>');
				$customValueInput.appendTo($('.boolvalues',$li));
			} else if(boolcolumns.hasOwnProperty($this.val())) {
				jQuery.ajax({
					url: settings['url'],
					data: {tableField:$this.val(),key: $this.prop('name').match(/\[(.*)\]/)[1],id:settings['id']},
					success: function(data,textStatus,jqXHR) { $li.find('.boolvalues').html(data); }
				});
			} else if(dateColumns.hasOwnProperty($this.val())) {
				//dateSelect = '<div class="fieldvalue"><label for="dateFormat['+$index+']">&nbsp;</label><div class="tablefield_value"><select class="corner2px customvalue" name="dateFormat['+$index+']"></div>';
				var dateSelect = '<div class="fieldvalue"><span class="selectwrapper"><select name="dateFormat['+$index+']">';
				for(i in dateFormats) dateSelect += '<option value='+i+'>'+dateFormats[i]+'</option>';
				dateSelect += '</select></span></div>';
				$(dateSelect).appendTo($('.boolvalues',$li));
			} else if(dividedColumns.hasOwnProperty($this.val())) {
				jQuery.ajax({
					url: settings['urlDividers'],
					data: {tableField:$this.val(),key: $this.prop('name').match(/\[(.*)\]/)[1],id:settings['id']},
					success: function(data,textStatus,jqXHR) {
						$li.find('.boolvalues').html(data);
					}
				});
			}
		});
	}

	$.fn.appendInputs = function(selector) {
		//console.log(this);
		var	x=jQuery(this);
		jQuery('#'+x.prop('id')+' > input').remove();
		jQuery(selector).each(function(i,elem) {
			jQuery(elem).find('input').clone().hide().appendTo(x);
			jQuery(elem).find('select').each(function(i,elem) {
				elem = jQuery(elem);
				jQuery(x).append('<input type=hidden name='+elem.prop('name')+' value='+elem.prop('value')+'>');
			});
		});
	}

	$.fn.userupload = function(settings) {
		var $form = $(this),
			$file = $('input[type=file]',$form),
			$iframe = $('iframe#upload_target'),
			$progress = $('div#progress'),
			$result = $('div#result'),
			$error = $('div#upload_error'),
			$fields = $('div#fields ul#importfields');

		$.ajax({
			url: settings.step2url,
			success: function(data) {
				if (data) $fields.html(data).parent().css('height','300px');
				else $fields.html('').parent().css('height','0');
			}
		});

		$form.submit(function(){
			if($file.val()!='') {
				//$progress.append('<p>uploading</p>');
				$iframe.unbind('load').one('load',function() {
					var json = $iframe.contents().find('body').html();
					var data = eval("("+json+")");  //var data = jQuery.parseJSON(json);
					if(data.hasOwnProperty('ExportInterface_userUpload')) {
						$file.parents('div.row').addClass('error');
						$('p',$error).html(data.ExportInterface_userUpload[0]);
						$error.slideDown('fast');
					} else if(data.success) {
						$file.parents('div.row').removeClass('error');
						$form[0].reset();
						$('.flash-success p').html('Success');
						$('.flash-success').show();
						$.ajax({
							url: settings.step2url,
							success: function(data) { $fields.html(data); }
						});
					}
				});
			} else {
				$file.parents('div.row').addClass('error');
				return false;
			}
		});
	}

})(jQuery);
