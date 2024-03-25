let QuizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let counte = document.querySelector(".counter span");
let bulletsContainer = document.querySelector(".bullets .spans");
let btn = document.querySelector(".submit-button");
let countdowner = document.querySelector(".countdown");
let result = document.querySelector(".result");

let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;

function getQuestions() {
  let MyRequest = new XMLHttpRequest();

  MyRequest.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let questionsObject = JSON.parse(MyRequest.responseText);

      // Shuffle the questions array
      shuffleArray(questionsObject);

      let Counter = questionsObject.length;

      // Create Bullets + Set Questions Count
      CreateBullets(Counter);

      // AddQuestionData
      AddQuestionData(questionsObject[currentIndex], Counter);

      // Start Countdown
      countdown(3, Counter);

      // Create Submit function
      btn.onclick = function () {
        // Select right_answer
        let theRightAnswer = questionsObject[currentIndex].right_answer;
        // console.log(theRightAnswer);

        // Increase currentIndex
        currentIndex++;

        // Check The Answer
        checkAnswer(theRightAnswer, Counter);

        // Remove previous question and answers
        QuizArea.innerHTML = "";
        answersArea.innerHTML = "";

        // Add next Question
        AddQuestionData(questionsObject[currentIndex], Counter);

        // Handle Bullets
        HandleBullets();

        // Start Countdown
        clearInterval(countdownInterval);
        countdown(3, Counter);

        // Show Results
        showResults(Counter);
      };
    }
  };
  MyRequest.open("GET", "Question.json", true);
  MyRequest.send();
}

function CreateBullets(num) {
  counte.innerHTML = num;

  for (let i = 0; i < num; i++) {
    let bullet = document.createElement("span");

    // Add class "on" to the first bullet
    if (i === 0) {
      bullet.className = "on";
    }

    // Append bullet span
    bulletsContainer.appendChild(bullet);
  }
}

function shuffleArray(array) {
  for (let i = 0; i <= array.length - 1; i++) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function AddQuestionData(obj, count) {
  if (currentIndex < count) {
    // Create Question
    let Question = document.createElement("h2");

    // Create Question Text
    let QuestionText = document.createTextNode(obj["title"]);

    // Append Question Text to Question
    Question.appendChild(QuestionText);

    // Append Question to QuizArea
    QuizArea.appendChild(Question);

    // Create Answer Area
    for (let i = 1; i <= 4; i++) {
      // Create Main div
      let Maindiv = document.createElement("div");

      // Add class to Main div
      Maindiv.className = "answer";

      // Create Radio input
      let input = document.createElement("input");

      // Set Type + Name + Id + Data-Attribute
      input.name = "question";
      input.type = "radio";
      input.id = `answer_${i}`;
      input.dataset.answer = obj[`answer_${i}`];
      if (i === 1) {
        input.checked = true;
      }

      // Create Label
      let Label = document.createElement("label");

      // Set For Attribute
      Label.htmlFor = `answer_${i}`;

      // Create Label Text
      let LabelText = document.createTextNode(obj[`answer_${i}`]);

      // Append Label Text to Label
      Label.appendChild(LabelText);
      // console.log(Label);

      // Append input and Label to Main div
      Maindiv.appendChild(input);
      Maindiv.appendChild(Label);

      // Append Main div to answersArea
      answersArea.appendChild(Maindiv);
    }
  }
}

getQuestions();

function checkAnswer(ranswer, count) {
  let answers = document.getElementsByName("question");
  let theChosenAnswer;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChosenAnswer = answers[i].dataset.answer;
      // console.log(answers[i].dataset.answer);
      if (ranswer === theChosenAnswer) {
        rightAnswers++;
      }
    }
  }
}

function HandleBullets() {
  let bulletspans = document.querySelectorAll(".bullets .spans span");
  bulletspans.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}
function countdown(duration, count) {
  if (currentIndex < count) {
    let min, sec;
    countdownInterval = setInterval(function () {
      min = parseInt(duration / 60);
      sec = parseInt(duration % 60);

      min = min < 10 ? `0${min}` : min;
      sec = sec < 10 ? `0${sec}` : sec;

      countdowner.innerHTML = `${min}:${sec}`;

      if (--duration < 0) {
        clearInterval(countdownInterval);
        btn.onclick();
      }
    }, 1000);
  }
}
function showResults(num) {
  let theResults;
  if (currentIndex === num) {
    QuizArea.remove();
    answersArea.remove();
    btn.remove();
    bulletsContainer.remove();
    countdowner.remove();

    if (rightAnswers > 10 && rightAnswers < num) {
      theResults = `<span class="good">Good</span>, ${rightAnswers} From ${num}`;
    } else if (rightAnswers === num) {
      theResults = `<span class="perfect">Perfect</span>, All Answers Is Good`;
    } else {
      theResults = `<span class="bad">Bad</span>, ${rightAnswers} From ${num}`;
    }

    result.innerHTML = theResults;
    result.style.padding = "10px";
    result.style.backgroundColor = "white";
    result.style.marginTop = "10px";
  }
}
