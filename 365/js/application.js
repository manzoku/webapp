$(document).on("pageinit", "#main", function(event) {
	Y365.showStatus();
	$("#deposit").on("tap", function() {
		var t = new Date(), now = new Date();
		if (localStorage.money) {
			localStorage.money = parseInt(localStorage.money) + parseInt($("#today").html());
			localStorage.elapsed = parseInt(localStorage.elapsed) + 1;
		} else {
			localStorage.start = (new Date(now.getFullYear(), now.getMonth(), now.getDate())).getTime();
			localStorage.leapYear = "T";
			localStorage.money = 1;
			localStorage.elapsed = 0;
		}
		localStorage.lastDate = (new Date(now.getFullYear(), now.getMonth(), now.getDate())).getTime();
		localStorage.lastMoney = $("#today").html();
		$("#doneToday").html($("#today").html());
		$("#notyetDeposit").hide();
		$("#doneDeposit").show();
		$("#total").html(localStorage.money);
		$("#lastM").html(now.getMonth()+1);
		$("#lastD").html(now.getDate());
		t.setTime(localStorage.start);
		$("#dsM").html(t.getMonth()+1);
		$("#dsD").html(t.getDate());
		$("#dsR").html(Math.floor(((new Date(now.getFullYear(), now.getMonth(), now.getDate())).getTime() - t.getTime()) / 86400000)); // 86400000 = 1000 * 60 * 60 * 24　：　ミリ秒から日への変換
		$(".doneStart").show();
		$("#notyetStart").hide();
		if (Y365.checkLost() !== 0) {
			Y365.reset();
			Y365.showStatus();
		}
	});
});

$(document).on("pageinit", "#options", function(event) {
	$("#useLeapYear").on("tap", function(event) {
		alert("未実装(必ず「する」になります)");
		var leapYearFlag = localStorage.leapYear;
		if (leapYearFlag === "T" || leapYearFlag == null) {
			$(this).find(".ui-icon").addClass("ui-nullIcon");
			localStorage.leapYear = "F";
		} else {
			$(this).find(".ui-icon").removeClass("ui-nullIcon");
			localStorage.leapYear = "T";
		}
	});
	$("#reset").on("tap", function(event) {
		if(confirm("リセットすると開始日、貯蓄金額がクリアされ、戻せなくなります。\nこのままリセットして大丈夫ですか？")) {
			localStorage.clear();
			$(useLeapYear).find(".ui-icon").removeClass("ui-nullIcon");
			Y365.reset();
			Y365.showStatus();
		}
	});
});

var Y365 = {
reset: function() {
		$("#notyetDeposit").show();
		$("#doneDeposit").hide();
		$(".doneStart").show();
		$("#notyetStart").hide();
		$("#warning").hide();
},
checkLost: function() {
	// サボり度判定
	var t = new Date(), now = new Date(), lost;
	t.setTime(localStorage.start);
	lost = Math.floor(((new Date(now.getFullYear(), now.getMonth(), now.getDate())).getTime() - t.getTime()) / 86400000) - parseInt(localStorage.elapsed); // 86400000 = 1000 * 60 * 60 * 24　：　ミリ秒から日への変換
	$("#lostD").html(lost);
	if (lost !== 0) {
		$("#warning").show();
	} else {
		$("#warning").hide();
	}
	return lost;
},
showStatus: function() {
	var tmp,t,now;
	tmp = localStorage.start;
	if (!tmp) {
		// 開始していない ⇒ リセット処理
		$(".doneStart").hide();
		$("#notyetStart").show();
		$("#today").html("1");
		$("#total").html("0");
		return;
	}

	t = new Date();
	now = new Date();
	t.setTime(tmp);
	$("#dsM").html(t.getMonth()+1);
	$("#dsD").html(t.getDate());
	now = new Date();
	$("#dsR").html(Math.floor(((new Date(now.getFullYear(), now.getMonth(), now.getDate())).getTime() - t.getTime()) / 86400000)); // 86400000 = 1000 * 60 * 60 * 24　：　ミリ秒から日への変換

	$("#total").html(localStorage.money);
	$("#today").html(parseInt(localStorage.lastMoney) + 1);

	t.setTime(localStorage.lastDate);
	$("#lastM").html(t.getMonth()+1);
	$("#lastD").html(t.getDate());

	if (Y365.checkLost() === 0) {
		if (now.getMonth() == t.getMonth() && now.getDate() == t.getDate()) {
			// 今日はもう貯金した！
			$("#notyetDeposit").hide();
			$("#doneDeposit").show();
			$("#doneToday").html(localStorage.lastMoney);
		}
	}

}
};