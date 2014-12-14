var Resource = require("./resource.js");
var Message = require("./resource.js").Message;
var Table = require("./table.js");

var Holdem = function() {
	this.table = null;
};
Holdem.prototype.message = function(msg) {
	console.log(msg);
};
Holdem.prototype.info = function(msg) {
	this.message("INFO: " + msg);
};
Holdem.prototype.error = function(msg) {
	this.message("ERROR: " + msg);
};
Holdem.prototype.confirm = function(sender, commandLine, msg) {
	if(this.currentConfirm) {
		this.cancelConfirm();
	}

	this.message(Message.CONFIRM_PREFIX + msg + Message.CONFIRM_POSTFIX);
	this.currentConfirm = {sender: sender, commandLine: commandLine};
};
Holdem.prototype.answerConfirm = function(sender, answer) {
	if(!this.currentConfirm || this.currentConfirm.sender != sender) {
		return;
	}
	if(answer == "yes" || answer == "y") {
		this.command(this.currentConfirm.sender, this.currentConfirm.commandLine, true);
		this.currentConfirm = null;
	} else {
		this.message(Message.CONFIRM_CANCELED + this.currentConfirm.commandLine);
	}
};
Holdem.prototype.cancelConfirm = function() {
	this.message(Message.CONFIRM_CANCELED + this.currentConfirm.sender + " " + this.currentConfirm.commandLine);
	this.currentConfirm = null;
};

Holdem.prototype.command = function(sender, commandLine, force) {
	var commandArgs = commandLine.split(" ");
	var command = commandArgs.shift().toLowerCase();
	command = command.split("-").join(""); // remove "-" like "all-in"
	switch(command) {
		case "init":
			this.init();
			break;
		case "yes":
		case "y":
		case "no":
		case "n":
			this.answerConfirm(sender, command);
			break;
		case "shutdown":
			if(!force) {
				this.confirm(sender, commandLine, Message.CONFIRM_SHUTDOWN);
			} else {
				this.error("shutdown not implemented");
			}
			break;
	}
};

Holdem.prototype.init = function(max, prizeList) {
	if(this.table) {
		this.error(Message.TABLE_ALREADY_INITIALIZED);
		return;
	}
	var table = new Table();
	this.table = table;
};

module.exports = Holdem;

var test = new Holdem();
test.command("root", "init");
test.command("root", "shutdown");
test.command("root", "shutdown");
test.command("root", "yes");

