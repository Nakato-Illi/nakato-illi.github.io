var hintWord = "Prüfungsfeld";
var genCorrectButton = document.getElementById('gen_but_corr');
var genWrongButton = document.getElementById('gen_but_wrong');
var genText = document.getElementById('gen_tex');
var editOK = document.getElementById('edit_ok');
var inputOK = document.getElementById('isCorrekt');
var start = document.getElementById('start');
var stopp = document.getElementById('stop');
var step = document.getElementById('step');
var editText = document.getElementById('wortandern');
var inputAlphabet = document.getElementById('eingabe');
var tBody = document.getElementById('tBody');
var result = document.getElementById('isExpCorrect');
var inputWord = document.getElementById('word_input');
var kanten = [];
var knoten = [];
var maxLength = 10;
var minLength = 5;

//Variablen für das Aussehen
var activeColor = 'rgb(255, 161, 47)';
var edgeColor = 'lightgrey';
var nodeColor = 'white';
var tableColor = 'lightgrey';
var faildColor = 'red';
var successColor = 'lightgreen';
var startIndicator = '->';
var endIndicator = '*';

//Variablen für die Überprüfung
var wordToCheck;
var originWord;
var index = 0; //Index des Buchstaben in der Zeichenkette, die geprüft wird.
var auto = true; //gibt an, ob die Überprüfung automatisch oder manuell ablaufen soll.
var inAction = false;
manageClickability(false); //gibt an, ob gerade überprüft wird.
var playEndAnim = false;
var prev;
var activeNode;
var maxSpeed = 2000;
var speed = maxSpeed * 0.2;
var isEdge = false;


inputWord.addEventListener('input', (evt) => {
    let word = inputWord.value;
    word.match(/[^a-z]/gi) && (inputWord.value = word.replace(/[^a-z]/gi, ''));
    manageStates();
    result.style.padding = '5px';
    result.style.backgroundColor = !inputWord.value ? 'transparent' : isWordCorrect() ? 'lightgreen' : 'red';
});

/**
 * generates a random word using the inputAlphabet with a random length 
 * between @var minLength and @var maxLength
 * 
 * 
 */
function generateRandomRightWord() {
    let previous = kanten.find((kante) => kante.isStart());
    let resultWord = previous.getKantenName();
    playEndAnim = false;
    originWord && (inputWord.value = originWord);
    originWord = null;
    for (let i = 0; true; i++) {
        let poss = getNextPossible(previous, kanten);
        if (!poss || poss.length === 0) break;
        previous = poss[getRandomNumber(0, poss.length - 1)]
        resultWord += previous.getKantenName();
    }
    console.log('1 generateRandomRightWord: ', resultWord, originWord, inputWord.value);
    if (resultWord === inputWord.value) {
        console.log('2 generateRandomRightWord: ', resultWord, originWord, inputWord.value);
        generateRandomRightWord();
    }
    else {
        inputWord.value = resultWord;
        console.log(resultWord[3]);
        isWordCorrect();
        manageStates();
    }

}

/**
 * generates a random word using the inputAlphabet with a random length 
 * between @var minLength and @var maxLength
 * 
 * 
 */
function generateRandomWrongWord() {

    let length = getRandomNumber(minLength, maxLength - minLength);
    let previous = kanten.find((kante) => kante.isStart());
    let resultWord = previous.getKantenName();
    playEndAnim = false;
    originWord && (inputWord.value = originWord);
    originWord = null;
    for (let i = 0; i < length; i++) {
        let r = getRandomNumber(0, 10);
        let poss = getNextPossible(previous, kanten);
        // console.log('rand: ',r, length);
        previous = r < 5 ? poss.length > 0 ? poss[getRandomNumber(0, poss.length - 1)] : kanten[getRandomNumber(0, kanten.length - 1)] : kanten[getRandomNumber(0, kanten.length - 1)];
        resultWord += previous.getKantenName();
    }

    console.log('1 generateRandomWrongWord: ', resultWord, originWord, inputWord.value);
    if ((resultWord === inputWord.value) || isWordCorrect(resultWord)) {
        console.log('2 generateRandomWrongWord: ', resultWord, originWord, inputWord.value);
        generateRandomWrongWord();
    }
    else {
        inputWord.value = resultWord;
        //isWordCorrect(resultWord);
        console.log(resultWord[3]);
        isWordCorrect();
        manageStates();
    }


}

