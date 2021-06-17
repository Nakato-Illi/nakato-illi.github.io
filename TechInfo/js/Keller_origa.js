var genCorrectButton = document.getElementById('gen_but_corr');
var genWrongButton = document.getElementById('gen_but_wrong');
var genExp = document.getElementById('word_input');
var exp = document.getElementById('gen_exp');
var start = document.getElementById('start');
var stopp = document.getElementById('stop');
var step = document.getElementById('step');
var result = document.getElementById('isExpCorrect');
var ausdrucke = ['AOA', '(A)', 'Z'];
var operanden = ['+', '-', '/', '*'];
const falseExp = ['OO', 'ZZ', '()', ')(', 'A(', ')A', '(O', 'O)', 'Z(', ')Z'];
var steps = [];
var maxLength = 3;
var max = 10;

genExp.addEventListener('input', (evt) => {
    let word = genExp.value;
    word.match(/[^\d+\-/*()]/g) && (genExp.value = word.replace(/[^\d+\-/*()]/g, ''));
    manageStates();
    // result.style.backgroundColor = !genExp.value ? 'transparent' : isExprCorrect() ? 'lightgreen' : 'red';
});

//Variablen für das Aussehen
var activeColor = 'blue';
var faildColor = 'red';
var successColor = 'lightgreen';


//Variablen für die Überprüfung
var index = 0; //Index des Buchstaben in der Zeichenkette, die geprüft wird.
var auto = true; //gibt an, ob die Überprüfung automatisch oder manuell ablaufen soll.
var inAction = false;
manageClickability(false); //gibt an, ob gerade überprüft wird.
var playEndAnim = false;
var prev;
var maxSpeed = 2000;
var speed = maxSpeed * 0.2;


/**
 * generates a random word using the inputAlphabet with a random length 
 * between @var minLength and @var maxLength
 * 
 * 
 */
function generateRandomRightWord() {
    count = 0;
    let r = getRandomNumber(0, ausdrucke.length - 1);
    let a = ausdrucke[r];
    // console.log(r, a);
    // let vorAusdruck = getAusdruck(a);
    let vorAusdruck = getRichtigAusdruck(a);

    let resultWord = '';
    for (let i = 0; i < vorAusdruck.length; i++) {
        resultWord += replace(vorAusdruck[i]);
    }

    genExp.value = resultWord;
    genExp.dispatchEvent(new Event('input'));
    console.log(resultWord);
    // isExprCorrect();
    manageStates();
    isExprCorrect();
    // resetk();
    // check();

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


function generateRandomWrongExpr() {
    let r = getRandomNumber(0, ausdrucke.length - 1);
    let a = ausdrucke[r];
    // console.log(r, a);
    let vorAusdruck = getFalschAusdruck(a);

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
        manageStates();
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
    isExprCorrect();
    steps.reverse();
    console.log(index, ' die liste: ', steps.map((el) => el.e + '|' + el.r + '|' + el.i));
    if (!steps.length > 0) return;
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
 * checks the word, one letter at a time.
 * if @var isEdge is true it checks the letter with index @var index
 * and also changes its the color
 * else it changes the color of the current node
 */
function isLetterCorrect() {

    if (prev) {
        prev.style.color = 'black';
        prev.style.fontSize = '27px';
    }
    const indexe = steps[index].l;
    if (indexe) {
        changeLetterColor(steps[index].e, indexe, 'red');
    } else {
        const element = document.getElementById(steps[index].r);
        if (element) {
            element.style.color = 'blue';
            element.style.fontSize = '35px';
            let i = steps[index].i;
            console.log('for color i', i, steps[index].e);
            if (i >= 0) {
                changeLetterColor(steps[index].e, [i, i + 1, i + 2], 'blue');
            } else {
                let r = steps[index].r;
                let l = getIndicesOf(r, steps[index].e);
                changeLetterColor(steps[index].e, l, 'blue');
            }
        }
        prev = element;
    }

    index++;
    setTimeout(() => {
        if (indexe || index > steps.length - 1) {
            finishCheck(true);
        } else
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
    console.log('finiche-----------------------', success);
    inAction = false;
    auto = false;
    manageStates();
    manageClickability(false);
    if (success) {

    } else {

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
function changeLetterColor(word, ind, color) {
    let text = word;
    // console.log('col: ', text);
    let i = 0;
    let newText = '';
    newText = Array.prototype.map.call(text, function (letter) {
        let res = letter.fontcolor(ind.includes(i) ? color : 'black');
        i++;
        return res;
    }).join('');
    console.log('change color ', word, ind, newText);
    exp.innerHTML = newText;
}
let stepss = [];
let replaced = { s: -1, r: '' };
let keller = [];
// let word = '(Z)OZO(ZO(ZOZ))OZ';
// let word = 'ZO((Z)O(Z))';
let word = '(ZOZO(ZO(ZOZ))OZ)';
let w = null;
let firstPush = { w: '', r: '', ex: '' };
let lastPop = [];

let stepMap = new Map();

function resetk(){
    stepss = [];
replaced = { s: -1, r: '' };
keller = [];
w = null;
firstPush = { w: '', r: '', ex: '' };
lastPop = [];

stepMap = new Map();
}



// function check() {
//     w || (w = word);
//     console.log('check word ', word, w, keller, stepMap);

//     setTimeout(() => {
//         if (keller.length === 0) {
//             keller.push('$');
//             check();
//         } else {
//             if (stepMap.size === 0) {
//                 firstPush = {w: w.slice(), r:'Z'};
//                 stepMap.set(1, [{ r: 'Z', w: w.slice(), k: [...keller], s: 0 }]);
//                 keller.push('Z');
//                 check();
//             } else {
//                 // let l = Array.from(stepMap.keys());
//                 let l = stepMap.get(stepMap.size);
//                 let st = l[l.length - 1];
//                 if (keller.length === 1) {
//                     if (w.length === 0) {
//                         console.log('end success');
//                     } else {

//                         w = st.w;
//                         if (st.s === 0) {
//                             stepMap.set(l.length, [{ r: 'ZOZ', w: w.slice(), k: [...keller], s: 1 }]);
//                             keller.push('Z','O','Z');
//                             check();
//                         } else if (st.s === 1) {
//                             stepMap.set(l.length, [{ r: '(Z)', w: w.slice(), k: [...keller], s: 2 }]);
//                             keller.push(')' + 'Z' + '(');
//                             check();
//                         } else {
//                             console.log('end fail');
//                         }
//                     }
//                 } else {
//                     let f = w[0];
//                     // console.log('1 check ', word, w, keller, st);
//                     if (keller[keller.length - 1] === f) {

//                         if (st.r === 'Z' && st.s === 0) {
//                             keller.pop();
//                             w = w.substring(1);
//                             check();
//                         }else 
//                         if (st.r === 'ZOZ' && st.s === 1) {
//                             keller.pop();
//                             w = w.substring(1);
//                             check();
//                         } else if (st.r === '(Z)' && st.s === 2) {
//                             keller.pop();
//                             w = w.substring(1);
//                             check();
//                         }else  {
//                             if (f === '(') {
//                                 if (st.s === 0) {
//                                     keller.pop();
//                                     w = w.substring(1);
//                                     check();
//                                 } else if (st.s === 1) {

//                                     stepMap.set(l.length, [{ r: 'ZOZ', w: w.slice(), k: [...keller], s: 2 }]);
//                                     keller.pop();
//                                     keller.push('Z','O','Z');
//                                     check();
//                                 } else if (st.s === 2) {
//                                     stepMap.set(l.length, [{ r: '(Z)', w: w.slice(), k: [...keller], s: 3 }]);
//                                     keller.push(')' + 'Z' + '(');
//                                     check();
//                                 } else {
//                                     console.log('end fail');
//                                 }
//                             } else {

//                             }
//                         }



//                     } else {
//                         // console.log('2 check ', word, w, keller, st);
//                         if (f === '(') {
//                              if (st.s === 1) {

//                                 stepMap.set(l.length, [{ r: '(Z)', w: w.slice(), k: [...keller], s: 2 }]);
//                                 keller.pop();
//                                 keller.push(')', 'Z' , '(');
//                                 check();
//                             } else if (st.s === 2) {
//                                 stepMap.set(l.length, [{ r: 'ZOZ', w: w.slice(), k: [...keller], s: 3 }]);
//                                 keller.pop();
//                                 keller.push('Z','O','Z');
//                                 check();

//                             } else {
//                                 console.log('end fail');
//                             }
//                         } else {

//                         }
//                     }

//                 }
//             }
//         }


//     }, 1000);
// }

// check();


function check2() {
    w || (w = word);
    console.log('check word ', word, w, keller, replaced, stepss);

    setTimeout(() => {

        last = 0;


        if (keller.length === 0) {
            keller.push('$');
            check();
        } else {
            if (keller.length === 1) {
                if (w.length === 0) {
                    // success
                    console.log('=========================success');
                } else {
                    if (w.length === word.length) {
                        if (replaced.s === -1) {
                            keller.push('Z');
                            stepss.push({ w: w, k: [...keller] });
                        } else if (replaced.s === 0) {
                            stepss.push({ w: w, k: [...keller] });
                            replaced.s = 1;
                            replaced.r = 'ZOZ';
                            keller.push('Z', 'O', 'Z');

                        } else if (replaced.s === 1) {
                            stepss.push({ w: w, k: [...keller] });
                            replaced.s = 2;
                            replaced.r = '(Z)';
                            keller.push(')', 'Z', '(');
                        }
                        check();
                    } else {
                        // if(replaced.s === -1){
                        //     w = stepss[stepss.length-1].w;
                        // keller = stepss[stepss.length-1].k;
                        // replaced.s = 0;
                        // } else
                        w = stepss[stepss.length - 1].w;
                        console.log('=========================1', replaced.s === -1);
                        if (replaced.s === 0 || replaced.s === -1) {
                            console.log('=========================2');
                            stepss.push({ w: w, k: [...keller] });
                            replaced.s = 1;
                            replaced.r = 'ZOZ';
                            keller.push('Z', 'O', 'Z');

                        } else if (replaced.s === 1) {
                            console.log('=========================3');
                            stepss.push({ w: w, k: [...keller] });
                            replaced.s = 2;
                            replaced.r = '(Z)';
                            keller.push(')', 'Z', '(');
                        }

                        check();
                    }
                }
            } else {
                if (keller[keller.length - 1] === w[0]) {
                    if (replaced.s === -1) {
                        keller.pop();
                        w = w.substring(1);
                        check();
                    } else {
                        let last = keller.pop();
                        if (last === 'Z') {
                            stepss.push({ w: w, k: [...keller] });
                            if (replaced.s === 0 && replaced === -1) {
                                replaced.s = 1;
                                replaced.r = 'ZOZ';
                                keller.push('Z', 'O', 'Z');
                            } else if (replaced.s === 1) {
                                replaced.s = 2;
                                replaced.r = '(Z)';
                                keller.push(')', 'Z', '(');
                            } else {
                                // end
                                console.log('================faild');
                                return;
                            }
                            check();
                        }
                    }

                } else {
                    let last = keller.pop();
                    if (last === 'Z') {
                        stepss.push({ w: w, k: [...keller] });
                        if (replaced.s >= 0) {
                            replaced.s = 1;
                            replaced.r = 'ZOZ';
                            keller.push('Z', 'O', 'Z');
                        } if (replaced.s === 1) {
                            replaced.s = 2;
                            replaced.r = '(Z)';
                            keller.push(')', 'Z', '(');
                        } else {
                            // end
                            console.log('================faild');
                            return;
                        }
                        check();
                    }
                }

            }

        }
    }, 1000);


}


function isExprCorrect(e) {
    let res = false;
    let exp = '' + (e || genExp.value);

    console.log('1 check exp: ', exp);

    steps.push({ e: exp, r: 'Z2' });
    exp = exp.replace(/\d/g, 'Z');

    exp.match(/[+ \- / *]/g) && steps.push({ e: exp, r: 'O' });
    exp = exp.replace(/[+ \- / *]/g, 'O');
    const temp = exp;
    steps.push({ e: exp, r: 'Z' });
    // exp = replace2(exp);
    // console.log('2 check exp stw: ', exp);
    if (exp === 'Z') res = true;
    exp = exp.replaceAll('Z', 'A');
    // steps.push({e:exp.replaceAll('A','Z'), r:'Z'});
    let prev = exp;
    while (isOrderCorrect(exp).length === 0) {
        console.log('check exp stw: ', exp);
        
        if (exp.length < 4) {
            if (exp === 'AOA') {
                steps.push({ e: exp, r: 'AOA', i: exp.search('AOA') });
                res = true;
            } else
                if (exp === '(A)') {
                    steps.push({ e: exp, r: '(A)', i: exp.search('\\(A\\)') });
                    res = true;
                }
            break;
        }
        if (exp.length > 3) {
            if (exp.includes('(A)')) {
                steps.push({ e: exp, r: '(A)', i: exp.search('\\(A\\)') });
                exp = exp.replace('(A)', 'A');

                continue;
            } else if (exp.includes('AOA')) {
                steps.push({ e: exp, r: 'AOA', i: exp.search('AOA') });
                exp = exp.replace('AOA', 'A');

                continue;
            }
        }
        if (prev === exp) break;
        prev = exp;
    }

    if (!res) {
        let indexe = [];
        isOrderCorrect(temp).forEach((a) => indexe = [...indexe, ...getIndicesOf(a, temp)]);
        indexe.forEach((ind) => indexe.push(ind + 1));
        steps = [{ e: temp, l: indexe }];
    }
    console.log('check res stw: ', res, steps);
    return res;
}

function getIndicesOf(searchStr, str, caseSensitive = false) {
    var searchStrLen = searchStr.length;
    if (searchStrLen == 0) {
        return [];
    }
    var startIndex = 0, index, indices = [];
    if (!caseSensitive) {
        str = str.toLowerCase();
        searchStr = searchStr.toLowerCase();
    }
    while ((index = str.indexOf(searchStr, startIndex)) > -1) {
        indices.push(index);
        startIndex = index + searchStrLen;
    }
    return indices;
}

function replace2(a = '') {
    return a.replace(/\d/g, 'A').replace(/[+ \- / *]/g, 'O');
}

function replace3(a = '') {
    return a.replace(/\d/g, 'Z').replace(/[+ \- / *]/g, 'O');
}

function isOrderCorrect(a) {
    const list = [];

    falseExp.forEach((e) => {
        if (a.includes(e)) {
            list.push(e);
        }
    });

    return list;
}

function manageClickability(status) {
    genCorrectButton.disabled = status;
    genWrongButton.disabled = status;
}

function manageStates() {
    console.log('manageStates: ', inAction);
    const s = !genExp.value;
    start.disabled = s ? true : false;
    step.disabled = s ? true : false;
    stopp.disabled = inAction && auto ? false : true;
    neu_laden.disabled = s ? true : false;
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
 * initializes the arrays with the nodes and edges of the grammer
 * and fills the table.
 */
function initProgram() {

    manageStates();

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

count = 0;
function getNext(type) {
    let res;
    switch (type) {
        case 'AOA':
            res = { next: ['AOA', '(A)', 'Z'], anzahl: 2 }
            break;
        case '(A)':
            res = { next: ['AOA', 'Z'], anzahl: 1 }
            break;
        default:
            res = { next: [], anzahl: 0 }
            break;
    }
    return res;
}

function getAusdruck(ex) {
    let res = ex;
    const nex = getNext(ex);
    // console.log('pre ', res);
    for (let i = 0; i < nex.anzahl; i++) {
        let r = getRandomNumber(0, nex.next.length - 1);
        let n = count > 5 ? 'Z' : getAusdruck(nex.next[r]);
        // console.log('res ', res, ' n ',n);
        res = res.replace('A', n);
        console.log('2 res ', res, ' n ', n, count);
        count++;
    }
    // console.log('post ', res, count);
    return res;
}

function getRichtigAusdruck(ex) {
    let res = ex;
    let list = ['AOA', 'Z'];
    console.log('pre ', res);
    for (let i = 0; i < max; i++) {

        if (res.search('\\(A\\)') >= 0) {
            let r = getRandomNumber(0, list.length - 1);
            res = res.replace('(A)', '(' + list[r] + ')');
        } else {
            let r = getRandomNumber(0, ausdrucke.length - 1);
            res = res.replace('A', ausdrucke[r]);
        }
    }
    res = res.replace(/[A]/g, 'Z');
    // console.log('post ', res);
    return res;
}

function getFalschAusdruck(ex) {
    let res = ex;
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

/**
 * initializes the arrays with the nodes and edges of the grammer
 * and fills the table.
 */
function initProgram() {

    kanten.push(new Kante("0", "1"));
    kanten.push(new Kante("1", "2"));
    kanten.push(new Kante("2", "2", '1'));
    kanten.push(new Kante("2", "2", '2'));
    kanten.push(new Kante("2", "3"));
    for (let i = 0; i <= 7; i++) {
        knoten.push(new Knoten(i + ''));
    }

    initColors();
    manageStates();

    //console.log('kanten: ',kanten);
}

class Kante {
    row;
    kante;
    start;
    end;
    svgRef;
    constructor(start, end, num = '') {
        this.start = start;
        this.end = end;

        let from = this.start;
        let to = this.end;
        this.svgRef = {
            arrow: document.getElementById('arrow' + from + '-' + to),
            arrow2: document.getElementById(num + 'arrow_' + from + '-' + to),
            letter: document.getElementById('letter' + from + '-' + to),
            arrowHead: (from - to) === 0 ? document.getElementById(num + 'arrowhead' + from + '-' + to) : null,
        }
    }

    setActive() {
        this.setColor(activeColor);
        let text = genText.textContent;
        console.log('col: ', text);
        let n = knoten.find((node) => node.getName() === this.start);
        if (n) {
            n.setColor(nodeColor);
        }
    }

    setInactive() {
        this.setColor(edgeColor);
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

    setLetterColor(color) {
        this.svgRef.letter.style.stroke = color;
    }

    reset() {
        this.setColor(edgeColor);
    }

    getKantenName() {
        return this.kante;
    }

    isStart() {
        return this.getStartPos() === '0';
    }

    isEnd() {
        return this.getEndPos() === '3';
    }

    getStartPos() {
        return this.start;
    }

    getEndPos() {
        return this.end;
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
        return this.number === '3';
    }
}

// initProgram();

// check();
