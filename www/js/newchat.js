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

var go = function(user) {
	var sess = window.localStorage.getItem("sess");
	var html = new XMLHttpRequest();
	html.open("POST", "https://messenger.stibarc.gq/api/newchat.sjs", false);
	html.send("sess="+sess+"&user="+user);
	var tmp = html.responseText.split("\n");
	if (tmp[0] != "bad") {
		location.href = "chat.html?id="+tmp[0];
	} else {
		document.getElementById("none").style.display = "";
	}
}

window.onload = function() {
	var id = getAllUrlParams().id;
	if (id != undefined && id != "") {
		go(id);
	}
	document.getElementById("go").onclick = function(e) {
		var username = document.getElementById("username").value;
		if (username != "" && username != undefined) {
			go(username);
		}
	}
}