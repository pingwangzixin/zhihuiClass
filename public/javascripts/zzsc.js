var i = 0;
var mycan = document.getElementById("canvas");
var con = mycan.getContext('2d');
var sizeR = "3";
var ismousedown = false;
var changeColor = "#f3161f";
var endobj={};
var allpoint = []
var arrXY = []
var arr = [];
var undoarr = [];
var eraserEnabled = false;
mycan.width = document.documentElement.clientWidth;
mycan.height = document.documentElement.clientHeight;

function expand() {
	if (i == 0) {
		toolsShow();
	} else {
		toolsHide();
	};
}
function toolsHide(){   //小工具缩小
	    document.getElementById("menu").style.transform = "scale(0)";
	    document.getElementById("plus").style.transform = "rotate(0deg)";
	    document.getElementById("toggle").style.borderColor = "transparent";
	    $('#annotation').hide();
		$('#moreTools').hide();
	    $(".annotationFrame").hide();
	    $('.circle_bg .pos05').removeClass('actives');
	    i=0;
};
function toolsShow(){   //小工具放大
	document.getElementById("menu").style.transform = "scale(1)";
	document.getElementById("plus").style.transform = "rotate(45deg)";
	document.getElementById("toggle").style.borderColor = "#1296db";
	i = 1;
};





$('.circle_bg div').on('click', function() {
	$(this).addClass('actives').siblings().removeClass('actives');
});

function Annotation() { //批注选择颜色和字体大小
    $(".pos05").addClass("actives").siblings().removeClass("actives");
	$('#annotation').show();
	$(".annotationFrame").show();
};

function AnnotationFrame() { //批注弹层
    $(".pos05").addClass("actives").siblings().removeClass("actives");
	undoarr=[];
	con.clearRect(0, 0, mycan.width, mycan.height);
	con.beginPath();
	changeColor = "#f3161f";
	$(".annotationFrame").show();
	$("#moreTools").hide();
};

/* function addLongDown(ele, fn, fn1) { //长按事件
	var time = 0; // 用于计算按下时间
	var flag = false; // 判断按下时间否是大于500毫秒
	ele.addEventListener('mousedown', function(e) { // 按下计时
		time = new Date().getTime();
	});

	ele.addEventListener('mouseup', function(e) { // 抬起计算
		flag = (new Date().getTime() - time) > 1000;
		if (flag) {
			fn.call(this, e); // 按下大于500毫秒执行回调函数
		} else {
			fn1.call(this, e);
		};
	});

	ele.addEventListener('click', function(e) { // 在同一个target上执行按下和抬起会触发点击事件,屏蔽掉已经绑定的点击事件
		if (flag) {
			flag = false; // 重新计算
			e.stopImmediatePropagation(); // 屏蔽this的所有点击事件
		}
	});
};
addLongDown(document.getElementsByClassName("pos05")[0], Annotation, AnnotationFrame);
 */
$(".pos05").click(function(){
	AnnotationFrame();
});
$(".pos05").dblclick(function(){
	Annotation();
});


//开始绘制画板
function drawing() {
	var x, y //定义绘制的画笔起始坐标
	['touchstart', 'mousedown'].forEach(function(item, index) {
   
		mycan.addEventListener(item, function(e) {
			$("#menu .pos04").removeClass("actives").next().addClass("actives");
			$("#annotation").hide();
			if (item == "touchstart") {
				x = e.touches[0].clientX;
				y = e.touches[0].clientY;
			} else {
				x = e.x;
				y = e.y;
			}
			e.preventDefault();
			ismousedown = true;
			con.beginPath()
			con.lineCap = "round";
			con.lineJoin = "round";
			con.strokeStyle = changeColor;
			con.moveTo(x, y)
		});
	});
	var dx, dy //定义绘制的画笔当前移动的坐标
	['touchmove', 'mousemove'].forEach(function(item, index) {
		mycan.addEventListener(item, function(e) {
			if (item == "mousemove") {
				dx = e.x;
				dy = e.y
			} else {
				dx = e.touches[0].clientX;
				dy = e.touches[0].clientY;
			}
			if (ismousedown == true) {
				arr = [];
				arr[0] = dx;
				arr[1] = dy;
				arrXY.push(arr);
				con.lineTo(dx, dy)
				con.strokeStyle = changeColor;
				con.stroke()
				con.lineWidth = sizeR;
				con.restore()


			}
		});

	});
	['touchend', 'mouseup'].forEach(function(item, index) {
		mycan.addEventListener(item, function(e) {
			ismousedown = false;
			undoarr.push(mycan.toDataURL());
			var obj = {};
			obj.startX = x;
			obj.startY = y;
			obj.endY = dy;
			obj.endX = dx;
			obj.points = [];
			enddrew();
			allpoint = [];
			arrXY = [];

		});
	});

} //
drawing();



function restor() {
	if (undoarr.length != 0) {
		undoarr.pop();
		con.clearRect(0, 0, mycan.width,mycan.height);
		var canvasPic = new Image();
		canvasPic.src = undoarr[undoarr.length - 1];
		canvasPic.addEventListener('load', function() {
			con.drawImage(canvasPic, 0, 0);
		});
	};

};

var erasering;
//结束绘制
function enddrew() {
	ismousedown = false;
	allpoint.push(arrXY)
	endobj.width = sizeR;
	endobj.color = changeColor;
	endobj.points = arrXY;
};
//点击——选择颜色
$('#annotation .color li').on('click',function(){
	
      var index=$(this).index();
	  annotationColor(index);
				
});

function annotationColor(index){ 
	$("#annotation .color li").eq(index).addClass('actives').siblings().removeClass('actives');
	changeColor=$("#annotation .color li").eq(index).find("span").css("background-color");
	
};


//点击--改变画笔大小
$("#annotation .spot li").on("click", function() {

	var index=$(this).index();
	annotationSize(index);
});
function annotationSize(index){ 
	$("#annotation .spot li").eq(index).addClass('actives').siblings().removeClass('actives');
	if(index==0){
		 sizeR="3";
	}else if(index==1){
		 sizeR="6";
	}else if(index==2){
		 sizeR="9";
	};
	
};




$("#menu .pos04").click(function(){
	 restor();
});
