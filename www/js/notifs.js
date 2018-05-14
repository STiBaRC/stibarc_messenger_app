var checkNotifs = function(sess) {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("POST", "https://messenger.stibarc.gq/api/getnotifs.sjs", false);
	xmlHttp.send("sess="+sess);
	var tmp = xmlHttp.responseText.split("\n");
	var lastID = window.localStorage.getItem("lastNotifID");
	if (lastID == "" || lastID == undefined || lastID == null) {lastID = -1;}
	if (tmp[0].concat(tmp[1]) != lastID) {
		var text = tmp[3].replace(/<br\/>/g, "\n");
		var user = tmp[2];
		window.localStorage.setItem("lastNotifID", tmp[0].concat(tmp[1]));
		cordova.plugins.notification.local.schedule({
			title: user,
			message: text,
			icon: "icon.png"
		});
		cordova.plugins.notification.local.on("click", function (notification) {
			window.location.assign("chat.html?id="+tmp[1]+"#"+tmp[0]);
		});
	}
}

var doCheck = function() {
	var sess = window.localStorage.getItem("sess");
	checkNotifs(sess);
}

var startNotifs = function() {
	setInterval(doCheck, 500);
}