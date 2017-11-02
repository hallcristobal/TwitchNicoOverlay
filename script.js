let button;
let container;
let room;

let pushMessage;
let origPushMessage;

let log = (message) => {
	console.log('[Nico] ' + message + ' (Host: ' + window.location.host + ')');
};

let initialize = (attempts) => {
	var loaded = App.__container__.lookup('controller:channel');
	if (!loaded) {
		log("Not Loaded.");
		return setTimeout(initialize.bind(this, attempts), 1000);
	}

	App.__container__.lookup("controller:channel").get('chat').addObserver("currentChannelRoom", setupChatHook);
	App.__container__.lookup("controller:channel").addObserver("content.stream.isLoading", setupElements);
	setupChatHook();
	setupElements();
};

let setupChatHook = () => {
	log("Hooking Chat.");
	room = App.__container__.lookup("controller:channel").get("chat.currentChannelRoom");
	if (!room) {
		log("Room was null");
		return;
	}
	origPushMessage = room.pushMessage.bind(room);

	room.pushMessage = (msg) => {
		origPushMessage(msg);
		parseMsg(msg).then();
	}
	log("Chat Hooked.");
}

async function parseMsg(msg) {
	var div = document.createElement('div');
	var height = 2.5;
	var duration = 5 + 6 * Math.random();
	div.style.position = 'absolute';
	div.style.color = '#eee';
	div.style.fontSize = height + 'vh';
	div.style.lineHeight = height + 'vh';
	div.style.top = (100 - height) * Math.random() + '%';
	div.style.left = '100%';
	div.style.transitionDuration = duration + 's';
	div.style.transitionProperty = 'left';
	div.style.transitionTimingFunction = 'linear';
	div.style.whiteSpace = 'nowrap';
	div.style.boxSizing = 'content-box';

	var tokens = [msg.message];
	var emotes = _.reduce(msg.tags.emotes, function (flattened, indicesToReplace, emoticonId) {
		if ("length" in indicesToReplace[0]) {
			indicesToReplace.forEach(function (index) {
				flattened.push({ emoticonId: emoticonId, index: index });
			});
		} else {
			flattened.push({ emoticonId: emoticonId, index: indicesToReplace });
		}
		return flattened;
	}, []);
	emotes = _.sortBy(emotes, function (emoticon) { return emoticon.index[0]; });
	emotes.reverse();
	_.each(emotes, function (emoticon) {
		var token = tokens.shift();
		if (token.length > emoticon.index[1] + 1) {
			tokens.unshift(token.substr(emoticon.index[1] + 1));
		}
		var img = document.createElement('img');
		img.style.height = height + 'vh';
		img.style.verticalAlign = 'middle';
		img.src = `//static-cdn.jtvnw.net/emoticons/v1/${emoticon.emoticonId}/3.0`;
		tokens.unshift(img);
		if (emoticon.index[0]) {
			tokens.unshift(token.substr(0, emoticon.index[0]));
		}
	});
	_.each(tokens, function (elem) {
		if (typeof (elem) === "string") {
			elem = document.createTextNode(elem);
		}
		div.appendChild(elem);
	});

	setTimeout(() => {
		div.remove();
	}, duration * 1000);

	container.appendChild(div);

	// SLOWWWWWW!!!
	var style = window.getComputedStyle(div, null);
	var width = parseFloat(style.width);
	setTimeout(() => {
		div.style.left = -width + 'px';
	}, 0);

	// setTimeout(() => {
	// 	div.style.left = '-200%';
	// }, 0);
};

let setupElements = () => {
	//button = $('<button class="js-www-toggle player-button" style="width: 4em;"><span class="player-tip js-control-tip" data-tip="Toggle Nico Chat"></span><svg viewBox="0 0 40 30" style="width: 4em;"><text x="7" y="19" style="font-size: 9px; letter-spacing: 1px; font-weight: bold;">WWW</text><path d="M5,8 L6,7 L34,7 L35,8 L35,22 L34,23 L6,23 L5,22 L5,8 L6,9 L6,21 L7,22 L33,22 L34,22 L34,9 L33,8 L7,8 L6,9 Z"></path></svg></button>')[0];
	container = $('<div id="nico-chat-overlay" style="position: absolute; height: 100%; width: 100%;"></div>')[0];

	//$(".player-buttons-right").after(button);
	$(".player-video").after(container);
	log("Elements Placed.");
};

/**
 * Borrowed from FFZ:AP
 */
//region ap
let invalidHosts = ['api.', 'tmi.', 'spade.', 'chatdepot.', 'im.', 'api-akamai.', 'dev.'];
let isInvalidHost = () => {
	for (let i = 0; i < invalidHosts.length; i++) {
		if (window.location.host.indexOf(invalidHosts[i]) !== -1) {
			return true;
		}
	}
	return false;
};

var checkExistance = (attempts) => {
	// Check for invalid host - if it is, don't run the script
	if (isInvalidHost()) {
		return;
	}

	if (window.FrankerFaceZ !== undefined && window.jQuery !== undefined && window.$ !== undefined && window.App !== undefined) {
		initialize();
	} else {
		attempts = (attempts || 0) + 1;
		if (attempts < 60) {
			return setTimeout(checkExistance.bind(this, attempts), 1000);
		}
		log("Injection Unsuccessful");
	}
};

// Initialize after 3 seconds
setTimeout(checkExistance, 3000);
//endregion
