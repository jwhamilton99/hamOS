class hamOS {
	constructor(shell) {
		this.shell = shell;
		this.versionString = "1.0";
		this.wdTree = ["home"];
		this.tree = {};
	}
	
	process(argc, argv) {
		console.log(argv);
		console.log(argc);
		
		if(argc == 1 && argv[0].length == 0) { this.shell.complete(); return; }
		
		var cmd = argv[0];
		argv.shift();
		argc-=1;
		
		switch(cmd) {
			case "login":
				this.login();
				break;
			case "logout":
				this.logout();
			case "echo":
				this.echo(argv);
				break;
			case "version":
				this.version();
				break;
			case "about":
				this.about();
				break;
			case "date":
				this.date();
				break;
			case "clear":
				this.clear();
				break;
			case "random":
				this.random(argc, argv);
				break;
			case "help":
				this.displayHelp();
				break;
			case "ls":
				this.ls();
				break;
			case "cd":
				this.cd(argc, argv);
				break;
			case "pwd":
				this.pwd();
				break;
			default:
				if(!this.lookForCommandAtWD(argc, cmd)) {	
					this.shell.write("command not found: "+cmd);
				}
				break;
		}
		
		this.shell.complete();
	}
	
	async initTree() {
		return new Promise(resolve => {
			fetch("fileTree.json")
				.then(response=>response.text())
				.then((text) => {
					this.tree = JSON.parse(text);
					resolve();
				})
		});
	}
	
	login() {
		if(this.shell.loggedIn) {
			this.shell.write("Already logged in!");
			return;
		}
		this.version();
		let date = new Date();
		this.shell.write("Login successful at "+date.toUTCString());
		
		this.shell.write("Type 'help' for a list of available commands");
		
		this.shell.loggedIn = true;
	}
	
	logout() {
		this.shell.loggedIn = false;
		this.shell.write("Successfully logged out.");
		window.removeEventListener("keydown", processKeyPress);
	}
	
	version() {
		this.shell.write("hamOS v"+this.versionString);
	}
	
	date() {
		let date = new Date();
		this.shell.write(date.toUTCString());
	}
	
	echo(argv) {
		for(var arg of argv) {
			this.shell.write(arg);
		}
	}
	
	random(argc, argv) {
		switch(argc) {
			case 1:
				if(parseInt(argv[0]) != NaN) {
					let rand = Math.floor(Math.random()*parseInt(argv[0]))+1;
					this.shell.write(rand);
				}
				break;
			case 2:
				if(parseInt(argv[0]) != NaN && parseInt(argv[1]) != NaN) {
					let rand = (Math.floor(Math.random()*(parseInt(argv[1])-parseInt(argv[0])))+parseInt(argv[0]))+1;
					this.shell.write(rand);
				}
				break;
			default:
				this.shell.write("Usage: 'random x' for a random number between 1 and x. 'random x y' for a random number between x and y. Both are inclusive.");
				break;
		}
	}
	
	clear() {
		this.shell.removeAllNodes();
	}
	
	displayHelp() {
		this.shell.write("Available Commands:");
		this.shell.write("cd - change directory");
		this.shell.write("ls - list directory contents");
		this.shell.write("pwd - print working directory");
		this.shell.write("login - log in");
		this.shell.write("logout - log out");
		this.shell.write("version - hamOS version");
		this.shell.write("about - display about message");
		this.shell.write("echo - display text");
		this.shell.write("date - display date and time");
		this.shell.write("random - random number generator");
		this.shell.write("clear - clear the display");
		this.shell.write("help - display available commands");
	}
	
	cd(argc, argv) {
		
		if(argc > 1) {
			this.shell.write("no");
			return;
		}
		
		var directory = this.tree;
		
		if(argv[0] == "..") { if(this.wdTree.length > 1) { this.wdTree.pop(); } return; }
		
		if(argv[0] == "/") { return; }
		
		for(var dir of this.wdTree) {
			directory = directory[dir];
			console.log(directory);
		}
		
		if(directory == undefined) {
			this.shell.write("directory not found: "+argv[0]);
		} else {
			this.wdTree.push(argv[0]);
		}
	}
	
	ls() {
		var directory = this.tree;
		
		for(var dir of this.wdTree) {
			console.log(dir);
			directory = directory[dir];
			console.log(directory);
		}
		
		let directoryKeys = Object.keys(directory).filter((key)=>{return typeof(directory[key]) == "object"; });
		let executableKeys = Object.keys(directory).filter((key)=>{return typeof(directory[key]) == "string"; });
		
		this.shell.write("-- DIRECTORIES --");
		if(directoryKeys.length == 0) {
			this.shell.write("no directories found", "directory")
		} else {
			for(var key of directoryKeys.sort()) {
				this.shell.write(key,"directory");
			}
		}
		
		this.shell.write("-- EXECUTABLES --");
		if(executableKeys.length == 0) {
			this.shell.write("no executables found")
		} else {
			for(var key of executableKeys.sort()) {
				this.shell.write(key);
			}
		}
	}
	pwd() {
		this.shell.write("/"+this.wdTree.join("/"));
	}
	
	lookForCommandAtWD(argc, cmd) {
		console.log(argc, cmd);
		if(argc == 0) {
			var directory = this.tree;
			for(var dir of this.wdTree) {
				directory = directory[dir];
			}
			
			if(directory[cmd] != undefined) {
				if(typeof(directory[cmd]) == "string") {
					this.shell.write("opening URL '"+directory[cmd]+"'...");
					setTimeout(()=>{
						window.open(directory[cmd]);
					}, 2000);
					
					return true;
				} else {
					this.cd(0, [cmd]);
					return true;
				}
			}
		}
		
		return false;
	}
	
	about() {
		this.shell.write("Welcome to hamOS!");
		this.shell.write("I got bored and decided to make my site in the form of a shell.");
		this.shell.write("This site is built in vanilla Javascript. It's very simple, but I like it.");
		this.shell.write("Have a look around!");
	}
}