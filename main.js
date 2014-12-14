var Holdem = require("./Holdem");
var readline = require("readline");
var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

var user = "root";

var active = true;
var shutdown = function() {
	rl.close();
	active = false;
};

var holdem = new Holdem(shutdown);
process.stdout.write(user + "> ");

rl.on("line", function(line) {
	if(line.split(" ")[0] == "user") {
		user = line.split(" ")[1];
	} else {
		holdem.command(user, line);
	}
	active && process.stdout.write(user + "> ");
});

