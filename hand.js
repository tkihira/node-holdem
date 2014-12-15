var Hand = function() {
	this.cards = null;
	this.cardIndex = 0;
};

Hand.prototype.init = function(tournament) {
	var original_cards = [];
	for(var i = 0; i < 52; i++) {
		original_cards[i] = i;
	}
	var cards = [];
	while(original_cards.length) {
		var index = (original_cards.length * Math.random()) | 0;
		cards.push(original_cards[index]);
		original_cards.splice(index, 1);
	}
	this.cards = cards;
	this.cardIndex = 0;

	;
};

module.exports = Hand;
