$(function() {


	/**
 * Get current page Yii request (controller/action).
 * @return string request id (e.g. provider/index)
 */
	function getCurrentRequest() {
		var request = $(location).attr('href').split('r=');
		if (request.length > 1) {
			request = request[1].split('&');
			request = request[0];
			return request + '-';
		}
		return '';
	}

	/**
 * Save portles order and visibility status.
 */
	function savePortletsOrder() {
		var request = getCurrentRequest();
		$(".column").each(function(index, value){
			var colid = value.id;
			var cookieName = request + "cookie-" + colid;
			var order = $('#' + colid).sortable("toArray");
			var cookieValue = [];
			var cookiePos = 0;
			for (var i = 0, n = order.length; i < n; i++) {
				if (order[i] == '') continue;
				// Determine if it is 'opened' or 'closed'
				var v = $('#' + order[i] ).find('.portlet-content').is(':visible');
				cookieValue[cookiePos] = order[i] + ":" + v;
				cookiePos++;
			}
			var today = new Date();
			$.cookie(cookieName, cookieValue, {
				path: "/", 
				expiry: 365
			});
		});
	}

	/**
 * Restore portles order and visibility status.
 */
	function restorePortletsOrder() {
		var request = getCurrentRequest();
		$(".column").each(function(index, value) {
			var colid = value.id;
			var cookieName = request + "cookie-" + colid
			var cookie = $.cookie(cookieName);
			if (cookie == null) return;
			var IDs = cookie.split(",");
			for (var i = 0, n = IDs.length; i < n; i++ ) {
				var toks = IDs[i].split(":");
				if (toks.length != 2) continue;
				var portletID = toks[0];
				var visible = toks[1]
				// order
				var portlet = $(".column")
				.find('#' + portletID)
				.appendTo($('#' + colid));
				// visibility
				if (visible === 'false') {
					portlet.find(".toggle_button .fa").removeClass("fa-minus");
					portlet.find(".toggle_button .fa").addClass("fa-plus");
					portlet.find(".portlet-content").hide();
				}
			}
		});
	}

	$("#dialog-form").dialog({
		autoOpen:false, 
		modal:true, 
		buttons:{
			"Button":function(){}
		}
	});

	$(".column").sortable({
		connectWith: ['.column'],
		handle : '.portlet-header',
		cancel: '.icons',
		cursor: 'pointer',
		items: 'li.box',
		opacity: 0.6,
		dropOnEmpty: true,
		placeholder: 'box-placeholder',
		forcePlaceholderSize: true,
		tolerance: 'pointer',
		scroll: false,
		stop: function() {
		// savePortletsOrder();
		}
	});

	//restorePortletsOrder();

	$(".toggle_button").click(function(){
		var t = $(this).find('.fa');
		if (t.is('.fa-minus')){
			t.removeClass('fa-minus').addClass('fa-plus');
		} else{
			t.removeClass('fa-plus').addClass('fa-minus');
		}
		t.parent().parent().parent().next().slideToggle(100, function() {
			//savePortletsOrder();
			});
	})

	$(".min_dialog").live("click",function(){
		$(this).parent().parent().next().slideToggle(100);
	})

	$("a.rbutton").click(function(){
		$(this).parent().find("a.rbutton").removeClass("active");
		$(this).addClass("active").prev().prev().attr("checked","checked");
	})

	$(".box_add").click(function(){
		$("#dialog-form").dialog("open");
	});

});

function updateGrids(grids) {
	for(var i in grids) {
		if(grids.hasOwnProperty(i)) {
			if($('.'+grids[i]+' .grid-view').attr('id') || $('#'+grids[i]).attr('id')) $.fn.yiiGridView.update(grids[i]);
		}
	}
}

function showSuccess(data,grids) {
	if(grids=='undefined' || !grids) return;
	$(".flash-success").find("p").html(data.message).show(0);
}

function togglePaymentAttributes() {
	var id = '#Client_bank_name, #Client_bank_code, #Client_account_holder, #Client_account_number';
	if(!$('#Client_payment_type').attr('value')) $(id).removeAttr('disabled');
	else $(id).attr('disabled','disabled');
}

function toggleSettlementAttributes() {
	var id = '#Client_previous_supplier, #Client_previous_client_number, #Client_previous_volume, #Client_counter_number';
	if($('#Client_settlement_0').is(':checked')) $(id).attr('disabled','disabled');
	else $(id).removeAttr('disabled');
}
