var app = {
	init: function() {
		app.formula = '';
		$(".calc-button").on("tap", function(e) {
			app.add($(this).text());
		});
		$(".calc-opecode").on("tap", function(e) {
			app.ope($(this).text());
		});
		$("#button-c").on("tap", function(e) {
			if (!app.tapholdFlg) {
				app.clear();
			}
		}).on("touchstart", function(e) {
			e.preventDefault();
			app.tapholdFlg = false;
		}).on("taphold", function(e) {
			app.tapholdFlg = true;
			app.ac();
		});
		$("#button-eq").on("tap", function(e) {
			app.calc();
		});
		$("#button-m").on("tap", function(e) {
			app.memory();
		});
		$("#history").on("touchstart", "li", function(e) {
			app.historyListPosX = e.originalEvent.changedTouches[0].pageX;
			app.historyListPosY = e.originalEvent.changedTouches[0].pageY;
		}).on("touchmove", "li", function(e) {
			var  touch = e.originalEvent.changedTouches[0];
			if (Math.abs(touch.pageY - app.historyListPosY) > 10) {
				return;
			}
			var xBias = touch.pageX - app.historyListPosX;
			if (xBias % 5 < 4) {
				$(this).find(".list-fore, label").css("left", xBias + "px");
			}
		}).on("touchend", "li", function(e) {
			var xBias = Math.abs(e.originalEvent.changedTouches[0].pageX - app.historyListPosX);
			if (xBias > 120) {
				$(this).remove();
			} else {
				$(this).find(".list-fore, label").css("left", "0");
			}
		});
	},
	calc: function() {
		var $t = $("#calc-formula"),
			$o = $("#calc-opecode"),
			p = $t.text(),
			op = $o.text().replace(/÷/g, "/").replace(/×/g, "*");
		if (op == '') {
			return;
		}
		if (p == '') {
			p = '0';
		}
		$t.text(eval(app.formula + ' ' + op + ' '  + p));
		$o.text('');
		app.formula = '';
	},
	clear: function() {
		app.formula = '';
		$("#calc-formula, #calc-opecode").text("");
	},
	memory: function() {
		var $t = $("#history"),
			s = $t.find("li").size(),
			m = "<li class=\"history-list\"><span class=\"list-bg list-back\"></span><span class=\"list-bg list-fore\"></span><input type=\"checkbox\" id=\"history" + s + "\"><label for=\"history" + s + "\">" + $("#calc-formula").text() + "</label></li>";
		$t.prepend(m);
		app.clear();
	},
	add: function(v) {
		var $r = $("#calc-formula"),
			p = $r.text().replace(/,/g, ''),
			op = $("#calc-opecode").text().replace(/÷/g, "/").replace(/×/g, "*");
		if (op != '') {
			if (app.formula == '') {
				app.formula = p;
				p = v;
			} else {
				p = p + v;
			}
		}  else {
			p = p + v;
		}
		$r.text(p.replace(/(\d)(?=(\d{3})+$)/g , '$1,'));
	},
	ope: function(v) {
		var $h = $(".history-list input:checked");
		if ($h.size() == 0) {
			$("#calc-opecode").text(v);
		} else {
			var $r = $h.parent();
				var m = $r.size() - 1;
				var ans = $($r[m]).text().replace(/,/g, '');
			for(var i=m - 1; i >= 0; i--) {
				ans = eval(ans + ' ' + v.replace(/÷/g, "/").replace(/×/g, "*") + ' '+ $($r[i]).text().replace(/,/g, ''));
			}
			$h.prop('checked', false);
			$("#calc-formula").text(ans.toString().replace(/(\d)(?=(\d{3})+$)/g , '$1,'));
		}
	},
	ac: function() {
		if (confirm("Do you really want to clear the history ?")) {
			app.clear();
			$("#history").empty();
		}
	},
},
common = {
	init: function() {
		common.hideBar();
		$(window).on("orientationchange resize", function() {
			common.hideBar();
		});
	},
	hideBar: function() {
		setTimeout("scrollTo(0,1)", 100);
	},
};

$(function(){
	common.init();
	app.init();
});