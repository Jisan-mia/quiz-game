// //home page javscript
// const homePlayBtn = document.getElementById("homePlayBtn");
// const numberOfQuestion = document.getElementById("numberOfQuestion");
// const category = document.getElementById("category");
// const difficulty = document.getElementById("difficulty");

// homePlayBtn.addEventListener("click", function () {
// 	if (numberOfQuestion.value > 0) {
// 		console.log(numberOfQuestion.value, category.value, difficulty.value);
// 		window.location.assign("/game.html");
// 		fetchData();
// 	} else {
// 		alert("Please enter Number of question");
// 	}
// });

// get needed elements
const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progresstText = document.getElementById("progresstText");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progressBarFull");
const loader = document.getElementById("loader");
const game = document.getElementById("game");

//initialise some global variables
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

//cosntants
const CORECT_BONUS = 10;
let MAX_QUESTIONS;

//fetch api to laod questions
let questions = [];
const fetchData = () => {
	fetch(
		"https://opentdb.com/api.php?amount=5&category=18&difficulty=easy&type=multiple"
	)
		.then((res) => res.json())
		.then((data) => loadQuestions(data.results))
		.catch((err) => {
			console.log(err);
			// alert("Something wrong with fetch");
		});
};

//load questions
const loadQuestions = (loadedQuestions) => {
	questions = loadedQuestions.map((loadedQuestion) => {
		const formattedQuestion = {
			question: loadedQuestion.question,
		};

		const answerChoices = [...loadedQuestion.incorrect_answers];
		formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;
		answerChoices.splice(
			formattedQuestion.answer - 1,
			0,
			loadedQuestion.correct_answer
		);

		answerChoices.forEach((choice, index) => {
			formattedQuestion["choice" + (index + 1)] = choice;
		});
		return formattedQuestion;
	});

	startGame();
};

//start the game
const startGame = () => {
	questionCounter = 0;
	score = 0;
	availableQuestions = [...questions];
	getNewQuestion();
	console.log(questions.length);
	MAX_QUESTIONS = questions.length;
	console.log(MAX_QUESTIONS);
	game.classList.remove("hidden");
	loader.classList.add("hidden");
};

// get a new question
const getNewQuestion = () => {
	if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
		localStorage.setItem("mostRecentScore", score);
		//got the end page
		return window.location.assign("/end.html");
	}
	questionCounter++;

	progresstText.innerText = `Question ${questionCounter}/${
		MAX_QUESTIONS || questions.length
	}`;

	//update progress bar
	progressBarFull.style.width = `${
		100 * (questionCounter / questions.length)
	}%`;

	const questionIndex = Math.floor(Math.random() * availableQuestions.length);

	currentQuestion = availableQuestions[questionIndex];
	question.innerText = currentQuestion.question;

	choices.forEach((choice) => {
		const number = choice.dataset["number"];
		choice.innerText = currentQuestion["choice" + number];
	});

	availableQuestions.splice(questionIndex, 1);

	acceptingAnswers = true;
};

//event listener when click on the answer
choices.forEach((choice) => {
	choice.addEventListener("click", function (e) {
		if (!acceptingAnswers) return;

		acceptingAnswers = false;
		const selectedChoice = e.target;
		const selectedAnswer = selectedChoice.dataset["number"];

		const classToApply =
			selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

		classToApply == "correct" ? incrementScore(CORECT_BONUS) : "";

		selectedChoice.parentElement.classList.add(classToApply);
		setTimeout(() => {
			selectedChoice.parentElement.classList.remove(classToApply);
			getNewQuestion();
		}, 1000);
	});
});

//increment the score
const incrementScore = (num) => {
	score += num;
	scoreText.innerText = score;
};