/**
 * resets several parameters in order to start from the very beginning.
 */
function reset() {
    index = 0;
    isEdge = false;
    prev = null;
    activeNode = null;
    wordToCheck = originWord || inputWord.value;
    originWord || (originWord = new String(wordToCheck));
    kanten.forEach((k) => k.reset());
    knoten.forEach((n) => n.reset());
}

/**
 * starts the checking of the word or 
 * enters the next step in the manuel word-checking.
 * @param isauto wether to continue the word-checking automatically or manually.
 */
function checkWord(isauto) {
    if (inputWord.value === hintWord) return;
    inputWord.value = '';
    if (!inAction) {
        inAction = true;
        manageClickability(true);
        reset();
    }
    auto = isauto;
    manageStates();
    isLetterCorrect();
}

/**
 * checks the word, one letter at a time.
 * if @var isEdge is true it checks the letter with index @var index
 * and also changes its the color
 * else it changes the color of the current node
 */
function isLetterCorrect() {
    let edge;
    if (index === 0) {
        if (!isEdge) {
            let node = knoten.find((n) => n.isStart());
            node.setColor(activeColor);
        }
        if (isEdge) {
            edge = kanten.find((kante) => kante.getKantenName() === wordToCheck[index]);
            if (edge) {
                if (!edge.isStart()) {
                    edge = null;
                }
            }
        }
    }
    else {
        // if (!isEdge) node = knoten.find((n) => n.getNumber() === index);
        if (isEdge) {
            let poss = getNextPossible(prev);
            edge = poss.find((kante) => kante.getKantenName() === wordToCheck[index]);
        }
    }
    if (edge || !isEdge) {
        if (!isEdge) {
            if (prev) prev.setInactive();
        }
        if (isEdge) {
            edge.setActive();
            prev = edge;
            index++;
        }
        isEdge = !isEdge;

        setTimeout(() => {
            if (auto) isLetterCorrect();
        }, speed);

    } else {
        let end = prev && prev.isEnd();
        finishCheck(wordToCheck.length == index && end ? true : false);
        console.log('finiche-----------------------', wordToCheck.length, ' ', index, ' ', edge, ' ', prev, wordToCheck);
    }

}

/**
 * handles what happens once the word-checking is finished.
 * @param success indicates wether the word is correct or not.
 */
function finishCheck(success) {
    //console.log('finiche-----------------------',success);
    inAction = false;
    manageStates();
    manageClickability(false);
    playEndAnim = true;
    endAnimation(10, success);
    if (success) {

    } else {

        changeLetterColor(faildColor);
    }
}

/**
 * plays an animation at the end of the word-checking.
 * @param success indicates wether the word is correct or not.
 */
function endAnimation(count, success) {
    activeNode && activeNode.setColor(count % 2 == 0 ? success ? successColor : faildColor : nodeColor);
    setTimeout(() => {
        !inAction && playEndAnim && endAnimation(count - 1, success);
    }, 500);
}

/**
 * changes color of a single letter in the word.
 * @param color the new color for the letter.
 */
function changeLetterColor(color) {
    let text = inputWord.textContent;
    console.log('col: ', text);
    let i = 0;
    let newText = "";
    newText = Array.prototype.map.call(text, function (letter) {
        let res = letter.fontcolor(i == index ? color : 'white');
        i++;
        return res;
    }).join('');
    inputWord.value = newText;
}

/**
 * checks wether a given word is correct in regards to the grammer.
 * @param word the word to be checked.
 * @returns if word is correct or not.
 */
