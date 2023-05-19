


// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ..
//      ],
//    },
//    ...
//  ]

let catagory = [];
gameObj = {}
let catRes = [];

const reStart =  document.querySelector('#restart')//for restart button
reStart.addEventListener('click', function(){
    load()
})


function load() {
    sessionStorage.setItem("reloading", "true");//loads 'reloading' into session storage
    document.location.reload();//reloads page
    
}
window.onload = function() {
    let reloading = sessionStorage.getItem("reloading");
    if (reloading) {
        sessionStorage.removeItem("reloading");
        showLoadingView();//function that loads spinner
        getCategoryIds();//starts process to load game table
    }
}

async function getCategoryIds() {


    const res =  await axios.get('https://jservice.io/api/categories', {params: {count: 100}})//this gets the catagorys
    let catagoryIds = res.data.map(f => f.id);
    let clueCount = res.data.map(f => f.clues_count);

   //selects 6 catagorys at random for the game
   for (let y = 0; y < 6; y++){
    ran = Math.floor(Math.random()* catagoryIds.length)
    if(clueCount[ran]>4){//if the selectted clues dont have at least five Q and A's another catagory is selected
       
        catagory[y]= catagoryIds[ran];}
    
    else{y--

    }
}
  getCatorgories(catagory)//this gets the quesitons and answers
   

}


async function getCatorgories(catagory) {// this function getS the quesitons and answers
 

    for(let x = 0; x<6; x++){//gets the six catagories for the board
      catRes[x] =  await axios.get('https://jservice.io/api/category', {params: {id: catagory[x]}
    });
    
    
      
    }
    
fillTable(catRes)//this loads the top row, or the catagories.  Labeled header
let gameObj = getCategory(catRes)
buildQuestions()//initializes and builds the game board with the question marks
    
     }

    function buildQuestions(){//builds the initial question marks for the game
    const block = document.querySelector('#container')
    const questionContainer = document.createElement('div')
    questionContainer.classList.add('questionContainer')
    block.append(questionContainer);
    let column = 5
        
    for(y=0; y<column; y++){
        let columns=0;
        let col = document.createElement('div')
        col.classList.add(`qRow`)
        for(x=0; x<6; x++){
            
    const square =  document.createElement('div');
    square.classList.add("question", "column"+columns, "row"+y, "clicks0");
    square.innerHTML = '?';
    col.append(square)
    columns++;        
    questionContainer.append(col)
    hideLoadingView();    

}

//
}
  handleClick()  //puts the click listener on the game board
}


/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */



/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */


    function getCategory(catRes) {//loads the game object fuction
        questionNumber=[];
        for(let x=0; x<6; x++) {
       let numOfClues=catRes[x].data.clues_count
       questionNumber = getRandomQuestion(numOfClues)//looks for a list of five random question and answers

        gameObj[x] = {title: catRes[x].data.title,//initialze game object
                    clues: 
                    [
                               {question: catRes[x].data.clues[questionNumber[0]].question, answer: catRes[x].data.clues[questionNumber[0]].answer},
                               {question: catRes[x].data.clues[questionNumber[1]].question, answer: catRes[x].data.clues[questionNumber[1]].answer},
                               {question: catRes[x].data.clues[questionNumber[2]].question, answer: catRes[x].data.clues[questionNumber[2]].answer},
                               {question: catRes[x].data.clues[questionNumber[3]].question, answer: catRes[x].data.clues[questionNumber[3]].answer},
                               {question: catRes[x].data.clues[questionNumber[4]].question, answer: catRes[x].data.clues[questionNumber[4]].answer},
                             ],
                            
                        }
        }  
   // return gameObj;
    }
    
   

function getRandomQuestion(numOfClues){//randomly selects five questions and answers from the list of catagory ID's
    let number=[];
    
    for(x=0; x<5; x++){
        nextQuestion = Math.floor(Math.random()*(numOfClues))
        if (number.includes(nextQuestion)){
           
            x--;
        }else {
           
            number.push(nextQuestion)
        }

}
return number;
}



/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

async function fillTable(catagory) {//this is the function that builds the header with the catagorys listed
        const header = document.querySelector('#container')
        hContainer = document.createElement('div');
        hContainer.classList.add('headerBlock')
        
         for(x=0; x<6; x++){
        const square =  document.createElement('div');
        square.classList.add('catagory');
        square.innerHTML = catagory[x].data.title;
        
        hContainer.append(square)
        header.append(hContainer)
         }
    







}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:cdx 
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
    //click listener for the board
        const clicker = document.querySelector('#container');
       
        clicker.addEventListener('click', function(e){
          
         qCat = e.target.classList.value[15]//gets the values of the classes for column and row
         qNum = e.target.classList.value[20]
         nClicks = e.target.classList.value[28]//looks to see if the board has been clicked on before
         
       if (nClicks === '0') {
       
         e.target.innerHTML = gameObj[qCat].clues[qNum].question;
         e.target.classList.remove('clicks0');//USING CLASSES FOR DATA, IS IT BETTER TO USE THE DATA- STRUCTURE?
         e.target.classList.add('clicks1');
        
       }
       if (nClicks === '1') {
       
           e.target.innerHTML = gameObj[qCat].clues[qNum].answer;
           e.target.classList.remove('clicks1');
         e.target.classList.add('clicks0');
       
       }
       
       
        })
       }



/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {
loading = document.querySelector('body')
const loadingElement = document.createElement('div');
loadingElement.classList.add('spinner')
loadingElement.innerText='Loading'
loading.append(loadingElement)

}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
hide = document.querySelector('.spinner')
hide.classList.add('hidden')


}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */



/** On click of start / restart button, set up game. */

// TODO

/** On page load, add event handler for clicking clues */

// TODO


