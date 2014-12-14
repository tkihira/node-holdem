var Resource = {
	Config: {
		MaxPlayer: 10,
	},
	Message: {
		ALREADY_INITIALIZED: "既に初期化されています",
		INITIALIZED: "テキサスホールデムに参加される方は「join」と書いてください(最大%1名)",
		CONFIRM_PREFIX: "確認: ",
		CONFIRM_POSTFIX: " (y/n)",
		CONFIRM_CANCELED: "キャンセルされました: ",
		CONFIRM_SHUTDOWN: "シャットダウンしてよろしいですか？",
		TABLE_ALREADY_SEALED: "すでに参加申し込みは打ち切られています",
		TABLE_USER_ALREADY_JOINED: "%1さんは既に参加されています",
		TABLE_USER_MAX: "すでにテーブルは一杯です。これ以上参加出来ません",
		JOINED_SUCCESSFULLY: "%1さんが参加しました。残り%2名参加可能です。今すぐ開始する場合は「start」と書いてください",
		NOT_ENOUGH_PLAYER: "参加者が足りません。最低2名必要です",
		CONFIRM_START: "ゲームを開始してよろしいですか？",
		START_GAME: "ゲームを開始します。参加者は%1名です",
	},
};

module.exports = Resource;
