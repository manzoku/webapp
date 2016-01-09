var app, game, player;

player = {
	playOpen: function () {
	},
	playMusicbox: function () {
	},
	playClock: function () {
	}
};

game = {
	answer: {
		locknumber: "4762",
		treasurebox: "14",
		medicinebox: "29",
		musicbox: "11"
	},
	clearFlag: 0,
	specialFlag: 0,
	check: {
		locknumber: function () {
			"use strict";
			var playerKey;
			playerKey = $("#diallocknumber").val();
			if (playerKey.length === 4) {
				if (playerKey === game.answer.locknumber) {
					// 正解
					player.playOpen();
					app.notify.alert("鳥かごの鍵が開錠されました\n鳥かごからでると部屋の隅に箱を見つけました\nこの部屋には他には何もなさそうだ", true, 500);
					game.clearFlag += 1;	// かごから出る
					$("#selectEscape").show();
					$("#boxes").show();
					$("#main").off("tap", "#openlock");
					$("#openlock").button("disable");
					$("#diallocknumber").attr("readonly", "readonly");
				} else {
					// 間違い
					app.notify.toast("番号が違います", true, 500);
				}
			} else {
				app.notify.toast("桁数が違います", true, 500);
			}
		},
		treasurebox: function () {
			"use strict";
			var playerKey;
			playerKey = $("#treasureboxnumber").val();
			if (playerKey.length === 2) {
				if (playerKey === game.answer.treasurebox) {
					// 正解
					app.notify.alert("財宝発見！\n脱出することには直接関係なさそうだ", true, 500);
					game.clearFlag += 2;	// 宝箱あける
					$("#main").off("tap", "#opentreasurebox");
					$("#opentreasurebox").button("disable");
					$("#treasureboxnumber").attr("readonly", "readonly");
				} else {
					// 間違い
					app.notify.toast("番号が違います", true, 500);
				}
			} else {
				app.notify.toast("桁数が違います", true, 500);
			}
		},
		medicinebox: function () {
			"use strict";
			var playerKey;
			playerKey = $("#medicineboxnumber").val();
			if (playerKey.length === 2) {
				if (playerKey === game.answer.medicinebox) {
					// 正解
					app.notify.alert("カプセル発見！\nこれに解毒薬を入れると持ち出せるぞ", true, 500);
					game.clearFlag += 16;	// カプセル見つける
					$("#main").off("tap", "#openmedicinebox");
					$("#openmedicinebox").button("disable");
					$("#medicineboxnumber").attr("readonly", "readonly");
				} else {
					// 間違い
					app.notify.toast("番号が違います", true, 500);
				}
			} else {
				app.notify.toast("桁数が違います", true, 500);
			}
		},
		musicbox: function () {
			"use strict";
			var playerKey;
			playerKey = $("#musicboxnumber").val();
			if (playerKey.length === 2) {
				if (playerKey === game.answer.musicbox) {
					// 正解
					player.playMusicbox();
					app.notify.alert("ただのオルゴールのようだ\nこれはここから脱出することとは関係ない");
					$("#main").off("tap", "#openmusicbox");
					$("#openmusicbox").button("disable");
					$("#musicboxnumber").attr("readonly", "readonly");
				} else {
					// 間違い
					app.notify.toast("番号が違います", true, 500);
				}
			} else {
				app.notify.toast("桁数が違います", true, 500);
			}
		}
	},
	escape: function () {
		"use strict";
		clearTimeout(game.timer.id);
		game.timer.time.end = new Date();
		if (game.clearFlag > 28) {
			$.mobile.changePage("#clear");
		} else {
			$.mobile.changePage("#gameover");
		}
	},
	timer: {
		time: {
			start: null,
			end: null
		},
		id: null,
		skipcount: 0,
		hint6: function () {
			"use strict";
			$.mobile.changePage("#gameover");
		},
		hint5: function () {
			"use strict";
			app.notify.nezumiAlert("小箱のうち１つの鍵の番号はボク(ねずみ)の前にあるよ", true, 2000);	// オルゴール
			game.timer.id = setTimeout(game.timer.hint6, 600000);
		},
		hint4: function (passed) {
			"use strict";
			game.timer.id = setTimeout(game.timer.hint5, 600000);
			game.clearFlag += 8;	// 解毒薬見つける
			player.playClock();
			app.notify.alert("からくり時計が時報を告げている\n中に何かあるぞ！\n粉末の解毒薬を見つけた（このままでは持ち出すことはできそうにない）", true, 2000);
		},
		hint3: function (passed) {
			"use strict";
			game.timer.id = setTimeout(game.timer.hint4, 600000);
			app.notify.alert("カゴの鍵の側面に何か書いてあるようだ\n「ADBC」", true, 2000);		// カゴ（使うヒント番号を使う順で表示）
		},
		hint2: function (passed) {
			"use strict";
			game.timer.id = setTimeout(game.timer.hint3, 600000);
			app.notify.alert("この部屋には扉の他に小窓が１つあるが、とても人間が通れる大きさではなさそうだ", true, 2000);
		},
		hint1: function (passed) {
			"use strict";
			game.timer.id = setTimeout(game.timer.hint2, 600000);
			app.notify.dogAlert("どこかに犬がいるようだ\n家の中を通って逃げるのは危険だな", true, 2000);
		},
		logo: function () {
			"use strict";
			game.timer.id = setTimeout(function () {
				game.timer.id = null;
				$.mobile.changePage("#intro");
			}, 2000);
		},
		remain: function () {
			"use strict";
			$("#remain").text(60 - Math.round((new Date() - game.timer.time.start) / 60000) - (game.timer.skipcount * 10));
		},
		init: function (passed) {
			"use strict";
			game.timer.id = setTimeout(game.timer.hint1, 600000);
			game.timer.time.start = new Date();
			setInterval(game.timer.remain, 60000);
		}
	},
	skip: function () {
		"use strict";
		var nextHintId;
		nextHintId = Math.floor((new Date() - game.timer.time.start) / 600000) + 1 + game.timer.skipcount;
		if (nextHintId < 6) {
			clearTimeout(game.timer.id);
			eval("game.timer.hint" + nextHintId + "()");
			game.timer.skipcount += 1;
			game.timer.remain();
		} else {
			app.notify.alert("これ以上スキップできません", true, 2000);
		}
	},
	gameover: function () {
		"use strict";
		switch (game.clearFlag) {
			case 0:
			case 8:
			case 29:
			case 31:
				$("#gameovermessage").html("脱出に失敗したあなたは魔女に丸焼きにされて食べられてしまいました。");
				$("#gameoverbg").css("background-image", "url(images/witchhouse.png)");
				break;
			case 1:
			case 3:
			case 9:
			case 11:
			case 17:
			case 19:
			case 25:
			case 27:
				$("#gameovermessage").html("犬に見つかり魔女にも見つかってしまいました。<br>魔女に鳥かごに連れ戻されて丸焼きにされてしまいました。");
				$("#gameoverbg").css("background-image", "url(images/witchhouse.png)");
				break;
			case 5:
			case 7:
			case 21:
			case 23:
				$("#gameovermessage").html("解毒薬を手に入れずに逃げ出してきたせいで、あなたは鳥の姿のままです。<br>人間の姿に戻ることができませんでした。");
				$("#gameoverbg").css("background-image", "url(images/citybg.png)");
				$("#gameoverimage").attr("src", "images/bird.png");
				break;
			case 13:
			case 15:
				$("#gameovermessage").html("せっかく手に入れた解毒薬を放棄して逃げ出してきたせいで、あなたは鳥の姿のままです。<br>人間の姿に戻ることができませんでした。");
				$("#gameoverbg").css("background-image", "url(images/citybg.png)");
				$("#gameoverimage").attr("src", "images/bird.png");
				break;
			default:
				// 該当無し
				break;
		}
	},
	clear: function () {
		"use strict";
		var time = game.timer.time.end - game.timer.time.start;
		if (game.clearFlag === 31) {
			$("#winpose").css("background-image", "url(images/opentreasurebox.png)");
		}
		$("#gametime").text((new Date(time)).getMinutes() + game.timer.skipcount * 10);
	},
	save: function () {
		"use strict";
		localStorage.setItem("flag", game.clearFlag);
		localStorage.setItem("skipcount", game.timer.skipcount);
		localStorage.setItem("timer", new Date() - game.timer.time.start);
		localStorage.setItem("musicbox", $("#musicboxnumber").attr("readonly") ? true : false);
	},
	load: function () {
		"use strict";
		var passedTime, timeTemp, timerType;
		passedTime = parseInt(localStorage.getItem("timer"), 10);
		game.timer.skipcount = parseInt(localStorage.getItem("skipcount"), 10);
		game.clearFlag = parseInt(localStorage.getItem("flag"), 10);
		// ゲーム状態復元
		if (game.clearFlag & 1) {
			// カゴから抜け出した（カゴの鍵を開錠済み）
			$("#diallocknumber").val(game.answer.locknumber).attr("readonly", "readonly");
			$("#selectEscape").show();
			$("#boxes").show();
			$("#main").off("tap", "#openlock");
			$("#openlock").button("disable");
		}
		if (game.clearFlag & 2) {
			// 宝箱を開錠済み
			$("#treasureboxnumber").val(game.answer.treasurebox).attr("readonly", "readonly");
			$("#main").off("tap", "#opentreasurebox");
			$("#opentreasurebox").button("disable");
		}
		if (game.clearFlag & 16) {
			// カプセル発見済み（薬箱開錠済み）
			$("#medicineboxnumber").val(game.answer.medicinebox).attr("readonly", "readonly");
			$("#main").off("tap", "#openmedicinebox");
			$("#openmedicinebox").button("disable");
		}
		if (localStorage.getItem("musicbox") === "true") {
			// オルゴール開錠済み
			$("#musicboxnumber").val(game.answer.musicbox).attr("readonly", "readonly");
			$("#main").off("tap", "#openmusicbox");
			$("#openmusicbox").button("disable");
		}
		// タイマー復元
		game.timer.time.start = new Date() - passedTime;
		timeTemp = passedTime / 600000;
		timerType = Math.floor(timeTemp) + 1;
		game.timer.id = setTimeout(game.timer["hint" + timerType], 600000 - ((timeTemp - Math.floor(timeTemp)) * 600000));
		game.timer.remain();
		// まだカゴから出れていなくて、カゴから出るヒント（hintB）の表示時間を過ぎていたら、もう一度出してあげる
		if (timerType > 3 && !(game.clearFlag & 1)) {
			$(document).on("pageshow", "#main", function () {
				app.notify.alert("そういえば、鍵の側面に何か書いてあったぞ\n「ADBC」");		// カゴ（使うヒント番号を使う順で表示）
			});
		}
	},
	clearStorage: function () {
		"use strict";
		localStorage.clear();
	},
	mapping: function () {
		"use strict";
		$("#logo").on("tap", "#logoButton", function () {
			clearTimeout(game.timer.id);
			game.timer.id = null;
		});
		$("#main").on("tap", "#openlock", function () {
			game.check.locknumber();
		}).on("tap", "#opentreasurebox", function () {
			game.check.treasurebox();
		}).on("tap", "#openmedicinebox", function () {
			game.check.medicinebox();
		}).on("tap", "#openmusicbox", function () {
			game.check.musicbox();
		}).on("tap", "#medicinebox", function () {
			app.notify.alert("裏に何か書いてある\n「ごまちゃんがテトラポットで積み木をしている」\n何のことだ？");
		}).on("tap", ".exit", function () {
			application.end();
		}).on("tap", "#escapeDoor", function () {
			game.escape();
		}).on("tap", "#escapeWindow", function () {
			game.clearFlag += 4;	// 小窓から出る
			game.escape();
		}).on("tap", "#savebtn", function () {
			$(this).removeClass("ui-btn-active");
			game.save();
			app.notify.alert("状態を保存しました。");
		}).on("tap", "#exitbtn", function () {
			$(this).removeClass("ui-btn-active");
			if (confirm("終了しますか？")) {
				location.href = "index.html";
			}
		}).on("tap", "#skipbtn", function () {
			$(this).removeClass("ui-btn-active");
			game.skip();
		});
		$("#story").on("tap", "#startGame", function () {
			if (game.timer.id === null) {
				game.timer.init();
			}
		}).on("tap", "#startHintGame", function () {
			game.specialFlag = 1;
			if (game.timer.id === null) {
				game.timer.init();
			}
		}).on("tap", "#continueGame", function () {
			$(document).on("pagebeforeshow", "#main", function () {
				game.load();
			});
		}).on("tap", "#deleteGame", function () {
			game.clearStorage();
			$("#continueGame").add("#deleteGame").hide();
		});
		$("#gameover").on("tap", ".exit", function () {
			app.end();
		}).on("tap", ".sendMessage", function () {
			app.sendMessage();
		});
		$("#message").on("tap", ".exit", function () {
			app.end();
		});
		$(document).on("pagebeforeshow", "#story", function () {
			if (localStorage.getItem("flag") === null) {
				$("#continueGame").add("#deleteGame").hide();
			}
		});
	}
};

