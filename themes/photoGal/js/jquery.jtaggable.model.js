/**
 * @author		Ionut Titei
 * @copyright	(c) eisnundnull
 * @date		Nov 25, 2014
 *
 */
$(function($) {

    /**
     * @param options map settings for the jTaggableModel widget view. Available options are as follows:
     */
    $.fn.jTaggableModel = function (options) {
        return this.each(function () {
            var settings = $.extend({}, $.fn.jTaggableModel.defaults, options || {});
            var $this = $(this);
            var id = $this.attr('id');
            var elementId = '#'+id;

            $.fn.jTaggableModel.settings[id] = settings;
            //$('#{$id}-list-view').yiiListView();
            $( elementId + '-widget .buttonset-tagtype' ).buttonset();

            $( elementId + '-widget .searchTags' ).autocomplete({
                source: function( request, response ) {
                    $.ajax({
                        url: "index.php?r=tag/autocomplete",
                        dataType: "json",
                        data: {
                            term: request.term
                        },
                        success: function( data ) {
                            response( data );
                        }
                    });
                },
                minLength: 2
            });
        });
    };

    $.fn.jTaggableModel.defaults = { // use this to define some default options, if needed
        bindingClass : '.jtaggable-model-container', // the css class of the container, the one we use for binding events. Must be set as an css class like ".<class name>"
        ownerGridId : null, // the owner grid id, this applies only when combined with a grid
        ownerListId : null // the owner list id, this applies only when combined with a list
    };

    $.fn.jTaggableModel.settings = {};


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
    $.fn.jTaggableModel.getId = function (elementObject) {
        return elementObject.closest($.fn.jTaggableModel.defaults.bindingClass).attr('id');
    }


    /**
     *
     * Bind events with widget elements.
     *
     */


    $('body').on('keyup', $.fn.jTaggableModel.defaults.bindingClass + ' .searchTags', function(e){
        var keyCode = (e.keyCode ? e.keyCode : e.which);
        if (keyCode == 13) {
            $.fn.jTaggableModel.assign( $($.fn.jTaggableModel.defaults.bindingClass + ' .searchTags') );
            $(this).val('').focus();
        }
    });

    /**
     * Run a search
     */
    $.fn.jTaggableModel.assign = function (elementObject) {

        var id = $.fn.jTaggableModel.getId( elementObject );
        var listId = $('#'+id+' .list-view').attr('id');
        var elementId = '#'+id;
        var type = $(elementId + '-widget input[name="tagType"]:checked').val();

        var data = {
            tag  : $(elementId + '-widget input[name="tagString"]').val(),
            type : type,
            model: $.fn.jTaggableModel.settings[id].ownerModel,
            id   : $.fn.jTaggableModel.settings[id].ownerId
        };

        if(data.tag){
            $.ajax({
                type: 'POST',
                url: $.fn.jTaggableModel.settings[id].action,
                data: decodeURIComponent($.param(data)),
                success:function(html){
                    $.fn.yiiListView.update( listId, {data:{id:$.fn.jTaggableModel.settings[id].ownerId}}); // pass the model id as well, to complete the load the model details
                },
                error: function( jqXHR, textStatus, errorThrown) {
                    alert(errorThrown);
                }
            });
        }

        data = null;
    };

    $('body').on('click', $.fn.jTaggableModel.defaults.bindingClass + ' a.tag-form-add', function(e){
        var id = $.fn.jTaggableModel.getId( $(this) );
        var elementId = '#'+id;

        $(elementId + ' .add-tag-widget').show().find('.searchTags ').focus();
        $(this).hide();

        e.preventDefault();
    });

    $('body').on('click', $.fn.jTaggableModel.defaults.bindingClass + ' a.close-widget', function(e){
        var id = $.fn.jTaggableModel.getId( $(this) );
        var elementId = '#'+id;

        $(elementId + ' .add-tag-widget').hide();
        $(elementId + ' a.tag-form-add').show();

        e.preventDefault();
    });

    $('body').on('click', $.fn.jTaggableModel.defaults.bindingClass + ' .tag-container a.deleteTag', function(e){
        var id = $.fn.jTaggableModel.getId( $(this) );
        var listId = $('#'+id+' .list-view').attr('id');
        var tagContainer = $(this).closest('.tag-container');

        var data = {
            tag  : tagContainer.attr('data-tag'),
            model: tagContainer.attr('data-model'),
            id   : tagContainer.attr('data-id')
        };

        if(data.tag){
            $.ajax({
                type: 'POST',
                url: 'index.php?r=tag/unassign',
                data: decodeURIComponent($.param(data)),
                success:function(html){
                    $.fn.yiiListView.update( listId, {data:{id:data.id}}); // pass the model id as well, to complete the load the model details
                },
                error: function( jqXHR, textStatus, errorThrown) {
                    alert(errorThrown);
                }
            });
        }

        e.preventDefault();
    });
    /**
     * Apply tags and filter the grid
     */
    $('body').on('click', $.fn.jTaggableModel.defaults.bindingClass + ' .tag-container .applyTagFilter', function(e){
        var id = $.fn.jTaggableModel.getId( $(this) );
        var tagContainer = $(this).closest('.tag-container');
        var data = {
            tag  : tagContainer.attr('data-tag'),
            tagId: tagContainer.attr('data-tagid'),
            model: tagContainer.attr('data-model'),
            id   : tagContainer.attr('data-id')
        };
        var gridId = $.fn.jTaggableModel.settings[id].ownerGridId;

        $.fn.yiiGridView.addTagFilter(gridId, data.tagId, {auto_select: data.id});
    });
});