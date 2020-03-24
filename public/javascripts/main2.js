var app = angular.module("app", ['ngSanitize']);
app.controller("teachRoom", function($scope, $http, $interval, $timeout) {
	//定义一些初始化数据
	var socket = io(); //定义socket

	var singIn = 0;
	var timer;
	var xiafanum = 0;
	var ansertime;

	var playVideo = document.getElementById("videoplay");
	$scope.comecount = 0; //已签到的人数
	$scope.isClass = false; //判断是否是上课的状态，以便禁用点击事件
	$scope.isdrawing = false; //没打开画板
	$scope.windowShow = true; //弹窗显示状态
	$scope.classId = ""; //班级id
	$scope.sbjid = ""; //学科id
	$scope.userId = sessionStorage.getItem("userId");
	socket.emit('jeic', {
		"name": 'logined',
		"userId": $scope.userId
	}); //进入页面向app发送消息
	$scope.userName = sessionStorage.getItem("userName");
	$scope.userMobile = sessionStorage.getItem("userMobile");
	$scope.userEmail = sessionStorage.getItem("userEmail");
	$scope.teachFace = sessionStorage.getItem("teachFace");
	$scope.rs = 0;
	$scope.switchscore = 0;
	$scope.iframesrc = '';
	$scope.restypehide = true;
	$scope.resourceId = '';
	$scope.devce = [];
	$scope.cityId = "";
	$scope.studentName = ""; //获取学生姓名
	$scope.classXName = ""; //获取班级名字
	$scope.remember = []; //成员列表
	$scope.recordList = []; //课堂记录列表
	$scope.noduibi = true;
	var tihaorenshu = [];
	var banjibaifenbi = [];
	var tishuliangnum = [];
	var jieshudatile = false; //结束答题
	var imgZoomRate = 1; //图片缩放比率
	var crosswise = 0; //图片横向移动
	var lengthways = 0; //图片竖向移动
	var pptOperation = true; //ppt弹框是否可以调用（显示）
	var wordOperation = true;
	var excelOperation = true;
	var imgOperation = true;
	var pdfOperation = true;
	var testOperation = true;
	var testOperation2 = true;
	var testRecordSeeId = null;
	var testRecordSeeId2 = null;
	var testRecordMinId = null;
	var testRecordMinId2 = null;
	var imgRecordSeeId = null; 
	var imgRecordMinId = null;
	var pdfRecordSeeId = null;
	var pdfRecordMinId = null;
	var pptRecordSeeId = null;
	var pptRecordMinId = null;
	var wordRecordSeeId = null;
	var wordRecordMinId = null;
	var excelRecordSeeId = null;
	var excelRecordMinId = null;
	$scope.weiqiangda = true; //抢答默认头像
	$scope.chuangtiType = "";
	$scope.qiangdanan = false;
	$scope.qiangdanv = false;
	$scope.qiangdastoptrue = false;
	$scope.qiangdaBegintrue = true;
	$scope.lowerHair = false //是否下发了试题
	$scope.lowerHairNum = 0; //下发了几次试题
	$scope.questionIndex = 0; //云试题 试题默认显示第一道题
	$scope.stuUpLoadFile = [];
	$scope.stuUpLoadFileId = [];
	$scope.imgscontrasts = []; //拍照对比数据
	$scope.onePic = false;
	var Width = window.parent.document.body.clientWidth;
	var Height = window.parent.document.body.clientHeight;
	var yuntishiScroll = 0; //云试题模块试题滚动距离
	var teacherImg;
	//如果用户没登录就进入这个页面，那么就自动返回登录页
	if ($scope.userId == null) {
		window.location.href = './';
	}

	$(".welcome_user").fadeIn('fast', function() {
		$(this).css('top', '220px');
		$(this).html("欢迎您使用捷成智慧课堂教学系统");
		setTimeout(function() {
			$(".welcome_user").fadeOut('fast', function() {
				$(this).css('top', '0');
			});
			$(".welcome_user").html("");
		}, 2000)
	});

	//一进页面就通过老师Id，获取年级和班级下拉列表
	$http.get(jeucIp + '/ea/eaUserCourse/class?uid=' + $scope.userId).success(function(jdata) {
		$scope.gradeClass = jdata.data;
	});

	$scope.grade = {
		classId: ''
	};

	socket.on('jeic', function(data) {
		switch (data.name) {
			case "shangke":
				classBeginsEvents(); //点击上课按钮
				break;
			case "banji":
				classEvents(data.classId) //选择班级同步
				break;
			case "xueke":
				$("#xuekeid").val(data.subjectval); //选择学科同步
				break;
			case "sureBeginClass":
				$scope.classId = data.classId;
				sureBeginClass(data.classId, data.subjectId, data.subjectName, data.luping); //点击确认上课按钮同步
				break;
			case "sureStopClass":
				xiake(); //下课同步
				break;
			case "closeWindow":
				closeWindow(); //关闭弹窗同步
				break;
			case "teacherInfo":
				userEvents(); //查看老师信息同步
				break;
			case "memberAdmin":
				memberAdminEvents($scope.classId); //成员管理弹窗同步
				break;
			case "ketangjilu":
				classRecordEvents(); //课堂记录同步
				break;
			case "jiaoxueXiangQing":
				showclassrecordwindow(data.id, data.resourceId, data.imgUrl, data.type, data.resName); //点击课堂记录资源详情同步
				break;
			case "checkStuDeail":
				classRcordstu(data.stuId, data.stuName); //成员学生显示同步
				break;
			case "exitid":
				exitEvents(); //退出按钮点击
				break;
			case "logout_sure":
				logoutEvents(); //确认退出点击
				break;
			case "menberSwitch":
				chengyuantabEvents(data.switchN); //切换成员和分组
				break;
			case "startSignIn":
				findsingin(); //开始签到
				break;
			case "endSignin":
				endlogin(); //结束签到
				break;
			case "resouceAdmin":
				resouceAdminEvents(); //点击资源弹窗同步
				break;
			case "restabSwitch":
				restab(data.restabN); //资源弹窗切换左侧ul
				break;
			case "showResoce":
				resoceWindowShow(data.resId, data.resType); //点击单个资源查看资源
				break;
			case "resourcesMinimize": //最小化资源
				if (data.data == "ppt") {
					minimizePpt();
				} else if (data.data == "word") {
					minimizeWord();
				} else if (data.data == "excel") {
					minimizeExcel();
				} else if (data.data == "img") {
					minimizeImg();
				} else if (data.data == "test") { //云试题
					minimizeTest();
				} else if (data.data == "pdf") { //pdf
					minimizepdf();
				} else if (data.data == "test2") { //云试题
					minimizeTest2();
				} ;
				break;
			case "resourcesMaximization": //最大化资源
				if (data.data == "ppt") {
					judge(maximizationPpt);
				} else if (data.data == "word") {
					judge(maximizationWord);
				} else if (data.data == "excel") {
					judge(maximizationExcel);
				} else if (data.data == "img") {
					judge(maximizationImg);
				} else if (data.data == "test") {
					judge(maximizationTest);
				} else if (data.data == "pdf") {
					judge(maximizationpdf);
				} else if (data.data == "test2") {
					judge(maximizationTest2);
				};

				break;
			case "closeresdetail":
				closeResdetail(); //关闭视频播放器
				break;
			case "closeimgtc":
				closeimgtc(); //关闭图片弹窗
				break;
			case "testImgLook":
				testImgLook(data.data);
				break;
			case "imgBig":
				imgChange("big"); //图片放大
				break;
			case "imgSmall":
				imgChange("small"); //图片缩小
				break;
			case "imgLeft":
				displacement("left"); //图片左移
				break;
			case "imgRight":
				displacement("right"); //图片右移
				break;
			case "imgTop":
				displacement("top"); //图片
				break;
			case "imgBottom":
				displacement("bottom");
				break;
			case "closeshowType":
				closeshowType(); //关闭资源显示类型选项弹窗
				break;
			case "showShiti":
				showresshitiwindow(data.shitiId, data.downloadUrl, data.shitiType, data.shitiname); //试题下发弹窗显示
				break;
			case "closeshitiwindow":
				resshiticlose(); //试题下发弹窗关闭
				break;
			case "xiafahomework":
				xiafashiti(data.type); //下发试题
				break;
			case "beginanser":
				beginansershiti(data.type); //开始答题
				break;
			case "stopanser":
				stopansershiti(); //结束答题
				break;
			case "watchStudetail":
				studentScorewindow(data.strId, data.stuName); //查看学生答题情况弹窗
				break;
			case "closestrscroce":
				closestrscrocewindow(); //关闭学生答题情况弹窗
				break;
			case "datiqiehuan":
				datiqiehuan(data.scoreswitchN); //答题情况切换同步
				break;
			case "backhome":
				backHomeEvents(); //点击返回主页同步
				break;
			case "drawclick":
				drawEvents(data.huabansrc); //进入画板
				break;
			case "PlayVideo": //视频播放
				var playVideo = document.getElementById("videoplay");
				playVideo.play();
				break;
			case "PauseVideo": //视频停止
				var playVideo = document.getElementById("videoplay");
				playVideo.pause();
				break;
			case "ziyuanxiangqing": //资源详情
				$scope.drawclick();
				break;
			case "closeDraw": //关闭画板
				sessionStorage.clear("imgSrc");
				$(".dockposition").css({
					"z-index": "666"
				});
				$("#drawing").hide(500);
				$("#drawtwo").html("");
				break;
			case "pingtai": //云平台
				pingtai();
				break;
			case "datiInfo":
				zhutuxianshi();
				break;
			case "checkJiluClass":
				zhutuxianshi(data.text);
				break;
			case "showTable":
				$(".paichangetable").show();
				$(".paichange").hide();
				$("#switchPai").addClass("huangsebtn");
				$("#switchPai").html("查看图表");
				break;
			case "showPic":
				$(".paichangetable").hide();
				$(".paichange").show();
				$("#switchPai").removeClass("huangsebtn");
				$("#switchPai").html("查看表格");
				break;
			case "closeInfoWindow":
				closebanjiscroce();
				break;
			case "fanhui":
				fanhuiInfo();
				break;
			case "tihao": //点击题号，进入详细信息
				showTihao($scope.banjiansers[data.data].datamark)
				$scope.Tnum = data.data
				break;
			case "A": //切换柱状图ABCD选项
				changeABCD("A")
				break;
			case "B":
				changeABCD("B")
				break;
			case "C":
				changeABCD("C")
				break;
			case "D":
				changeABCD("D")
				break;
			case "E":
				changeABCD("E")
				break;
			case "F":
				changeABCD("F")
				break;
			case "G":
				changeABCD("G")
				break;
			case "H":
				changeABCD("H")
				break;
			case "I":
				changeABCD("I")
				break;
			case "J":
				changeABCD("J")
				break;
			case "YES":
				changeABCD("YES")
				break;
			case "NO":
				changeABCD("NO")
				break;
			case "ToggleHide":
				showstrlist();
				break;
			case "ToggleShow":
				Hidestrlist();
				break;
			case "LastQuestion":
				upsubject("#zmj_subjectDetail", data.index);
				break;
			case "NextQuestion":
				downsubject("#zmj_subjectDetail", data.index);
				break;
			case "historyLastQuestion": //课堂记录  云试题上一题
				upsubject("#mlh_subjectDetail", data.index);
				break;
			case "historyNextQuestion": //课堂记录  云试题下一题
				downsubject("#mlh_subjectDetail", data.index);
				break;
			case "prevQuestionStatistics": //查看班级答题情况上一题
				$scope.prevQuestionStatistics();
				break;
			case "nextQuestionStatistics": //查看班级答题情况下一题
				$scope.nextQuestionStatistics();
				break;
			case "closeketangjilu": //关闭课堂记录
				closeWindow();
				break;
			case "recordshiticlose":
				recordshiticlose();
				break;
			case "small": //云试题切换字体大小
				smallSize();
				break;
			case "middle":
				middleSize();
				break;
			case "big":
				bigSize();
				break;
			case "closePpt": //关闭ppt,word以及excel
				toolsHide();
				if (data.data == "ppt") {
					closePpttc(".pptPlayer");
				} else if (data.data == "word") {
					closePpttc(".wordPlayer");
				} else if (data.data == "excel") {
					closePpttc(".excelPlayer");
				};
				break;
			case "Rollcall":
				callName();
				toolsShow();
				break;
			case "search":
				search();
				toolsShow();
				break;
			case "toolsHide":
				toolsHide();
				break;
			case "toolsShow":
				toolsShow();
				break;
			case "sureStopanser":
				sureStopanser();
				break;
			case "closeSinOutWindow":
				closeSinOutWindow();
				break;
			case "clock":
				countDown();
				toolsShow();
				break;
			case "closeClock":
				closeClock();
				break;
			case "imgRotate": //图片旋转
				zuoxuanzhuan();
				break;
			case "clickStuPicture": //点击学生头像，查看学生上传的图片
				studentFileEvents(data.stuId);
				break;
			case "clickStuPicUrl": //点击学生头像，查看学生上传的图片
				showstuimgResoce(data.imgUrl);
				break;
			case "chengyuanScroll": //成员管理滚动条  
				var conheight1 = $(".memberAdminCon").height();
				$(".memberAdminCon").scrollTop(data.data * conheight1 * 1.1);

				break;
			case "yunziyuanScroll": //云资源一级页面滚动条
				var conheight2 = $(".alldom").height();
				$(".alldom").scrollTop(data.data * conheight2 * 1.1);
				break;
			case "yunshitiScroll": //云试题一级页面滚动条
				var conheight3 = $(".alldom").height();
				$(".alldom").scrollTop(data.data * conheight3 * 1.1);
				break;
			case "xueshengliebiaoScroll": //云试题 右边 学生列表滚动条
				var conheight4 = $(".studentlistscroll").height();
				$(".studentlistscroll").each(function(index) {
					var conheight4 = $(".studentlistscroll").eq(index).height();
					$(".studentlistscroll").eq(index).scrollTop(data.data * conheight4 / 2.2);
				});
				break;
			case "chakanzongchengjiScroll":
				var conheight5 = $(".paichangetable").height();
				$(".paichangetable").scrollTop(data.data * conheight5 / 1.8);
				break;
			case "shitijiangjieScroll"://试题讲解a-j
				var conheight9 = $(".tihaotcset").height();
				$(".tihaotcset").scrollTop(data.data * conheight9 / 2.2);
				break;
			case "gerenchengjiScroll":
				var conheight6 = $(".memberAdminCon").height();
				$(".memberAdminCon").scrollTop(data.data * conheight6 * 1.4);
				break;
			case "jiluxueshengliebiaoScroll":
				var conheight7 = $("#strIconRight .studentlistscroll").height();
				$("#strIconRight").scrollTop(data.data * conheight7 / 1.1);
				break;
			case "xiaoHongHuaScroll":
				var conheight8 = $(".studentResultTable").height();
				$(".studentResultTable").scrollTop(data.data * conheight8 * 1.2);
				break;
			case "yunshitiziyuanScrollxia":
				yunshitiMove("bottom");
				break;
			case "yunshitiziyuanScrollshang":
				yunshitiMove("top");
				break;
			case "closeStuPicTC":
				closestuimguploadtc();
				break;
			case "pptAnnotation": //ppt单击批注
				AnnotationFrame();
				break;
			case "resAnnotation": //资源单击批注
				AnnotationFrame();
				break;
			case "closeAnnotation": //单击批注
				$(".annotationFrame").hide();
				break;
			case "dblAnnotation": //双击批注
				Annotation();
				break;
			case "revokeAnnotation": //撤销批注
				restor();
				break;
			case "sizeAnnotation": //选择批注粗细
				annotationSize(data.index);
				break;
			case "colorAnnotation": //选择批注颜色
				annotationColor(data.index);
				break;
			case "draw": //开始批注
				if (data.points.length != 0) {
					$("#menu .pos04").removeClass("actives").next().addClass("actives");
					$("#annotation").hide();
					var flag = true;
					if (data.type == "start") {
						con.beginPath()
						con.lineCap = "round";
						con.lineJoin = "round";
						con.strokeStyle = changeColor;
						con.lineWidth = sizeR;
						con.moveTo(data.points[0][0] / (data.w / Width), data.points[0][1] / (data.h / Height));
					} else if (data.type == "move") {
						con.lineTo(data.points[0][0] / (data.w / Width), data.points[0][1] / (data.h / Height));
						con.strokeStyle = changeColor;
						con.lineWidth = sizeR;
						con.stroke();
						con.restore();
					} else if (data.type == "end") {
						undoarr.push(mycan.toDataURL());
					};
				};
				break;
			case "checkStudZhenQueLv":
				studentResultPopupShow();
				break;
			case "closeStudZhenQueLv":
				$(".studentResultPopup").hide();
				break;
			case "startQuickResponseQuestion": //抢答开始
				qiangdaBegin();
				break;
			case "endQuickResponseQuestion": //抢答结束
				qiangdastop()
				break;
			case "luxiang": //录屏投屏
				$scope.restypehide = false;
				$("#videoplay").attr("src",videoPlay + arrVideo)
				$(".resoucePlayer").show();
				break;
			case "showChuangti": //拍照创题
				showChuangti(data.shitiImageUrl, data.shitiType, data.answer);
				toolsHide();
				break;
			case "closeqiangda": //关闭抢答
				closeqiangda();
				break;
			case "moretoolsClick":
				moretoolsClick();
				break;
			case "qiangDa":
				qiangdaBtn();
				break;
			case "imageDuiBi": //拍照对比
				showduibitupian(data.data)
				break;
			case "closeComper": //关闭拍照对比
				closeimgduibiPlayer()
				break;
			case "findImageByIndex": //拍照对比查看单张详细的图
				contrastsImg(data.index)
				break;
			case "leftImage": //上一张图片
				leftChangeImg();
				break;
			case "rightImage": //下一张图片
				rightChangeImg();
				break;
			case "zhantai": //实物展台
				$(".zhantai").show();
				toolsHide();
				new PeerManager().peerInit(data.data)
				break;
			case "zhantaiClose": //实物展台
				closezhantaidetail()
				break;
			case "closePdf": //关闭pdf
				closePdftc()
				break;
		};
	});

	// 拍照对比___________
	function showduibitupian(data) {
		$scope.onePic = false;
		if (data.length == "1") {
			$scope.noduibi = false;
			showstuimgResoce(data[0].imgUrl);
		} else {
			$scope.imgscontrasts = data;
			$(".imgduibiPlayer").show();
		};
		$scope.$apply();
	}

	$scope.closeimgduibiPlayer = function() {
		closeimgduibiPlayer();
	}

	function closeimgduibiPlayer() {
		$(".imgduibiPlayer").hide();
	}
	
	function showimg(imgsrc){
		$(".liveplay").show();
		$("#screen").attr("src",imgsrc)
	}

	$scope.contrastsImg = function(name) {
		contrastsImg(name)
	}

	function contrastsImg(name) {
		$scope.noduibi = false;
		angular.forEach($scope.imgscontrasts, function(a, b, c) {
			if (name == a.name) {
				$scope.imgresShowtc = a.imgUrl;
				showstuimgResoce(a.imgUrl, a.name);
				$scope.$apply();
			}
		})
	};

	// 上一张图片
	$scope.leftChangeImg = function() {
		leftChangeImg();
	}

	function leftChangeImg() {
		if ($scope.imgIndex > 0) {
			$scope.imgIndex = parseInt($scope.imgIndex) - 1
			contrastsImg($scope.imgIndex)
		}
		imgZoomRate = 1;
		crosswise = 0;
		lengthways = 0;
		rotatenumclick = 1;
		$(".wx_transform").css("transform", 'scale(' + imgZoomRate + ')');
		$("#wx_imgshowtc").css("margin-left", crosswise + "px");
		$("#wx_imgshowtc").css("margin-top", lengthways + "px");
		$("#wx_imgshowtc").css("transform", 'rotate(0)');
	}

	// 下一张图片
	$scope.rightChangeImg = function() {
		rightChangeImg();
	}

	function rightChangeImg() {
		if ($scope.imgIndex < 3) {
			$scope.imgIndex = parseInt($scope.imgIndex) + 1
			contrastsImg($scope.imgIndex);
		}
		imgZoomRate = 1;
		crosswise = 0;
		lengthways = 0;
		rotatenumclick = 1;
		$(".wx_transform").css("transform", 'scale(' + imgZoomRate + ')');
		$("#wx_imgshowtc").css("margin-left", crosswise + "px");
		$("#wx_imgshowtc").css("margin-top", lengthways + "px");
		$("#wx_imgshowtc").css("transform", 'rotate(0)');
	};

	function yunshitiMove(direction) { //云试题试题滚动事件
		if (direction == "top") {
			yuntishiScroll += 20;
		} else if (direction == "bottom" && yuntishiScroll > 0) {
			yuntishiScroll += -20;
		};
		$('.subjectDetail').scrollTop(yuntishiScroll);
	};

	//云平台
	$scope.yunpingtai = function() {
		pingtai()
	};

	function pingtai() {
		$scope.callsrc = jeucIp + "/oauth/toClientUrl?clientId=1&userId=" + $scope.userId + "&areaCode=" + $scope.cityId;
		window.open($scope.callsrc, '_blank', 'nodeIntegration=no')
	};

	$scope.search = function() {
		search()
	};

	function search() {
		$scope.search = 'http://www.baidu.com';
		window.open($scope.search, "_blank", 'nodeIntegration=no')
	};

	// 倒计时
	$scope.countDown = function() {
		var clockText = $(".pos06 span").html();
		if (clockText == '倒计时') {
			countDown()
		} else {
			closeClock();
		}
	};

	function countDown() {
		$(".pos06 span").html("关闭");
		$("#clock").show(500);
		$(".daojishiicon,.textclock").hide();
		$(".closeClock").show();
	}

	function closeClock() {
		$(".pos06 span").html("倒计时");
		$(".pos06").removeClass("actives");
		$("#clock").hide(500);
		$(".daojishiicon,.textclock").show();
		$(".closeClock").hide();
	};

	//点击--上课按钮
	$scope.classBegins = function() {
		classBeginsEvents();
	};

	//点名
	$scope.callName = function() {
		callName();
	};
	// 更多小工具
	$scope.moretoolsClick = function() {
		moretoolsClick()
	}

	function moretoolsClick() {
		$("#moreTools").show();
		$("#annotation").hide();
		$(".annotationFrame").hide();
	}

	function callName() {
		if ($scope.remember.length) {
			if ($(".luck-back").css("display") == "none") {
				$(".luck-back").show();
				start();
			};
			toolsShow();
		} else {
			$(".welcome_user").show().html("请先上课");
			setTimeout(function() {
				$(".welcome_user").hide().html("");
			}, 1000);
		};
	};

	var nametxt = $('.slot');
	var phonetxt = $('.name');
	var t = null;

	// 开始
	function start() {
		var keepGoing = true;
		clearInterval(t);
		t = setInterval(startNum, 10);
		setTimeout(function() {
			clearInterval(t);
			t = setInterval(startNum, 200);
		}, 2000);
		setTimeout(function() {
			clearInterval(t);
			$scope.dianmingRemember.splice(num, 1);
		}, 3000);
		setTimeout(function() {
			$(".luck-back").hide();
		}, 6000);
	};

	// 循环参加名单
	function startNum() {
		num = Math.floor(Math.random() * ($scope.dianmingRemember.length - 1));
		nametxt.css('background-image', 'url(' + $scope.dianmingRemember[num].userFace + ')');
		phonetxt.html($scope.dianmingRemember[num].realname);
	};
	//点击开始按钮
	$("#start").click(function() {
		start();
	});
	//同步--上课调用事件
	function classBeginsEvents() {
		//判断画板出来没有
		if ($scope.isdrawing == true) {
			$("#drawing").hide(500);
			$scope.isdrawing = false;
		}
		$(".appcontwindow").show();
		//判断是上课还是下课
		if ($("#classBegins>div.title").text() == "上课") {
			//上课弹窗显示，选择班级和学科
			$(".classTc").show();
		} else if ($("#classBegins>div.title").text() == "下课") {
			$(".xiakeTc").show().siblings().hide(100);
			$(".xiaketips").show();
		} else {
			$(".welcome_user").show().html("系统状态异常，请重新打开")
			setTimeout(function() {
				$(".welcome_user").hide().html("")
			}, 2000)
		}
	};

	//拍照创建试题同步
	function showChuangti(imgUrl, imgType, answer) {
		$scope.shijuanType = "自主创题";
		if (testOperation2) {
			$(".appcontwindow").show();
			$(".showShiti").show();
			$scope.paizhaoanswer = answer;
			$scope.imgShitiShowtc = imgUrl;
			$("#mlh_chuangImgshowtc").attr("src", $scope.imgShitiShowtc);
			$scope.imgType = imgType;
			//通过班级id获取班级的学生列表
			$http.get(jeucIp + '/uc/user?classId=' + $scope.classId + '&userType=2&state=1&delFlag=0&orderBy=2').success(
				function(res) {
					$scope.shiTistudents = res.data.list;
			});
		
		} else if (id == testRecordMinId2) {
			judge(maximizationTest2);
		} else {
			$(".welcome_user").show().html("请先关闭最小化试题")
			setTimeout(function() {
				$(".welcome_user").hide().html("")
			}, 1000);
		};
	};

	// 抢答小工具
	$scope.qiangdaBegin = function() {
		qiangdaBegin();
	};

	//点击--关闭试题创建弹窗
	$scope.closeshowShitiwindow = function() {
		closeshowShitiwindow();
	};
	//同步--关闭试题创建弹窗
	function closeshowShitiwindow() {
		$(".showShiti").hide();
	};

	function qiangdaBegin() {
		$(".box_foot").html("抢答中... ...");
		$http.get(localIP + '/sunvote/startResponder?number=1').success(function(res) {
			if (res.ret == "200") {
				var xueshengdata = JSON.stringify($scope.xueshengdata);
				var qiandaosrtsetinter
				qiandaosrtsetinter = setInterval(function() {
					$http.post(localIP + '/sunvote/getStartResponder', xueshengdata).success(function(res) {
						if (res.ret == "200") {
							$(".box_foot").css({
								"background": "#1296db"
							})
							$scope.qiangdaBegintrue = false;
							$scope.qiangdastoptrue = true;
							clearInterval(qiandaosrtsetinter)
							$(".qiangdaname").html(res.data.realname)
							socket.emit("jeic", {
								"name": "QuickResponseQuestionData",
								"data": res.data
							})
							if (res.data.sex == "男") {
								$scope.weiqiangda = false;
								$scope.qiangdanan = true;
								$scope.qiangdanv = false;
							} else {
								$scope.weiqiangda = false;
								$scope.qiangdanan = false;
								$scope.qiangdanv = true;
							}
						} else {
							$(".qiangdaname").html("准备好了吗？")
							$scope.weiqiangda = true; //抢答默认头像
							$scope.qiangdanan = false;
							$scope.qiangdanv = false;
							$scope.qiangdastoptrue = false;
							$scope.qiangdaBegintrue = true;
						}
					})
				}, 1000)
			} else {
				$(".welcome_user").show().html("答题器环境有问题，请重新插入答题器接收器！")
				setTimeout(function() {
					$(".welcome_user").hide().html("")
				}, 2000)
			}
		})
	};

	$scope.qiangdastop = function() {
		qiangdastop();
	};

	function qiangdastop() {
		$scope.qiangdaBegintrue = true;
		$scope.qiangdastoptrue = false;
		$(".qiangdaname").html("准备好了吗？")
		$scope.weiqiangda = true;
		$scope.qiangdanan = false;
		$scope.qiangdanv = false;
		$scope.$apply();
	};

	//点击--选择班级事件
	$scope.selectClass = function(classId) {
		classEvents(classId)
	};
	//同步--选择班级调用的事件
	function classEvents(classId) {
		if (classId == null) {
			$scope.sbjid = null;
			$("#banjiid").val("");
			$("#xuekeid").val("");
			$scope.subjects = [];
		} else {
			$scope.grade.classId = classId;
			$scope.sbjid = null;
			$scope.classId = classId;
			$("#xuekeid").val("");
			//通过老师id和班级id获取学科
			$http.get(jeucIp + '/ea/eaUserCourse/subject?uid=' + $scope.userId + '&cid=' + classId).success(function(jdata) {
				$("#xuekeid").html("")
				$("#xuekeid ").append('<option value="">请选择科目</option>')
				for (var i = 0; i < jdata.data.length; i++) {
					if ($("#xuekeid option").val() == jdata.data[i].subjectId) {

					} else {
						$("#xuekeid").append('<option value="' + jdata.data[i].subjectId + '">' + jdata.data[i].subjectName +
							'</option>')
					}
				}
			})
		}
	};

	//点击--选择学科下拉选项改变事件
	$("#xuekeid").change(function() {
		var subjectval = $(this).val();
		$scope.SubjectName = $("#xuekeid option:selected").text();
	});

	$(".icons .icon").click(function() { //结束签到
		if ($(this).index() != 2) {
			endlogin()
		}
	});

	//点击--确认上课按钮
	$scope.sure_beginClass = function(classId, subjectId, subjectName, luping) {
		sureBeginClass(classId, subjectId, subjectName, luping)
	};
	//同步--点击确认上课按钮调用的事件
	function sureBeginClass(classId, subjectId, subjectName, luping) {
		if (classId == null || classId == "") {
			$(".welcome_user").show().html("请选择班级")
			setTimeout(function() {
				$(".welcome_user").hide().html("")
			}, 1000)
		} else if (subjectId == null || subjectId == "") {
			$(".welcome_user").show().html("请选择学科")
			setTimeout(function() {
				$(".welcome_user").hide().html("")
			}, 1000)
		} else {
			if (luping == "true") {
				$("#screenyes").attr("checked", true)
			}
			setTimeout(function() {
				$("#classBegins").removeClass("animated tada")
			}, 1000)
			$(".classTc").hide();
			$("#classBegins").addClass("wx_red");
			$("#classBegins div.title").html("下课")
			$("#classBegins").addClass("animated tada")
			$scope.isClass = true;
			$scope.teachClassId = classId;
			$scope.teachSubjectId = subjectId;
			if (subjectName == undefined) {
				$scope.SubjectName = $("#xuekeid option:selected").text();
			} else {
				$scope.SubjectName = subjectName
			}
			//通过班级id获取班级的学生列表
			$http.get(jeucIp + '/uc/user?classId=' + classId + '&userType=2&state=1&delFlag=0&orderBy=2').success(function(res) {
				$scope.xueshengdata = res.data;
				$scope.remember = res.data.list;
				console.log($scope.remember.length);
				$scope.dianmingRemember = $scope.remember.concat($scope.remember);
				$scope.allcount = res.data.count;
				$scope.userList = []

				for (var i = 0; i < $scope.remember.length; i++) {
					var studentobj = {}
					studentobj.userId = $scope.remember[i].id;
					studentobj.deviceName = $scope.remember[i].deviceName;
					studentobj.realname = $scope.remember[i].realname;
					$scope.userList.push(studentobj)
				};

				$http.get(jeucIp + '/ea/class/' + $scope.teachClassId).success(function(data) {
					$scope.gradeId = data.data.gradeId;
					$scope.gradeName = data.data.gradeName;
					$scope.classXName = data.data.name;

					$http.get(jeucIp + '/uc/user/' + $scope.userId).success(function(jdata) {
						var stuinfodata = {
							'officeId': jdata.data.provinceId + ',' + jdata.data.cityId + ',' + jdata.data.countyId + ',' + jdata.data
								.officeId,
							'teacherId': $scope.userId,
							'teacherName': jdata.data.realname,
							"officeName": jdata.data.provinceName + ',' + jdata.data.cityName + ',' + jdata.data.countyName + ',' +
								jdata.data.officeName,
							"gradeId": $scope.gradeId,
							"gradeName": $scope.gradeName,
							"classId": $scope.teachClassId,
							"className": $scope.classXName,
							"subjectId": $scope.teachSubjectId,
							"subjectName": $scope.SubjectName,
							"userList": $scope.userList
						};
						var stringstuinfodata = JSON.stringify(stuinfodata);
						$scope.cityId = jdata.data.cityId;

						//通过班级id获取班级的学生列表
						$http.post(kezhongIp + '/startLesson', stringstuinfodata).success(function(res) {
							$scope.classRecord = res.data;
							socket.emit("joinRoom", {
								"classId": $scope.teachClassId,
								"userId": $scope.userId
							});
							socket.emit("jeic", {
								"name": "classRecord",
								"data": $scope.classRecord
							});
							// 进去页面调取签到接口
							$scope.userList = [];
							for (var i = 0; i < $scope.remember.length; i++) {
								var studentobj = {}
								studentobj.userId = $scope.remember[i].id;
								studentobj.deviceName = $scope.remember[i].deviceName;
								studentobj.realname = $scope.remember[i].realname;
								$scope.userList.push(studentobj)
							};
							var jsondata = {
								'classRecord': $scope.classRecord,
								'userList': $scope.userList,
							};

							var stringjsondata = JSON.stringify(jsondata);
							$http.post(kezhongIp + '/signinStart', stringjsondata).success(function(res) {

							});
							if ($("#screenyes").attr("checked")) {
								const {
									ipcRenderer
								} = require('electron')
								ipcRenderer.on('start', (e) => { //接收响应
									console.log(e)
								})
								ipcRenderer.sendToHost('lupingstart_' + $scope.classRecord + "," + $scope.userId + ',' + $scope.teachClassId +
									',' + $scope.SubjectName) //向webview所在页面的进程传达消息
							}
						});
					})
				})
			});
		}
		setTimeout(function() {
			$("#classBegins").removeClass("animated tada")
		}, 1000)
		$(".classTc").hide();
		$("#classBegins").addClass("wx_red");
		$("#classBegins div.title").html("下课")
		$("#classBegins").addClass("animated tada")
		$scope.isClass = true;
	};

	//点击--确认下课点击事件
	$scope.xiake_sure = function() {
		xiake();
	};
	//同步--下课调用事件
	function xiake() {
		$scope.grade.classId = null;
		$scope.sbjid = null;
		$("#banjiid").val("");
		$("#xuekeid").val("");
		$("#classBegins").removeClass("wx_red");
		$("#classBegins div.title").html("上课");
		$scope.isClass = false;
		$("#classBegins").addClass("animated tada");
		$http.get(kezhongIp + "/stopLesson").success(function(res) {
			setTimeout(function() {
				$("#classBegins").removeClass("animated tada");
				window.location.href = '/';
				sessionStorage.clear();
			}, 1000);
		});

		$(".xiakeTc").hide();
		$(".xiaketips").hide();
		$("#drawing").hide(500);
		$(".appcontwindow").show();
		if ($("#screenyes").attr("checked")) {
			const {
				ipcRenderer
			} = require('electron')
			ipcRenderer.on('start', (e) => { //接收响应
				console.log(e)
			})
			ipcRenderer.sendToHost('lupingend') //向webview所在页面的进程传达消息
			socket.emit('jeic', {
				"name": 'xiake'
			}); //进入页面向app发送消息
		}
	};

	//点击--关闭按钮和取消按钮
	$scope.closeWindow = function() {
		closeWindow();
	};
	//同步--关闭弹窗按钮的调用

	function closeWindow() {
		$(".showTc").hide(300);
		$scope.rs = 0;
		$scope.grade.classId = null;
		$scope.sbjid = null;
		$("#banjiid").val("");
		$("#xuekeid").val("");
		endlogin();
	};

	//点击--查看老师信息
	$scope.userWindow = function() {
		userEvents();
	};
	//同步--查看老师信息调用
	function userEvents() {
		$("#drawing").hide(500);
		$(".appcontwindow").show();
		if ($scope.isClass == true) {
			$("#userWindow").addClass("animated flash");
			setTimeout(function() {
				$("#userWindow").removeClass("animated flash");
			}, 1000)
			$(".userInfoTc").show().siblings().hide(100);
		} else {
			if ($scope.isdrawing == false) {
				$(".welcome_user").show().html("请先上课")
				setTimeout(function() {
					$(".welcome_user").hide().html("")
				}, 1000)
			}
		}
	};

	//点击--成员管理
	$scope.memberAdmin = function() {
		memberAdminEvents($scope.classId);
	};
	//同步--成员管理调用方法
	function memberAdminEvents(classId) {
		$("#drawing").hide(500);
		$(".appcontwindow").show();
		if ($scope.isClass == true) {
			$("#memberAdmin").addClass("animated flash");
			setTimeout(function() {
				$("#memberAdmin").removeClass("animated flash");
			}, 1000)
			$(".menberAdminTc").show(500).siblings().hide(100);
			findsingin()
		} else {
			if ($scope.isdrawing == false) {
				$(".welcome_user").show().html("请先上课")
				setTimeout(function() {
					$(".welcome_user").hide().html("")
				}, 1000)
			}
		}
	};

	//点击--退出按钮事件
	$scope.exitid = function() {
		exitEvents();
	};
	//同步--退出按钮调用的方法
	function exitEvents() {
		$("#drawing").hide(500);
		$(".appcontwindow").show();
		if ($scope.isdrawing == true) {
			$("#drawing").hide()
		}
		$(".userLogOut").show().siblings().hide();
		$("#exitid").addClass("animated flash");
		setTimeout(function() {
			$("#exitid").removeClass("animated flash");
		}, 1000)
	};

	//点击--确认退出事件
	$scope.logout_sure = function() {
		$("#drawing").append("");
		logoutEvents();
	};
	//同步--确认退出点击事件
	function logoutEvents() {
		$(".page-container").fadeIn('fast', function() {
			$(this).css('top', '200px')
		});
		$http.get(kezhongIp + "/stopLesson").success(function(res) {

			if ($("#screenyes").attr("checked")) {
				const {
					ipcRenderer
				} = require('electron')
				ipcRenderer.on('start', (e) => { //接收响应
					console.log(e)
				})
				ipcRenderer.sendToHost('lupingend') //向webview所在页面的进程传达消息
				socket.emit('jeic', {
					"name": 'xiake'
				}); //进入页面向app发送消息
			}

			window.location.href = './';
			sessionStorage.clear();
		})
	};

	//同步--开始签到调用
	function findsingin() {
		singIn++;
		timer = setInterval(function() {
			$http.get(kezhongIp + '/signIn').success(function(res) {
				if (res.ret == "200") {
					$scope.devce = res.data;
					socket.emit('jeic', {
						'name': "qiandao",
						'data': res.data
					});
					$scope.comecount = res.data.length;
				}
			});

			//获取学生上传数量
			$http.get(studentIp + 'findClassStuSendCount?classRecordId=' + $scope.classRecord).success(function(res) {
				$scope.stuUpLoadFileId = [];
				for (var i = 0; i < res.data.length; i++) {
					if (res.data[i].stu_id) {

						$scope.stuUpLoadFileId.push(res.data[i].stu_id);

					};
				};
				$scope.stuUpLoadFile = res.data;
			});
			$scope.$apply();
			$(".removeclas").parent().removeClass("opacity");
		}, 1000);
	};

	$scope.closeCyglWindow = function() {
		endlogin();
		closeWindow()
	}

	//同步--结束签到调用
	function endlogin() {
		singIn = 0;
		window.clearInterval(timer)
	};

	//点击--资源弹窗显示事件
	$scope.resouceAdmin = function() {
		resouceAdminEvents();
	};
	//点击--学生文件上传弹窗显示事件
	$scope.studentFile = function(event, id) {
		var trueUpload = angular.element(event.target).find("span").length;
		console.log(trueUpload)
		if (trueUpload > 0) {
			studentFileEvents(id);
		}
	};
	//同步--学生文件上传弹窗显示事件
	function studentFileEvents(id) {
		$(".imgListtc").show();
		$scope.studentId = id;
		//查询同步学生文件上传列表
		$http.get(studentIp + "/findClassStuSendList?classRecordId=" + $scope.classRecord + "&stuId=" + $scope.studentId).success(
			function(res) {
				$scope.studentFileList = res.data;
			});
	};

	// 点击学生上传的图片进图片展示弹窗
	$scope.showstuimgResoce = function(imgurl, index) {
		showstuimgResoce(imgurl, index);
		$scope.onePic = true;
	}

	function showstuimgResoce(imgurl, index) {
		$scope.imgIndex = index;
		if (imgOperation) {
			$(".imgPlayer").removeClass("zoomOut")
			$(".imgPlayer").addClass("animated zoomIn")
			$scope.imgresShowtc = imgurl;
			$(".imgPlayer").show();
			//图片加载成功
			$(".wx_imgshowtc").load(function() {
				var imgwidth = $(".wx_imgshowtc")[0].naturalWidth;
				var imgheight = $(".wx_imgshowtc")[0].naturalHeight;
				if (imgwidth > imgheight) { //横着的图
					if (imgwidth < 1300) {
						$(".wx_imgshowtc").css({
							"width": imgwidth,
							"height": ""
						})
					} else {
						$(".wx_imgshowtc").css({
							"width": "100%",
							"height": "calc(100% - 96px);"
						})
					}
				} else if (imgwidth <= imgheight) { //竖着的图
					if (imgheight < 768) {
						$(".wx_imgshowtc").css({
							"height": imgheight,
							"width": ""
						})
					} else {
						var PcHeight = document.body.clientHeight - 100;
						$(".wx_imgshowtc").css({
							"height": PcHeight,
							"width": ""
						})
					}
				}
			});
		} else {
			$(".welcome_user").show().html("请先关闭最小化img资源")
			setTimeout(function() {
				$(".welcome_user").hide().html("")
			}, 1000);
		};

		//图片加载失败
		$(".wx_imgshowtc").error(function() {
			$(".imgPlayer").hide();
			$(".welcome_user").show().html("图片加载失败...")
			setTimeout(function() {
				$(".welcome_user").hide().html("")
			}, 1000);
		});
	};

	// 点击关闭学生上传图片的弹窗
	$scope.closestuimguploadtc = function() {
		closestuimguploadtc();
	}

	function closestuimguploadtc() {
		$(".imgListtc").hide();
	}

	//点击--课堂记录弹窗显示事件
	$scope.classRecorda = function() {
		classRecordEvents();
	};
	//同步--课堂记录弹框显示事件
	function classRecordEvents() {
		$("#drawing").hide(500);
		$(".appcontwindow").show();
		if ($scope.isClass == true) {

			$("#classRecord").addClass("animated flash");
			setTimeout(function() {
				$("#classRecord").removeClass("animated flash");
			}, 1000);
			//查询同步资源列表 
			$http.get(recordIp + "classRecordId=" + $scope.classRecord).success(function(res) {
				$scope.recordList = res.data;
				angular.forEach($scope.recordList, function(item) {
					if (item.name == "自主创题") {
						$scope.chuangtiType = 3;
					}
				});
			});
			$(".recordInfoTc").show().siblings().hide();
		} else {
			if ($scope.isdrawing == false) {
				$(".welcome_user").show().html("请先上课")
				setTimeout(function() {
					$(".welcome_user").hide().html("")
				}, 1000)
			}
		}
	};
	//同步--资源弹框显示事件
	function resouceAdminEvents() {
		$("#drawing").hide(500);
		$(".appcontwindow").show();
		if ($scope.isClass == true) {

			$("#resouceAdmin").addClass("animated flash");
			setTimeout(function() {
				$("#resouceAdmin").removeClass("animated flash");
			}, 1000)

			$scope.restab(0)
			//查询同步资源列表 userId=用户id，非必传参数type=(资源：res, 作业：homework，试题：question)
			$http.get(resourceIp + "/sync?userId=" + $scope.userId + "&type=res").success(function(res) {
				$scope.resourceList = res.data;
			});
			$(".resouceInfoTc").show().siblings().hide();
		} else {
			if ($scope.isdrawing == false) {
				$(".welcome_user").show().html("请先上课")
				setTimeout(function() {
					$(".welcome_user").hide().html("")
				}, 1000)
			}
		}
	};

	//点击--资源管理左侧UL切换
	$scope.restab = function(n) {
		restab(n);
	}
	//同步--资源弹窗左侧UL切换
	function restab(n) {
		$scope.rs = n;
		if (n == 0) {
			$http.get(resourceIp + "/sync?userId=" + $scope.userId + "&type=res").success(function(res) {
				$scope.resourceList = res.data;
			});
		} else if (n == 1) {
			$http.get(resourceIp + "/sync?userId=" + $scope.userId + "&type=homework").success(function(res) {
				$scope.resourceLists = res.data;
			});
		}
	};

	//在线预览资源
	$scope.onlineOffice = function(flieurl, fileType) {
		$(".resoucedetaiTc").show();
	}

	//点击--单个资源查看资源
	$scope.showResoce = function(id, resType) {
		$scope.resdrawId = id;
		resoceWindowShow(id, resType);
	};

	//点击--单个资源查看资源
	$scope.showRecord = function(id) {
		$scope.resRecordId = id;
		console.log($scope.resRecordId)
	};

	//同步--单个资源查看资源
	function resoceWindowShow(id, resType) {
		$scope.fileType = resType
		$http.get(showResourceIp + id).success(function(res) {
			if (res.ret == 200) {
				$scope.downloadUrl = res.result.downloadUrl;
				if (resType == 1 || resType == 8 || resType == 9) { //这是视频
					var VideoMpsrc = res.result.viewURL.pathmp4PC; //mp4播放地址需要单独设置
					var arrVideo = VideoMpsrc.split(":")[3];
					$(".tipsNullcontainer").css({
						"display": "flex"
					});
					$scope.restypehide = false;
					$(".resoucePlayer").show();
					$(".tipsNullcontainer").hide();
					$("#videoplay").attr("src",videoPlay + arrVideo)
				} else if (resType == 2) { //这是音频
					var AudioMpsrc = res.result.viewURL.pathmp3PC; //mp3播放地址需要单独设置
					var arrAudio = AudioMpsrc.split(":")[3];
					$scope.restypehide = false;
					$("#videoplay").attr("src",videoPlay + arrAudio)
					$(".resoucePlayer").show();
				} else if (resType == 3) { //这是图片资源
					$scope.onePic = true;
					if (imgOperation) {
						imgRecordSeeId = id;
						$(".imgPlayer").removeClass("zoomOut")
						$(".imgPlayer").addClass("animated zoomIn")
						$scope.imgresShowtc = $scope.downloadUrl;
						$(".imgPlayer").show();
						//图片加载成功
						$(".wx_imgshowtc").load(function() {
							var imgwidth = $(".wx_imgshowtc")[0].naturalWidth;
							var imgheight = $(".wx_imgshowtc")[0].naturalHeight;
							if (imgwidth > imgheight) { //横着的图
								if (imgwidth < 1300) {
									$(".wx_imgshowtc").css({
										"width": imgwidth,
										"height": ""
									})
								} else {
									$(".wx_imgshowtc").css({
										"width": "100%",
										"height": "calc(100% - 96px);"
									})
								}
							} else if (imgwidth <= imgheight) { //竖着的图
								if (imgheight < 768) {
									$(".wx_imgshowtc").css({
										"height": imgheight - 100,
										"width": ""
									})
								} else {
									var PcHeight = document.body.clientHeight - 100;
									$(".wx_imgshowtc").css({
										"height": PcHeight,
										"width": ""
									})
								}
							}
						});
					} else if (id == imgRecordMinId) {
						judge(maximizationImg);
					} else {
						$(".welcome_user").show().html("请先关闭最小化img资源")
						setTimeout(function() {
							$(".welcome_user").hide().html("")
						}, 1000);
					};


					//图片加载失败
					$(".wx_imgshowtc").error(function() {
						$(".imgPlayer").hide();
						$(".welcome_user").show().html("图片加载失败...")
						setTimeout(function() {
							$(".welcome_user").hide().html("")
						}, 1000);
					});
				} else if (resType == 4) { //PDF文档
					
					
					if (pdfOperation) {
						pdfRecordseeId = id;
						$(".pdfPlayer").show();
						var showPDFsrc = '/pdf?resourceId=' + id;
						$("#showPdfsrc").attr("src", showPDFsrc);
					} else if (id == pdfRecordseeId) {
					
						judge(maximizationpdf);
					
					} else {
						$(".welcome_user").show().html("请先关闭最小化pdf资源")
						setTimeout(function() {
							$(".welcome_user").hide().html("")
						}, 1000);
					};
					
				} else if (resType == 5) { //ppt在线预览
					if (pptOperation) {
						pptRecordseeId = id;
						$(".pptPlayer").show();
						var showPPTsrc = '/ppt?resourceId=' + id;
						$("#showPPTsrc").attr("src", showPPTsrc);
					} else if (id == pptRecordMinId) {

						judge(maximizationPpt);

					} else {
						$(".welcome_user").show().html("请先关闭最小化ppt资源")
						setTimeout(function() {
							$(".welcome_user").hide().html("")
						}, 1000);
					};


				} else if (resType == 6) { //word在线预览
					if (wordOperation) {
						wordRecordseeId = id;
						$(".wordPlayer").show();
						var showWordsrc = '/word?resourceId=' + id;
						$("#showWordsrc").attr("src", showWordsrc);
					} else if (id == wordRecordMinId) {

						judge(maximizationWord);

					} else {
						$(".welcome_user").show().html("请先关闭最小化word资源")
						setTimeout(function() {
							$(".welcome_user").hide().html("")
						}, 1000);
					};

				} else if (resType == 7) { //excel在线预览
					if (excelOperation) {
						excelRecordseeId = id;
						$(".excelPlayer").show();
						var showExcelsrc = '/excel?resourceId=' + id;
						$("#showExcelsrc").attr("src", showExcelsrc);
					} else if (id == excelRecordMinId) {

						judge(maximizationExcel);

					} else {
						$(".welcome_user").show().html("请先关闭最小化excel资源")
						setTimeout(function() {
							$(".welcome_user").hide().html("")
						}, 1000);
					};


				} else {
					$scope.resImg = res.result.viewURL.readfileList;
					$scope.restypehide = true;
					if ($scope.resImg.length == "0") {
						$(".welcome_user").show().html("资源为空")
						setTimeout(function() {
							$(".welcome_user").hide().html("")
						}, 1000);
						return false;
					} else {
						$scope.drawclick();
					}
				}
			} else {
				$(".welcome_user").show().html("获取资源信息出错")
				setTimeout(function() {
					$(".welcome_user").hide().html("")
				}, 1000);
				$scope.downloadUrl = "";
			}
		})
	};
	$("#pptMinimize").click(function() {
		minimizePpt();
	});
	$("body").on("click", "#pptMax", function() {
		judge(maximizationPpt);
	});

	function minimizePpt() { //最小化资源
		$(".pptPlayer").hide();
		pptRecordMinId = pptRecordseeId;
		if ($("#pptMax").length == 0) {
			$(".dockposition .icons").append(
				"<div  class='icon' id='pptMax'><i class='iconfont icon-quanping'></i><div class='title'>ppt</div></div>");
		};
		pptOperation = false;
	};

	function maximizationPpt() { //最大化资源

		$(".pptPlayer").show();
		$("#pptMax").remove();
		pptOperation = true;
	};

	$("#wordMinimize").click(function() {
		minimizeWord();
	});
	$("body").on("click", "#wordMax", function() {
		judge(maximizationWord);
	});

	function minimizeWord() { //最小化资源
		$(".wordPlayer").hide();
		wordRecordMinId = wordRecordseeId;
		if ($("#wordMax").length == 0) {
			$(".dockposition .icons").append(
				"<div  class='icon' id='wordMax'><i class='iconfont icon-quanping'></i><div class='title'>word</div></div>");
		};

		wordOperation = false;
	};

	function maximizationWord() { //最大化资源
		$(".wordPlayer").show();
		$("#wordMax").remove();
		wordOperation = true;
	};
	$("#excelMinimize").click(function() {
		minimizeExcel();
	});
	$("body").on("click", "#excelMax", function() {

		judge(maximizationExcel);

	});

	function minimizeExcel() { //最小化资源
		$(".excelPlayer").hide();
		excelRecordMinId = excelRecordseeId;
		if ($("#excelMax").length == 0) {
			$(".dockposition .icons").append(
				"<div class='icon' id='excelMax'><i class='iconfont icon-quanping'></i><div class='title'>excel</div></div>");
		};
		excelOperation = false;
	};

	function maximizationExcel() { //最大化资源
		$(".excelPlayer").show();
		$("#excelMax").remove();
		excelOperation = true;
	};

	function judge(fun) {
		if ($(".player:visible").length == 0) {
			fun();
		} else {
			$(".welcome_user").show().html("请先关闭或者最小化当前正在阅览的资源文件，才能阅览！")
			setTimeout(function() {
				$(".welcome_user").hide(500).html("")
			}, 1000);
		};
	};
	
	
	$("#imgMinimize").click(function() {
		minimizeImg();
	});
	$("body").on("click", "#imgMax", function() {
		judge(maximizationImg);
	});

	function minimizeImg() { //最小化资源
		$(".imgPlayer").hide();
		imgRecordMinId = imgRecordSeeId;
		if ($("#imgMax").length == 0) {
			$(".dockposition .icons").append(
				"<div  class='icon' id='imgMax'><i class='iconfont icon-quanping'></i><div class='title'>img</div></div>");
		};
		imgOperation = false;
	};

	function maximizationImg() { //最大化资源
		$(".imgPlayer").show();
		$("#imgMax").remove();
		imgOperation = true;
	};
	
	// pdf最大化最小化
	$("#pdfMinimize").click(function() {
		minimizepdf();
	});
	$("body").on("click", "#pdfMax", function() {
		judge(maximizationpdf);
	});
	
	function minimizepdf() { //最小化资源
		$(".pdfPlayer").hide();
		pdfRecordMinId = pdfRecordSeeId;
		if ($("#pdfMax").length == 0) {
			$(".dockposition .icons").append(
				"<div  class='icon' id='pdfMax'><i class='iconfont icon-quanping'></i><div class='title'>pdf</div></div>");
		};
		pdfOperation = false;
	};
	
	function maximizationpdf() { //最大化资源
		$(".pdfPlayer").show();
		$("#pdfMax").remove();
		pdfOperation = true;
	};
	
	
	//-------------------

	function maximizationWhiteboard() { //最大化资源
		$("#drawing").show();
		$("#whiteboardMax").remove();
		whiteboardOperation = true;
	};

	$("#testMinimize").click(function() {
		minimizeTest();
	});
	$("#shiTiMinimize").click(function() { //云试题最小化
		minimizeTest();
	});
	
	$("#shiTiMinimize2").click(function() { //拍照试题最小化
		minimizeTest2();
	});
	
	$("body").on("click", "#testMax", function() {
		judge(maximizationTest);
	});
	
	$("body").on("click", "#testMax2", function() {
		judge(maximizationTest2);
	});

	function minimizeTest() { //最小化资源
		$(".resoucedetaiTc").hide();
		testRecordMinId = testRecordSeeId;
		if ($("#testMax").length == 0) {
			$(".dockposition .icons").append(
				"<div  class='icon' id='testMax'><i class='iconfont icon-quanping'></i><div class='title'>云试题</div></div>");
		};
		testOperation = false;
	};
	
	function minimizeTest2() { //最小化拍照创题
		$(".showShiti").hide();
		testRecordMinId2 = testRecordSeeId2;
		if ($("#testMax2").length == 0) {
			$(".dockposition .icons").append(
				"<div  class='icon' id='testMax2'><i class='iconfont icon-quanping'></i><div class='title'>拍照创题</div></div>");
		};
		testOperation2 = false;
	};

	function maximizationTest() { //最大化资源
		$(".resoucedetaiTc").show();
		$("#testMax").remove();
		testOperation = true;
	};
	
	function maximizationTest2() { //最大化资源
		$(".showShiti").show();
		$("#testMax2").remove();
		testOperation2 = true;
	};

	// 抢答小工具点击
	$scope.qiangdaBtn = function() {
		qiangdaBtn()
	}

	function qiangdaBtn() {
		$(".qiangda").show();
		$scope.qiangdaBegintrue = true;
		$scope.qiangdastoptrue = false;
		$(".box_foot ").html("开始抢答")
		$("#moreTools").hide();
		$(".box_foot").html("开始抢答");
		toolsHide();
	}

	$scope.closeqiangda = function() {
		closeqiangda()
	}

	function closeqiangda() {
		$(".qiangda").hide();
		qiangdastop()
	}

	$("#zuoxuanzhuan").click(function() {
		zuoxuanzhuan();
	});

	var rotatenumclick = 1

	function zuoxuanzhuan() {
		var rotatenum = 90 * rotatenumclick + 'deg';
		rotatenumclick++
		$("#wx_imgshowtc").css("transform", 'rotate(' + rotatenum + ')');
	};

	$("#big").click(function() {
		imgChange("big");
	});
	$("#small").click(function() {
		imgChange("small")
	});
	$("#left").click(function() {
		displacement("left");
	});
	$("#right").click(function() {
		displacement("right");
	});
	$("#top").click(function() {
		displacement("top");
	});
	$("#bottom").click(function() {
		displacement("bottom");
	});

	function displacement(direction) { //图片移动
		if (direction == "left") {
			crosswise += -40;
		} else if (direction == "right") {
			crosswise += 40;
		} else if (direction == "top") {
			lengthways += -40;
		} else if (direction == "bottom") {
			lengthways += 40;
		};
		$("#wx_imgshowtc").css("margin-left", crosswise + "px");
		$("#wx_imgshowtc").css("margin-top", lengthways + "px");

	};

	function imgChange(num) { //缩放图片
		if (num == "big") {
			imgZoomRate += 0.2;
		} else if (num == "small" && imgZoomRate >= 0.4) {
			imgZoomRate += -0.2;
		};
		$(".wx_transform").css("transform", 'scale(' + imgZoomRate + ')');
	};

	// 点击关闭ppt弹窗
	$scope.closePpttc = function(ele) {
		closePpttc(ele);
	}
	//同步--关闭ppt弹窗
	function closePpttc(ele) {
		$(".annotationFrame").hide();
		$(ele).hide();
	}

	// 点击关闭pdf弹窗
	$scope.closePdftc = function(ele) {
		closePpttc(ele);
	}
	//同步--关闭pdf弹窗
	function closePdftc(ele) {
		$(".pdfPlayer").hide();
		$(ele).hide();
	}
	//点击--关闭播放器弹窗
	$scope.closeresdetail = function() {
		closeResdetail();
	};
	//同步--关闭播放器弹窗
	function closeResdetail() {
		var playVideo = document.getElementById("videoplay");
		playVideo.pause();
		playVideo.src=''
		// player.videoPause();
		$(".resoucePlayer").hide();
		// player.videoClear();
	}
	
	//点击--关闭展台播放器弹窗
	$scope.closezhantaidetail = function() {
		closezhantaidetail();
	};
	//同步--关闭展台播放器弹窗
	function closezhantaidetail() {
		$(".zhantai").hide();
		$("#remoteVideosContainer").empty();
	}

	//点击--关闭资源图片展示弹窗
	$scope.closeimgtc = function() {
		closeimgtc();
	};
	//同步--关闭图片展示弹窗
	function closeimgtc() {
		$(".imgPlayer").removeClass("zoomIn")
		$(".imgPlayer").addClass("zoomOut")
		$(".imgPlayer").hide(1000);
		imgZoomRate = 1;
		crosswise = 0;
		lengthways = 0;
		rotatenumclick = 1;
		$(".wx_transform").css("transform", 'scale(' + imgZoomRate + ')');
		$("#wx_imgshowtc").css("margin-left", crosswise + "px");
		$("#wx_imgshowtc").css("margin-top", lengthways + "px");
		$("#wx_imgshowtc").css("transform", 'rotate(0)');
		$("#wx_imgshowtc").css("height", "auto");
		$("#wx_imgshowtc").css("width", "auto");
		$scope.noduibi = true;
	};

	//点击--关闭选择打开画板还是本地打开选项弹窗
	$scope.closeshowType = function() {
		closeshowType();
	}
	//同步--关闭选择打开画板还是本地打开选项弹窗
	function closeshowType() {
		$(".resouceTctips").hide();
	};

	//点击--试题调出资源使用方法弹窗
	$scope.showResoceshiti = function(id, downloadUrl, resType, name) {
		showresshitiwindow(id, downloadUrl, resType, name);
	};
	//点击--调出教师下发word或pic弹窗
	$scope.showclassRecord = function(id, resourceId, resourceurl, type, name) {
		showclassrecordwindow(id, resourceId, resourceurl, type, name);
	};
	//同步--调出教师下发word或pic弹窗
	function showclassrecordwindow(id, resourceId, resourceurl, type, name) {

		$(".recorddetaiTc").show();
		$("#mlh_imgshowtc").show();
		$scope.recordUrl = resourceurl;
		$scope.stuRecordId = id;
		$scope.resourceId = resourceId;
		$scope.recordType = type;
		$scope.shijuanType = name;
		if (name == "自主创题") {
			$scope.questionsType = 3;
		} else {
			$scope.questionsType = 1;
		};


		if ($scope.recordType == 1) {
			$http.get(resourceIp + '/teacher/import/getQuestionInfo.do?hid=' + $scope.resourceId).success(
				function(res) {
					$(".mlh_shitishowtc").show();
					// $("#mlh_imgshowtc").hide();
					$scope.recordoptionshow = res.data.data;
					$scope.tishuliang = res.data.total;
					$scope.optionlist = res.data.data.option;
					$scope.totalsubject = res.data.total;
					$scope.anseer = res.data.answer;

				});
				
				//通过班级id获取班级的学生列表
				$http.get(jeucIp + '/uc/user?classId=' + $scope.classId + '&userType=2&state=1&delFlag=0&orderBy=2').success(
					function(res) {
						$scope.classStudents = res.data.list;
						$http.get(kezhongIp + '/getAnsweredUser?sendRecordId=' + $scope.stuRecordId + '&type=' + $scope.recordType).success(
							function(res) {
				
								$scope.StuAnswerList = res.data; //获取答题学生的名单
							});
					});
				
				
		} else {
			$("#mlh_imgshowtc").show();
			$(".mlh_shitishowtc").hide();
			$scope.recordUrl = resourceurl;
			teacherImg = resourceurl;
			//通过班级id获取班级的学生列表
			$http.get(jeucIp + '/uc/user?classId=' + $scope.classId + '&userType=2&state=1&delFlag=0&orderBy=2').success(
				function(res) {
					$scope.classStudents = res.data.list;
					$http.get(kezhongIp + '/getAnsweredUser?sendRecordId=' + $scope.stuRecordId + '&type=1').success(
						function(res) {
			
							$scope.StuAnswerList = res.data; //获取答题学生的名单
						});
				});
		}
		
	};
	//点击每个学生显示回传内容
	$scope.classRcordstu = function(id, name) {
		classRcordstu(id, name)
	};

	function classRcordstu(id, name) {
		$scope.answerShow = true;
		$('.stuAnswer').show();
		$scope.stuId = id;
		$scope.stuName = name;
		if ($scope.recordType == 1 || $scope.chuangtiType == 3) {
			$http.get(kezhongIp + '/getUserAnswer?recordId=' + $scope.stuRecordId + '&userId=' + $scope.stuId).success(
				function(
					res) {
					$scope.Stuanswers = res.data;

				});
		} else {
			$http.get(recordimgIp + 'stuId=' + $scope.stuId + '&classRecordId=' + $scope.classRecord + "&id=" + $scope.stuRecordId)
				.success(function(
					res) {
					if (res.data.length > 0) {
						$scope.recordUrl = res.data[0].resourceUrl;
					} else {
						$scope.recordUrl = teacherImg;
					};
				});
		}
	};

	//同步--查看学生答题详情课堂记录
	function studentScoreRcordwindow(id, studentName) {
		//判断头像是否亮着
		$scope.currentstrname = studentName;
		$(".getclassRcordTc").show();
		$scope.stuId = id;
		$http.get(kezhongIp + '/getUserAnswer?recordId=' + $scope.recordId + '&userId=' + $scope.stuId).success(function(
			res) {
			$scope.answers = res.data;
			$scope.studentFraction = 0;
			angular.forEach($scope.answers, function(item) {
				$scope.studentFraction += item.result * 1;
			});
		});
	};
	//同步--试题调出资源使用方法弹窗
	function showresshitiwindow(id, downloadUrl, resType, name) {
		$scope.shijuanType = name;

		if (testOperation) {
			testRecordSeeId = id;
			$scope.resourceName = name;
			$scope.resourceId = id;
			$scope.restypehide = false;
			$(".resoucedetaiTc").show();
			$scope.questionIndex = 0;
			// 通过接口查询题号的答案和内容
			$http.get(resourceIp + '/teacher/import/getQuestionInfo.do?hid=' + $scope.resourceId).success(function(res) {
				if (res.ret == "200") {
					$scope.optionshow = res.data.data;
					$scope.tishuliang = res.data.total;
					$scope.optionlist = res.data.data.option;
					$scope.totalsubject = res.data.total;
					$scope.anseer = res.data.answer;
				} else {
					$(".welcome_user").show().html(res.message)
					setTimeout(function() {
						$(".welcome_user").hide(500).html("")
					}, 1000);
				}
			});

			//通过班级id获取班级的学生列表
			$http.get(jeucIp + '/uc/user?classId=' + $scope.classId + '&userType=2&state=1&delFlag=0&orderBy=2').success(
				function(res) {
					$scope.students = res.data.list;
				});

		} else if (id == testRecordMinId) {

			judge(maximizationTest);

		} else {
			$(".welcome_user").show().html("请先关闭最小化试题")
			setTimeout(function() {
				$(".welcome_user").hide().html("")
			}, 1000);
		};

	};

	//点击--关闭下发试题弹窗
	$scope.closeshitiwindow = function() {
		resshiticlose();
	};
	//点击--关闭课堂记录试题弹窗
	$scope.closerecordwindow = function() {
		recordshiticlose();
	};
	//同步--关闭下发试题弹窗
	function recordshiticlose() {
		$scope.answerShow = false;
		$(".recorddetaiTc").hide();
		$scope.stuName = "";

	};
	//同步--关闭下发试题弹窗
	function resshiticlose() {
		$(".annotationFrame").hide();
		var hasbtn = $(".jieshudati").hasClass("wx_disable")
		if (hasbtn == false) {
			$(".testSinOut").show();
		} else {
			sureStopanser()
		}
	};

	$scope.sureStopanser = function() {
		sureStopanser();
	}

	function sureStopanser() {
		$scope.lowerHair = false;
		$(".jieshudati").attr("disabled", true);
		$(".xiafashiti").attr("disabled", false);
		$(".xiafashiti").removeClass("wx_disable");
		$(".jieshudati").addClass("wx_disable");
		clearInterval(ansertime);
		jieshudatile = true;

		$(".testSinOut").hide();
		$scope.students = [];
		$scope.shiTistudents = [];
		$(".chengyuanlist").addClass("opacity");
		$(".removestring").parent().addClass("opacity");
		$(".resoucedetaiTc").hide();
		$(".showShiti").hide();
		Hidestrlist();
		jieshudatile = false;
	}

	// 取消确认退出弹窗
	$scope.closeSinOutWindow = function() {
		closeSinOutWindow()
	}

	function closeSinOutWindow() {
		$(".testSinOut").hide();
	}

	//点击--下发试题
	$scope.xiafahomework = function(type) {
		xiafashiti(type);
	};

	//同步--下发试题
	function xiafashiti(type) {
		$scope.ShiTiType = type + "";
		$scope.lowerHair = true;
		$scope.questionsType = type;
		$scope.lowerHairNum++
		if (type == 1) {
			$http.get(resourceIp + '/teacher/import/getQuestionInfo.do?hid=' + $scope.resourceId).success(

				function(res) {
					if (res.ret == 200) {
						$(".chengyuanlist").addClass("opacity");
						$scope.answer = res.data.data; //这个是后台返回的下发资源生成的id
						$scope.ticount = res.data.count;
						$scope.titotal = res.data.total;
						xiafanum++
						if (xiafanum > 0) {
							$(".xiafashiti").attr("disabled", true);
							$(".jieshudati").attr("disabled", false);
							$(".jieshudati").removeClass("wx_disable");
							$(".xiafashiti").addClass("wx_disable");
						};
						$scope.userList = []

						for (var i = 0; i < $scope.remember.length; i++) {
							var studentobj = {}
							studentobj.userId = $scope.remember[i].id;
							studentobj.deviceName = $scope.remember[i].deviceName;
							studentobj.realname = $scope.remember[i].realname;
							$scope.userList.push(studentobj)
						};

						$scope.teacherId = sessionStorage.getItem("userId") + ''; //老师id
						//学生列表
						var jsondata = {
							'resourceId': $scope.resourceId,
							'resourceUrl': "",
							'teacherId': $scope.teacherId + "",
							'userList': $scope.userList,
							"answer": $scope.answer,
							"type": $scope.ShiTiType,
							"classRecordId": $scope.classRecord,
							"resourceName": $scope.resourceName,
							"ticount": $scope.ticount,
							"titotal": $scope.titotal
						};
						var stringjsondata = JSON.stringify(jsondata);
						$http.post(kezhongIp + '/sendRecord', stringjsondata).success(function(res) {
							if (res.ret == "200") {
								$scope.recordId = res.data; //这个是后台返回的下发资源生成的id
								socket.emit('jeic', {
									'name': "recordId",
									'data': res.data
								});

								beginansershiti(type);
							}
						});
					}
				})
		} else if (type == 3) {
			$(".chengyuanlist").addClass("opacity");
			xiafanum++
			if (xiafanum > 0) {
				$(".xiafashiti").attr("disabled", true);
				$(".jieshudati").attr("disabled", false);
				$(".jieshudati").removeClass("wx_disable");
				$(".xiafashiti").addClass("wx_disable");
			};
			$scope.userList = []
			for (var i = 0; i < $scope.remember.length; i++) {
				var studentobj = {}
				studentobj.userId = $scope.remember[i].id;
				studentobj.deviceName = $scope.remember[i].deviceName;
				studentobj.realname = $scope.remember[i].realname;
				$scope.userList.push(studentobj)
			};

			$scope.teacherId = sessionStorage.getItem("userId") + ''; //老师id
			//学生列表
			var jsondata = {
				'resourceId': "",
				'resourceUrl': $scope.imgShitiShowtc,
				'teacherId': $scope.teacherId + "",
				'userList': $scope.userList,
				"answer": $scope.paizhaoanswer,
				"type": "3",
				"classRecordId": $scope.classRecord,
				"resourceName": "自主创题"
			};
			var stringjsondata = JSON.stringify(jsondata);
			$http.post(kezhongIp + '/sendRecord', stringjsondata).success(function(res) {
				if (res.ret == "200") {
					$scope.recordId = res.data; //这个是后台返回的下发资源生成的id
					socket.emit('jeic', {
						'name': "recordId",
						'data': res.data
					});
					beginansershiti(type);
				}
			});
		}

	};

	//同步--开始答题
	function beginansershiti(type) {

		//根据答题的资源id获取学生答题数据  轮询方式
		$scope.strdev = []
		//开始答题
		ansertime = setInterval(function() {
			$http.get(kezhongIp + '/getAnsweredList').success(function(res) {
				$scope.strdev = res.data;
				if (res.ret == 200) {
					$scope.strdev = res.data;
					socket.emit('jeic', {
						'name': "dati",
						'data': res.data
					});
				}
			});
			if (type == 1) {
				for (var i = 0; i < $scope.students.length - 1; i++) {
					if ($scope.strdev.indexOf($scope.students[i].deviceName) != -1) {
						$scope.students.push($scope.students[i]);
						$scope.students.splice(i, 1);
						$scope.$apply();
					};
				};
			} else if (type == 3) {
				for (var i = 0; i < $scope.shiTistudents.length - 1; i++) {
					if ($scope.strdev.indexOf($scope.shiTistudents[i].deviceName) != -1) {
						$scope.shiTistudents.push($scope.shiTistudents[i]);
						$scope.shiTistudents.splice(i, 1);
						$scope.$apply();
					};
				};
			};
			$(".removestring").parent().removeClass("opacity");
		}, 2500);
	};

	//点击--结束答题
	$scope.stopanser = function() {
		stopansershiti();
	};

	//同步--结束答题
	function stopansershiti() {
		$scope.lowerHair = false;
		$(".jieshudati").attr("disabled", true);
		$(".xiafashiti").attr("disabled", false);
		$(".xiafashiti").removeClass("wx_disable");
		$(".jieshudati").addClass("wx_disable");
		clearInterval(ansertime);
		jieshudatile = true;
		$(".tipsNullcontainer").css({
			"display": "flex"
		});
		$(".tipData").html("答题数据上传中，请稍等... ...")
		$http.get(kezhongIp + '/insertAnswer?recordId=' + $scope.recordId).success(function(res) {
			$(".tipsNullcontainer").hide();
			$(".tipData").html("")
			socket.emit('jeic', {
				"name": 'canCheck'
			});
			$scope.strdev = res.data;
			if (res.ret == 200) {}
		}).error(function() {
			$(".tipsNullcontainer").hide();
			socket.emit('jeic', {
				"name": 'canCheck'
			});
		})
	};

	//点击--查看学生答题详情
	$scope.watchStudetail = function(event, id) {

		if ($scope.lowerHair == false) {
			var Answered = angular.element(event.target).hasClass("opacity");
			$scope.studentName = angular.element(event.target).attr('studentname');
			if (Answered == false) { // 如果学生已经答题，头像变亮
				studentScorewindow(id, $scope.studentName);
			} else {
				$(".welcome_user").show().html($scope.studentName + " 未答题")
				setTimeout(function() {
					$(".welcome_user").hide(500).html("")
				}, 1000);
			}
		} else {
			$(".welcome_user").show().html("请先结束答题再查看")
			setTimeout(function() {
				$(".welcome_user").hide(500).html("")
			}, 1000);
		}
	};
	//同步--查看学生答题详情
	function studentScorewindow(id, studentName) {
		//判断头像是否亮着
		$scope.currentstrname = studentName;
		$(".getscoreAdminTc").show();
		$scope.stuId = id;
		$http.get(kezhongIp + '/getUserAnswer?recordId=' + $scope.recordId + '&userId=' + $scope.stuId).success(function(
			res) {
			$scope.answers = res.data;

		});
	};

	//点击--关闭学生分数详情弹窗
	$scope.closestrscroce = function() {
		closestrscrocewindow();
	};
	//同步--关闭学生分数详情弹窗
	function closestrscrocewindow() {
		$(".getscoreAdminTc").hide();
		//		$(".getrcordAdminTc").hide();
	};

	//同步--切换学生答题情况和班级答题情况
	function datiqiehuan(n) {
		$scope.switchscore = n;
		if (n == 0) {
			$http.get(kezhongIp + '/getUserAnswer?recordId=' + $scope.recordId + '&userId=' + $scope.stuId).success(function(
				res) {
				$scope.answers = res.data;

			});
		}
	};

	//点击--返回主页
	$scope.backhome = function() {
		backHomeEvents();
	};
	//同步--返回主页事件
	function backHomeEvents() {
		$(".dockposition").css({
			"z-index": "666"
		});
		$("#drawing").hide(500);
		$("#drawtwo").html("");
		//$(".appcontwindow").hide(500);
		$scope.isdrawing = false;
		$("#backhome").addClass("animated flash");
		setTimeout(function() {
			$("#backhome").removeClass("animated flash");
		}, 1000)
	};

	//点击--调出画板
	$scope.drawclick = function() {

		$scope.iframesrc = "/draw?userId=" + $scope.userId + '&resourceId=' + $scope.resdrawId + '&filetype=' + $scope.fileType;
		//$scope.iframesrc = "/draw"
		drawEvents($scope.iframesrc);

	};
	//同步--画板事件
	function drawEvents(huabansrc) {
		$(".dockposition").css({
			"z-index": "0"
		});
		if (!$("#drawtwo").find("iframe").length) {
			$scope.iframesrc = huabansrc;
			$("#drawtwo").append('<iframe id="iframeuser" src="' + $scope.iframesrc + '"></iframe>');
		};
		setTimeout(function() {
			$("#drawing").show(500)
			$scope.isdrawing = true;
		}, 800);
		$("#drawclick").addClass("animated flash");
		setTimeout(function() {
			$("#drawclick").removeClass("animated flash");
		}, 1000)
	};

	//点击--关闭班级分数详情弹窗
	$scope.closebanjiscroce = function() {
		closebanjiscroce()
	};

	//同步--关闭班级分数详情弹窗
	function closebanjiscroce() {
		$(".getClasstjtc").hide();
		//		$(".recordgetClasstjtc").hide();
		banjibaifenbi = [];
		tishuliangnum = [];
		$scope.averagelv = 0;
		$(".paichangetable").hide();
		$(".paichange").show();
		$(".studentDatirenshu").hide();
		$(".getClasstjtc .menberight").show();
		//		$(".recordgetClasstjtc .menberight").show();
		$("#switchPai").removeClass("huangsebtn");
		$("#switchPai").html("查看表格");
	};

	$scope.Tnum = "";
	//题号弹窗显示
	$scope.showTihao = function(Tnum) {
		$scope.Tnum = Tnum;
		showTihao($scope.banjiansers[$scope.Tnum].datamark);
	};
	$scope.prevQuestionStatistics = function() {
		$scope.Tnum--;
		showTihao($scope.banjiansers[$scope.Tnum].datamark);
		$(".wx_selectkuang").hide();
	};
	$scope.nextQuestionStatistics = function() {
		$scope.Tnum++;
		showTihao($scope.banjiansers[$scope.Tnum].datamark);
		$(".wx_selectkuang").hide();

	};

	//点击班级答题情况弹窗出现
	$scope.banjitczhutu = function(text) {

		zhutuxianshi(text)
	};
	$scope.averagelv = 0;

	function compare(property) { //排序
		return function(a, b) {
			var value1 = a[property];
			var value2 = b[property];
			return value1 - value2;
		}
	};
	$scope.sortBytrue = function() { //通过错误人数排序
		$scope.banjiansers.sort(compare('trueCount'));
	};
	$scope.sortBydatamark = function() { //通过题号排序
		$scope.banjiansers.sort(compare('datamark'));
	};

	//点击班级答题情况弹窗出现-同步
	function zhutuxianshi(text) {
		if (text == 'yidati') {
			jieshudatile = true;
			$scope.recordId = $scope.stuRecordId;
		}
		if (jieshudatile == true) {
			$(".getClasstjtc").show();
			//柱状图
			var myChart = echarts.init(document.getElementById('container2'));
			// 获取答题人数
			$http.get(kezhongIp + '/getDataGroupByUser?recordId=' + $scope.recordId).success(function(res) {
				$scope.yidatinum = res.data.haveTheAnswerCount;
				$scope.weidatinum = res.data.notTheAnswerCount;
			});

			//获取答题数据
			$http.get(kezhongIp + '/getAnswerByRecordId?recordId=' + $scope.recordId).success(function(res) {
				$scope.banjiansers = res.data;

				$scope.chushu = res.data.length
				for (var i = 0; i < res.data.length; i++) {
					banjibaifenbi.push(res.data[i].accuracy * 100);
					tishuliangnum.push(i + 1 + "题")
					$scope.averagelv = $scope.averagelv + res.data[i].accuracy
				}
				$scope.averagelv2 = parseFloat($scope.averagelv * 100 / $scope.chushu).toFixed(2)
				option.xAxis.data = tishuliangnum;
				option.series[0].data = banjibaifenbi;
				myChart.setOption(option, true);
				myChart.on('click', function(params) {

					showTihao(params.dataIndex + 1);
					$scope.Tnum = params.dataIndex;
				});


			});
		} else {
			$(".welcome_user").show().html("请先答题")
			setTimeout(function() {
				$(".welcome_user").hide(500).html("")
			}, 1000)
		}
	}

	//图表返回按钮
	$(".fanhuipai").on("click", function() {
		fanhuiInfo()
	});

	function fanhuiInfo() {
		$(".studentDatirenshu").hide();
		$(".getClasstjtc .menberight").show();
		$(".wx_selectkuang").hide();
	}

	//切换btn柱状图的班级图表
	$("#switchPai").click(function() {
		if ($(this).hasClass("huangsebtn")) {
			$(".paichange").show();
			$(".paichangetable").hide();
			$(this).removeClass("huangsebtn");
			$(this).html("查看表格");
		} else {
			$(".paichangetable").show()
			$(".paichange").hide();
			$(this).addClass("huangsebtn");
			$(this).html("查看图表");
		};

	});
	$("#recordswitchPai").click(function() {
		if ($(this).hasClass("huangsebtn")) {
			$(".paichange").show();
			$(".paichangetable").hide();
			$(this).removeClass("huangsebtn");
			$(this).html("查看表格");
		} else {
			$(".paichangetable").show()
			$(".paichange").hide();
			$(this).addClass("huangsebtn");
			$(this).html("查看图表");

		};

	});


	$("#studentResultbtn").click(function() { //查看学生作答详情
		studentResultPopupShow();
	});

	function studentResultPopupShow() {
		$(".studentResultPopup").show();
		$http.get("http://localhost:8081/sunvote/getDataGroupByUser?recordId=" + $scope.recordId).success(function(data) {
			if (data.ret == 200) {
				angular.forEach(data.data.answerResultList, function(item, index) {
					ratio = parseFloat(item.accuracy * 100).toFixed(2);
					console.log(ratio)
					if (0 <= ratio && ratio < 20) {
						item.star = 0;
					} else if (20 <= ratio && ratio < 40) {

						item.star = 1;
					} else if (40 <= ratio && ratio < 60) {
						item.star = 2;
					} else if (60 <= ratio && ratio < 80) {
						item.star = 3;
					} else if (80 <= ratio && ratio < 100) {
						item.star = 4;
					} else if (ratio == 100) {
						item.star = 5;
					};

					item.ratio = ratio + "%";
					console.log(item.star)
				});
				$scope.studentResultData = data.data.answerResultList;
				console.log($scope.studentResultData)
			};

		});

	};





	$(".studentResultPopup .closefullscreen").click(function() { //关闭学生作答详情

		$(".studentResultPopup").hide();

	});




	option = {
		title: {
			text: '正确率统计图表',
			textStyle: {
				fontWeight: 'bold', //标题颜色
				color: '#eee',
				fontSize: 20
			},
			subtext: '',
			x: 'center'
		},
		xAxis: {
			type: 'category',
			data: tishuliangnum,
			axisLabel: {
				show: true,
				rotate: 45,
				textStyle: {
					color: '#eee',
					fontSize: 24
				},

			}
		},
		yAxis: {
			type: 'value',
			axisLabel: {
				formatter: '{value}%',
				textStyle: {
					color: '#eee',
					fontSize: 30
				}
			}
		},
		series: [{
			data: banjibaifenbi,
			type: 'bar',
			itemStyle: {
				normal: {
					color: '#78B1E8',
					label: {
						show: false, //开启显示
						position: 'top', //在上方显示
						textStyle: { //数值样式
							color: '#fff',
							fontSize: 26
						}
					}
				}
			},
		}]
	};

	// 指定图表的配置项和数据
	var option2 = {
		title: {
			text: ''
		},
		tooltip: {},
		xAxis: {

			triggerEvent: true,
			axisTick: {
				alignWithLabel: true //坐标值是否在刻度中间
			},
			axisLabel: {
				show: true,
				textStyle: {
					color: '#e5e5e5',
					fontSize: 30
				}
			}
		},
		yAxis: {
			minInterval: 1, //y轴显示整数
			axisLabel: {
				show: true,
				formatter: '{value}人',
				textStyle: {
					color: '#e5e5e5',
					fontSize: 26
				}
			}
		},
		series: {
			name: '选项',
			type: 'bar',
			data: tihaorenshu,
			itemStyle: {
				normal: {
					color: function(params) {
						var colorList = ['#78b1e7'];
						//若返回的list长度不足，不足部分自动显示为最后一个颜色
						return colorList[params.dataIndex]
					},
					label: {
						show: false,
						position: 'top'
					},
					textStyle: { //数值样式
						color: '#fff',
						fontSize: 26
					}
				}
			}
		}
	};

	$scope.changeSelectxx = "";

	function showTihao(Tnum) {
		$(".studentDatirenshu").show();

		$(".getClasstjtc .menberight").hide();
		//通过接口查询题号的答案和内容
		if ($scope.questionsType == 1) {

			$http.get(resourceIp + '/teacher/import/getQuestionInfo.do?hid=' + $scope.resourceId + '&sort=' + Tnum).success(function(res) {
					$scope.tioption = res.data.data[0].option;
					$scope.shitidaanLength = [];
					for (var i = 0; i < res.data.data[0].option.length; i++) {
						if (res.data.data[0].option[i].text != "") {
							$scope.shitidaanLength.push(res.data.data[0].option[i]);
						};
					};
					
					$scope.answerOption=[];

					switch ($scope.shitidaanLength.length) {
						case 0:
							$scope.answerOption = ["YES", "NO"];
							break;
						case 1:
							$scope.answerOption = ["A"];
							break;
						case 2:
							$scope.answerOption = ["A", "B"];
							break;
						case 3:
							$scope.answerOption = ["A", "B", "C"];
							break;
						case 4:
							$scope.answerOption = ["A", "B", "C", "D"];
							break;
						case 5:
							$scope.answerOption = ["A", "B", "C", "D","E"];
							break;
						case 6:
							$scope.answerOption = ["A", "B", "C", "D","E","F"];
							break;
						case 7:
							$scope.answerOption = ["A", "B", "C", "D","E","F","G"];
							break;
						case 8:
							$scope.answerOption = ["A", "B", "C", "D","E","F","G","H"];
							break;
						case 9:
							$scope.answerOption = ["A", "B", "C", "D","E","F","G","H","I"];
							break;
						case 10:
							$scope.answerOption = ["A", "B", "C", "D","E","F","G","H","I","J"];
							break;
					};

					
					
					var tihaohtml = "第" + Tnum + "题";
					$(".tiganhtml").html(res.data.data[0].body)
					$scope.titype = res.data.data[0].type;
					$scope.anseer = res.data.answer;
					$(".switchingQuestions span").html(tihaohtml);
					//通过接口查询学生答题选项
					$http.get(kezhongIp + '/getDataByQuestionId?recordId=' + $scope.recordId + '&datamark=' + Tnum).success(
						function(
							res) {
							$scope.trueCount = res.data.trueCount; //正确人数
							$scope.falseCount = res.data.falseCount; //错误人数
							$scope.nullCount = res.data.nullCount; //未答题人数
							$scope.optionNu = res.data.optionNu;//答案数量
							
							tihaorenshu=[];
							
							if (res.data.type != "1") {
								if($scope.optionNu==1){
									$scope.AcountNum = res.data.optionInfo.optionA.countA;
									$scope.aslectnum = res.data.optionInfo.optionA.userListOptionA;
									tihaorenshu[0] = $scope.AcountNum;
								}else if($scope.optionNu==2){
									$scope.AcountNum = res.data.optionInfo.optionA.countA;
									$scope.aslectnum = res.data.optionInfo.optionA.userListOptionA;
									tihaorenshu[0] = $scope.AcountNum;
									$scope.BcountNum = res.data.optionInfo.optionB.countB;
									$scope.bslectnum = res.data.optionInfo.optionB.userListOptionB;
									tihaorenshu[1] = $scope.BcountNum;
								}else if($scope.optionNu==3){
									$scope.AcountNum = res.data.optionInfo.optionA.countA;
									$scope.aslectnum = res.data.optionInfo.optionA.userListOptionA;
									tihaorenshu[0] = $scope.AcountNum;
									$scope.BcountNum = res.data.optionInfo.optionB.countB;
									$scope.bslectnum = res.data.optionInfo.optionB.userListOptionB;
									tihaorenshu[1] = $scope.BcountNum;
									$scope.CcountNum = res.data.optionInfo.optionC.countC;
									$scope.cslectnum = res.data.optionInfo.optionC.userListOptionC;
									tihaorenshu[2] = $scope.CcountNum;
								}else if($scope.optionNu==4){
									$scope.AcountNum = res.data.optionInfo.optionA.countA;
									$scope.aslectnum = res.data.optionInfo.optionA.userListOptionA;
									tihaorenshu[0] = $scope.AcountNum;
									$scope.BcountNum = res.data.optionInfo.optionB.countB;
									$scope.bslectnum = res.data.optionInfo.optionB.userListOptionB;
									tihaorenshu[1] = $scope.BcountNum;
									$scope.CcountNum = res.data.optionInfo.optionC.countC;
									$scope.cslectnum = res.data.optionInfo.optionC.userListOptionC;
									tihaorenshu[2] = $scope.CcountNum;
									$scope.DcountNum = res.data.optionInfo.optionD.countD;
									$scope.dslectnum = res.data.optionInfo.optionD.userListOptionD;
									tihaorenshu[3] = $scope.DcountNum;
								}else if($scope.optionNu==5){
									$scope.AcountNum = res.data.optionInfo.optionA.countA;
									$scope.aslectnum = res.data.optionInfo.optionA.userListOptionA;
									tihaorenshu[0] = $scope.AcountNum;
									$scope.BcountNum = res.data.optionInfo.optionB.countB;
									$scope.bslectnum = res.data.optionInfo.optionB.userListOptionB;
									tihaorenshu[1] = $scope.BcountNum;
									$scope.CcountNum = res.data.optionInfo.optionC.countC;
									$scope.cslectnum = res.data.optionInfo.optionC.userListOptionC;
									tihaorenshu[2] = $scope.CcountNum;
									$scope.DcountNum = res.data.optionInfo.optionD.countD;
									$scope.dslectnum = res.data.optionInfo.optionD.userListOptionD;
									tihaorenshu[3] = $scope.DcountNum;
									$scope.EcountNum = res.data.optionInfo.optionE.countE;
									$scope.eslectnum = res.data.optionInfo.optionE.userListOptionE;
									tihaorenshu[4] = $scope.EcountNum;
								}else if($scope.optionNu==6){
									$scope.AcountNum = res.data.optionInfo.optionA.countA;
									$scope.aslectnum = res.data.optionInfo.optionA.userListOptionA;
									tihaorenshu[0] = $scope.AcountNum;
									$scope.BcountNum = res.data.optionInfo.optionB.countB;
									$scope.bslectnum = res.data.optionInfo.optionB.userListOptionB;
									tihaorenshu[1] = $scope.BcountNum;
									$scope.CcountNum = res.data.optionInfo.optionC.countC;
									$scope.cslectnum = res.data.optionInfo.optionC.userListOptionC;
									tihaorenshu[2] = $scope.CcountNum;
									$scope.DcountNum = res.data.optionInfo.optionD.countD;
									$scope.dslectnum = res.data.optionInfo.optionD.userListOptionD;
									tihaorenshu[3] = $scope.DcountNum;
									$scope.EcountNum = res.data.optionInfo.optionE.countE;
									$scope.eslectnum = res.data.optionInfo.optionE.userListOptionE;
									tihaorenshu[4] = $scope.EcountNum;
									$scope.FcountNum = res.data.optionInfo.optionF.countF;
									$scope.fslectnum = res.data.optionInfo.optionF.userListOptionF;
									tihaorenshu[5] = $scope.FcountNum;
								}else if($scope.optionNu==7){
									$scope.AcountNum = res.data.optionInfo.optionA.countA;
									$scope.aslectnum = res.data.optionInfo.optionA.userListOptionA;
									tihaorenshu[0] = $scope.AcountNum;
									$scope.BcountNum = res.data.optionInfo.optionB.countB;
									$scope.bslectnum = res.data.optionInfo.optionB.userListOptionB;
									tihaorenshu[1] = $scope.BcountNum;
									$scope.CcountNum = res.data.optionInfo.optionC.countC;
									$scope.cslectnum = res.data.optionInfo.optionC.userListOptionC;
									tihaorenshu[2] = $scope.CcountNum;
									$scope.DcountNum = res.data.optionInfo.optionD.countD;
									$scope.dslectnum = res.data.optionInfo.optionD.userListOptionD;
									tihaorenshu[3] = $scope.DcountNum;
									$scope.EcountNum = res.data.optionInfo.optionE.countE;
									$scope.eslectnum = res.data.optionInfo.optionE.userListOptionE;
									tihaorenshu[4] = $scope.EcountNum;
									$scope.FcountNum = res.data.optionInfo.optionF.countF;
									$scope.fslectnum = res.data.optionInfo.optionF.userListOptionF;
									tihaorenshu[5] = $scope.FcountNum;
									$scope.GcountNum = res.data.optionInfo.optionG.countG;
									$scope.gslectnum = res.data.optionInfo.optionG.userListOptionG;
									tihaorenshu[6] = $scope.GcountNum;
								}else if($scope.optionNu==8){
									$scope.AcountNum = res.data.optionInfo.optionA.countA;
									$scope.aslectnum = res.data.optionInfo.optionA.userListOptionA;
									tihaorenshu[0] = $scope.AcountNum;
									$scope.BcountNum = res.data.optionInfo.optionB.countB;
									$scope.bslectnum = res.data.optionInfo.optionB.userListOptionB;
									tihaorenshu[1] = $scope.BcountNum;
									$scope.CcountNum = res.data.optionInfo.optionC.countC;
									$scope.cslectnum = res.data.optionInfo.optionC.userListOptionC;
									tihaorenshu[2] = $scope.CcountNum;
									$scope.DcountNum = res.data.optionInfo.optionD.countD;
									$scope.dslectnum = res.data.optionInfo.optionD.userListOptionD;
									tihaorenshu[3] = $scope.DcountNum;
									$scope.EcountNum = res.data.optionInfo.optionE.countE;
									$scope.eslectnum = res.data.optionInfo.optionE.userListOptionE;
									tihaorenshu[4] = $scope.EcountNum;
									$scope.FcountNum = res.data.optionInfo.optionF.countF;
									$scope.fslectnum = res.data.optionInfo.optionF.userListOptionF;
									tihaorenshu[5] = $scope.FcountNum;
									$scope.GcountNum = res.data.optionInfo.optionG.countG;
									$scope.gslectnum = res.data.optionInfo.optionG.userListOptionG;
									tihaorenshu[6] = $scope.GcountNum;
									$scope.HcountNum = res.data.optionInfo.optionH.countH;
									$scope.hslectnum = res.data.optionInfo.optionH.userListOptionH;
									tihaorenshu[7] = $scope.HcountNum;
								}else if($scope.optionNu==9){
									$scope.AcountNum = res.data.optionInfo.optionA.countA;
									$scope.aslectnum = res.data.optionInfo.optionA.userListOptionA;
									tihaorenshu[0] = $scope.AcountNum;
									$scope.BcountNum = res.data.optionInfo.optionB.countB;
									$scope.bslectnum = res.data.optionInfo.optionB.userListOptionB;
									tihaorenshu[1] = $scope.BcountNum;
									$scope.CcountNum = res.data.optionInfo.optionC.countC;
									$scope.cslectnum = res.data.optionInfo.optionC.userListOptionC;
									tihaorenshu[2] = $scope.CcountNum;
									$scope.DcountNum = res.data.optionInfo.optionD.countD;
									$scope.dslectnum = res.data.optionInfo.optionD.userListOptionD;
									tihaorenshu[3] = $scope.DcountNum;
									$scope.EcountNum = res.data.optionInfo.optionE.countE;
									$scope.eslectnum = res.data.optionInfo.optionE.userListOptionE;
									tihaorenshu[4] = $scope.EcountNum;
									$scope.FcountNum = res.data.optionInfo.optionF.countF;
									$scope.fslectnum = res.data.optionInfo.optionF.userListOptionF;
									tihaorenshu[5] = $scope.FcountNum;
									$scope.GcountNum = res.data.optionInfo.optionG.countG;
									$scope.gslectnum = res.data.optionInfo.optionG.userListOptionG;
									tihaorenshu[6] = $scope.GcountNum;
									$scope.HcountNum = res.data.optionInfo.optionH.countH;
									$scope.hslectnum = res.data.optionInfo.optionH.userListOptionH;
									tihaorenshu[7] = $scope.HcountNum;
									$scope.IcountNum = res.data.optionInfo.optionI.countI;
									$scope.islectnum = res.data.optionInfo.optionI.userListOptionI;
									tihaorenshu[8] = $scope.IcountNum;
								}else if($scope.optionNu==10){
									$scope.AcountNum = res.data.optionInfo.optionA.countA;
									$scope.aslectnum = res.data.optionInfo.optionA.userListOptionA;
									tihaorenshu[0] = $scope.AcountNum;
									$scope.BcountNum = res.data.optionInfo.optionB.countB;
									$scope.bslectnum = res.data.optionInfo.optionB.userListOptionB;
									tihaorenshu[1] = $scope.BcountNum;
									$scope.CcountNum = res.data.optionInfo.optionC.countC;
									$scope.cslectnum = res.data.optionInfo.optionC.userListOptionC;
									tihaorenshu[2] = $scope.CcountNum;
									$scope.DcountNum = res.data.optionInfo.optionD.countD;
									$scope.dslectnum = res.data.optionInfo.optionD.userListOptionD;
									tihaorenshu[3] = $scope.DcountNum;
									$scope.EcountNum = res.data.optionInfo.optionE.countE;
									$scope.eslectnum = res.data.optionInfo.optionE.userListOptionE;
									tihaorenshu[4] = $scope.EcountNum;
									$scope.FcountNum = res.data.optionInfo.optionF.countF;
									$scope.fslectnum = res.data.optionInfo.optionF.userListOptionF;
									tihaorenshu[5] = $scope.FcountNum;
									$scope.GcountNum = res.data.optionInfo.optionG.countG;
									$scope.gslectnum = res.data.optionInfo.optionG.userListOptionG;
									tihaorenshu[6] = $scope.GcountNum;
									$scope.HcountNum = res.data.optionInfo.optionH.countH;
									$scope.hslectnum = res.data.optionInfo.optionH.userListOptionH;
									tihaorenshu[7] = $scope.HcountNum;
									$scope.IcountNum = res.data.optionInfo.optionI.countI;
									$scope.islectnum = res.data.optionInfo.optionI.userListOptionI;
									tihaorenshu[8] = $scope.IcountNum;
									$scope.JcountNum = res.data.optionInfo.optionJ.countJ;
									$scope.jslectnum = res.data.optionInfo.optionJ.userListOptionJ;
									tihaorenshu[9] = $scope.JcountNum;
								}

							} else {
								$scope.AcountNum = res.data.optionInfo.optionYES.countYES;
								$scope.BcountNum = res.data.optionInfo.optionNO.countNO;

								$scope.aslectnum = res.data.optionInfo.optionYES.userListOptionYES;
								$scope.bslectnum = res.data.optionInfo.optionNO.userListOptionNO;
								
								tihaorenshu[0] = $scope.AcountNum;
								tihaorenshu[1] = $scope.BcountNum;

							}

							option2.series.data = tihaorenshu;
							option2.xAxis.data = $scope.answerOption;
							myChart2 = echarts.init(document.getElementById('tihaomain'));

							myChart2.setOption(option2, true);

							// 点击A\B\C\D
							myChart2.on('click', function(params) {
								if (params.name != undefined) {
									changeABCD(params.name)
								};
							});

						});
				});
		} else if ($scope.questionsType == 3) {
			$("#mlh_showimg").attr("src", $scope.imgShitiShowtc);

			//通过接口查询学生答题选项
			$http.get(kezhongIp + '/getDataByQuestionId?recordId=' + $scope.recordId + '&datamark=' + Tnum).success(function(
				res) {
					
					$scope.answerOption=[]

				switch (res.data.optionNu) {
					case 1:
						$scope.answerOption = ["A"];
						break;
					case 2:
						$scope.answerOption = ["A", "B"];
						break;
					case 3:
						$scope.answerOption = ["A", "B", "C"];
						break;
					case 4:
						$scope.answerOption = ["A", "B", "C", "D"];
						break;
					case 5:
						$scope.answerOption = ["A", "B", "C", "D","E"];
						break;
					case 6:
						$scope.answerOption = ["A", "B", "C", "D","E","F"];
						break;
					case 7:
						$scope.answerOption = ["A", "B", "C", "D","E","F","G"];
						break;
					case 8:
						$scope.answerOption = ["A", "B", "C", "D","E","F","G","H"];
						break;
					case 9:
						$scope.answerOption = ["A", "B", "C", "D","E","F","G","H","I"];
						break;
					case 10:
						$scope.answerOption = ["A", "B", "C", "D","E","F","G","H","I","J"];
						break;
				};
				if (res.data.type == 1) {
					$scope.answerOption = ["YES", "NO"];
				};
				option2.xAxis.data = $scope.answerOption;
				myChart2 = echarts.init(document.getElementById('tihaomain'));
				var tihaohtml = "第" + Tnum + "题";
				$(".switchingQuestions span").html(tihaohtml);
				$scope.trueCount = res.data.trueCount; //正确人数
				$scope.falseCount = res.data.falseCount; //错误人数
				$scope.nullCount = res.data.nullCount; //未答题人数
				$scope.optionNu = res.data.optionNu; //答案数量
				
				tihaorenshu=[];

				if (res.data.type != "1") {
						if($scope.optionNu==1){
							$scope.AcountNum = res.data.optionInfo.optionA.countA;
							$scope.aslectnum = res.data.optionInfo.optionA.userListOptionA;
							tihaorenshu[0] = $scope.AcountNum;
						}else if($scope.optionNu==2){
							$scope.AcountNum = res.data.optionInfo.optionA.countA;
							$scope.aslectnum = res.data.optionInfo.optionA.userListOptionA;
							tihaorenshu[0] = $scope.AcountNum;
							$scope.BcountNum = res.data.optionInfo.optionB.countB;
							$scope.bslectnum = res.data.optionInfo.optionB.userListOptionB;
							tihaorenshu[1] = $scope.BcountNum;
						}else if($scope.optionNu==3){
							$scope.AcountNum = res.data.optionInfo.optionA.countA;
							$scope.aslectnum = res.data.optionInfo.optionA.userListOptionA;
							tihaorenshu[0] = $scope.AcountNum;
							$scope.BcountNum = res.data.optionInfo.optionB.countB;
							$scope.bslectnum = res.data.optionInfo.optionB.userListOptionB;
							tihaorenshu[1] = $scope.BcountNum;
							$scope.CcountNum = res.data.optionInfo.optionC.countC;
							$scope.cslectnum = res.data.optionInfo.optionC.userListOptionC;
							tihaorenshu[2] = $scope.CcountNum;
						}else if($scope.optionNu==4){
							$scope.AcountNum = res.data.optionInfo.optionA.countA;
							$scope.aslectnum = res.data.optionInfo.optionA.userListOptionA;
							tihaorenshu[0] = $scope.AcountNum;
							$scope.BcountNum = res.data.optionInfo.optionB.countB;
							$scope.bslectnum = res.data.optionInfo.optionB.userListOptionB;
							tihaorenshu[1] = $scope.BcountNum;
							$scope.CcountNum = res.data.optionInfo.optionC.countC;
							$scope.cslectnum = res.data.optionInfo.optionC.userListOptionC;
							tihaorenshu[2] = $scope.CcountNum;
							$scope.DcountNum = res.data.optionInfo.optionD.countD;
							$scope.dslectnum = res.data.optionInfo.optionD.userListOptionD;
							tihaorenshu[3] = $scope.DcountNum;
						}else if($scope.optionNu==5){
							$scope.AcountNum = res.data.optionInfo.optionA.countA;
							$scope.aslectnum = res.data.optionInfo.optionA.userListOptionA;
							tihaorenshu[0] = $scope.AcountNum;
							$scope.BcountNum = res.data.optionInfo.optionB.countB;
							$scope.bslectnum = res.data.optionInfo.optionB.userListOptionB;
							tihaorenshu[1] = $scope.BcountNum;
							$scope.CcountNum = res.data.optionInfo.optionC.countC;
							$scope.cslectnum = res.data.optionInfo.optionC.userListOptionC;
							tihaorenshu[2] = $scope.CcountNum;
							$scope.DcountNum = res.data.optionInfo.optionD.countD;
							$scope.dslectnum = res.data.optionInfo.optionD.userListOptionD;
							tihaorenshu[3] = $scope.DcountNum;
							$scope.EcountNum = res.data.optionInfo.optionE.countE;
							$scope.eslectnum = res.data.optionInfo.optionE.userListOptionE;
							tihaorenshu[4] = $scope.EcountNum;
						}else if($scope.optionNu==6){
							$scope.AcountNum = res.data.optionInfo.optionA.countA;
							$scope.aslectnum = res.data.optionInfo.optionA.userListOptionA;
							tihaorenshu[0] = $scope.AcountNum;
							$scope.BcountNum = res.data.optionInfo.optionB.countB;
							$scope.bslectnum = res.data.optionInfo.optionB.userListOptionB;
							tihaorenshu[1] = $scope.BcountNum;
							$scope.CcountNum = res.data.optionInfo.optionC.countC;
							$scope.cslectnum = res.data.optionInfo.optionC.userListOptionC;
							tihaorenshu[2] = $scope.CcountNum;
							$scope.DcountNum = res.data.optionInfo.optionD.countD;
							$scope.dslectnum = res.data.optionInfo.optionD.userListOptionD;
							tihaorenshu[3] = $scope.DcountNum;
							$scope.EcountNum = res.data.optionInfo.optionE.countE;
							$scope.eslectnum = res.data.optionInfo.optionE.userListOptionE;
							tihaorenshu[4] = $scope.EcountNum;
							$scope.FcountNum = res.data.optionInfo.optionF.countF;
							$scope.fslectnum = res.data.optionInfo.optionF.userListOptionF;
							tihaorenshu[5] = $scope.FcountNum;
						}else if($scope.optionNu==7){
							$scope.AcountNum = res.data.optionInfo.optionA.countA;
							$scope.aslectnum = res.data.optionInfo.optionA.userListOptionA;
							tihaorenshu[0] = $scope.AcountNum;
							$scope.BcountNum = res.data.optionInfo.optionB.countB;
							$scope.bslectnum = res.data.optionInfo.optionB.userListOptionB;
							tihaorenshu[1] = $scope.BcountNum;
							$scope.CcountNum = res.data.optionInfo.optionC.countC;
							$scope.cslectnum = res.data.optionInfo.optionC.userListOptionC;
							tihaorenshu[2] = $scope.CcountNum;
							$scope.DcountNum = res.data.optionInfo.optionD.countD;
							$scope.dslectnum = res.data.optionInfo.optionD.userListOptionD;
							tihaorenshu[3] = $scope.DcountNum;
							$scope.EcountNum = res.data.optionInfo.optionE.countE;
							$scope.eslectnum = res.data.optionInfo.optionE.userListOptionE;
							tihaorenshu[4] = $scope.EcountNum;
							$scope.FcountNum = res.data.optionInfo.optionF.countF;
							$scope.fslectnum = res.data.optionInfo.optionF.userListOptionF;
							tihaorenshu[5] = $scope.FcountNum;
							$scope.GcountNum = res.data.optionInfo.optionG.countG;
							$scope.gslectnum = res.data.optionInfo.optionG.userListOptionG;
							tihaorenshu[6] = $scope.GcountNum;
						}else if($scope.optionNu==8){
							$scope.AcountNum = res.data.optionInfo.optionA.countA;
							$scope.aslectnum = res.data.optionInfo.optionA.userListOptionA;
							tihaorenshu[0] = $scope.AcountNum;
							$scope.BcountNum = res.data.optionInfo.optionB.countB;
							$scope.bslectnum = res.data.optionInfo.optionB.userListOptionB;
							tihaorenshu[1] = $scope.BcountNum;
							$scope.CcountNum = res.data.optionInfo.optionC.countC;
							$scope.cslectnum = res.data.optionInfo.optionC.userListOptionC;
							tihaorenshu[2] = $scope.CcountNum;
							$scope.DcountNum = res.data.optionInfo.optionD.countD;
							$scope.dslectnum = res.data.optionInfo.optionD.userListOptionD;
							tihaorenshu[3] = $scope.DcountNum;
							$scope.EcountNum = res.data.optionInfo.optionE.countE;
							$scope.eslectnum = res.data.optionInfo.optionE.userListOptionE;
							tihaorenshu[4] = $scope.EcountNum;
							$scope.FcountNum = res.data.optionInfo.optionF.countF;
							$scope.fslectnum = res.data.optionInfo.optionF.userListOptionF;
							tihaorenshu[5] = $scope.FcountNum;
							$scope.GcountNum = res.data.optionInfo.optionG.countG;
							$scope.gslectnum = res.data.optionInfo.optionG.userListOptionG;
							tihaorenshu[6] = $scope.GcountNum;
							$scope.HcountNum = res.data.optionInfo.optionH.countH;
							$scope.hslectnum = res.data.optionInfo.optionH.userListOptionH;
							tihaorenshu[7] = $scope.HcountNum;
						}else if($scope.optionNu==9){
							$scope.AcountNum = res.data.optionInfo.optionA.countA;
							$scope.aslectnum = res.data.optionInfo.optionA.userListOptionA;
							tihaorenshu[0] = $scope.AcountNum;
							$scope.BcountNum = res.data.optionInfo.optionB.countB;
							$scope.bslectnum = res.data.optionInfo.optionB.userListOptionB;
							tihaorenshu[1] = $scope.BcountNum;
							$scope.CcountNum = res.data.optionInfo.optionC.countC;
							$scope.cslectnum = res.data.optionInfo.optionC.userListOptionC;
							tihaorenshu[2] = $scope.CcountNum;
							$scope.DcountNum = res.data.optionInfo.optionD.countD;
							$scope.dslectnum = res.data.optionInfo.optionD.userListOptionD;
							tihaorenshu[3] = $scope.DcountNum;
							$scope.EcountNum = res.data.optionInfo.optionE.countE;
							$scope.eslectnum = res.data.optionInfo.optionE.userListOptionE;
							tihaorenshu[4] = $scope.EcountNum;
							$scope.FcountNum = res.data.optionInfo.optionF.countF;
							$scope.fslectnum = res.data.optionInfo.optionF.userListOptionF;
							tihaorenshu[5] = $scope.FcountNum;
							$scope.GcountNum = res.data.optionInfo.optionG.countG;
							$scope.gslectnum = res.data.optionInfo.optionG.userListOptionG;
							tihaorenshu[6] = $scope.GcountNum;
							$scope.HcountNum = res.data.optionInfo.optionH.countH;
							$scope.hslectnum = res.data.optionInfo.optionH.userListOptionH;
							tihaorenshu[7] = $scope.HcountNum;
							$scope.IcountNum = res.data.optionInfo.optionI.countI;
							$scope.islectnum = res.data.optionInfo.optionI.userListOptionI;
							tihaorenshu[8] = $scope.IcountNum;
						}else if($scope.optionNu==10){
							$scope.AcountNum = res.data.optionInfo.optionA.countA;
							$scope.aslectnum = res.data.optionInfo.optionA.userListOptionA;
							tihaorenshu[0] = $scope.AcountNum;
							$scope.BcountNum = res.data.optionInfo.optionB.countB;
							$scope.bslectnum = res.data.optionInfo.optionB.userListOptionB;
							tihaorenshu[1] = $scope.BcountNum;
							$scope.CcountNum = res.data.optionInfo.optionC.countC;
							$scope.cslectnum = res.data.optionInfo.optionC.userListOptionC;
							tihaorenshu[2] = $scope.CcountNum;
							$scope.DcountNum = res.data.optionInfo.optionD.countD;
							$scope.dslectnum = res.data.optionInfo.optionD.userListOptionD;
							tihaorenshu[3] = $scope.DcountNum;
							$scope.EcountNum = res.data.optionInfo.optionE.countE;
							$scope.eslectnum = res.data.optionInfo.optionE.userListOptionE;
							tihaorenshu[4] = $scope.EcountNum;
							$scope.FcountNum = res.data.optionInfo.optionF.countF;
							$scope.fslectnum = res.data.optionInfo.optionF.userListOptionF;
							tihaorenshu[5] = $scope.FcountNum;
							$scope.GcountNum = res.data.optionInfo.optionG.countG;
							$scope.gslectnum = res.data.optionInfo.optionG.userListOptionG;
							tihaorenshu[6] = $scope.GcountNum;
							$scope.HcountNum = res.data.optionInfo.optionH.countH;
							$scope.hslectnum = res.data.optionInfo.optionH.userListOptionH;
							tihaorenshu[7] = $scope.HcountNum;
							$scope.IcountNum = res.data.optionInfo.optionI.countI;
							$scope.islectnum = res.data.optionInfo.optionI.userListOptionI;
							tihaorenshu[8] = $scope.IcountNum;
							$scope.JcountNum = res.data.optionInfo.optionJ.countJ;
							$scope.jslectnum = res.data.optionInfo.optionJ.userListOptionJ;
							tihaorenshu[9] = $scope.JcountNum;
						}
					
				} else {
					$scope.AcountNum = res.data.optionInfo.optionYES.countYES;
					$scope.BcountNum = res.data.optionInfo.optionNO.countNO;

					$scope.aslectnum = res.data.optionInfo.optionYES.userListOptionYES;
					$scope.bslectnum = res.data.optionInfo.optionNO.userListOptionNO;
					tihaorenshu[0] = $scope.AcountNum;
					tihaorenshu[1] = $scope.BcountNum;

				}
				
				option2.series.data = tihaorenshu;
				myChart2.setOption(option2, true);

				// 点击A\B\C\D
				myChart2.on('click', function(params) {
					if (params.name != undefined) {
						changeABCD(params.name)
					};
				});

			});
		}
	};

	function changeABCD(name) {
		$(".xuanxiangullist").empty();
		$(".wx_selectkuang").show();
		$("#changeSelectxx").html(name) //切换选项显示名字

		if (name == "A") {
			for (var i = 0; i < $scope.aslectnum.length; i++) {
				var strnameshow = $scope.aslectnum[i].realname;
				var alltrue = $scope.aslectnum[i].result;
				if (alltrue == 1) {
					$(".xuanxiangullist").append(' <li style="color:#78b1e7">' + strnameshow + '</li>')
				} else {
					$(".xuanxiangullist").append(' <li>' + strnameshow + '</li>')
				}

			};
		} else if (name == "B") {
			for (var i = 0; i < $scope.bslectnum.length; i++) {
				var strnameshow = $scope.bslectnum[i].realname;
				var alltrue = $scope.bslectnum[i].result;
				if (alltrue == 1) {
					$(".xuanxiangullist").append(' <li style="color:#78b1e7">' + strnameshow + '</li>')
				} else {
					$(".xuanxiangullist").append(' <li>' + strnameshow + '</li>')
				}
			};
		} else if (name == "C") {
			for (var i = 0; i < $scope.cslectnum.length; i++) {
				var strnameshow = $scope.cslectnum[i].realname;
				var alltrue = $scope.cslectnum[i].result;
				if (alltrue == 1) {
					$(".xuanxiangullist").append(' <li style="color:#78b1e7">' + strnameshow + '</li>')
				} else {
					$(".xuanxiangullist").append(' <li>' + strnameshow + '</li>')
				}
			};
		} else if (name == "D") {
			for (var i = 0; i < $scope.dslectnum.length; i++) {
				var strnameshow = $scope.dslectnum[i].realname;
				var alltrue = $scope.dslectnum[i].result;
				if (alltrue == 1) {
					$(".xuanxiangullist").append(' <li style="color:#78b1e7">' + strnameshow + '</li>')
				} else {
					$(".xuanxiangullist").append(' <li>' + strnameshow + '</li>')
				}
			};
		} else if (name == "E") {
			for (var i = 0; i < $scope.eslectnum.length; i++) {
				var strnameshow = $scope.eslectnum[i].realname;
				var alltrue = $scope.eslectnum[i].result;
				if (alltrue == 1) {
					$(".xuanxiangullist").append(' <li style="color:#78b1e7">' + strnameshow + '</li>')
				} else {
					$(".xuanxiangullist").append(' <li>' + strnameshow + '</li>')
				}
			};
		} else if (name == "F") {
			for (var i = 0; i < $scope.fslectnum.length; i++) {
				var strnameshow = $scope.fslectnum[i].realname;
				var alltrue = $scope.fslectnum[i].result;
				if (alltrue == 1) {
					$(".xuanxiangullist").append(' <li style="color:#78b1e7">' + strnameshow + '</li>')
				} else {
					$(".xuanxiangullist").append(' <li>' + strnameshow + '</li>')
				}
			};
		} else if (name == "G") {
			for (var i = 0; i < $scope.gslectnum.length; i++) {
				var strnameshow = $scope.gslectnum[i].realname;
				var alltrue = $scope.gslectnum[i].result;
				if (alltrue == 1) {
					$(".xuanxiangullist").append(' <li style="color:#78b1e7">' + strnameshow + '</li>')
				} else {
					$(".xuanxiangullist").append(' <li>' + strnameshow + '</li>')
				}
			};
		} else if (name == "H") {
			for (var i = 0; i < $scope.hslectnum.length; i++) {
				var strnameshow = $scope.hslectnum[i].realname;
				var alltrue = $scope.hslectnum[i].result;
				if (alltrue == 1) {
					$(".xuanxiangullist").append(' <li style="color:#78b1e7">' + strnameshow + '</li>')
				} else {
					$(".xuanxiangullist").append(' <li>' + strnameshow + '</li>')
				}
			};
		} else if (name == "I") {
			for (var i = 0; i < $scope.islectnum.length; i++) {
				var strnameshow = $scope.islectnum[i].realname;
				var alltrue = $scope.islectnum[i].result;
				if (alltrue == 1) {
					$(".xuanxiangullist").append(' <li style="color:#78b1e7">' + strnameshow + '</li>')
				} else {
					$(".xuanxiangullist").append(' <li>' + strnameshow + '</li>')
				}
			};
		} else if (name == "J") {
			for (var i = 0; i < $scope.jslectnum.length; i++) {
				var strnameshow = $scope.jslectnum[i].realname;
				var alltrue = $scope.jslectnum[i].result;
				if (alltrue == 1) {
					$(".xuanxiangullist").append(' <li style="color:#78b1e7">' + strnameshow + '</li>')
				} else {
					$(".xuanxiangullist").append(' <li>' + strnameshow + '</li>')
				}
			};
		} else if (name == "YES") {
			for (var i = 0; i < $scope.aslectnum.length; i++) {
				var strnameshow = $scope.aslectnum[i].realname;
				$(".xuanxiangullist").append(' <li>' + strnameshow + '</li>')
			};
		} else if (name == "NO") {
			for (var i = 0; i < $scope.bslectnum.length; i++) {
				var strnameshow = $scope.bslectnum[i].realname;
				$(".xuanxiangullist").append(' <li>' + strnameshow + '</li>')
			};
		}
	};

	// 显示隐藏学生答题的右侧列表
	$scope.changeDisplayStrList = function() {
		if ($(".changeDisplayStrList").hasClass("icon-xianshi")) {
			showstrlist();
		} else {
			Hidestrlist();
		};
		setTimeout(function() {
			$(".subjectDetail").css("min-height", $(".questionBody").height());
		}, 400);
	}

	function showstrlist() {
		$(".strIconRight").animate({
			right: "-41rem"
		});
		$(".resoucetcContent .resouceright").animate({
			right: 0
		})
		$(".subjectScreen").animate({
			height: "100%"
		})
		$(".questionBody").css({
			fontSize: "3rem"
		})
		$(".changeDisplayStrList").addClass("icon-yincang")
		$(".changeDisplayStrList").removeClass("icon-xianshi");
		$(".xuanxiang").css({
			"padding": "0 0 0 8rem"
		});



	}

	function Hidestrlist() {
		$(".strIconRight").animate({
			right: "0"
		});
		$(".resoucetcContent .resouceright").animate({
			right: "41.2rem"
		})
		$(".questionBody").css({
			fontSize: "3rem"
		})
		$(".subjectScreen").animate({
			height: "100%"
		})
		$(".changeDisplayStrList").addClass("icon-xianshi")
		$(".changeDisplayStrList").removeClass("icon-yincang")
		$(".xuanxiang").css({
			"padding": "0 0 0 4rem"
		});


	};
	$scope.prevSubject = 0;
	$scope.upsubject = function(dom, index) {
		upsubject(dom, index);
	};

	function upsubject(dom, index) {
		yuntishiScroll = 0;
		$(dom).find(".subjectDetail").eq(index - 1).show().siblings().hide();
	}

	//下一题
	$scope.downsubject = function(dom, index) {

		downsubject(dom, index);
	}

	function downsubject(dom, index) {
		yuntishiScroll = 0;
		$(dom).find(".subjectDetail").eq(index + 1).show().siblings().hide();
	};

	$("body").on("click", ".subjectDetail img", function() {
		var imgSrc = $(this).attr("src");
		testImgLook(imgSrc);
	});

	function testImgLook(src) { //查看试题图片
		if ($("#imgMax").length == 0) {
			$scope.onePic = false;
			$scope.imgresShowtc = src;
			$(".imgPlayer").removeClass("zoomOut");
			$(".imgPlayer").show().addClass("animated zoomIn");
			$scope.$apply();
			//图片加载成功
			var imgwidth = $(".wx_imgshowtc")[0].naturalWidth;
			var imgheight = $(".wx_imgshowtc")[0].naturalHeight;
			if (imgwidth > imgheight) { //横着的图
				if (imgwidth < 1300) {
					$(".wx_imgshowtc").css({
						"width": imgwidth,
						"height": ""
					})
				} else {
					$(".wx_imgshowtc").css({
						"width": imgwidth,
						"height": imgheight
					})
				}
			} else if (imgwidth <= imgheight) { //竖着的图
				if (imgheight < 768) {
					$(".wx_imgshowtc").css({
						"height": imgheight - 100,
						"width": ""
					})
				} else {
					var PcHeight = document.body.clientHeight - 100;
					$(".wx_imgshowtc").css({
						"height": PcHeight,
						"width": ""
					})
				}
			}

		} else {
			$(".welcome_user").show().html("请先关闭最小化图片资源！")
			setTimeout(function() {
				$(".welcome_user").hide().html("")
			}, 2000);

		}

	};


	// 小号字体
	$scope.smallSize = function() {
		smallSize()
	}

	function smallSize() {
		$(".questionBody").css({
			fontSize: "3rem"
		})
		$(".xuanxiang").css({
			"padding": "0 0 0 4rem"
		})
	}
	// 中号字体
	$scope.middleSize = function() {
		middleSize()
	}

	function middleSize() {
		$(".questionBody").css({
			fontSize: "3.5rem"
		})
		$(".xuanxiang").css({
			"padding": "0 0 0 6rem"
		})
	}
	// 大号字体
	$scope.bigSize = function() {
		bigSize()
	}

	function bigSize() {
		$(".questionBody").css({
			fontSize: "4rem"
		})
		$(".xuanxiang").css({
			"padding": "0 0 0 8rem"
		})
	}




	//zyx 2019.04.01 桌面按钮拖拽事件
	var x, y; //定义起始坐标
	var flag = false;
	var div = document.getElementById('fd');
	// 鼠标按下事件
	['touchstart', 'mousedown'].forEach(function(item) {

		div.addEventListener(item, function(event) {
			var e = event || window.event;
			flag = true;
			//鼠标按下时的坐标x,y
			if (item == "touchstart") {
				x = e.touches[0].clientX;
				y = e.touches[0].clientY;
			} else {
				x = e.x;
				y = e.y;
			}
			//鼠标按下时的左右偏移量
			var dragLeft = this.offsetLeft,
				dragTop = this.offsetTop;

			// 鼠标移动事件
			['touchmove', 'mousemove'].forEach(function(item) {

				if (item == 'touchmove') {
					div.addEventListener(item, function(e) {
						if (flag) {
							var nowX = e.touches[0].clientX,
								nowY = e.touches[0].clientY,
								//鼠标移动时的坐标的变化量
								moveX = nowX - x,
								moveY = nowY - y;
							offsetX = dragLeft + moveX;
							maxW = $("body").width() - $("#fd").width() / 2;
							maxH = $("body").height() - $("#fd").height();
							if (offsetX < 0) {
								offsetX = 0;
							}
							if (offsetX > maxW) {
								offsetX = maxW;
							}
							offsetY = dragTop + moveY;
							if (offsetY < 0) {
								offsetY = 0;
							};
							if (offsetY > maxH) {
								offsetY = maxH;
							};
							div.style.left = offsetX + 'px';
							div.style.top = offsetY + 'px';
							event.preventDefault();
						}
					})
				} else {
					document.addEventListener(item, function(e) {
						if (flag) {
							var nowX = e.clientX,
								nowY = e.clientY,
								//鼠标移动时的坐标的变化量
								moveX = nowX - x,
								moveY = nowY - y;
							offsetX = dragLeft + moveX;
							maxW = $("body").width() - $("#fd").width() / 2;
							maxH = $("body").height() - $("#fd").height() / 2;
							if (offsetX < -$("#fd").width() / 2) {
								offsetX = -$("#fd").width() / 2;
							}
							if (offsetX > maxW) {
								offsetX = maxW;
							}
							offsetY = dragTop + moveY;
							if (offsetY < -$("#fd").height() / 2) {
								offsetY = -$("#fd").height() / 2;
							};
							if (offsetY > maxH) {
								offsetY = maxH;
							};
							div.style.left = offsetX + 'px';
							div.style.top = offsetY + 'px';
							event.preventDefault();
						}
					})
				}

			});

			// 鼠标抬起事件
			['touchend', 'mouseup'].forEach(function(item) {
				if (item == 'touchend') {
					div.addEventListener(item, function() {
						flag = false
					})
				} else {
					document.addEventListener(item, function() {
						flag = false
					})

				}
			});
		});
	});




	$scope.fun = function() {
		$(".subjectDetail").css("min-height", $(".questionBody").height());
	};

});


app.directive('repeatFinish', function($timeout) {
	return {
		link: function(scope, element, attr) {
			if (scope.$last == true) {
				//              $timeout(function (){
				console.log('ng-repeat执行完毕');
				scope.$eval(attr.repeatFinish);
				//					scope.$emit('ngRepeatFinished');
				//              },50);
			}
		}
	}
});
app.filter('trustHtml', function($sce) { //解释html标签
	return function(input) {
		return $sce.trustAsHtml(input);
	}
});