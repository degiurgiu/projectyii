String.prototype.replaceAll = function(search, replace){
	return this.split(search).join(replace);
}

$(function(){
	$('.fileinput > input[type="file"]').live('change', function(){
		$(this).parent().find('.fakefile > input').val($(this).val());
	});
});

$.fn.tt = (function(tooltipselector, tooltip) {
	return $(this).hover(
		function() { $(this).parent().find(tooltipselector).html(tooltip); },
		function() { $(this).parent().find(tooltipselector).empty() }
	);
});

$.fn.modalBox = (function(name, params) {
	return $(this).dialog({
		title:name,
		autoOpen:false,
		modal:true,
		resizable:false,
		//buttons:[{'text':'ok'}],
		minHeight: (params && params['minHeight']) ? params['minHeight'] : 'auto',
		minWidth: (params && params['minWidth']) ? params['minWidth'] : 'auto',
		height: (params && params['height']) ? params['height'] : 'auto',
		width: (params && params['width']) ? params['width'] : '',
		create: function(event, ui) {
			var dialog = $(this).closest('.ui-dialog');
			$('.ui-dialog-titlebar', dialog).append('<div class="dialog_tooltip"></div>');
		},
		open: function(){
			var dialog = $(this).closest('.ui-dialog');
			if( dialog.find('select.styled-select') )
				dialog.find('select.styled-select').select2({minimumResultsForSearch: -1});
		}
	});
});

/**
 * Improved error checker & summary renderer of yii's CActiveForm response.
 * What's added:
 *		- it can handle more general errors that are not bound to a model attribute (e.g. soap errors)
 *		- custom data can also be sent along with the usual errors list. The expected json field must be named
 *		  "response". This way we are not forced to make another http request for forms that also return a response.
 *
 * This validator works well with error-summary css. Inside your form add at the top:
 * <div class="error-summary"></div>
 *
 * @param data json data from the server (contains both errors as expected by yii and response if any)
 * @param error_element object jquery
 * @return true if there are no errors false otherwise
 */
function checkError(data, error_element) {
	error_element.html('');

	if ($.isEmptyObject(data))
		return true;

	var has_response = false;
	var length = 0;
	$.each(data, function(k, v){
		length++;
		if (k == 'response') {
			has_response = true;
		} else {
			if ($.isArray(v))
				$.each(v, function(k2, v2){	error_element.append('<p>' + v2 + '</p>'); });
			else
				error_element.append('<p>' + v + '</p>');
		}
	});

	// if there is only one element and that is the response then there are no errors
	if (length == 1 && has_response)
		return true;

	error_element.slideDown('fast');
	return false;
}

/**
 * Above function adapted to latest vova design. Will replace the one above after updating the site.
 */
function checkErrorEx(data, error_element)
{
	error_element.html('');
	if ($.isEmptyObject(data)) return true;
	var has_response = false;
	var length = 0;
	var content = '<a href="javascript:void(0)" class="summaryClose" onclick="$(this).parent().slideUp();return false;"><i class="fa fa-times-circle"></i></a><ul>';
	$.each(data, function(k,v){
		length++;
		if (k == 'response') has_response = true;
		else {
			if ($.isArray(v)) $.each(v, function(k2, v2){content = content + '<li>' + v2 + '</li>';});
			else content = content + '<li>' + v + '</li>';
		}
	});
	// if there is only one element and that is the response then there are no errors
	if (length == 1 && has_response) return true;
	error_element.empty().html(content + "</ul>");
	error_element.show();
	return false;
}

/**
 * Check if JSON response contains an error (Works with CActiveForm error).
 */
function responseHasError(data){
	if ($.isEmptyObject(data))
		return false;
	var length = 0;
	$.each(data, function(k, v){ if (k != 'response') length++; });
	return length > 0;
}

/**
 * Show success summary for 5 seconds.
 * The prefered success summary class is success-summary. Inside your form add at the top:
 *
 * <div class="success-summary"><p> some success text </p></div>
 *
 * @param obj jquery object for the success-summary container
 */
