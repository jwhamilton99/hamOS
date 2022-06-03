class Shell {
	constructor() {}
	
	async init(shellContainer) {
		this.loggedIn = false;
		this.working = false;
		this.waitingForInput = false;
		this.prompt = ">";
		this.currentNode = null;
		this.currentInput = "";
		this.history = [];
		this.historyIndex = -1;
		
		this.tickTimer = null;
		this.tickToggle = true;
		this.tickInterval = 750;
		
		this.container = shellContainer;
		this.os = new hamOS(this);
		
		await this.os.initTree();
		
		this.read("login");
	}
	
	read(text) {
		this.historyIndex = -1;
		if(text.length > 0) {
			this.history.unshift(text);
		}
		
		if(this.currentNode != null) {
			this.currentNode.innerHTML = this.os.wdTree[this.os.wdTree.length-1]+this.prompt+" "+text;
		}
		
		this.working = true;
		let args = getArgs(text);
		
		this.os.process(args.length, args);
	}
	
	write(result, className) {
		let text = document.createElement("p");
		text.className = "outputNode";
		if(className != undefined) {
			text.className+=" "+className;
		}
		text.innerHTML = result;
		
		this.container.appendChild(text);
	}
	
	complete() {
		this.working = false;
		
		if(this.loggedIn) {
			this.waitingForInput = true;
			this.showPrompt();
		} else {
			clearTimeout(this.tickTimer);
		}
	}
	
	showPrompt() {
		this.currentInput = "";
		
		this.currentNode = document.createElement("p");
		this.currentNode.className = "outputNode";
		
		this.container.appendChild(document.createElement("br"));
		this.container.appendChild(this.currentNode);
		this.updatePrompt();
	}
	
	receiveInput(c) {
		clearTimeout(this.tickerTimer);
		this.currentInput += c;
		this.updatePrompt();
	}
	
	updatePrompt() {
		clearTimeout(this.tickTimer);
		this.currentNode.innerHTML = this.os.wdTree[this.os.wdTree.length-1]+this.prompt+" "+this.currentInput+"_";
		this.currentNode.scrollIntoView();
		this.tickTimer = setTimeout(()=>{this.tick()}, this.tickInterval);
	}
	
	tick() {
		this.tickToggle = !this.tickToggle;
		if(this.tickToggle) {
			this.currentNode.innerHTML = this.os.wdTree[this.os.wdTree.length-1]+this.prompt+" "+this.currentInput+"_";
		} else {
			this.currentNode.innerHTML = this.os.wdTree[this.os.wdTree.length-1]+this.prompt+" "+this.currentInput;
		}
		this.tickTimer = setTimeout(()=>{this.tick()}, this.tickInterval);
	}
	
	backspace() {
		this.currentInput = this.currentInput.slice(0, this.currentInput.length-1);
		this.updatePrompt();
	}
	
	removeAllNodes() {
		this.container.innerHTML = "";
	}
	
	moveUpOneEntry() {
		this.historyIndex = Math.min(this.historyIndex+1, this.history.length-1);
		if(this.historyIndex > -1) {
			this.currentInput = this.history[this.historyIndex];
		}
		this.updatePrompt();
	}
	
	moveDownOneEntry() {
		this.historyIndex = Math.max(this.historyIndex-1, -1);
		if(this.historyIndex > -1) {
			this.currentInput = this.history[this.historyIndex];
		} else {
			this.currentInput = "";
		}
		this.updatePrompt();
	}
}

function getArgs(text) {
	return text.split(" ");
}