app = {
	jqm: {
		init: function () {
			"use strict";
			$.mobile.defaultPageTransition = "pop";
			$.mobile.phonegapNavigationEnabled = true;
		}
	},
	notify: {
		alert: function (message) {
			"use strict";
			alert(message);
		},
		toast: function (message) {
			"use strict";
			alert(message);
		},
		dogAlert: function (message) {
			"use strict";
			alert(message);
		},
		nezumiAlert: function (message) {
			"use strict";
			alert(message);
		}
	},
	format: function () {
		"use strict";
		$(document).on("pagebeforeshow", "#main", function () {
			$(".numberInput").css("display", "inline-block").css("width", "60%");
			$(".lateHide").hide();
			if (game.specialFlag === 1) {
				$("#puzzleImage").attr("src", "images/codec2.jpg");
				$("#specialhint1").show();
			}
		}).on("pagebeforeshow", "#clear", function () {
			game.clear();
		}).on("pagebeforeshow", "#gameover", function () {
			game.gameover();
		});
		game.timer.logo();
	},
	end: function () {
		"use strict";
		game.clearStorage();
		location.href = "index.html";
	},
	sendMessage: function () {
		"use strict";
			$.mobile.changePage("#message");
	},
	init: function () {
		"use strict";
		app.jqm.init();
		app.format();
		game.mapping();
	}
};

$(document).ready(function () {
	"use strict";
	app.init();
});