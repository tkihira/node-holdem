var Message = require("./resource").Message;

var Table = function() {
	this.sealed = false;
	this.playerList = [];
};

Table.prototype.join = function(name) {
	if(this.sealed) {
		return {result: false, reason: Message.TABLE_ALREADY_SEALED};
	}
	if(this.playerList.indexOf(name) != -1) {
		return {result: false, reason: Message.TABLE_USER_ALREADY_JOINED};
	}
	if(this.playerList.length >= 10) {
		return {result: false, reason: Message.TABLE_USER_MAX};
	}
	this.playerList.push(name);
	return {result: true, playerCount: this.playerList.length};
};
Table.prototype.seal = function() {
	this.sealed = true;
};

Table.prototype.getPlayerCount = function() {
	return this.playerList.length;
};

module.exports = Table;
