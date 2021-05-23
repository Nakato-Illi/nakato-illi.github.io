var hintWord = "Prüfungsfeld";
var genCorrectButton = document.getElementById('gen_but_corr');
var genWrongButton = document.getElementById('gen_but_wrong');
var genExp = document.getElementById('word_input');
var exp = document.getElementById('gen_exp');
var inputOK = document.getElementById('isCorrekt');
var start = document.getElementById('start');
var stopp = document.getElementById('stop');
var step = document.getElementById('step');
var inputAlphabet = document.getElementById('eingabe');
var tBody = document.getElementById('tBody');
var result = document.getElementById('isExpCorrect');
var inputWord = document.getElementById('word_input');
var ausdrucke = ['AOA', '(A)', 'Z'];
var operanden = ['+', '-', '/', '*'];
var knoten = [];
var steps = [];
var maxLength = 3;
var minLength = 5;

genExp.addEventListener('input', (evt) => {
    result.style.backgroundColor = !genExp.value ? 'transparent' : isExprCorrect() ? 'lightgreen' : 'red';
});

// start.addEventListener('click', (evt) => {
//     console.log('jhhcjugc,')
//     checkWord(true);
// });

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


/**
 * generates a random word using the inputAlphabet with a random length 
 * between @var minLength and @var maxLength
 * 
 * 
 */
function generateRandomRightWord() {
    index = 0;
    let r = getRandomNumber(0, ausdrucke.length - 1);
    let a = ausdrucke[r];
    // console.log(r, a);
    let vorAusdruck = new Ausdruck(a).getAusdruck();

    let resultWord = '';
    for (let i = 0; i < vorAusdruck.length; i++) {
        resultWord += replace(vorAusdruck[i]);
    }

    genExp.value = resultWord;
    genExp.dispatchEvent(new Event('input'));
    console.log(resultWord);
    // isExprCorrect();
    // manageStates();

}

function replace(a) {
    switch (a) {
        case 'Z':
            return getRandomNumber(0, 9);
            break;
        case 'O':
            return operanden[getRandomNumber(0, operanden.length - 1)];
            break;
        default:
            return a;
            break;
    }
}

/**
 * generates a random word using the inputAlphabet with a random length 
 * between @var minLength and @var maxLength
 * 
 * 
 */
function generateRandomWrongExpr() {
    index = 0;
    let r = getRandomNumber(0, ausdrucke.length - 1);
    let a = ausdrucke[r];
    // console.log(r, a);
    let vorAusdruck = new Ausdruck(a).getFalschAusdruck();

    let resultWord = '';
    for (let i = 0; i < vorAusdruck.length; i++) {
        resultWord += replace(vorAusdruck[i]);
    }
    if (isExprCorrect(resultWord)) {
        generateRandomWrongExpr();
    } else {
        genExp.value = resultWord;
        genExp.dispatchEvent(new Event('input'));
        console.log(resultWord);
    }
}

/**
 * resets several parameters in order to start from the very beginning.
 */
function reset() {
    index = 0;
}

const checkWord = (isauto) => {
    steps = [];
    isExprCorrect2();
    steps.reverse();
    console.log(index, ' die liste: ', steps.map((el) => el.e+'|'+el.r));
    if(!steps.length > 0) return;
    if (!inAction) {
        inAction = true;
        manageClickability(true);
        reset();
    }
    auto = isauto;
    manageStates();
    isLetterCorrect();
};

/**
 * starts the checking of the word or 
 * enters the next step in the manuel word-checking.
 * @param isauto wether to continue the word-checking automatically or manually.
 */
function checkWord2(isauto) {
    isExprCorrect2();
    
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


   exp.innerHTML = steps[index].e;
   const element = document.getElementById(steps[index].r);
   prev && (prev.style.color = 'black');
   element && (element.style.color = 'blue');
   prev = element;
   index++;
//    if(index>steps.length-1){
//        inAction = false;
//        exp.innerHTML = steps[index].e.replaceAll('A','Z');
//    }
//    else{
    setTimeout(() => {
        if(index>steps.length-1){
            inAction = false;
            // exp.innerHTML = steps[steps.length-1].e.replaceAll('A','Z');
            // document.getElementById('Z').style.color = 'blue';
        }else 
        if (auto) {
            isLetterCorrect();
        }
    }, speed);
//    }
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
    let text = genExp.textContent;
    console.log('col: ', text);
    let i = 0;
    let newText = '';
    newText = Array.prototype.map.call(text, function (letter) {
        let res = letter.fontcolor(i == index ? color : 'white');
        i++;
        return res;
    }).join('');
    genExp.innerHTML = newText;
}

/**
 * checks wether a given expression is correct in regards to the grammer.
 * @param word the word to be checked.
 * @returns if word is correct or not.
 */
