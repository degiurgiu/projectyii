;$(function() {
	//find a max rule index and 
	//return it incremented by 1
	$.fn.getRuleIndex = function() {
		//helper for max array value
		Array.prototype.max = function(){
			var result = Math.max.apply( Math, this );
			if(result>=0) { 
				return result;
			} else {
				return 0;
			}
		};
		var $rules = jQuery('.detailedrule');
		var indexes = [];
 		$rules.each(function(i,rule) {
			var index = $(rule).find('input.monthes').prop('name').match(/\[(\d+)\]\[month\]$/);
			indexes.push(Number(index[1]));
		});
		return indexes.max()+1;
	};

	$.fn.buildIntervals = function() {
		var $prev = null;
		$('.interval').each(function(index,el) {
			if($prev!==null) {
				$('input[id$="from"]',el).attr('readonly','readonly').attr('value',Number($('input[id$="to"]',$prev).val())+1);
			}
			$prev = $(el);
		});
		$prev = null;

		// interval numbers
		$('.number').each(function(index,el) {
			$(el).html(index+1);
		});

		$('.intervals tr, tr.detailedrule').each(function(i,el) {
			var $el = jQuery(el);
			if($el.prop('class')==='interval') {
				if(i===0) {
					$('.delete',$el).hide();
				}
				$('.delete',$el.next()).hide();
			}
			if($el.next().prop('class')==='detailedrule') {
				$el.find('.lastbutton input').hide();
			}
			if($el.next().prop('class')==='interval' || !$el.next().length) {
				$el.find('.lastbutton input').show();
			}
		});
	}

	// fill interval numbers after every ajax
	$('body').bind('ajaxComplete',function() {
		$(this).buildIntervals();
	});

	var selectTypeSelector = '#ProvisionRule_type';
	jQuery('#newprovision').dialog({'title':'New Provision','autoOpen':false,'modal':true,'buttons':[{'text':'ok'}]});

	//delete interval
	jQuery('.interval > .last > a.delete').live('click',function() {
		var $this = jQuery(this);
		$this.parents('tr:first').fadeOut('fast',function() {
			jQuery(this).nextUntil('.interval').remove();
			jQuery(this).remove();
			$('body').buildIntervals();
		});

	});

	//delete detailedrule
	jQuery('.detailedrule a.delete').live('click',function() {
		var $this = jQuery(this);
		$this.parents('tr:first').fadeOut(function() {
			jQuery(this).remove();
			$this.buildIntervals();
		});
	});

	//flatrate new rule button
	jQuery('.loaddetailedruleflatrate').live('click',function() {
		var modelId = CONFIG_PROVISIONRULEDATA.modelId;
		var intervalIndex = -1;
		var ruleIndex = 0;
		var modelId = CONFIG_PROVISIONRULEDATA.modelId;
		var indexes;
		$.get( CONFIG_PROVISIONRULEDATA.detailedruleurl,
			{ 
				detailedRuleIndex: $().getRuleIndex(),
				intervalIndex: intervalIndex,
				id: modelId,
				type: $(selectTypeSelector).val()
			},
		function(data) {
			jQuery(data).appendTo('.detailedrules');
		});
	});

	jQuery('.loadDetailedRule').live('click',function() {
		var $link;
		$link = jQuery(this); 

		if(jQuery('#ProvisionRule_type').val()!=='0') {
			$('.loaddetailedruleflatrate').trigger('click');
			return;
		}

		/*
		 * Get interval
		 * Get last detailedRule
		 */
		var $detailedRulesList = $('.detailedrules',$link.parents('tr'));
		var $interval = $link.parents('tr').prevAll('.interval').first();

		var $rules = $interval.nextUntil('.interval');

		var $lastLi = jQuery('li',$detailedRulesList).last();
		var $lastRule = $rules.last();

		var intervalIndex = -1;
		var ruleIndex = 0;

		var modelId = CONFIG_PROVISIONRULEDATA.modelId;
		var indexes;

		//get a interval index if it's a intervaltype
		if($lastRule.length!==0) {
			indexes = jQuery('input',$lastRule).prop('name').match(/\w+\[(\d+)\](\[(\d+)\])*\[month\]/);
			if(indexes && indexes[2]===undefined) {
			} else {
				intervalIndex = indexes[1];
			}
		} else if($interval.length!==0) {
			indexes = jQuery('input',$interval).prop('name').match(/\w+\[(\d+)*\]\[from\]/);
			intervalIndex = Number(indexes[1]);
		}
		$.get( CONFIG_PROVISIONRULEDATA.detailedruleurl,
			{ 
				detailedRuleIndex: $().getRuleIndex(),
				intervalIndex: intervalIndex,
				id: modelId,
				type: $(selectTypeSelector).val()
			},
		function(data) {
			jQuery(data).insertAfter($lastRule);
		});
	});

	jQuery('select.detailedruletypeselect').live('change',function() {
		var $this = jQuery(this);
		var $li = $this.parents('tr:first');
		if($this.val()==1) {
			jQuery('span.meassurement',$li).html('&euro;');
		} else if($this.val()==2) {
			jQuery('span.meassurement',$li).html('ct/kWh');
		}
	});

	jQuery('a.loadInterval').live('click',function() {
		var modelId = CONFIG_PROVISIONRULEDATA.modelId;
		var $intervalsList  = jQuery(CONFIG_PROVISIONRULEDATA.intervalsSelector);
		var intervalIndex;
		var $lastInterval = jQuery('.interval',$intervalsList).last();
		var indexes;

		if($lastInterval.length!==0) {
			indexes = jQuery('input',$lastInterval).prop('name').match(/\w+\[(\d*)\]\[from\]/);
			intervalIndex = Number(indexes[1])+1;
		} else {
			intervalIndex = 0;
		}
		$.get(CONFIG_PROVISIONRULEDATA.intervalUrl,{id: modelId,intervalIndex: intervalIndex, ruleIndex: $().getRuleIndex()}, function(data) {
			jQuery(data).hide().appendTo(CONFIG_PROVISIONRULEDATA.intervalsSelector).fadeIn();
		});
	});

	$(selectTypeSelector).live('change',function() {
		$this = $(this);
		$.get(CONFIG_PROVISIONRULEDATA.changeTypeUrl, {
				type: $this.val()
		}, function(data){
			jQuery(CONFIG_PROVISIONRULEDATA.detailsDivSelector).html(data);
		});
		//alert(jQuery(this).val());
	});

});
