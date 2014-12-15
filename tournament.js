var Resource = require("./resource");
var Message = require("./resource").Message;

var Tournament = function() {
	this.blindStructure = Resource.BlindStructure.regular;
	this.prizeStructure = null;
	this.blindLevel = Resource.Config.blindLevel; // minutes

	this.sealed = false;
	this.playerList = [];
	this.startTime = 0;
};

Tournament.prototype.getDefaultPrizeStructure = function() {
	var players = this.playerList.length;
	var amount = players * Resource.Config.buyin;
	if(players <= 3) {
		return [amount];
	}
	if(players <= 7) {
		return [amount * 0.65, amount * 0.35];
	}
	return [amount * 0.5, amount * 0.3, amount * 0.2];
};

Tournament.prototype.join = function(name) {
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
Tournament.prototype.seal = function() {
	this.sealed = true;
};

Tournament.prototype.getPlayerCount = function() {
	return this.playerList.length;
};

Tournament.prototype.init = function() {
	this.startTime = Date.now();
	if(!this.prizeStructure) {
		this.prizeStructure = this.getDefaultPrizeStructure();
	}
};
Tournament.prototype.getCurrentBlindLevel = function() {
	var level = (Date.now() - this.startTime) / 1000 / 60 / this.blindLevel;
	return Math.max(this.blindLevel.length - 1, (level | 0));
};

module.exports = Tournament;
