let submitButton = document.querySelector('.submit-button');
let currentIndex = 0;
let rightAnswers = 0;
let quizArea = document.querySelector('.quiz-area');
let answersArea = document.querySelector(".answers-area");
let countdownInterval;
let countSpan = document.querySelector(".count span");
let bulletsSpanContainer = document.querySelector('.bullets .spans');
let countDownElement = document.querySelector('.countdown');
let resultsContainer = document.querySelector(".results");
// * Function getQuestions : get data from JSON then convert it

function getQuestions(){
 let myRequest = new XMLHttpRequest();
 console.log(myRequest);
 myRequest.onreadystatechange = function () {
    
     // * When readyState is 4 and status is 200 = RESPONSE IS READY
    if(this.readyState === 4 && this.status === 200 ){
        let questionsObject = JSON.parse(this.responseText); // ? PARSING IS CONVERTING  ( JSON ---> JS OBJECT);
        //! JS OBJECT ---> JSON : JSON.stringify
        console.log(questionsObject)
        let qCount = questionsObject.length ;
        // * Create bullets + Set Questions count    
        createBullets(qCount);
        // * Add Questions Data 
        addQuestionData(questionsObject[currentIndex],qCount);
        //* Start Countdown 
        countdown(10,qCount);
          // * Click on submit
          submitButton.onclick = () => {
           
            let theRightAnswer = questionsObject[currentIndex].right_answer;  
            currentIndex++;
            checkAnswer(theRightAnswer);
            quizArea.innerHTML = "";
            answersArea.innerHTML = "";
            addQuestionData(questionsObject[currentIndex],qCount);
 
              handleBullets();
            clearInterval(countdownInterval);
            countdown(10,qCount);
 
            showResults(qCount);
 
         }
      
    }
 };
 myRequest.open("GET","html_questions.json",true); // ? true refers to asynchronious request
 myRequest.send();
}  
//  ! appelle fonction getQuestion
getQuestions();



function showResults(count){
    let theResult;
if(currentIndex === count)
{
    // ? CLEAR ALL THE HTML TAGS
    submitButton.remove();
    quizArea.remove();
    countDownElement.remove();
    answersArea.remove();
    bulletsSpanContainer.remove();
    // ! CREATE RESULT TAG
    if (rightAnswers > count/2 && rightAnswers < count){
        theResult = `<span>GOOD</span>, ${rightAnswers} From ${count}`
    }
    else if (rightAnswers === count){
        theResult = `<span>EXCELLENT</span>, ${rightAnswers} From ${count}`
    }
    else {
        theResult = `<span class="bad">Bad</span>, ${rightAnswers} From ${count}`
    }
    // * ADD SOME STYLING ON THE RSULT
    resultsContainer.innerHTML = theResult;
    resultsContainer.style.padding = "10px";
    resultsContainer.style.backgroundColor = "white"

}
}

function handleBullets(){
    let bulletsSpans = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpans = Array.from(bulletsSpans);
    arrayOfSpans.forEach((span,index) => {
        if(currentIndex === index){
            span.className = "on"
        }
    })
}

function checkAnswer(rAnswer){

    let answers = document.getElementsByName("question");
    let choosenAnswer;

    for(let i = 0 ; i < answers.length ; i++){
        if(answers[i].checked){
            choosenAnswer = answers[i].dataset.answer ;// DATASET ANSWER
        }
    }
    if(rAnswer === choosenAnswer){
        rightAnswers++;
    }
}



function addQuestionData(obj,count){
    if(currentIndex < count ){
        let questionTitle = document.createElement("h2");
        let questionText = document.createTextNode(obj["title"]);
        questionTitle.appendChild(questionText);
        quizArea.appendChild(questionTitle);
    
        for(let i = 1 ; i <=4 ; i++){
            let mainDiv = document.createElement("div");
            mainDiv.className =  "answer";
    
            let radioInput = document.createElement("input");
            radioInput.name = "question";
            radioInput.type = "radio";
            radioInput.id = `answer_${i}`;
          
            radioInput.dataset.answer = obj[`answer_${i}`];
    
            if(i === 1) {
                radioInput.checked = true;
            }
    
            let theLabel = document.createElement("label");
            let theLabelText  = document.createTextNode(obj[`answer_${i}`]);
    
            theLabel.appendChild(theLabelText);
    
            mainDiv.appendChild(radioInput);
            mainDiv.appendChild(theLabel);
            answersArea.appendChild(mainDiv)
    
    
        }
    
    }
    }
    


    function createBullets(num){
        countSpan.innerHTML = num;
    for (let i= 0;i < num ;i++){
        let theBullet = document.createElement("span");
        if(i == 0 ){
            theBullet.className = "on";
        }
        bulletsSpanContainer.appendChild(theBullet);
    }
    }
    

    
function countdown(duration,count){
    if(currentIndex < count){
       let minutes,seconds; 
       countdownInterval = setInterval(function (){
        minutes = parseInt(duration / 60);
        seconds = parseInt(duration % 60);
        
        // if(minutes <10 ) {
        //     minutes = `0${minutes}`;
        // } else  {
        //     minutes = minutes;
        // }
        countDownElement.innerHTML = `${minutes}:${seconds}`;
        minutes = minutes < 10 ? `0${minutes}` : minutes;
        seconds = seconds < 10 ? `0${seconds}` : seconds;
        if(--duration < 0 ){
            clearInterval(countdownInterval);
            submitButton.click();
           }
       },1000);
    
    
    
    }
    }
    