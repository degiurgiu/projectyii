
(function(){
	
	var section_symbol = "&sect;";
	
	var a = {
		exec:function(editor){
			var theSelectedText = editor.getSelection().getNative();
			editor.insertHtml("{" + section_symbol + "=" + theSelectedText + "}");
		}
	};
  
	var sa = {
		exec:function(editor){
			var theSelectedText = editor.getSelection().getNative();
			editor.insertHtml("{" + section_symbol + section_symbol + "=" + theSelectedText + "}");
		}
	};
  
	var va = {
		exec:function(editor){
			var theSelectedText = editor.getSelection().getNative();
			editor.insertHtml("{" + theSelectedText + "}");
		}
	};

	var ha = {
		exec:function(editor){
			var theSelectedText = editor.getSelection().getNative();
			editor.insertHtml("<h1>" + theSelectedText + "</h1>");
		}
	};
  
	var ba = {
		exec:function(editor){
			editor.insertHtml("{br}");
		}
	};
  
	//Section 2 : Create the button and add the functionality to it
	b = 'gg_templates';
  
	CKEDITOR.plugins.add(b, {
		init: function(editor){
			editor.addCommand('section', a);
			editor.ui.addButton('section', {
				label:'Section',
				icon: this.path + 'section.gif',
				command:'section'
			});
			editor.addCommand('subsection', sa);
			editor.ui.addButton('subsection', {
				label:'Subsection',
				icon: this.path + 'subsection.gif',
				command:'subsection'
			});
			editor.addCommand('variable', va);
			editor.ui.addButton('variable', {
				label:'Variable',
				icon: this.path + 'variable.gif',
				command:'variable'
			});
			editor.addCommand('headline', ha);
			editor.ui.addButton('headline', {
				label:'Headline',
				icon: this.path + 'headline.gif',
				command:'headline'
			});
			editor.addCommand('breakline', ba);
			editor.ui.addButton('breakline', {
				label:'Break Line',
				icon: this.path + 'breakline.gif',
				command:'breakline'
			});
		}
	});
})();

