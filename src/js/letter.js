'use strict';

export default (function App(window, document, $){

	const $open = $('.js-write-letter');

	function actions(){
		$open.on('click', function(e){
			e.preventDefault();

			var url = $(this).attr('href');
			//http://detionline.com/webim/client.php?locale=ru
	
			var newWindow = window.open(url + '&amp;url='+escape(document.location.href)+'&amp;referrer='+escape(document.referrer), 'webim', 'toolbar=0,scrollbars=0,location=0,status=1,menubar=0,width=640,height=480,resizable=1');
			newWindow.focus();
			newWindow.opener=window;

		});
	}



	function init(){
		actions();
	}

	return {
		init
	}

})(window, document, jQuery, undefined);