function showSuccessSummary(obj)
{
	obj.slideDown('fast');
}

/**
 * Add a Clear button to the date picker widget.
 */
function addDatePickerClearButton(){
	//wrap up the redraw function with our new shiz
	var dpFunc = $.datepicker._generateHTML; //record the original
	$.datepicker._generateHTML = function(inst){
		var thishtml = $(dpFunc.call($.datepicker, inst)); //call the original
		thishtml = $('<div />').append(thishtml); //add a wrapper div for jQuery context

		if (inst.settings.monthPicker) {
			// monthpicker
			$('.ui-datepicker-calendar', thishtml).hide();
			$('.ui-datepicker-buttonpane', thishtml).html(
				$('<div class="icons" style="float:none;"><a class="box_save" style="width:auto; margin: 2px 2px; cursor: pointer; padding-left: 18px; line-height: 16px;">Setzen</a></div>'
				).click(function(){
					var month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
					var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
					inst.input.datepicker('setDate', new Date(year, month, 1));
					inst.input.datepicker('hide');
				})
			);
		} else {
			// normal pickers have clear button.
			$('.ui-datepicker-buttonpane', thishtml).html(
				$('<div class="icons" style="float:none;"><a class="box_delete" style="width:auto; margin: 2px 2px; cursor: pointer; padding-left: 18px; line-height: 16px;">Datum wieder entfernen</a></div>'
				).click(function(){
					$.datepicker._clearDate('#' + inst.id);
					inst.input.datepicker('hide');
				})
			);
		}

		thishtml = thishtml.children(); //remove the wrapper div
		return thishtml; //assume okay to return a jQuery
	};
}
$(function(){ addDatePickerClearButton(); });

/**
 * Add automatic tabindex. Also works with our custom css (i.e. 'two-parts' container).
 */
function setAutoTabindex(container_selector, start){
	var tabindex = 1;
	if (start) tabindex = start;
	var container = container_selector + ' input, ' + container_selector + ' select';
	$(container).each(function() {
		if (this.type != "hidden") {
			var parent_div = $(this).parent().parent();
			var parent_span = $(this).parent();
			if (parent_span.hasClass('left-part') && parent_div.hasClass('two-parts')) {
				var first_el = parent_div.children('.main-part').children();
				if (first_el) {
					$(this).attr("tabindex", first_el.attr('tabindex'));
					first_el.attr("tabindex", tabindex);
				}
			} else {
				$(this).attr("tabindex", tabindex);
			}
			tabindex++;
		}

	});
}

// set readonly children fields
$.fn.setReadonly = (function(){
    var container = $(this);
    if ($(this).is('input') || $(this).is('select') || $(this).is('textarea'))
        container = $(this).parent();
    container.find('input').prop('readOnly', true);
    container.find('input[type=checkbox], input[type=radio]').prop('disabled', true);
    container.find('select, textarea').prop('disabled', true);
    container.find('.ui-buttonset').buttonset('disable');
    container.find('.ui-buttonset input[type=hidden]').prop('disabled', true);
    container.find('input, textarea').addClass('readonly');
    container.find('button').prop('disabled', true);
	return $(this);
});

// unset readonly children fields
$.fn.unsetReadonly = (function(){
    var container = $(this);
    if ($(this).is('input') || $(this).is('select') || $(this).is('textarea'))
        container = $(this).parent();
    container.find('input').prop('readOnly', false);
    container.find('input[type=checkbox], input[type=radio]').prop('disabled', false);
    container.find('select, textarea').prop('disabled', false);
    container.find('.ui-buttonset').buttonset('enable');
    container.find('.ui-buttonset input[type=hidden]').prop('disabled', false);
    container.find('input, textarea').removeClass('readonly');
    container.find('button').prop('disabled', false);
	return $(this);
});

// has to be initiated after client was loaded
$.fn.checkDisableOnHide = (function(){
    var container = $(this);
    
    container.find('.disable-on-hide').each(function(){
        if ($(this).is(":hidden")){
            $(this).prop('disabled', true);
        } else {
            $(this).prop('disabled', false);
        }
    });
});
    