function isWordCorrect(w) {
    // BPBTXSEPE
    let res = true;

    word = w || originWord || inputWord.value;
    if (word.length < 9) res = false;
    let last = kanten.filter((k) => k.getEndPos() === 8);

    let previous = kanten.find((kante) => kante.getKantenName() === word[0] && kante.isStart());
    console.log('check word first: ', word, res, previous);
    let ind = 0;
    if(res)for (let i = 1; i < word.length; i++) {
        ind = i;
        if (!previous) { res = false; break; }
        let poss = getNextPossible(previous);
        console.log(i+' check word poss: ', word, res, poss);
        if (poss) {
            previous = poss.find((kante) => kante.getKantenName() === word[i]);
            console.log(i+' - check word prev: ', word, res, previous, word[i]);
        } else {
            if (i < word.length - 1) { res = false; break; }
        }
        // if (i === 1) {
        //     console.log(i+' check word: ', word, res, word[i] !== 'B');
        //     if (word[i] !== 'B') { res = false; break; }
        // }
        // if (i === 1) {
        //     if (word[i] !== 'P' || word[i] !== 'T') { res = false; break; }
        // }
        // if (i === word.length - 4) {
        //     let vl = last.find((kante) => kante.getKantenName() === word[i]);
        //     console.log('i:' + i + ' vorletztes: ', word[i], vl);
        //     if (!vl) { res = false; break; }
        // }
        // if (i === word.length - 3) {
        //     let l = kanten.find((kante) => kante.isEnd()).getKantenName() === word[i];
        //     console.log('i:' + i + ' letztes: ', word[i], l);
        //     if (!l) { res = false; break; }
        // }
    }
    // if(!w){
    //     inputWord.value = '';
    //     result.style.color = res ? successColor : faildColor;
    //     result.style.fontSize = '20px';
    //     result.style.padding = '5px';
    //     result.innerHTML = res ? 'richtig' : 'falsch';
    // }
    console.log('check word: ', word, res, ind);
    return res;
}

function manageClickability(status) {
    // editText.disabled = status;
    // inputWord.disabled = status;
    // genCorrectButton.disabled = status;
    // genWrongButton.disabled = status;
    // inputOK.disabled = status;
}

function manageStates() {
    // console.log('manageStates: ', inputWord.value);
    let s = inputWord.value === hintWord;
    start.disabled = s || inAction ? true : false;
    step.disabled = s ? true : false;
    stopp.disabled = inAction && auto ? false : true;
    // editText.disabled = s||inAction?true:false;
}

function editWord() {
    inputWord.value = originWord || inputWord.value;
    inputWord.focus();
}

/**
 * accepts the manually input word to be checked
 * and displays it. 
 */
function inputReady() {
    if (!inputWord.value) return;

    if (inputWord.value) inputWord.value = inputWord.value;
    originWord = inputWord.value;
    inputWord.value = '';

    playEndAnim = false;
    isWordCorrect();
    manageStates();
}

/**
 * pauses the ongooing word-checcking.
 */
function pause() {
    auto = false;
}

/**
 * sets the speed for the automatic word-checking.
 * @param value time between each step in millisecons.
 */
function setSpeed(value) {
    speed = Math.abs(maxSpeed * (value / 100) - maxSpeed);
}

/**
 * looks for all edges that can follow after the current one in the grammer.
 * @param current the edge in the grammer that is being checked.
 * @returns array of edges that can follow after the current.
 */
function getNextPossible(current) {
    return kanten.filter((k) => k.getStartPos() === current.getEndPos());
}

/**
 * initializes the arrays with the nodes and edges of the grammer
 * and fills the table.
 */
function initProgram() {

    kanten.push(new Kante("qStart", "B", "qA", [0, 1]));
    kanten.push(new Kante("qA", "T", "qB", [1, 2]));
    kanten.push(new Kante("qA", "P", "qB", [1, 2]));
    kanten.push(new Kante("qB", "B", "q1", [2, 3]));
    kanten.push(new Kante("q1", "T", "q2", [3, 4]));
    kanten.push(new Kante("q1", "P", "q3", [3, 5]));
    kanten.push(new Kante("q2", "S", "q2", [4, 4]));
    kanten.push(new Kante("q2", "X", "q4", [4, 6]));
    kanten.push(new Kante("q3", "T", "q3", [5, 5]));
    kanten.push(new Kante("q3", "V", "q5", [5, 7]));
    kanten.push(new Kante("q4", "S", "q6", [6, 8]));
    kanten.push(new Kante("q4", "X", "q3", [6, 5]));
    kanten.push(new Kante("q5", "P", "q4", [7, 6]));
    kanten.push(new Kante("q5", "V", "q6", [7, 8]));
    kanten.push(new Kante("q6", "E", "qC", [8, 9]));
    kanten.push(new Kante("qC", "T", "qD", [9, 10]));
    kanten.push(new Kante("qC", "P", "qE", [9, 11]));
    kanten.push(new Kante("qD", "E", "qF", [10, 12]));
    kanten.push(new Kante("qE", "E", "qG", [11, 13]));
    kanten.push(new Kante("qF", "_", "qF", [12, 12]));
    kanten.push(new Kante("qG", "_", "qG", [13, 13]));
    kanten.push(new Kante("qF", "T", "qAccept", [12, 14]));
    kanten.push(new Kante("qG", "P", "qAccept", [13, 14]));

    const l = [...kanten.map((k) => { return { kan: k.end, num: k.endPos } }), { kan: 'qStart', num: 0 }]

    for (let i = 0; i <= 14; i++) {
        knoten.push(new Knoten(l.find((e) => e.num === i).kan, i));
    }

    initColors();
    manageStates();

    //console.log('kanten: ',kanten);
}

