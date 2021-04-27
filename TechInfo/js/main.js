var genButton = document.getElementById('gen_but');
var genText = document.getElementById('gen_tex');
var inputAlphabet = document.getElementById('eingabe');
var tBody = document.getElementById('tBody');
var result = document.getElementById('result_bool');
var inputWord = document.getElementById('word_input');
var kanten = [];
var knoten = [];
var maxLength = 20;
var minLength = 5;

//Variablen für das Aussehen
var activeColor = 'rgb(255, 161, 47)';
var edgeColor = 'grey';
var nodeColor = 'white';
var tableColor = 'gray';
var faildColor = 'red';
var successColor = 'lightgreen';

//Variablen für die Überprüfung
var wordToCheck;
var originWord;
var index = 0; //Index des Buchstaben in der Zeichenkette, die geprüft wird.
var auto = true; //gibt an, ob die Überprüfung automatisch oder manuell ablaufen soll.
var inAction = false; //gibt an, ob gerade überprüft wird.
var playEndAnim = false;
var prev;
var activeNode;
var maxSpeed = 2000;
var speed = maxSpeed*0.2;
var isEdge = false;


/**
 * generates a random word using the inputAlphabet with a random length 
 * between @var minLength and @var maxLength
 * 
 * 
 */
function generateRandomWord() {
    let length = getRandomNumber(minLength, maxLength - minLength);
    let middle = kanten.filter((k) => !k.isStart() && !k.isEnd());
    let previous = kanten.find((kante) => kante.isStart());
    let resultWord = previous.getKantenName();
    playEndAnim = false;
    originWord = null;
    for (let i = 0; i < length; i++) {
        let poss = getNextPossible(previous, kanten);
        if (!poss || poss.length === 0) break;
        if (i === length - 2) {
            let last = kanten.filter((k) => k.getEndPos() === "6");
            resultWord += last[getRandomNumber(0, last.length - 1)].getKantenName();
            continue;
        } else if (i === length - 1) {
            resultWord += kanten.find((kante) => kante.isEnd()).getKantenName();
            break;
        }
        let r = getRandomNumber(0,10);
        console.log('rand: ',r, length);
        previous = r<10?poss[getRandomNumber(0, poss.length - 1)]:
                        middle[getRandomNumber(0, middle.length - 1)];
        //console.log(i,' poss:  ',poss, ' prev: ',previous);
        resultWord += previous.getKantenName();
    }

    genText.innerHTML = resultWord;
    //isWordCorrect(resultWord);
    console.log(resultWord[3]);

}

/**
 * resets several parameters in order to start from the very beginning.
 */
function reset() {
    index = 0;
    isEdge = false;
    prev = null;
    activeNode = null;
    wordToCheck = originWord || genText.innerHTML;
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
    if(!inAction){
        inAction = true;
        reset();
    } 
    auto = isauto;
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
        finishCheck(wordToCheck.length == index?true:false);
        console.log('finiche-----------------------',wordToCheck.length,' ', index,' ', edge,' ', prev,wordToCheck);
    }

}

/**
 * handles what happens once the word-checking is finished.
 * @param success indicates wether the word is correct or not.
 */
function finishCheck(success) {
    //console.log('finiche-----------------------',success);
    inAction = false;
    playEndAnim = true;
    endAnimation(10,success);
    if(success){

    }else{

        changeLetterColor(faildColor);
    }
}

/**
 * plays an animation at the end of the word-checking.
 * @param success indicates wether the word is correct or not.
 */
function endAnimation(count, success){
    activeNode && activeNode.setColor(count%2==0?success?successColor:faildColor:nodeColor);
    setTimeout(() => {
        !inAction && playEndAnim && endAnimation(count-1,success);
    }, 500);
}

/**
 * changes color of a single letter in the word.
 * @param color the new color for the letter.
 */
function changeLetterColor(color){
    let text = genText.textContent;
        console.log('col: ',text);
        let i = 0;
        let newText = "";
        newText = Array.prototype.map.call(text, function(letter) {
            let res = letter.fontcolor(i == index?color:'white');
            i++;
            return res;
        }).join('');
        genText.innerHTML = newText;
}

/**
 * checks wether a given word is correct in regards to the grammer.
 * @param word the word to be checked.
 * @returns if word is correct or not.
 */
