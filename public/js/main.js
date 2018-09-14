;(function(){

			// Menu settings
			$('#menuToggle, .menu-close').on('click', function(){
				$('#menuToggle').toggleClass('active');
				$('body').toggleClass('body-push-toleft');
				$('#theMenu').toggleClass('menu-open');
				$('#toggleIcon').toggleClass('fa-caret-right');
				$('#toggleIcon').toggleClass('fa-caret-left');
			});


})(jQuery);