/**
 * sets the colors of table and grammer.
 */
function initColors() {
    kanten.forEach((k) => {
        k.setColor(edgeColor);
        k.setRowColor(tableColor);
    });
    knoten.forEach((n) => n.setColor(nodeColor));
}


/**
 * calculates a random int within a given interval
 * @param start start of the interval
 * @param length length of the interval
 * @returns an int
 */
function getRandomNumber(start, length) {
    return start + Math.round(Math.random() * length);
}

class Kante {
    row;
    kante;
    start;
    startPos;
    end;
    endPos;
    svgRef;
    constructor(start, name, end, pos) {
        this.row = document.getElementById(start + '-' + name);
        this.start = start;
        this.kante = name;
        this.end = end;
        this.startPos = pos[0]
        this.endPos = pos[1]

        let from = pos[0];
        let to = pos[1];
        this.svgRef = {
            arrow: document.getElementById('arrow' + from + '-' + to),
            arrow2: document.getElementById('arrow_' + from + '-' + to),
            letter: document.getElementById('letter' + from + '-' + to),
            arrowHead: (from - to) === 0 ? document.getElementById('arrowhead' + from + '-' + to) : null,
        }
    }

    setActive() {
        this.setColor(activeColor);
        this.setRowColor(activeColor);
        // let text = inputWord.textContent;
        // console.log('col: ',text);
        // let i = 0;
        // let newText = Array.prototype.map.call(text, function(letter) {
        //     let res = letter.fontcolor(i == index?activeColor:'white');
        //     i++;
        //     return res;
        // }).join('');
        // inputWord.value = newText;
        //console.log('col: ', text.charAt(index));
        let n = knoten.find((node) => node.getName() === this.start);
        if (n) {
            n.setColor(nodeColor);
        }
    }

    setInactive() {
        this.setColor(edgeColor);
        this.setRowColor(tableColor);
        let n = knoten.find((node) => node.getName() === this.end);
        if (n) {
            n.setColor(activeColor);
            activeNode = n;
        }
    }

    setColor(color) {
        // this.svgRef.arrow.style.stroke = color;
        // this.svgRef.arrow2 && (this.svgRef.arrow2.style.stroke = color);
        // this.svgRef.arrowHead && (this.svgRef.arrowHead.style.stroke = color);
    }

    setLetterColor(color) {
        this.svgRef.letter.style.stroke = color;
    }

    setRowColor(color) {
        // this.row.childNodes.forEach((r) => r.style.backgroundColor = color);
    }

    reset() {
        this.setColor(edgeColor);
    }

    getRow() {
        return this.row;
    }

    getKantenName() {
        return this.kante;
    }

    isStart() {
        return this.start === 'qStart';
    }

    isEnd() {
        return this.end === 'qAccept';
    }

    getStartPos() {
        return this.startPos;
    }

    getEndPos() {
        return this.endPos;
    }
}

class Knoten {
    name;
    number;
    svgRef;
    constructor(name, num) {
        this.name = name;
        this.number = this.num;
        this.svgRef = {
            node: document.getElementById('node' + this.number),
        }
    }

    getName() {
        return this.name;
    }

    getNumber() {
        return Number.parseInt(this.number);
    }

    setColor(color) {
        // this.svgRef.node.style.fill = color;
    }

    reset() {
        this.setColor(nodeColor);
    }

    isStart() {
        return this.number === '0';
    }

    isEnd() {
        return this.number === '7';
    }
}

initProgram();


