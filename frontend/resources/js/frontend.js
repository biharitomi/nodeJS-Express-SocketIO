$(function() {
	var socket = io.connect();
	var content = $('#content');
	var input = $('#input');
	var status = $('#status');
	// my name sent to the server
    var myName = false;
    var myColor = false;

	function addMessage(author, message, dt, color) {
        content.append('<p><span style="color:'+ color +'">' + author + '</span> @ ' +
             + (dt.getHours() < 10 ? '0' + dt.getHours() : dt.getHours()) + ':'
             + (dt.getMinutes() < 10 ? '0' + dt.getMinutes() : dt.getMinutes())
             + ': ' + message + '</p>');
        content.scrollTop(content[0].scrollHeight);
    }

	function sendMessage(msg) {
		if (msg != "") 
		{
			socket.emit('message', msg);
			addMessage("Me",msg, new Date(), myColor);
			$('#messageInput').val('');
		}
	}
	function setPseudo(pseudo) {
		if (pseudo != "")
		{
			socket.emit('setPseudo', pseudo);
			status.text(pseudo+' message:');
		}
	}

	socket.on('connect', function(){
		// first we want users to enter their names
	    input.removeAttr('disabled');
	    status.text('Choose name:');
	    console.log('connected succesfully');
	});

	socket.on('setPseudo', function(data){
		//after successfully connect we got the user color
		console.log(data)
		myColor = data.userColor;
		addMessage('Me', ' entered the chat room ', new Date(), data.userColor);
	});

	socket.on('message', function(data) {
		console.log(data)
		addMessage(data.pseudo.userName, data['message'], new Date(), data.pseudo.userColor);
	});

	 /**
     * Send mesage when user presses Enter key
     */
    input.keydown(function(e) {
        if (e.keyCode === 13) {
            var msg = $(this).val();
            if (msg) {    
	            // we know that the first message sent from a user their name
	            if (myName === false) {
	                myName = msg;
	                setPseudo(msg);
	            }
	            else{
	            	sendMessage(msg);	
	            }
            }
            input.val("").focus();
        }
    });
});