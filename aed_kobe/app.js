// --- Initialize
var conf= {
	apikey: "395438557a73754b797242386263373337487532756e69524c6743672f6d4d6e4d726279505148432f4536",
	map: {
		zoomLevel: 16,
		center: {lat: 34.690152, lng: 135.195523}
	}
};


// --- Add event handlers
$(function() {

});


// --- Objects
var app = {
	aedData: null,
	init: function() {
		// AEDデータを取得
		kobe.getAed(function(data) {
			// 現在地
			var here = conf.map.center;
			gps.getHere_dfd().done(function(pos) {
				here = pos;
				app.aedData = $(data).find("marker").each(function() {
					var $t = $(this);
					$t.attr("note", ($t.attr("note") == "対応不可") ? "不可" : "可");
					// 距離の割り出しを行ない、各データにdistance属性を設定
					$t.attr("distance", map.getDistance($t.attr("lat"), $t.attr("lng"), here.lat, here.lng, 0, 4) / 1000); //kmで算出
				});
				// 現在地からの距離が小さい順にソート
				app.aedData.sort(function(a, b){
					return ($(a).attr("distance") < $(b).attr("distance")) ? -1 : 1;
				});

				$.when(
					app.createList(),
					map.createMap(here)
				).done(function() {
					app.addMarker();
				}).fail();
			}).fail(function(e) {
				console.error(e);
				console.log("hoge");
			});
		}, function(xhr, status) {
			console.log("KOBE AED data wasn't get. because xhr status: " + status);
			console.error(xhr);
		});
	},
	addMarker: function() {
		app.aedData.each(function() {
			var $t = $(this);
			map.createMarker({
					name: $t.attr("name"),
					category: $t.attr("category"),
					zipcode: $t.attr("zipcode"),
					location: $t.attr("location"),
					note: $t.attr("note"),
					distance: $t.attr("distance")
				},
				$t.attr("lat"),
				$t.attr("lng")
			);
		});
		map.markMe(gps.here.lat, gps.here.lng);
	},
	createList: function() {
		// リストの幅計算が失敗するらしい。タイミング的な問題な気がする。エンジンのバグだろうから回避策だけ入れておく。
		// ⇒最初に非表示にしておいてリスト構築完了後.5秒待って再表示
		var $listContainer = $("#listContainer").hide(),
			$list = $("#list");
		app.aedData.each(function() {
			var $t = $(this),
				li = template.list;
			li = li.replace(/{name}/, $t.attr("name")).replace(/{category}/, $t.attr("category")).replace(/{zipcode}/, $t.attr("zipcode")).replace(/{location}/, $t.attr("location")).replace(/{note}/, $t.attr("note")).replace(/{dist}/, $t.attr("distance"));
			$list.append(li);
		});
		setTimeout("$('#listContainer').show()", 500);
	}
},
gps = {
	here: null,
	getHere_dfd: function() {
		var dfd = $.Deferred();
		if( !navigator.geolocation ) {
			dfd.reject();
		}
		navigator.geolocation.getCurrentPosition(function(position) {
			gps.here = {lat: position.coords.latitude, lng: lng = position.coords.longitude};
    		dfd.resolve(gps.here);
		},
		function(error) {
			dfd.reject();
		},
		{
			enableHighAccuracy:true, //位置情報の精度を高く
			timeout: 10000, //10秒でタイムアウト
			maximumAge: 600000 //10分間有効
		});
		return dfd.promise();
	}
},
map = {
	map: null,
	markers: [],
	me: null,
	infoWindow: null,
	init: function() {
		map.infoWindow = new google.maps.InfoWindow();
		app.init();
	},
	createMap: function(center) {
		map.map = new google.maps.Map(
				$("#map")[0], {
					zoom: conf.map.zoomLevel,
					center: center,
					mapTypeId: google.maps.MapTypeId.TERRAIN
				}
		);
	},
	createMarker: function(meta, lat, lng) {
		var marker = new google.maps.Marker({position: new google.maps.LatLng(lat, lng), map: map.map});
		google.maps.event.addListener(marker, "click", function() {
			var content = template.infoWindow;
			content = content.replace(/{name}/, meta.name).replace(/{category}/, meta.category).replace(/{zipcode}/, meta.zipcode).replace(/{location}/, meta.location).replace(/{note}/, meta.note).replace(/{dist}/, meta.distance);
			map.infoWindow.close();
			map.infoWindow.setContent(content);
			map.infoWindow.open(map.map, marker);
		});
		map.markers.push(marker);
	},
	markMe: function(lat, lng) {
		map.me = new google.maps.Marker({
			position: new google.maps.LatLng(lat, lng),
			map: map.map,
			title: "I'm here.",
			icon: new google.maps.MarkerImage("me.png", new google.maps.Size(50, 103), new google.maps.Point(0, 0))
		});
	},
	getDistance: function(lat1, lng1, lat2, lng2, precision) {
		/**
		 * 2点間の緯度経度から距離を取得
		 * 測地線航海算法を使用して距離を算出する。
		 * @see http://hamasyou.com/blog/2010/09/07/post-2/
		 * @param float 緯度1
		 * @param float 経度2
		 * @param float 緯度2
		 * @param float 経度2
		 * @param 小数点以下の桁数(べき乗で算出精度を指定)
		 */
		var distance = 0;
		if( ( Math.abs(lat1 - lat2) < 0.00001 ) && ( Math.abs(lng1 - lng2) < 0.00001 ) ) {
			distance = 0;
		} else {
			lat1 = lat1 * Math.PI / 180;
			lng1 = lng1 * Math.PI / 180;
			lat2 = lat2 * Math.PI / 180;
			lng2 = lng2 * Math.PI / 180;

			var A = 6378140;
			var B = 6356755;
			var F = ( A - B ) / A;

			var P1 = Math.atan( ( B / A ) * Math.tan(lat1) );
			var P2 = Math.atan( ( B / A ) * Math.tan(lat2) );

			var X = Math.acos( Math.sin(P1) * Math.sin(P2) + Math.cos(P1) * Math.cos(P2) * Math.cos(lng1 - lng2) );
			var L = ( F / 8 ) * ( ( Math.sin(X) - X ) * Math.pow( (Math.sin(P1) + Math.sin(P2) ), 2) / Math.pow( Math.cos(X / 2), 2 ) - ( Math.sin(X) - X ) * Math.pow( Math.sin(P1) - Math.sin(P2), 2 ) / Math.pow( Math.sin(X), 2) );

			distance = A * ( X + L );
			var decimal_no = Math.pow(10, precision);
			distance = Math.round(decimal_no * distance / 1) / decimal_no;
		}
		return distance;
	}
},
kobe = {
	getAed: function(success, fail) {
		$.ajax({
			url: "aed_kobe.xml",
			//url: "http://www.city.kobe.lg.jp/safety/fire/ambulance/aedmap/aed_kobe.xml",
			dataType: "xml",
			success: function(data, xhr, status) {
				success(data)
			},
			error: function(xhr, status) {
				fail(xhr, status);
			}
		});
	}
},
docomo = {
	ajax: function(url, data, success, error, async) {
		var asyncValue = async || false
		$.ajax({
			url: url,
			data: $.extend(data, {APIKEY: conf.apikey}),
			async: asyncValue,
			dataType: "json",
			success: success,
			error: error
		});
	}
};


// --- Templates
var template = {
	list: "<li><div><div class=\"listName\">{name}</div><span class=\"listCategory\">{category}</span><span class=\"listZipcode\">{zipcode}</span><span class=\"listLocation\">{location}</span><span class=\"list24h\">{note}</span><div>ここから {dist}Km</div></div></li>",
	infoWindow: "<div><div class=\"listCategory\">【{category}】</div></div><div class=\"listName\">{name}</div><div><span class=\"listZipcode\">〒{zipcode}</span> <span class=\"listLocation\">{location}</span></div><div class=\"list24h\">24H対応：{note}</div><div>ここから {dist}Km</div></div></div>"
};
