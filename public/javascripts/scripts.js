jQuery(document).ready(function() {
	
	$('.page-container form .username, .page-container form .password').keyup(function() {
		$(this).parent().find('.error').fadeOut('fast');
	});
	$(".icons .icon").click(function(e) {
		$(this).addClass("active").siblings().removeClass('active')
	});

	//查看详细资源
	$(document).on("click", ".wx_resoceul_jushou li", function() {
		$(this).addClass("wx_active").siblings().removeClass("wx_active");
	});
	
	history.pushState(null, null, document.URL);
	window.addEventListener('popstate', function () {
	    history.pushState(null, null, document.URL);
	});

	//禁用网页F5刷新功能
	$(document).on("keydown", function(e) {
	     e = window.event || e;
	     if (e.keyCode == 116) //禁用F5
	     {                               
	         return false;                           
	     }
	     if(e.ctrlKey&&e.keyCode==82)// 禁用ctrl+R刷新 
	     {
	         return false;
	     }
	});
});