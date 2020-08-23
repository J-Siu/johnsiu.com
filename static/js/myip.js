// --- /home/myip.md

function myip(ipv) {
	fetch('//myip' + ipv + '.jsiu.dev')
		.then(r => r.text())
		.then(t => document.getElementById('myip' + ipv).innerHTML = t)
}

// Get SPF result
function googleIp2table() {
	fetch('//dns.google/resolve?name=_spf.google.com&type=txt')
		.then(j => j.json())
		.then(j => spf2blocks(JSON.parse(j.Answer[0].data)))
		.then(b => {
			var ip = []
			ip.v4 = []
			ip.v6 = []
			for (i = 0; i < b.length; i++) {
				fetch('//dns.google/resolve?name=' + b[i] + '&type=txt')
					.then(k => k.json())
					.then(k => block2ip(JSON.parse(k.Answer[0].data)))
					.then(c => {
						ip.v4 = ip.v4.concat(c.v4).sort(ip_compare)
						ip.v6 = ip.v6.concat(c.v6).sort(ip_compare)
						document.getElementById("v4").innerHTML = ip2table("IPv4", ip.v4)
						document.getElementById("v6").innerHTML = ip2table("IPv6", ip.v6)
					})
			}
		})
}

// --- /blog/google-ip.md

// Get blocks from SPF
function spf2blocks(msg) {
	// split by space
	var str = msg.split(" ")
	var blocks = []
	var tmp = []
	for (i = 0; i < str.length; i++) {
		tmp = str[i].split(":")
		// add "include" to block list
		if (tmp[0] === "include") {
			blocks.push(tmp[1])
		}
	}
	return blocks
}

// IPv4/6 list
function block2ip(msg) {
	// split by space
	var str = msg.split(" ")
	var ip = []
	ip.v4 = []
	ip.v6 = []
	for (i = 0; i < str.length; i++) {
		if (str[i].startsWith("ip4:")) {
			ip.v4.push(str[i].substring(4, str[i].length))
		}
		if (str[i].startsWith("ip6:")) {
			ip.v6.push(str[i].substring(4, str[i].length))
		}
	}
	return ip
}

// IP list to table
function ip2table(title, list) {
	var str = ""
	str += "<table>"
	str += "<tbody>"
	for (i = 0; i < list.length; i++) {
		str += "<tr><td>" + list[i] + "</td></tr>"
	}
	str += "</tbody>"
	str += "</table>"
	return str
}

function ip_compare(a, b) {
	var delimiter = "." // IPv4
	if (a.indexOf(":") > -1) {
		delimiter = ":" // IPv6
	}
	var ip1 = a.split(delimiter)
	var ip2 = b.split(delimiter)
	for (i = 0; i < ip1.length; i++) {
		if (ip1[i] != ip2[i]) {
			return (ip1[i] - ip2[i])
		}
	}
	return 0
}

myip(4)
myip(6)