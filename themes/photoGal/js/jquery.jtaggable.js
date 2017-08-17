/**
 * @author		Ionut Titei
 * @copyright	(c) eisnundnull
 * @date		Dec 01, 2014
 *
 */
$(function($) {

    $.widget( "custom.JTFilterable", $.ui.autocomplete, {
        _create: function() {
            this._super();
            this.widget().menu( "option", "items", "> :not(.ui-autocomplete-category)" );
        },
        _renderMenu: function( ul, items ) {
            var id = this.options.id;

            if(items.length)
                $('#'+id+' #connectable1 li').hide();
            else
                $('#'+id+' #connectable1 li').show();

            $.each( items, function( index, item ) {
                $('#'+id+' #connectable1 li[data-tagid="'+item.value+'"]').show();
            });
        }
    });

    /**
     * @param options map settings for the jTaggable widget view. Available options are as follows:
     * - json: json, object with all possible tag elements
     */
    $.fn.jTaggable = function (options) {
        return this.each(function () {
            var settings = $.extend({}, $.fn.jTaggable.defaults, options || {});
            var $this = $(this);
            var id = $this.attr('id'); // widget id
            var elementId = '#'+id;

            $.fn.jTaggable.settings[id] = settings;

            $( elementId + ' .buttonset-tagOperator' ).buttonset();

            $( elementId + ' #connectable1, #connectable2' ).sortable({
                items: 'li:not(.ui-state-disabled)',
                connectWith: '.connectedSortable',
                revert: true
            });

            /**
             * Bind the criteria filter to the auto-complete widget
             */
            $( elementId + ' #filter-box input#filter-tags' ).JTFilterable({
                id: id,
                delay: 0,
                source: $.fn.jTaggable.settings[id].json
            });
        });
    };

    $.fn.jTaggable.defaults = { // use this to define some default options, if needed
        bindingClass : '.jtaggable-container', // the css class of the container, the one we use for binding events. Must be set as an css class like ".<class name>"
        ownerGridId : null, // the owner grid id, this applies only when combined with a grid
        ownerListId : null // the owner list id, this applies only when combined with a list
    };

    $.fn.jTaggable.settings = {};


    /**
     *
     * Define useful functions.
     *
     */

    /**
     * Get widget id
     * @param elementObject
     * @returns {*}
     */
    $.fn.jTaggable.getId = function (elementObject) {
        return elementObject.closest($.fn.jTaggable.defaults.bindingClass).attr('id');
    }


    /**
     *
     * Bind events with widget elements.
     *
     */


    $('body').on('keyup', $.fn.jTaggable.defaults.bindingClass + ' .searchTags', function(e){
        var keyCode = (e.keyCode ? e.keyCode : e.which);
        if (keyCode == 13) {
            $.fn.jTaggable.assign( $($.fn.jTaggable.defaults.bindingClass + ' .searchTags') );
        }
    });

    /**
     * Run a search
     */
    $.fn.jTaggable.resetTagSearchElement = function(widgetId, listItem) {
        listItem.detach();
        listItem.fadeOut(300, function () {
            $('#' + widgetId + ' #connectable1').append( listItem );
            $('#' + widgetId + ' ul#connectable1 li').tsort({'attr':'data-position'});
        });
        return;
    }

    $.fn.jTaggable.addTagSearchElement = function(widgetId, listItem) {
        listItem.detach();
        listItem.fadeIn(300, function () {
            $('#' + widgetId + ' #connectable2').append( listItem );
        });
        return;
    }

    $('body').on('click', $.fn.jTaggable.defaults.bindingClass + ' #connectable2 .removeTag', function(e){
        var id = $.fn.jTaggable.getId( $(this) );
        $.fn.jTaggable.resetTagSearchElement(id, $(this).closest('li'));
        e.preventDefault();
    });

    /**
     * Cover a special case when input gets emptied and the auto-complete event's trigger
     */
    $("body").on('keyup', $.fn.jTaggable.defaults.bindingClass + ' #filter-box input', function(e){
        var id = $.fn.jTaggable.getId( $(this) );
        if($(this).val() == '' || !$(this).val())
            $( '#' + id + ' #connectable1 li' ).show();

        e.preventDefault();
    });
    /**
     * Apply tags and filter the grid
     */
    $('body').on('click', $.fn.jTaggable.defaults.bindingClass + ' .startSearch', function(e){
        var id = $.fn.jTaggable.getId( $(this) );
        var gridId = $.fn.jTaggable.settings[id].ownerGridId;
        var formId = '#'+id+'-form';
        var tagFilterArray = [];

        $.each( $( formId + ' input[type="hidden"]'), function( key, element ){
            tagFilterArray.push($(element).val());
        });

        $.fn.yiiGridView.addTagFiltersArray(gridId, tagFilterArray, $( '#' + id + ' #tagOperator :checked').val());

        formObject = null;
        e.preventDefault();
    });
    /**
     * Load search template
     */
    $("body").on('change', $.fn.jTaggable.defaults.bindingClass+' #search_template', function(e){
        var templateString = $(this).val();
        var id = $.fn.jTaggable.getId( $(this) );

        var tagIds = templateString.split(',');
        var templateArray = [];
        $.each( tagIds, function( key, value ){
            templateArray.push(value);
        });

        // detach all criteria elements already used
        $( $.fn.jTaggable.defaults.bindingClass+' #connectable2 li' ).each(function(){
            $.fn.jTaggable.resetTagSearchElement(id, $(this));
        });

        // attach criteria elements according like in the template
        $.each( templateArray, function( key, value ){
            $.fn.jTaggable.addTagSearchElement(id, $('body #' + id + ' #connectable1 li[data-tagid="' + value + '"]').closest('li'));
        });

        e.preventDefault();
    });
    /**
     * Save the selected criteria elements as a search template and then update the template list.
     */
    $('body').on('click', $.fn.jTaggable.defaults.bindingClass+' .saveTemplate', function(e){
        var id = $.fn.jTaggable.getId( $(this) );
        var elementId = '#'+id;
        var formObject = $('#'+id+'-form');
        var that = this;
        var data = formObject.serialize();

        if(!data)
            $( '#'+id+' .status-summary p').html('No search criteria!').parent().removeClass('successSummary').addClass('errorSummary').slideDown();
        else{
            var templateName = $( elementId+' #templateName' ).val();
            data = data + '&templateName=' + templateName + '&widgetId=' + id + '&type=tag';

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
});