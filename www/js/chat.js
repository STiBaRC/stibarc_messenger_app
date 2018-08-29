var first = true;

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
	var div = document.createElement('div');
	div.className = 'chatbox'
	div.setAttribute("name", i+1);
	div.innerHTML = '<a href="https://stibarc.gq/user.html?id='+oof['sender']+'">'+oof['sender']+'</a><br/>'+oof['message'];
	document.getElementById("chatstuffs").appendChild(div);
	document.getElementById("chatstuffs").innerHTML = document.getElementById("chatstuffs").innerHTML.concat("<br/>");
}

var oldresponse = "";
var inloop = false;

var getchatsloop = function(tmp, i) {
	toBox(tmp[i],i);
	window.scrollTo(0,document.body.scrollHeight);
	if (tmp[i+1] != undefined) {
		setTimeout(function() {getchatsloop(tmp, i+1)},1);
	} else {
		inloop = false;
	}
}

var getchats = function(id, sess) {
	var http = new XMLHttpRequest();
	http.open("POST", "https://messenger.stibarc.gq/api/v2/getuserchat.sjs", true);
	http.send("id="+id+"&sess="+sess);
	http.onload = function(e) {
		if (http.responseText != oldresponse && !inloop) {
			oldresponse = http.responseText;
			var tmp = JSON.parse(http.responseText);
			if (first) {
				first = false;
				inloop = true;
				document.getElementById("chatstuffs").innerHTML = document.getElementById("chatstuffs").innerHTML.concat("<br/>");
				getchatsloop(tmp, 0);
			} else {
				toBox(tmp[Object.keys(tmp).length-1],Object.keys(tmp).length-1);
				window.scrollTo(0,document.body.scrollHeight);
			}
		}
		setTimeout(function(){getchats(id, sess);}, 500);
	}
}

var sendtext = function(sess,username,id) {
	var text = document.getElementById("input").value;
	document.getElementById("input").value = "";
	var tmp = text.split("\n");
	if (tmp[tmp.length-1] == "") {
		tmp.pop();
	}
	text = tmp.join("\n");
	if (text != "" && text != undefined) {
		var chathttp2 = new XMLHttpRequest();
		chathttp2.open("POST", "https://messenger.stibarc.gq/api/postchat.sjs", true);
		chathttp2.send("sess="+sess+"&other="+username+"&id="+id+"&message="+encodeURIComponent(text));
	}
}

window.onload = function() {
	first = true;
	var id = getAllUrlParams().id;
	var sess = window.localStorage.getItem("sess");
	var chathttp = new XMLHttpRequest();
	chathttp.open("POST", "https://messenger.stibarc.gq/api/v2/getuserchats.sjs", true);
	chathttp.send("sess="+sess);
	chathttp.onload = function(e) {
		var tmp = JSON.parse(chathttp.responseText);
		var username = tmp[id]['user'];
		document.getElementById("user").innerHTML = "<b>"+username+"</b>";
		document.getElementById("send").onclick = function(e) {
			sendtext(sess,username,id);
		}
		var shifted = false;
		document.getElementById("input").addEventListener("keydown", function(e) {
			if (e.keyCode == 16) {
				shifted = true;
			}
		});
		document.getElementById("input").addEventListener("keyup", function(e) {
			if (e.keyCode == 13 && shifted == false) {
				sendtext(sess,username,id);
			}
			if (e.keyCode == 16) {
				shifted = false;
			}
		});
		getchats(id, sess);
		startNotifs();
	}
}
