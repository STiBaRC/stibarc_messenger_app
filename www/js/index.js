var checkSess = function() {
	var sess = window.localStorage.getItem("sess");
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("get", "https://api.stibarc.gq/checksess.sjs?sess="+sess, false);
	xmlHttp.send(null);
	if (xmlHttp.responseText.split("\n")[0] == "bad") {
		window.localStorage.removeItem("sess");
		window.localStorage.removeItem("username");
		location.reload();
	}
}

var getUsername = function() {
	var sess = window.localStorage.getItem("sess");
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("POST", "https://api.stibarc.gq/getusername.sjs", false);
	xmlHttp.send("sess="+sess);
	window.localStorage.setItem("username", xmlHttp.responseText.split("\n")[0]);
}

var getChats = function() {
	document.getElementById("mainblobshitwithlist").innerHTML = "<br/>";
	var sess = window.localStorage.getItem("sess");
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("POST", "https://messenger.stibarc.gq/api/v2/getuserchats.sjs", true);
	xmlHttp.send("sess="+sess);
	xmlHttp.onload = function(e) {
		var tmp = JSON.parse(xmlHttp.responseText);
		for (key in tmp) {
			var div = document.createElement('div');
			div.className = 'chatbox';
			div.innerHTML = '<a href="chat.html?id='+key+'">'+tmp[key]['user']+"</a>:";
			if (tmp[key]['lastmessage'] == undefined) {tmp[key]['lastmessage'] = {sender: tmp[key]['user'], message: "No messages sent yet"}}
			div.innerHTML = div.innerHTML.concat("<br/><i>"+tmp[key]['lastmessage']['sender']+":"+tmp[key]['lastmessage']['message']+"</i>");
			document.getElementById("mainblobshitwithlist").appendChild(div);
			document.getElementById("mainblobshitwithlist").innerHTML = document.getElementById("mainblobshitwithlist").innerHTML.concat("<br/>");
		}
	}
}

window.onload = function() {
	document.getElementById("loginbutton").onclick = function(evt) {
		location.href = "login.html";
	}
	var sess = window.localStorage.getItem("sess");
	if (sess == undefined || sess == null || sess == "") {
		document.getElementById("loggedoutcontainer").style.display = "";
		document.getElementById("loggedincontainer").style.display = "none";
		document.getElementsByTagName("footer")[0].style.display = "none";
	} else {
		checkSess();
		getChats();
		startNotifs();
	}
	if (window.localStorage.getItem("username") == "" || window.localStorage.getItem("username") == undefined) {
		if (sess != undefined && sess != null && sess != "") {
			getUsername();
		}
	}
}
