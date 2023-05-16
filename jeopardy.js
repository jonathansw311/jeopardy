


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

let cats = [];
gameObj = {}
let catRes = [];
let cCount = [];



const reStart =  document.querySelector('#restart')//for restart button
reStart.addEventListener('click', function(){
    setupAndStart()
})

function setupAndStart() {
    sessionStorage.setItem("reloading", "true");
    document.location.reload();
    
}
window.onload = function() {
    let reloading = sessionStorage.getItem("reloading");
    if (reloading) {
        sessionStorage.removeItem("reloading");
        getCategoryIds();
    }
}

async function getCategoryIds() {


    const res =  await axios.get('https://jservice.io/api/categories', {params: {count: 100}})//this gets the catagorys
   
   //selects 6 catagorys at random for the game
   for (let y = 0; y < 6; y++){
    ran = Math.floor(Math.random()* 100)
    if(res.data[ran].clues_count>4){//if the clues dont have at least five Q and A's another catagory is selected
    cats[y]= res.data[ran];}
    else{y--} 
   
    
   // console.log(cats[y].clues_count)//cats is an array of 6 catagorys.  the questions have not been selected
   }
  
   getCatorgories(cats)
   buildBoard(cats) 

}


async function getCatorgories(cats) {// this function get the catagories
 

    for(let x = 0; x<6; x++){//gets the six catagories for the board
      catRes[x] =  await axios.get('https://jservice.io/api/category', {params: {id: cats[x].id}});
    }
// buildCatObj(catRes);//builds the catObj for the game, sends over the catagories to get the object
       buildQuestions()//initializes the game board with the question marks
      
      // getFiveClues(cats)
      cCount=getCcount(0);
      loadGameObject(cCount)
     }

     function buildBoard(cats){
        const header = document.querySelector('#container')
        hContainer = document.createElement('div');
        hContainer.classList.add('headerBlock')
        
         for(x=0; x<6; x++){
        const square =  document.createElement('div');
        square.classList.add('catagory');
        square.innerHTML = cats[x].title;
        
        hContainer.append(square)
        header.append(hContainer)
         }
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
           

}

//
}
  getListener()  //puts the click listener on the game board
}


function getListener(){//click listener for the board
    const clicker = document.querySelector('#container');
   
    clicker.addEventListener('click', function(e){
      
     qCat = e.target.classList.value[15]//gets the values of the classes for column and row
     qNum = e.target.classList.value[20]
     nClicks = e.target.classList.value[28]//looks to see if the board has been clicked on before
     
   if (nClicks === '0') {
   
     e.target.innerHTML = gameObj[qCat].clues[qNum].question;
     e.target.classList.remove('clicks0');
     e.target.classList.add('clicks1');
    
   }
   if (nClicks === '1') {
   
       e.target.innerHTML = gameObj[qCat].clues[qNum].answer;
       e.target.classList.remove('clicks1');
     e.target.classList.add('clicks0');
   
   }
   
   
    })
   }

   function loadGameObject(cCount){
    let questions=[];
    let answers = [];
    let QnA = '';

    for(let x = 0; x<6; x++) {
        y=cCount[x]
cCount = getCcount(x);
        // questions[x] = (catRes[x].data.clues[y].question)
        // answers[x] = (catRes[x].data.clues[y].answer)
   
   questions = loadQ(cCount, questions, x);//gets 5 randomly selectios questions
    answers=loadA(cCount, answers, x);//and the matching answersw
    gameObj[x] = {title: catRes[x].data.title,
                clues: [{question: questions[0], answer: answers[0]},
                        {question: questions[1], answer: answers[1]},
                        {question: questions[2], answer: answers[2]},
                        {question: questions[3], answer: answers[3]},
                        {question: questions[4], answer: answers[4]},
            
            
            ]}
    }

}
//loads questions into object
function loadQ(cCount, questions, idx){
    for(let x = 0; x<5; x++) {//gets the six catagories for the board
          let  y=cCount[x];
                questions[x] = (catRes[idx].data.clues[y].question)
             //  console.log(questions[x])
            }
            return questions
}

//loads answers into object
function loadA(cCount, answers, idx){
  
    for(let x = 0; x<5; x++) {//gets the six catagories for the board
          let  y=cCount[x];

                answers[x] = (catRes[idx].data.clues[y].answer)
            
            }
            return answers
}
//randomly selects five questions within each catagory
function getCcount(idx){
    cCount = [];
    for(x= 0; x<5; x++) {
        if(cats[idx].clues_count<5) {
            console.log('not Enough clues')
            return;
        }
       ran=Math.floor(Math.random()*(cats[idx].clues_count))
       if(cCount.includes(ran)) {
        console.log('we had a dupe')
        x--
       }
       else {cCount.push(ran);
    }
        
    }
    return cCount;
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

function getCategory(catId) {
}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

async function fillTable() {
}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:cdx 
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {

}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
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


