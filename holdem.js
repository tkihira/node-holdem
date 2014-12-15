var Resource = require("./resource.js");
var Message = require("./resource.js").Message;
var Tournament = require("./tournament.js");

var Status = {
	UNINITED: "uninited",
	SEATING: "seating",
	GAMING: "gaming",
	FINISHED: "finished"
};

var Holdem = function(shutdownCallback) {
	this.status = Status.UNINITED;
	this.tournament = null;
	this.shutdownCallback = shutdownCallback;
	this.messageFunc = function(msg) { console.log(msg); };
};
Holdem.prototype.message = function(msg) {
	for(var i = 1; i < arguments.length; i++) {
		msg = msg.replace("%" + i, arguments[i]);
	}
	this.messageFunc(msg);
};
Holdem.prototype.setMessageFunc = function(msgFunc) {
	this.messageFunc = msgFunc;
};
Holdem.prototype.info = function(msg) {
	this.message("INFO: " + msg);
};
Holdem.prototype.error = function(msg) {
	this.message("ERROR: " + msg);
};
Holdem.prototype.confirm = function(sender, commandLine, msg) {
	this.cancelConfirm();

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
	if(this.currentConfirm) {
		this.message(Message.CONFIRM_CANCELED + this.currentConfirm.sender + " " + this.currentConfirm.commandLine);
		this.currentConfirm = null;
	}
};

Holdem.prototype.command = function(sender, commandLine, force) {
	// console.log("[" + sender + ":" + commandLine + "]");
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
				this.shutdownCallback && this.shutdownCallback();
			}
			break;
		case "join":
			if(this.status == Status.SEATING) {
				var ret = this.tournament.join(sender);
				if(ret.result) {
					this.message(Message.JOINED_SUCCESSFULLY, sender, Resource.Config.maxPlayer - ret.playerCount);
					if(ret.playerCount == Resource.Config.maxPlayer) {
						// sealed and start
						this.command(null, "start", true);
					}
				} else {
					this.message(ret.reason, sender);
				}
			}
			break;
		case "start":
			if(this.status == Status.SEATING) {
				if(this.tournament.getPlayerCount() < 2) {
					this.message(Message.NOT_ENOUGH_PLAYER);
				} else {
					if(!force) {
						this.confirm(sender, commandLine, Message.CONFIRM_START);
					} else {
						this.tournament.seal();
						this.message(Message.START_GAME, this.tournament.getPlayerCount(), "$" + Resource.Config.buyin.toFixed(2));
						this.tournament.init();
						// start gaming
						this.status = Status.GAMING;
						this.command(null, "info");
					}
				}
			}
			break;
		case "info":
			if(this.status == Status.GAMING) {
				var prize = "";
				this.tournament.prizeStructure.forEach(function(e) {
					prize += "$" + e.toFixed(2) + " ";
				});
				this.message(Message.TOURNAMENT_INFO, this.tournament.getPlayerCount(), this.tournament.blindLevel, this.tournament.prizeStructure.length, prize);
			}
			break;
	}
};

Holdem.prototype.init = function(max, prizeList) {
	if(this.status != Status.UNINITED) {
		this.error(Message.ALREADY_INITIALIZED);
		return;
	}
	this.tournament = new Tournament();
	this.status = Status.SEATING;
	this.message(Message.INITIALIZED, Resource.Config.maxPlayer);
};

module.exports = Holdem;