// increment item count in tab title (e.g. see Kunden -> Zusatzinfos tabs)
$.fn.tabTitleItemCountInc = (function(){
	var el = $(this).find('span.tab-item-count');
	el.html(parseInt(el.html())+1);
});

// decrement item count in tab title (e.g. see Kunden -> Zusatzinfos tabs)
$.fn.tabTitleItemCountDec = (function(){
	var el = $(this).find('span.tab-item-count');
	el.html(parseInt(el.html())-1);
});

$.fn.extend({japp:{}});
$.fn.japp.modal = $.fn.modalBox;
$.fn.japp.reset = (function(id) {
    var object = $(id)
    if(object && object[0]){
        object[0].reset();
        return true;
    }
    return false;
});

// global jquery extenstions
$.extend({
	// read parameter from url
	getUrlParam: function(paramName) {
		var searchString = window.location.search.substring(1),	params = searchString.split("&"), i, val;
		for (i=0; i<params.length; i++) {
			val = params[i].split("=");
			if (val[0] == paramName)
				return decodeURIComponent(val[1]);
		}
		return null;
	},

    getUrlParams: function(){
        var match,
            pl     = /\+/g,  // Regex for replacing addition symbol with a space
            search = /([^&=]+)=?([^&]*)/g,
            decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
            query  = window.location.search.substring(1);

        urlParams = {};
        while (match = search.exec(query))
            urlParams[decode(match[1])] = decode(match[2]);
        return urlParams;
    }
});

// grid view expander
$(".grid-view .expander").live("click", function(){
	var element = $(this).closest('.grid-view').find('div.grid-inner');
	var currentHeight = element.height();
	var maxHeight = element.attr('data-maxheight');
	if(currentHeight == maxHeight) element.attr('style', 'height: auto;');
	else element.height(maxHeight);

	$(this).toggleClass("active");
});

function exportGridList(grid_id, url){
	var location = url + '&export_file=\' + $(\'#dlg-export-grid-value\').val() + \'&' + $.fn.yiiGridView.getFilterData(grid_id);
	dlgHtml = '<div id="dlg-export-grid" style="display:none;"><div style="overflow: hidden; padding: 10px 15px 10px 10px; font-size: 14px;">';
	dlgHtml += '<div class="form-section">' +
					'<table class="form-table"></table>' +
						'<tr><td><span class="inputwrapper">' +
							'<input type="text" id="dlg-export-grid-value" value="kunden.csv"/>' +
						'</span></td></tr>' +
					'</table>' +
				'</div>';
	dlgHtml += '<div style="position: absolute; bottom: 0px; right: 10px; font-size: 12px;">';
	dlgHtml += '<button style="margin-right:10px" onclick="window.location=\'' + location + '\'; return false;" class="k-button dialog-button">Exportieren</button>';
	dlgHtml += '</div>';
	dlgHtml += '</div></div>';
	$("#dlg-export-grid").remove();
	$('body').append(dlgHtml);
	var alertModal = $("#dlg-export-grid").modalBox('Liste exportieren', {minHeight: 140});
	alertModal.dialog("open");
	return false;
}

function redoNumbering(items, parent_index){
	start = 1;
	items.each(function(){$(this).html(typeof parent_index !== 'undefined' ? (parent_index > 0 ? parent_index + '.' + start : start) : '1.' + start); start++;});
}

function jaAlert(message) {
	var alertModal = null;
	var alertModalId = 'alert-modal';
	var alertModalHtml = '';

	alertModalHtml  = '<div id="'+alertModalId+'" style="display:none;"><div style="overflow: hidden; padding: 10px 15px 10px 10px; font-size: 14px; text-align: center;">';
		alertModalHtml += message;
		alertModalHtml += '<div style="position: absolute; bottom: 0px; right: 10px; font-size: 12px;">';
			//alertModalHtml += '<button style="margin-right:5px" onclick="jQuery(\'#'+alertModalId+'\').dialog(\'close\'); return false;" class="k-button dialog-button">Fenster schließen</button>';
		alertModalHtml += '</div>';
	alertModalHtml += '</div></div>';
	$("#"+alertModalId).remove();
	$('body').append(alertModalHtml);
	var alertModal = $("#"+alertModalId).modalBox('', {minHeight: 98});
	alertModal.dialog("open");
};

