function getAllUrlParams(url) {
    var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
    var obj = {};
    if (queryString) {
        queryString = queryString.split('#')[0];
        var arr = queryString.split('&');
        for (var i = 0; i < arr.length; i++) {
            var a = arr[i].split('=');
            var paramNum = undefined;
            var paramName = a[0].replace(/\[\d*\]/, function (v) {
                paramNum = v.slice(1, -1);
                return '';
            });
            var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];
            paramName = paramName;
            paramValue = paramValue;
            if (obj[paramName]) {
                if (typeof obj[paramName] === 'string') {
                    obj[paramName] = [obj[paramName]];
                }
                if (typeof paramNum === 'undefined') {
                    obj[paramName].push(paramValue);
                }
                else {
                    obj[paramName][paramNum] = paramValue;
                }
            }
            else {
                obj[paramName] = paramValue;
            }
        }
    }
    return obj;
}

var toBox = function(oof,i) {
	var tmp = oof.split(":");
	var username = tmp[0].replace(/<script/g, "&lt;script").replace(/<meta/g, "&lt;meta");
	tmp.shift();
	tmp = tmp.join(":");
	var div = document.createElement('div');
	div.className = 'chatbox'
	div.setAttribute("name", i+1);
	div.innerHTML = '<a href="https://stibarc.gq/user.html?id='+username+'">'+username+'</a><br/>'+tmp;
	document.getElementById("chatstuffs").appendChild(div);
	document.getElementById("chatstuffs").innerHTML = document.getElementById("chatstuffs").innerHTML.concat("<br/>");
}

var getchats = function(id, sess) {
	var http = new XMLHttpRequest();
	http.open("POST", "https://messenger.stibarc.gq/api/getuserchat.sjs", true);
	http.send("id="+id+"&sess="+sess);
	http.onload = function(e) {
		var tmp = http.responseText.split("\n");
		if (tmp[0] == "CHATHEAD") {
			document.getElementById("chatstuffs").innerHTML = "<br/>";
			tmp.shift();
			for (var i = 0; i < tmp.length-1; i++) {
				toBox(tmp[i].replace(/<script/g, "&lt;script").replace(/<meta/g, "&lt;meta").replace(/<\/script/g, "&lt;/script"),i);
			}
		}
	}
}

window.onload = function() {
	var id = getAllUrlParams().id;
	var sess = window.localStorage.getItem("sess");
	var chathttp = new XMLHttpRequest();
	chathttp.open("POST", "https://messenger.stibarc.gq/api/getuserchats.sjs", false);
	chathttp.send("sess="+sess);
	var tmp = JSON.parse(chathttp.responseText);
	var username = tmp[id]['user'];
	document.getElementById("user").innerHTML = "<b>"+username+"</b>";
	setInterval(function(){getchats(id, sess);}, 500);
	startNotifs();
	document.getElementById("send").onclick = function(e) {
		var text = document.getElementById("input").value;
		document.getElementById("input").value = "";
		if (text != "" && text != undefined) {
			var chathttp2 = new XMLHttpRequest();
			chathttp2.open("POST", "https://messenger.stibarc.gq/api/postchat.sjs", false);
			chathttp2.send("sess="+sess+"&other="+username+"&id="+id+"&message="+encodeURIComponent(text.replace(/\n/g, "<br/>")));
			getchats(id, sess);
		}
	}
}