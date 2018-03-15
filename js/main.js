const quiz = [
	{ name: "Superman", realName: "Clark Kent" },
	{ name: "Wonder Woman", realName: "Diana Prince" },
	{ name: "Batman", realName: "Bruce Wayne" },
];

function random(a, b=1) {
	if (b === 1) {
		[a,b] = [b,a];
	}
	return Math.floor((b - a + 1) * Math.random()) + a;
}

function shuffle(array) {
	for (let i = array.length; i; i--) {
		let j = random(i) - 1;
		[array[i - 1], array[j]] = [array[j], array[i - 1]];
	}
}

const view = {
	start: document.getElementById('start'),
	score: document.querySelector('#score strong'),
	question: document.getElementById('question'),
	response: document.querySelector('#response'),
	result: document.getElementById('result'),
	info: document.getElementById('info'),
	timer: document.querySelector('#timer strong'),
	render(target, content, attributes) {
		for (const key in attributes) {
			target.setAttribute(key, attributes[key]);
		}
		target.innerHTML = content;
	},
	show(element) {
		element.display = 'block';
	},
	hide(element) {
		element.display = 'none';
	},
	setup() {
		this.show(this.question);
		this.show(this.response);
		this.show(this.result);
		this.hide(this.start);
		this.render(this.score, game.score);
		this.render(this.result, '');
		this.render(this.info, '');
		this.resetForm();
	},
	teardown() {
		this.hide(this.question);
		this.hide(this.response);
		this.show(this.start);
	},
	resetForm() {
		this.response.answer.value = '';
		this.response.answer.focus();
	}
};

const game = {
	start() {
		console.log('start() invoked');
		this.secondsRemaining = 20;
		this.timer = setInterval(this.coundtown, 1000);
		this.questions = [...quiz];
		this.score = 0;
		view.setup();
		this.ask();
	},

	ask() {
		console.log('ask() invoked');
		if (this.questions.length > 0) {
			shuffle(this.questions);
			this.question = this.questions.pop();
			const question = `What is ${this.question.name}'s real name?`;
			view.render(view.question, question);
		} else {
			this.gameOver();
		}
	},

	check(event) {
		console.log('check() invoked');
		event.preventDefault();
		const response = view.response.answer.value;
		const answer = this.question.realName;
		if (response === answer) {
			view.render(view.result, 'Correct!', {'class':'correct'});
			this.score++;
			view.render(view.score, this.score);
		} else {
			view.render(view.result, `Wrong! The correct answer is ${answer}.`, {'class':'wrong'});
		}
		view.resetForm();
		this.ask();
	},

	coundtown() {
		game.secondsRemaining--;
		view.render(view.timer, game.secondsRemaining);
		if(game.secondsRemaining < 0) {
			game.gameOver();
		}
	},

	gameOver() {
		console.log('gameOver() invoked');
		view.render(view.info, `Game Over...you scored ${this.score} point${this.score !== 1 ? 's' : ''}!`);
		view.teardown();
		clearInterval(this.timer);
	}
};

view.start.addEventListener('click', () => game.start(), false);
view.response.addEventListener('submit', (event) => game.check(event), false);
view.hide(view.response);