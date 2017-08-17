/*
Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.editorConfig = function( config )
{
	config.language = 'de';
	config.enterMode = CKEDITOR.ENTER_P;
	config.ignoreEmptyParagraph = true;
	config.resize_enabled = false;
	config.autoParagraph = false;

	config.toolbar = 'JoulesMessage';
	config.toolbar_JoulesMessage = [
        ['Bold','Italic','Strike'],
		['Format','Font','FontSize'],
		['NumberedList','BulletedList','-'],
		['Image','Table'],
		['Source'],
	];
};