function isExprCorrect(e) {
    let res = false;

    let exp = '' + (e || genExp.value);

    console.log('1 check exp: ', exp);
    if ((exp.match(/[^\d+\-/*()]/g) || []).length > 0) {
        console.log('check res: ', res);
        return false;
    }

    exp = replace2(exp);
    console.log('2 check exp: ', exp);
    if (exp === 'A') res = true;
    let prev = exp;
    while (isOrderCorrect(exp)) {
        console.log('check exp: ', exp);
        if (exp.length < 4) {
            if (exp === 'AOA') {
                res = true;
            }
            if (exp === '(A)') {
                res = true;
            }
            break;
        }
        exp.length > 3 && (exp = exp.replaceAll('(A)', 'A'));
        exp.length > 3 && (exp = exp.replaceAll('AOA', 'A'));
        if (prev === exp) break;
        prev = exp;
    }
    console.log('check res: ', res);
    return res;
}

function isExprCorrect2(e) {
    let res = false;
    let exp = '' + (e || genExp.value);

    console.log('1 check exp: ', exp);
    if ((exp.match(/[^\d+\-/*()]/g) || []).length > 0) {
        console.log('check res: ', res);
        return false;
    }

    exp = replace2(exp);
    console.log('2 check exp stw: ', exp);
    if (exp === 'A') res = true;
    steps.push({e:exp.replaceAll('A','Z'), r:'Z'});
    let prev = exp;
    while (isOrderCorrect(exp)) {
        console.log('check exp stw: ', exp);
        if (exp.length < 4) {
            if (exp === 'AOA') {
                steps.push({e:exp, r:'AOA'});
                res = true;
            }else
            if (exp === '(A)') {
                steps.push({e:exp, r:'(A)'});
                res = true;
            }
            break;
        }
        if(exp.length > 3){
            if(exp.includes('(A)')){
                steps.push({e:exp, r:'(A)'});
                exp = exp.replace('(A)', 'A');
                
                continue;
            }else if(exp.includes('AOA')){
                steps.push({e:exp, r:'AOA'});
                exp = exp.replace('AOA', 'A');
                
                continue;
            }
        }
        if (prev === exp) break;
        prev = exp;
    }
    console.log('check res stw: ', res);
    return steps;
}

function replace2(a = '') {
    return a.replace(/\d/g, 'A').replace(/[+ \- / *]/g, 'O');
}

function isOrderCorrect(a) {

    if (a.includes('OO')) {
        return false;
    }
    if (a.includes('ZZ')) {
        return false;
    }
    if (a.includes('()')) {
        return false;
    }
    if (a.includes(')(')) {
        return false;
    }
    if (a.includes('A(')) {
        return false;
    }
    if (a.includes(')A')) {
        return false;
    }
    if (a.includes('(O')) {
        return false;
    }
    if (a.includes('O)')) {
        return false;
    }
    if (a.length === 2) {
        return false;
    }

    return true;
}

function manageClickability(status) {
    // editText.disabled = status;
    // inputWord.disabled = status;
    // genCorrectButton.disabled = status;
    // genWrongButton.disabled = status;
    // inputOK.disabled = status;
}

function manageStates() {
    // console.log('manageStates: ', genText.innerHTML);
    // let s = genExp.innerHTML === hintWord;
    // start.disabled = s || inAction ? true : false;
    // step.disabled = s ? true : false;
    // stopp.disabled = inAction && auto ? false : true;
}

function editWord() {
    inputWord.value = originWord || genExp.innerHTML;
    inputWord.focus();
}

/**
 * accepts the manually input word to be checked
 * and displays it. 
 */
function inputReady() {
    if (!inputWord.value) return;

    if (inputWord.value) genExp.innerHTML = inputWord.value;
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



    // let alphabet = "";
    // kanten.forEach((k) => {
    //     tBody.appendChild(k.getRow());
    //     let name = k.getKantenName();
    //     alphabet.includes(name) || (alphabet += ", " + name);
    // });
    // inputAlphabet.innerHTML = alphabet.substring(2);
    // initColors();
    // manageStates();

    //console.log('kanten: ',kanten);
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

class Ausdruck {
    name;
    type;
    nextPssible;
    anzahl;
    svgRef;
    constructor(type) {
        this.setAusdruck(type);
        this.svgRef = {
            node: document.getElementById('node' + this.number),
        }
    }

    setAusdruck(type) {
        switch (type) {
            case 'AOA':
                this.name = type;
                this.nextPssible = ['AOA', '(A)', 'Z'];
                this.anzahl = 2;
                break;
            case '(A)':
                this.name = type;
                this.nextPssible = ['AOA', 'Z'];
                this.anzahl = 1;
                break;
            case 'Z':
                this.name = type;
                this.nextPssible = [];
                this.anzahl = 0;
                break;
            default:
                break;
        }
    }

    getAusdruck() {
        let res = this.name;
        // console.log('pre ', res);
        for (let i = 0; i < this.anzahl; i++) {
            let r = getRandomNumber(0, this.nextPssible.length - 1);
            let n = index > maxLength ? 'Z' : new Ausdruck(this.nextPssible[r]).getAusdruck();
            // console.log('res ', res, ' n ',n);
            res = res.replace('A', n);
            // console.log('2 res ', res, ' n ',n);
            index++;
        }
        // console.log('post ', res);
        return res;
    }

    getFalschAusdruck() {
        let res = this.name;
        let list = [...ausdrucke, 'O'];
        // console.log('pre ', res);
        for (let i = 0; i < maxLength; i++) {
            let r = getRandomNumber(0, list.length - 1);
            res += list[r];
        }
        res = res.replace(/[A]/g, 'Z');
        // console.log('post ', res);
        return res;
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