function jaConfirm(message, yesCallback, noCallback) {
	var confirmModal = null;
	var confirmModalId = 'confirm-modal';

	if (yesCallback) {
		window.yesCallback = yesCallback;
	} else window.yesCallback = function () {
		return true;
	};

	if (noCallback) {
		window.noCallback = noCallback;
	} else window.noCallback = function () {
		return true;
	};

	confirmModalHtml  = '<div id="'+confirmModalId+'" style="display:none;"><div style="overflow: hidden; padding: 10px 15px 0 10px; font-size: 14px; text-align: center;">';
		confirmModalHtml += message;
		confirmModalHtml += '<div style="font-size: 12px;">';
			confirmModalHtml += '<button onclick="$(\'#confirm-modal\').dialog(\'close\'); window.noCallback(); return false;" class="k-button" style="float:right;width:70px;">Cancel</button>';
			confirmModalHtml += '<button onclick="$(\'#confirm-modal\').dialog(\'close\'); window.yesCallback();return true;" class="k-button" style="float:right;margin-right:5px; width:70px; background-color:#27AC03;">Ok</button>';
		confirmModalHtml += '</div>';
	confirmModalHtml += '</div></div>';
	$("#"+confirmModalId).remove();
	$('body').append(confirmModalHtml);

	modalOptions = {minHeight: 98, width: 300};
	var confirmModal = $("#"+confirmModalId).modalBox('', modalOptions);
	$("#"+confirmModalId).bind('dialogclose', function(){$(this).remove();});
	confirmModal.dialog("open");
};

(function(object) {
	object.alert = jaAlert;
	//object.confirm = jaConfirm; NOT working
})(this);

$.fn.initStaticTableHead = (function(){
	var id = $(this).attr('id');
	$( "#"+id+" table.inner-grid-view-responsive" ).floatThead({
		useAbsolutePositioning: true,
		zIndex: 1,
		debug: false,
		scrollContainer: function(table){
			return table.closest(".grid-inner");
		}
	});
});



$(function(){
    /**
     * Add some shadow with a cool loaded over the element
     * @type {Function}
     */
    $.fn.blockPortlet = (function (){
        var selector = $(this).selector;
        $(selector).find('.portlet-loader').show();
        $(selector).find('.portlet-title').hide();
        $(selector).block({ message: '',
            css: {border: '0px', backgroundColor: 'transparent'}, 'overlayCSS': {opacity: 0.6}});
    });

    /**
     * Remove the cool shadow
     * @type {Function}
     */
    $.fn.unblockPortlet = (function (){
        var selector = $(this).selector;
        $(selector).find('.portlet-loader').hide();
        $(selector).find('.portlet-title').show();
        $(selector).unblock();
    });
	
	//add dots(.) every three digits ex 1.000.000, eg. for consumption field readability
	$.fn.addThousandSeparator = (function(){
		$.each($(this), function(i, obj) {
			var num = $(obj).val().split(',')[0]; //remove comma and everything after it (this is required for numbers formatted like this: 2.000,00)
			num = num.replace(/\D/g, ""); // remove all non numeric characters
			$(obj).val(num.replace(/\B(?=(\d{3})+(?!\d))/g, ".")); //add a "." every three digits
		});
	});
	
	//add dots(.) every three digits ex 1.000.000
	$(document.body).on('keyup', 'input.thousand-separator', function(event) {
		if (event.which >= 37 && event.which <= 40) {
			event.preventDefault();
		}
		$(this).addThousandSeparator();
	});
});

/**
 * The global joules instance
 */
var joules = (function(self){
	return {
		settings: {
			demo: false // true if demo application
		}
	}
}(joules || {}));
