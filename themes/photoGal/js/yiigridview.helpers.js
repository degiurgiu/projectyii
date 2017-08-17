$(function() {
     /**
     * Adjust header height based on filter row being visible or not.
     * @param string id grid id
     */
    $.fn.yiiGridView.checkSetHeaderFilterHeight = function(id) {
        var grid = $('#'+id);
        var visible = grid.closest('.portlet').find('tr.filters').is(':visible');
        var headerRow =  grid.find('.grid-inner .inner-grid-view-responsive');

        if (visible && headerRow.css('margin-top') == '0px') {
            headerRow.css('margin-top', '24px');
        }
        if (!visible && headerRow.css('margin-top') != '0px') {
            headerRow.css('margin-top', '0px');
        }
    }


	$.fn.yiiGridView.showFilters = function(id,data) {
		return;
		var grid = $('#'+id);
		var clicked = false;
		var filters = $('tr.filters:visible',grid);
		$('tr.filters input, tr.filters select',grid).each(function(i,el) {
			if($(el).val() && !clicked && !filters.length) {
				if (!($(el).is('select') && $(el).val() == '---')) { // skip combos empty value
					grid.closest('.portlet').find('.box_filter').trigger('click');
					clicked = true;
				}
			}
		});
	}
	
	// clear all filters and reload the grid
	$.fn.yiiGridView.clearFilters = function(id) {
		var grid = $('#'+id);
		var filters = $('tr.filters:visible', grid);
		$('tr.filters input, tr.filters select', grid).each(function(i,el) {
			if ($(el).is('select'))
				$(el).val('');
			else
				$(el).val('');
				
		});
		$.fn.yiiGridView.update(id);
	}
	
	// Check if filter is active and show a status message about it.
	$.fn.yiiGridView.checkShowActiveFilter = function(id) {
		var grid = $('#'+id);
		var filters = $('tr.filters:visible',grid);
		var attributes = [];
		$('tr.filters input, tr.filters select',grid).each(function(i,el) {
			var obj = $(el);
			if(obj.val() && !(obj.is('select') && obj.val() == '---')) {
				var td = obj.closest('td');
				var idx = td.parent().children().index(td);
				var text = obj.closest('table.items').find('tr:first th').eq(idx).find('a').html();
				if(text == null){
					text = obj.closest('table.items').find('tr:first th').eq(idx).html();
				}
				if (obj.is('select')) {
					text = text +' ist "' + obj.find('option:selected').text() + '"';
				} else {
					// text input
					text = text +' enthält "' + obj.val() + '"';
				}
				attributes.push(text);
			}
		});

        if (attributes.length) {
            var resetLink = '<button class="reset button-reset-filters"><i class="fa fa-refresh"></i></button>';
            $('#'+id + ' .active-filter-search').html('Liste filtern: ' + attributes.join(', '));
            $('<div class="portlet-grid-info">Filter aktiv'+resetLink+'</div>').insertAfter($('#'+id).closest('div.inner-portlet,div.portlet').find('div.portlet-title'));
            grid.closest('.portlet').find('tr.filters').show();
        }
	}
	
	// Check if search is active and show a status message about it.
	$.fn.yiiGridView.checkShowActiveSearch = function(id) {
        var attributes = [];
        $('#searchmodels:visible tr').each(function (i, el) {
            var text = $('td:first .attribute-label', el).html();
            var type = $('td:nth-child(2)', el).attr('class');
            if (type == 'attribute-value-string') {
                text = text + ' ' + $('.attribute-operator option:selected', el).text().toLowerCase() + ' "' + $('.attribute-value', el).val() + '"';
            } else if (type == 'attribute-value-list') {
                text = text + ' ist "' + $('.attribute-value option:selected', el).text() + '"';
            } else if (type == 'attribute-value-range') {
                text = text + ' zwischen ' + $('.attribute-value-0', el).val() + ' und ' + $('.attribute-value-1', el).val();
            }
            attributes.push(text);
        });
        if (attributes.length) {
            var resetLink = '<button class="reset button-reset-filters" data-gridid="' + id + '"><i class="fa fa-refresh"></i></button>';
            $('#' + id + ' .active-filter-search').html('Detailsuche: ' + attributes.join(', '));
            $('<div class="portlet-grid-info">Aktive Detailsuche' + resetLink + '</div>').insertAfter($('#' + id).closest('div.portlet').find('div.portlet-title'));

            $('body').on('click', 'button.button-reset-filters', function (e) {
                $('#searchmodels a.delete').trigger('click'); // this will reset the search params
                e.preventDefault();
            });
        }
    }

    /*
	// toggle the filtering
	jQuery('.box_filter').unbind('click').bind('click',function(e) {
		$(this).toggleClass('active');
		$(this).closest('.portlet').find('tr.filters').toggle();
		e.preventDefault();
	});
	*/

	// auto select the row with the specified id. The row <td> must have 'col-id' class.
	$.fn.yiiGridView.autoSelectbyId = function(id, row_id){
		$('#'+id+' table.items td[data-id="1"]').each(function(el){
			if ($.trim($(this).html()) == row_id)
//				$(this).closest('tr').addClass('selected');
				$(this).closest('tr').trigger('click');
		});
	}

    //  select the row with the specified id.
    $.fn.yiiGridView.selectbyId = function(id, row_id){
        var settings = $.fn.yiiGridView.settings[id];
        $('#'+id+' > div.keys > span').each(function(key_i){
            if ($(this).html() == row_id){
                $('#'+id+' .'+settings.tableClass+' > tbody > tr').each(function(row_i){
                    if (row_i == key_i){
                        $(this).addClass('selected');
                    }
                });
            }
        });
    }

	$.fn.yiiGridView.getFilterData = function(id, add_page){
		var settings = $.fn.yiiGridView.settings[id];
		var page = 1;
		if (add_page){
			var re = new RegExp(settings.pageVar + '=([0-9]+)');
			var m = re.exec($.fn.yiiGridView.getUrl(id));
			if ($.isArray(m))
				page = page = m.pop();
		}
		var inputSelector = '#'+id+' .'+settings.filterClass+' input, #'+id+' .'+settings.filterClass+' select';
		var data = $(inputSelector).serialize().replace(/---/g, '');
		var searchData = $('#searchmodels input[name*=SearchModel], #searchmodels select[name*=SearchModel]').serialize().replace(/---/g, '');
		if(searchData != ''){
			data += '&'+searchData;
		}
		if (add_page){
            data += '&'+settings.pageVar + '=' + page;
		}
		return data;
	}

    $.fn.yiiGridView.initGlobalEvents = function(){
        $('body').on('click', 'button.button-reset-filters', function(e){
            var portlet = $(this).parent().parent().parent();
            var gridId = portlet.find('.grid-view').attr('id');
            $.fn.yiiGridView.clearFilters(gridId);
            $( portlet.find('.inner-portlet-buttons .box_filter').removeClass('active') );
            e.preventDefault();
        });
    }
});