function isWordCorrect(word) {
    let res = true;
    if (word.length < 5) res = false;
    let last = kanten.filter((k) => k.getEndPos() === "6");

    let previous = kanten.find((kante) => kante.getKantenName() === word[0]);
    for (let i = 1; i < word.length; i++) {
        if (!previous) { res = false; break; }
        let poss = getNextPossible(previous);
        if (poss) {
            previous = poss.find((kante) => kante.getKantenName() === word[i]);
        } else {
            if (i < word.length - 1) { res = false; break; }
        }
        if (i === word.length - 2) {
            let vl = last.find((kante) => kante.getKantenName() === word[i]);
            //console.log('i:'+i+' vorletztes: ', word[i], vl);
            if (!vl) { res = false; break; }
        }
        if (i === word.length - 1) {
            let l = kanten.find((kante) => kante.isEnd()).getKantenName() === word[i];
            //console.log('i:'+i+' letztes: ', word[i], l);
            if (!l) { res = false; break; }
        }
    }
    result.innerHTML = res ? 'richtig' : 'falsch';
    return res;
}

/**
 * accepts the manually input word to be checked
 * and displays it. 
 */
function inputReady(){
    if(inputWord.value)genText.innerHTML = inputWord.value;
    inputWord.value = '';
    originWord = null;
    playEndAnim = false;
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
    speed = Math.abs(maxSpeed*(value/100)-maxSpeed);
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

    kanten.push(new Kante(getTableRow("q0", "B", "q1")));
    kanten.push(new Kante(getTableRow("q1", "T", "q2")));
    kanten.push(new Kante(getTableRow("q1", "P", "q3")));
    kanten.push(new Kante(getTableRow("q2", "S", "q2")));
    kanten.push(new Kante(getTableRow("q2", "X", "q4")));
    kanten.push(new Kante(getTableRow("q3", "T", "q3")));
    kanten.push(new Kante(getTableRow("q3", "V", "q5")));
    kanten.push(new Kante(getTableRow("q4", "S", "q6")));
    kanten.push(new Kante(getTableRow("q4", "X", "q3")));
    kanten.push(new Kante(getTableRow("q5", "P", "q4")));
    kanten.push(new Kante(getTableRow("q5", "V", "q6")));
    kanten.push(new Kante(getTableRow("q6", "E", "q7")));

    for (let i = 0; i <= 7; i++) {
        knoten.push(new Knoten('q' + i));
    }

    let alphabet = "";
    kanten.forEach((k) => {
        tBody.appendChild(k.getRow());
        let name = k.getKantenName();
        alphabet.includes(name) || (alphabet += ", " + name);
    });
    inputAlphabet.innerHTML = alphabet.substring(2);
    initColors();
    //console.log('kanten: ',kanten);
}

/**
 * sets the colors of table and grammer.
 */
function initColors() {
    kanten.forEach((k) =>{
        k.setColor(edgeColor);
        k.setRowColor(tableColor);
    });
    knoten.forEach((n) => n.setColor(nodeColor));
}

/**
 * creates a single tablerow with 3 cells.
 * @param start start node
 * @param edge edge in the grammer.
 * @param end end node
 * @returns an html tablerow element.
 */
function getTableRow(start, edge, end) {
    let tableRow = document.createElement("tr");

    tableRow.insertCell(0).innerHTML = start;
    tableRow.insertCell(1).innerHTML = edge;
    tableRow.insertCell(2).innerHTML = end;

    return tableRow;
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
    end;
    svgRef;
    constructor(row) {
        this.row = row;
        this.start = row.childNodes[0].innerHTML;
        this.kante = row.childNodes[1].innerHTML;
        this.end = row.childNodes[2].innerHTML;
        let from = this.start.substring(1);
        let to = this.end.substring(1);
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
        let text = genText.textContent;
        console.log('col: ',text);
        let i = 0;
        let newText = Array.prototype.map.call(text, function(letter) {
            let res = letter.fontcolor(i == index?activeColor:'white');
            i++;
            return res;
        }).join('');
        genText.innerHTML = newText;
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
        this.svgRef.arrow.style.stroke = color;
        this.svgRef.arrow2 && (this.svgRef.arrow2.style.stroke = color);
        this.svgRef.arrowHead && (this.svgRef.arrowHead.style.stroke = color);
    }

    setLetterColor(color){
        this.svgRef.letter.style.stroke = color;
    }

    setRowColor(color){
        this.row.childNodes.forEach((r) => r.style.backgroundColor = color);
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
        return this.getStartPos() === '0';
    }

    isEnd() {
        return this.getEndPos() === '7';
    }

    getStartPos() {
        return this.start.substring(1);
    }

    getEndPos() {
        return this.end.substring(1);
    }
}

class Knoten {
    name;
    number;
    svgRef;
    constructor(name) {
        this.name = name;
        this.number = this.name.substring(1);
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
        this.svgRef.node.style.fill = color;
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

