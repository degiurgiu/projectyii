/**
 * @author		Ionut Titei
 * @copyright	(c) eisnundnull
 * @date		Nov 10, 2014
 *
 * Requires: jquery.tinysort.min.js
 */
$(function($) {

    $.widget( "custom.JSFilterable", $.ui.autocomplete, {
        _create: function() {
            this._super();
            this.widget().menu( "option", "items", "> :not(.ui-autocomplete-category)" );
        },
        _renderMenu: function( ul, items ) {
            var id = this.options.id;

            if(items.length)
                $('#'+id+' #sortable1 li').hide();
            else
                $('#'+id+' #sortable1 li').show();

            $.each( items, function( index, item ) {
                $('#'+id+' #sortable1 li[data-category="'+item.category+'"]').show();
                $('#'+id+' #sortable1 li[data-unique="'+item.unique+'"]').show();
            });
        }
    });

    /**
     * @param options map settings for the jSearchable widget view. Available options are as follows:
     * - uniqueWidgetId: string, the unique name of the widget
     * - gridId: string, the id of the grid on which we're going to use the widget
     * - criteria: json, object with all possible criteria elements
     */
    $.fn.jSearchable = function (options) {
        return this.each(function () {
            var settings = $.extend({}, $.fn.jSearchable.defaults, options || {});
            var $this = $(this);
            var id = $this.attr('id');
            var elementId = '#'+id;

            $.fn.jSearchable.settings[id] = settings;

            $( elementId + ' #sortable1, #sortable2' ).sortable({
                items: 'li:not(.ui-state-disabled)',
                connectWith: '.connectedSortable',
                revert: true
            });

            $( elementId + ' .buttonset-together' ).buttonset();

            /**
             * Bind the criteria filter to the auto-complete widget
             */
            $( elementId + ' #filter-box input' ).JSFilterable({
                id: id,
                delay: 0,
                source: $.fn.jSearchable.settings[id].criteria
            });
        });
    };

    $.fn.jSearchable.defaults = { // use this to define some default options, if needed
        bindingClass : '.jsearchable-container' // the css class of the container, the one we use for binding events. Must be set as an css class like ".<class name>"
    };

    $.fn.jSearchable.settings = {};

    /**
     *
     * Define useful functions.
     *
     */

    /**
     * Restore a criteria element back to the left column
     * @param widgetId string the unique widget id
     */
    $.fn.jSearchable.resetCriteriaElement = function (widgetId, listItem) {
        listItem.detach();
        listItem.fadeOut(300, function () {
            $('#' + widgetId + ' #sortable1').append( listItem );
            $('#' + widgetId + ' ul#sortable1 li').tsort({'attr':'data-position'});
        });
        return;
    }
    /**
     * Attach a criteria element to the search form, on the right column
     * @param widgetId
     * @param elementId
     * @param elementValue
     */
    $.fn.jSearchable.addCriteriaElement = function (widgetId, elementId, elementValue) {
        var listItem = $('body #' + widgetId + ' #sortable1 #' + elementId).closest('li');

        listItem.detach();
        listItem.find('#'+elementId).val(elementValue);
        listItem.fadeIn(300, function () {
            $('#' + widgetId + ' #sortable2').append( listItem );
        });
        return;
    }
    /**
     * Get widget id
     * @param elementObject
     * @returns {*}
     */
    $.fn.jSearchable.getId = function (elementObject) {
        return elementObject.closest($.fn.jSearchable.defaults.bindingClass).attr('id');
    }
    /**
     *
     * Bind events with widget elements.
     *
     */

    /**
     * Cover a special case when input gets emptied and the auto-complete event's trigger
     */
    $("body").on('keyup', $.fn.jSearchable.defaults.bindingClass+' #filter-box input', function(e){
        var id = $.fn.jSearchable.getId( $(this) );
        if($(this).val() == '' || !$(this).val())
            $( '#' + id + ' #sortable1 li' ).show();

        e.preventDefault();
    });
    /**
     * Load search template
     */
    $("body").on('change', $.fn.jSearchable.defaults.bindingClass+' #search_template', function(e){
        var templateArray = JSON.parse($(this).val());
        var id = $.fn.jSearchable.getId( $(this) );

        // detach all criteria elements already used
        $( $.fn.jSearchable.defaults.bindingClass+' #sortable2 li' ).each(function(){
            $.fn.jSearchable.resetCriteriaElement(id, $(this));
        });

        // attach criteria elements according like in the template
        $.each( templateArray, function( key, value ){
            $.fn.jSearchable.addCriteriaElement(id, key, value);
        });

        e.preventDefault();
    });
    /**
     * Change input color (focus)
     */
    $('body').on('focus', $.fn.jSearchable.defaults.bindingClass+' input', function(e){
        $(this).closest('li').find('label').css({color: '#0082ff'});
        e.preventDefault();
    });
    /**
     * Change input color (focus out)
     */
    $('body').on('blur', $.fn.jSearchable.defaults.bindingClass+' input', function(e){
        $(this).closest('li').find('label').css({color: '#2e2e2e'});
        e.preventDefault();
    });
    /**
     * Change select color (focus)
     */
    $('body').on('click', $.fn.jSearchable.defaults.bindingClass+' select', function(e){
        $(this).closest('li').find('label').css({color: '#0082ff'});
        e.preventDefault();
    });
    /**
     * Change select color (focus out)
     */
    $('body').on('focusout', $.fn.jSearchable.defaults.bindingClass+' select', function(e){
        $(this).closest('li').find('label').css({color: '#2e2e2e'});
        e.preventDefault();
    });
    /**
     * Toggle values checkbox on click
     */
    $('body').on('click', $.fn.jSearchable.defaults.bindingClass+' .toggle-values-button', function(){
        $(this).find('input').trigger('click');
    });
    /**
     * Prevent form from being submitted
     */
    $('body').on('submit', $.fn.jSearchable.defaults.bindingClass+' form', function(e){
        e.preventDefault();
        return false;
    });
    /**
     * Run a search
     */
    $('body').on('click', $.fn.jSearchable.defaults.bindingClass+' .startSearch', function(e){
        var id = $.fn.jSearchable.getId( $(this) );
        var gridId = $.fn.jSearchable.settings[id].gridId;
        var formObject = $('#'+id+'-form');
        var that = this;
        var data = formObject.serialize();

        var resetLink = '<button class="reset button-reset-filters" data-gridid="' + gridId + '"><i class="fa fa-refresh"></i></button>';

        if(!data)
            $( '#'+id+' .status-summary p').html('You need to search for something!').parent().removeClass('successSummary').addClass('errorSummary').slideDown();
        else{
            $.fn.yiiGridView.block(gridId);
            data = data + '&searchTogether=' + $($.fn.jSearchable.defaults.bindingClass+' input[name="searchTogether"]:checked').val();
            $.ajax({
                type: 'POST',
                url: formObject.attr('action') + '&search=all',
                data: data,
                success:function(html){
                    var gridHtml = $(html).find('#'+gridId).html();
                    $('#'+gridId).html(gridHtml);
                    $('<div class="portlet-grid-info">Aktive Detailsuche' + resetLink + '</div>').insertAfter($('#' + gridId).closest('div.portlet').find('div.portlet-title'));

                    $.fn.yiiGridView.unblock(gridId);
                },
                error: function( jqXHR, textStatus, errorThrown) {
                    alert(errorThrown);
                }
            });
        }
        formObject = null;
        e.preventDefault();
    });
    /**
     * Save the selected criteria elements as a search template and then update the template list.
     */
    $('body').on('click', $.fn.jSearchable.defaults.bindingClass+' .saveTemplate', function(e){
        var id = $.fn.jSearchable.getId( $(this) );
        var elementId = '#'+id;
        var formObject = $('#'+id+'-form');
        var that = this;
        var data = formObject.serialize();

        if(!data)
            $( '#'+id+' .status-summary p').html('No search criteria!').parent().removeClass('successSummary').addClass('errorSummary').slideDown();
        else{
            var templateName = $( elementId+' #templateName' ).val();
            var templateValues = ( $('#templateValues').prop('checked') ? 1 : 0 );
            data = data + '&templateName=' + templateName + '&widgetId=' + id + '&templateValues=' + templateValues + '&type=criteria';
            //console.log(data);
            $.ajax({
                type: 'POST',
                url: '/index.php?r=client/saveSearch',
                data: data,
                success:function(html){
                    $( elementId + ' .successSummary p' ).html('Template saved').parent().slideDown();
                    $( elementId + ' #search_template' ).replaceWith( html );
                },
                error: function( jqXHR, textStatus, errorThrown) {
                    $( elementId + ' .successSummary p' ).toggleClass('errorSummary').html(errorThrown).parent().slideDown();
                }
            });
        }
        e.preventDefault();
    });
    /**
     * Remove a criteria element from the selected list and place it back to the left column
     */
    $('body').on('click', $.fn.jSearchable.defaults.bindingClass+' button.search-form-remove-criteria', function(e){
        var id = $.fn.jSearchable.getId( $(this) );
        $.fn.jSearchable.resetCriteriaElement(id, $(this).closest('li'));
        e.preventDefault();
    });

});