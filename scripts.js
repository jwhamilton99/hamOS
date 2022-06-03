var shell;

let alphanumerics = ["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890"];

window.onload = async function() {
	console.log("ready");
	
	shell = new Shell();
	
	shell.init(document.getElementById("container"));
	
	window.addEventListener("keydown", processKeyPress);
}

function processKeyPress(e) {
	switch(e.key) {
		case "Enter":
			shell.read(shell.currentInput);
			break;
		case "Backspace":
			shell.backspace();
			break;
		case "ArrowUp":
			e.preventDefault();
			shell.moveUpOneEntry();
			break;
		case "ArrowDown":
			e.preventDefault();
			shell.moveDownOneEntry();
			break;
		default:
			if(e.key.length == 1) {
				shell.receiveInput(e.key);
			}
			break;
	}
}