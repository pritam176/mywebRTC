//connecting to our signaling server 

var configuration = {
  'iceServers': [{
    'url': 'stun:stun.example.org'
  }]
};
const selfView = document.querySelector("#selfView");
const remoteView = document.querySelector("#remoteView");

var username ;
var dest;
var conn ;
function start() {
    conn = new WebSocket('wss://https://my0-app.herokuapp.com/socket');
	username = document.getElementById("username").value;
	conn.onopen = function() {
		console.log("Connected to the signaling server");
		login(username);
		
	};

	conn.onmessage = async function(msg) {
		console.log("Got message", msg.data);
		
		
		
		var content = JSON.parse(msg.data);
		
		if(typeof dest === 'undefined' )
			dest =content.initeator;
		
		
		
		if(typeof peerConnection === 'undefined' && content.event==='offer'){
			console.log("initialize");
			initialize();
			
			var localVideoStream =  await navigator.mediaDevices.getUserMedia({video: true, audio: true});
			selfView.srcObject = localVideoStream
			peerConnection.addStream(localVideoStream);
			
		}
		
		
		
		var data = content.data;
		switch (content.event) {
		// when somebody wants to call us
		case "offer":
			handleOffer(data);
			break;
		case "answer":
			handleAnswer(data);
			break;
		// when a remote peer sends an ice candidate to us
		case "candidate":
			handleCandidate(data);
			break;
		default:
			break;
		}
	};
}
function login(username) {
	send({
		event : "login",
		dest : username
	});
}

function send(message) {
	conn.send(JSON.stringify(message));
}

var peerConnection;
var dataChannel;
var input = document.getElementById("messageInput");





 function initialize() {
	var configuration = null;
	
	
	
	

	peerConnection = new RTCPeerConnection(configuration, {
		optional : [ {
			RtpDataChannels : true
		} ]
	});

	
	
	// Setup ice handling
	peerConnection.onicecandidate = function(event) {
		if (event.candidate) {
			console.log(dest);
			
			send({
				event : "candidate",
				data : event.candidate,
				dest : dest,
				initeator:username
			});
		}
	};
	
	
	 // once remote stream arrives, sho480w it in the remote video element
	peerConnection.ontrack = function (event) {
		
		console.log('connected');
		if (event.streams.length > 0) {
			remoteView.srcObject = event.streams[0];
			console.log('connected');
        }

	}
    
	
	peerConnection.onaddstream = function(event) {
		console.log('onaddstream');
	};
   
   

	// creating data channel
	dataChannel = peerConnection.createDataChannel("dataChannel", {
		reliable : true
	});

	dataChannel.onerror = function(error) {
		console.log("Error occured on datachannel:", error);
	};

	// when we receive a message from the other peer, printing it on the console
	dataChannel.onmessage = function(event) {
		console.log("message:", event.data);
	};

	dataChannel.onclose = function() {
		console.log("data channel is closed");
	};
}

function logError(error) {
	  console.log(error.name + ': ' + error.message);
	}

async function createOffer() {
	dest = document.getElementById("dest").value;
	initialize();
	
	var localVideoStream =  await navigator.mediaDevices.getUserMedia({video: true, audio: true});
	selfView.srcObject = localVideoStream
	peerConnection.addStream(localVideoStream);
	
	peerConnection.createOffer(function(offer) {
		console.log(dest);
		
		send({
			event : "offer",
			data : offer,
			dest : dest,
			initeator: username
		});
		peerConnection.setLocalDescription(offer);
	}, function(error) {
		alert("Error creating an offer");
	});
}

function handleOffer(offer) {
	peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

	// create and send an answer to an offer
	peerConnection.createAnswer(function(answer) {
		peerConnection.setLocalDescription(answer);
		console.log(dest);
		
		send({
			event : "answer",
			data : answer,
			dest : dest,
			initeator:username
		});
	}, function(error) {
		alert("Error creating an answer");
	});

};

function handleCandidate(candidate) {
	peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
};

function handleAnswer(answer) {
	peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
	console.log("connection established successfully!!");
};

function sendMessage() {
	dataChannel.send(input.value);
	input.value = "";
}
