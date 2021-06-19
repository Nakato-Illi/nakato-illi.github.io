var $ = function (id) { return document.getElementById(id); };
var genCorrectButton = document.getElementById('gen_but_corr');
var genWrongButton = document.getElementById('gen_but_wrong');
var genExp = document.getElementById('word_input');
var exp = document.getElementById('gen_exp');
var start = document.getElementById('start');
var stopp = document.getElementById('stop');
var step = document.getElementById('step');
var kell = document.getElementById('keller');
var feld = document.getElementById('feldeingabe');
var result = document.getElementById('isExpCorrect');
var knoten = [];
var kanten = [];
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
    result.style.backgroundColor = !genExp.value ? 'transparent' : isExprCorrect() ? 'lightgreen' : 'red';
});

//Variablen für das Aussehen
var nodeColor = 'rgb(255, 128, 187)';
var edgeColor = 'rgb(211, 211, 211)';
var activeColor = 'blue';
var tableColor = 'white';
var tactiveColor = 'lightblue';
var faildColor = 'red';
var successColor = 'lightgreen';


//Variablen für die Überprüfung
var index = 0; //Index des Buchstaben in der Zeichenkette, die geprüft wird.
var auto = true; //gibt an, ob die Überprüfung automatisch oder manuell ablaufen soll.
var inAction = false;
manageClickability(false); //gibt an, ob gerade überprüft wird.
var playEndAnim = false;
var prev;
var activeNode;
var maxSpeed = 2000;
var speed = maxSpeed * 0.2;

let stepss = [];
let replaced = { s: -1, r: '' };
let keller = [];
let word;
let w = null;
let firstPush = { w: '', r: '', ex: '' };
let lastPop = [];

let stepMap = new Map();

function resetk() {
    w = null;
    // word = null;
    keller = [];
    stepu = [];
    starto = true;
    prev = null;
    endo = false;
    activeNode = null;
    let sutep = null;
    back = false;
    con = false;
    suc = false;
    // kanten.forEach((ka) => ka.setInactive());
    // knoten.forEach((kn) => kn.setColor(nodeColor));
}


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
    playEndAnim = false;
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
    playEndAnim = false;
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

    if (!inAction) {
        inAction = true;
        manageClickability(true);
        resetk();
        steps = [];
        stepss = [];
        playEndAnim = false;
        let cor = isExprCorrect();
        if (!stepss.length > 0 && cor) return;
        stepss.sort((a, b) => b.i - a.i);
        console.log(cor, stepss);
        word = null;
    }
    let cor = iscorrect();

    auto = isauto;
    manageStates();
    if (cor) check();
    else test();
};


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
    playEndAnim = true;
    endAnimation(10, success);
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
    console.log('col: ', text);
    let i = 0;
    let newText = '';
    newText = Array.prototype.map.call(text, function (letter) {
        let res = letter.fontcolor(ind.includes(i) ? color : 'white');
        i++;
        return res;
    }).join('');
    
    feld.innerHTML = newText;
    console.log('change color ', word, ind, feld.innerText, feld.innerHTML, newText);

}
let starto = true;
let endo = false;
let trow = null;
let svg1 = null;
let svg2 = null;

function check() {
    console.log('check word ', word, w, [...keller], [...stepss]);
    knoten.forEach((e) => e.setColor(nodeColor));
    // let lastp2 = lastPop[lastPop.length-2];
    trow && (trow.style.backgroundColor = tableColor);
    svg1 && (svg1.style.fill = 'black');
    svg2 && (svg2.style.fill = 'black');

    let con = false;
    let suc = false;
    let edge;
    if (starto) {
        isEdge = false;
        starto = false;
        trow = $('t_start');
        trow.style.backgroundColor = tactiveColor;
        let node = knoten.find((n) => n.isStart());
        console.log('start knoten ', node, knoten);
        node.setColor(activeColor);
        con = true;
    } else if (endo) {
        console.log('end success');
        suc = true;
        let node = knoten.find((n) => n.isEnd());
        console.log('end knoten ', node, knoten);
        node.setColor(activeColor);
        keller = [];
    } else

        if (keller.length === 0) {
            edge = kanten.find((kante) => kante.isStart());
            trow = $('t_start');
            trow.style.backgroundColor = tactiveColor;

            word || (word = genExp.value);
            w = replace3(word.slice());
            keller.push('$');

            con = true;
            // check();
        } else if (keller.length === 1) {


            if (w.length === 0) {

                if (!isEdge) {
                    con = true;
                } else {
                    trow = $('t_end');
                    trow.style.backgroundColor = tactiveColor;
                    edge = kanten.find((kante) => kante.isEnd());
                    con = true;
                    endo = true;
                }
            } else {
                if (!isEdge) {
                    let node = knoten.find((n) => n.getNumber() === 1);
                    node.setColor(activeColor);
                    con = true;
                } else {
                    edge = kanten.find((kante) => kante.getStartPos() === '1');
                    keller.push('Z');
                    trow = $('t_push_Z');
                    trow.style.backgroundColor = tactiveColor;
                    con = true;
                }
            }
        } else {
            if (!isEdge) {
                let node = knoten.find((n) => n.getNumber() === 2);
                node.setColor(activeColor);
                con = true;
            } else {

                const f = w[0];
                const ke = keller[keller.length - 1];
                const f2 = w[1];
                const ke2 = keller[keller.length - 2];
                if (ke === f) {
                    if (ke === 'Z') {
                        con = true;
                        if (((keller.join('').match(/Z/g) || []).length < 2 && (w.match(/Z/g) || []).length > 1) || f2 && f2 !== ke2) {
                            const s = stepss.pop();
                            if (s.r) {
                                let k = s.r.split('').reverse().join('').replace(/[A]/g, 'Z');
                                keller.pop();
                                for (let i = 0; i < k.length; i++) {
                                    keller.push(k[i]);
                                }
                                trow = $('t_push_' + s.r);
                                trow || console.log('da row push 1: ', s.r);
                                trow && (trow.style.backgroundColor = tactiveColor);
                                svg1 = $('push');
                                svg2 = $('push_' + s.r);
                                console.log('svgs: ', svg1, svg2);
                                svg1 && (svg1.style.fill = activeColor);
                                svg2 && (svg2.style.fill = activeColor);
                                edge = kanten.find((kante) => kante.num === '1');
                            } else con = false;

                        } else {
                            w = w.slice(1);
                            keller.pop();
                            edge = kanten.find((kante) => kante.num === '2');
                            trow = $('t_pop_Z');
                            trow.style.backgroundColor = tactiveColor;
                            svg1 = $('pop');
                            svg2 = $('pop_Z');
                            console.log('svgs: ', svg1?.innerHTML, svg2);
                            svg1 && (svg1.style.fill = activeColor);
                            svg2 && (svg2.style.fill = activeColor);
                        }

                    } else {
                        w = w.slice(1);
                        keller.pop();
                        con = true;
                        edge = kanten.find((kante) => kante.num === '2');
                        trow = $('t_pop_' + ke);
                        trow || console.log('da row pop 1: ', s.r);
                        trow && (trow.style.backgroundColor = tactiveColor);
                        svg1 = $('pop');
                        svg2 = $('pop_' + ke);
                        console.log('svgs: ', svg1, svg2);
                        svg1 && (svg1.style.fill = activeColor);
                        svg2 && (svg2.style.fill = activeColor);
                    }

                    // check();

                } else {
                    if (ke === 'Z') {
                        const s = stepss.pop();
                        console.log('1 stepwise stepss', s, stepss, keller);
                        if (s.r) {
                            let k = s.r.split('').reverse().join('').replace(/[A]/g, 'Z');
                            keller.pop();
                            for (let i = 0; i < k.length; i++) {
                                keller.push(k[i]);
                            }
                            trow = $('t_push_' + s.r);
                            trow || console.log('da row push 2: ', s.r);
                            trow && (trow.style.backgroundColor = tactiveColor);
                            svg1 = $('push');
                            svg2 = $('push_' + s.r);
                            console.log('svgs: ', svg1.innerHTML, svg2);
                            svg1 && (svg1.style.fill = activeColor);
                            svg2 && (svg2.style.fill = activeColor);
                            edge = kanten.find((kante) => kante.num === '1');
                            con = true;
                        }

                        console.log('2 stepwise stepss', s, stepss, keller, con);
                    }
                }
            }

        }

    kell.innerHTML = keller.join('').replace(/[\\(]/g, 'k').replace(/[\\)]/g, '(').replace(/[k]/g, ')');
    feld.style.color = 'white';
    feld.innerHTML = w;
    if (!isEdge) {
        if (prev) prev.setInactive();
    }
    if (edge && isEdge) {
        edge.setActive();
        prev = edge;
    }
    isEdge = !isEdge;
    if (con) {
        setTimeout(() => {
            if (auto) check();
        }, speed);

    } else {
        // let end = prev && prev.isEnd();
        finishCheck(suc);
        console.log('finiche-----------------------', suc);
    }
}

let sutep = null;
let back = false;
let con = false;
let suc = false;

const goBack = () => {
    sutep = stepu.pop();
    if (sutep && sutep.st < 2) {
        w = sutep.wpre;
        keller = sutep.k;
        back = true;
        con = true;
    }
}

const pop = () => {
    w = w.slice(1);
    keller.pop();
    con = true;
}

const push = (a, st, p = true) => {
    p && stepu.push({ wpre: w, wpost: w, pop: '', push: a, k: [...keller], st: st });
    let k = keller.join('').replace(new RegExp('Z' + '$'), a);
    keller = [];
    for (let i = 0; i < k.length; i++) {
        keller.push(k[i]);
    }
    con = true;
}

const handlePush = () => {
    const f = w[0];
    const f2 = w[1];
    let res = false;
    if (f !== '(') {
        if (back) {
            back = false;
            goBack();
        } else {
            push('ZOZ', 2, f2 && f2 === ')' ? false : true);
            res = true;
        }
    } else {
        if (back) {

            back = false;
            push('ZOZ', 2);
            res = true;
        } else {
            push(')Z(', 1);
            res = true;
        }

    }
    return res;
}

const handleSpecialPop = () => {
    let res = false;
    if (((keller.join('').match(/Z/g) || []).length < 2 && (w.match(/Z/g) || []).length > 1)) {//|| f2 && f2 !== ke2
        handlePush();
        res = true;
    } else {
        con = true;
    }
    // console.log('handleSpecialPop: ', res, con);
    return res;
}

let st = { wpre: '', wpost: '', pop: '', push: '', st: 0 };
let stepu = [];
let hist = [];

const h = (s) => {
    if (hist.length >= 2) {
        hist = [hist[hist.length - 1]];
    }
    hist.push(s);
}

let startu = true;
const test2 = () => {
    con = false;
    console.log('test word ', word, w, back, stepu[stepu.length - 1]?.st, [...keller], stepu);


    if (startu) {
        startu = false;
        word = genExp.value;
        w = replace3(word.slice());

        keller = [];
        keller.push('$', 'Z');
        stepu.push({ wpre: w, wpost: w, pop: '', push: 'Z', k: [...keller], st: 0 });
        con = true;
    } else if (stepu.length === 0) {
        console.log('end fail 1');
    } else {
        if (keller.length === 1) {
            if (w.length === 0) {
                console.log('end success');
                suc = true;
            } else {
                console.log('end fail 2');
            }
        } else {
            const f = w[0];
            const ke = keller[keller.length - 1];
            if (ke === f) {
                if (ke === 'Z') {
                    handleSpecialPop() || pop();
                } else
                    pop();
            } else {
                if (ke === 'Z') {
                    handlePush();// || goBack();
                } else goBack();
            }

        }
    }
    if (con) {
        setTimeout(() => {
            if (auto) test2();
        }, speed);

    } else {
        finishCheck(suc);
        console.log('finiche-----------------------', suc);
    }

}

function test() {
    back && (isEdge = true);
    
    kanten.forEach((e) => e.setInactive());
    knoten.forEach((e) => e.setColor(nodeColor));
    h({ k: [...keller], w: w });
    console.log('test word ', word, w, back, stepu[stepu.length - 1]?.st, [...keller], [...stepu]);
    trow && (trow.style.backgroundColor = tableColor);
    svg1 && (svg1.style.fill = 'black');
    svg2 && (svg2.style.fill = 'black');

    let con = false;
    let suc = false;
    let edge;
    let col = false;

    if(w && w[0] && w[1] && isOrderCorrect(w[0]+w[1]).length > 0){
        col = true;
        // stepu = [];
        // con = true;
    }else
    if (starto) {
        isEdge = false;
        starto = false;
        trow = $('t_start');
        trow.style.backgroundColor = tactiveColor;
        let node = knoten.find((n) => n.isStart());
        console.log('start knoten ', node, knoten);
        node.setColor(activeColor);
        con = true;
    } else if (endo) {
        console.log('end success');
        suc = true;
        let node = knoten.find((n) => n.isEnd());
        console.log('end knoten ', node, knoten);
        node.setColor(activeColor);
        keller = [];
    } else
        if (keller.length === 0) {
            edge = kanten.find((kante) => kante.isStart());
            trow = $('t_start');
            trow.style.backgroundColor = tactiveColor;
            word = genExp.value;
            w = replace3(word.slice());

            keller = [];
            keller.push('$');

            con = true;
        } else {
            if (keller.length === 1) {
                if (w.length === 0) {

                    if (!isEdge) {
                        con = true;
                    } else {
                        trow = $('t_end');
                        trow.style.backgroundColor = tactiveColor;
                        edge = kanten.find((kante) => kante.isEnd());
                        con = true;
                        endo = true;
                    }

                    // finishCheck();
                } else {
                    if (!isEdge) {
                        let node = knoten.find((n) => n.getNumber() === 1);
                        node.setColor(activeColor);
                        con = true;
                    } else {
                        stepu.push({ wpre: w, wpost: w, pop: '', push: 'Z', k: [...keller], st: 0 });
                        // h(stepu[stepu.length - 1]);
                        edge = kanten.find((kante) => kante.getStartPos() === '1');
                        keller.push('Z');
                        trow = $('t_push_Z');
                        trow.style.backgroundColor = tactiveColor;
                        // check();
                        con = true;
                    }


                }
            } else {
                const f = w[0];
                const ke = keller[keller.length - 1];
                const f2 = w[1];
                const ke2 = keller[keller.length - 2];
                if (ke === f) {
                    if (ke === 'Z') {
                        if (((keller.join('').match(/Z/g) || []).length < 2 && (w.match(/Z/g) || []).length > 1)) { //|| f2 && f2 !== ke2){
                            if (f !== '(') {
                                if (back) {
                                    back = false;
                                    // stepu.pop();
                                    const b = stepu.pop();
                                    console.log('back 1 ', b);
                                    if (b && b.st < 2) {
                                        stepu.push({ wpre: w, wpost: w, pop: '', push: 'ZOZ', k: [...keller], st: 2 });
                                        // h(stepu[stepu.length - 1]);
                                        let k = keller.join('').replace(new RegExp('Z' + '$'), 'ZOZ');
                                        keller = [];
                                        for (let i = 0; i < k.length; i++) {
                                            keller.push(k[i]);
                                        }
                                        trow = $('t_push_ZOZ');
                                        trow || console.log('da row push 1: ', 'ZOZ');
                                        trow && (trow.style.backgroundColor = tactiveColor);
                                        svg1 = $('push');
                                        svg2 = $('push_ZOZ');
                                        // console.log('svgs: ', svg1.innerHTML, svg2);
                                        svg1 && (svg1.style.fill = activeColor);
                                        svg2 && (svg2.style.fill = activeColor);
                                        edge = kanten.find((kante) => kante.num === '1');
                                        con = true;
                                    } else {
                                        const ba = stepu[stepu.length - 1];
                                        if (ba) {
                                            w = ba.wpre;
                                            keller = ba.k;
                                            back = true;
                                            con = true;
                                            knoten.forEach((kn) => kn.setColor(nodeColor));
                                        }
                                    }
                                } else {
                                    const b = stepu[stepu.length - 1];
                                    stepu.push({ wpre: w, wpost: w, pop: '', push: 'ZOZ', k: [...keller], st: 2 });
                                    // h(stepu[stepu.length - 1]);
                                    let k = keller.join('').replace(new RegExp('Z' + '$'), 'ZOZ');
                                    keller = [];
                                    for (let i = 0; i < k.length; i++) {
                                        keller.push(k[i]);
                                    }
                                    trow = $('t_push_ZOZ');
                                    trow || console.log('da row push 2: ', 'ZOZ');
                                    trow && (trow.style.backgroundColor = tactiveColor);
                                    svg1 = $('push');
                                    svg2 = $('push_ZOZ');
                                    // console.log('svgs: ', svg1.innerHTML, svg2);
                                    svg1 && (svg1.style.fill = activeColor);
                                    svg2 && (svg2.style.fill = activeColor);
                                    edge = kanten.find((kante) => kante.num === '1');
                                    con = true;
                                }

                            } else {
                                if (back) {

                                    back = false;
                                    // stepu.pop();
                                    const b = stepu.pop();
                                    console.log('back 2 ', b);
                                    if (b.st < 2) {
                                        stepu.push({ wpre: w, wpost: w, pop: '', push: 'ZOZ', k: [...keller], st: 2 });
                                        // h(stepu[stepu.length - 1]);
                                        let k = keller.join('').replace(new RegExp('Z' + '$'), 'ZOZ');
                                        keller = [];
                                        for (let i = 0; i < k.length; i++) {
                                            keller.push(k[i]);
                                        }
                                        trow = $('t_push_ZOZ');
                                        trow || console.log('da row push 3: ', 'ZOZ');
                                        trow && (trow.style.backgroundColor = tactiveColor);
                                        svg1 = $('push');
                                        svg2 = $('push_ZOZ');
                                        // console.log('svgs: ', svg1.innerHTML, svg2);
                                        svg1 && (svg1.style.fill = activeColor);
                                        svg2 && (svg2.style.fill = activeColor);
                                        edge = kanten.find((kante) => kante.num === '1');
                                        con = true;
                                    } else {
                                        const ba = stepu[stepu.length - 1];
                                        if (ba) {
                                            w = ba.wpre;
                                            keller = ba.k;
                                            back = true;
                                            con = true;
                                            knoten.forEach((kn) => kn.setColor(nodeColor));
                                        }
                                    }

                                } else {
                                    stepu.push({ wpre: w, wpost: w, pop: '', push: '(Z)', k: [...keller], st: 1 });
                                    // h(stepu[stepu.length - 1]);
                                    let k = keller.join('').replace(new RegExp('Z' + '$'), ')Z(');
                                    keller = [];
                                    for (let i = 0; i < k.length; i++) {
                                        keller.push(k[i]);
                                    }
                                    trow = $('t_push_(Z)');
                                    trow || console.log('da row push 1: ', '(Z)');
                                    trow && (trow.style.backgroundColor = tactiveColor);
                                    svg1 = $('push');
                                    svg2 = $('push_(Z)');
                                    // console.log('svgs: ', svg1.innerHTML, svg2);
                                    svg1 && (svg1.style.fill = activeColor);
                                    svg2 && (svg2.style.fill = activeColor);
                                    edge = kanten.find((kante) => kante.num === '1');
                                }

                            }
                        } else if (f2 && f2 !== ke2){
                            const ba = stepu[stepu.length - 1];
                            if (ba) {
                                w = ba.wpre;
                                keller = ba.k;
                                back = true;
                                con = true;
                                knoten.forEach((kn) => kn.setColor(nodeColor));
                            }
                        }else{
                            w = w.slice(1);
                            keller.pop();
                            con = true;
                            edge = kanten.find((kante) => kante.num === '2');
                            trow = $('t_pop_Z');
                            trow.style.backgroundColor = tactiveColor;
                            svg1 = $('pop');
                            svg2 = $('pop_Z');
                            // console.log('svgs: ', svg1.innerHTML, svg2);
                            svg1 && (svg1.style.fill = activeColor);
                            svg2 && (svg2.style.fill = activeColor);
                        }

                    } else {
                        w = w.slice(1);
                        keller.pop();
                        con = true;
                        edge = kanten.find((kante) => kante.num === '2');
                        trow = $('t_pop_Z');
                        trow.style.backgroundColor = tactiveColor;
                        svg1 = $('pop');
                        svg2 = $('pop_Z');
                        // console.log('svgs: ', svg1.innerHTML, svg2);
                        svg1 && (svg1.style.fill = activeColor);
                        svg2 && (svg2.style.fill = activeColor);
                    }

                } else {
                    if (ke === 'Z') {
                        if (f !== '(') {
                            stepu.push({ wpre: w, wpost: w, pop: '', push: 'ZOZ', k: [...keller], st: 2 });
                            // h(stepu[stepu.length - 1]);
                            let k = keller.join('').replace(new RegExp('Z' + '$'), 'ZOZ');
                            keller = [];
                            for (let i = 0; i < k.length; i++) {
                                keller.push(k[i]);
                            }
                            trow = $('t_push_ZOZ');
                            trow || console.log('da row push 1: ', 'ZOZ');
                            trow && (trow.style.backgroundColor = tactiveColor);
                            svg1 = $('push');
                            svg2 = $('push_ZOZ');
                            // console.log('svgs: ', svg1.innerHTML, svg2);
                            svg1 && (svg1.style.fill = activeColor);
                            svg2 && (svg2.style.fill = activeColor);
                            edge = kanten.find((kante) => kante.num === '1');
                        } else {
                            if (back) {
                                back = false;
                                stepu.length > 1 && stepu.pop();
                                const b = stepu.pop();
                                console.log('back 3 ', b);
                                if (b && b.st < 2) {
                                    stepu.push({ wpre: w, wpost: w, pop: '', push: 'ZOZ', k: [...keller], st: 2 });
                                    // h(stepu[stepu.length - 1]);
                                    let k = keller.join('').replace(new RegExp('Z' + '$'), 'ZOZ');
                                    keller = [];
                                    for (let i = 0; i < k.length; i++) {
                                        keller.push(k[i]);
                                    }
                                    trow = $('t_push_ZOZ');
                                    trow || console.log('da row push 1: ', 'ZOZ');
                                    trow && (trow.style.backgroundColor = tactiveColor);
                                    svg1 = $('push');
                                    svg2 = $('push_ZOZ');
                                    // console.log('svgs: ', svg1.innerHTML, svg2);
                                    svg1 && (svg1.style.fill = activeColor);
                                    svg2 && (svg2.style.fill = activeColor);
                                    edge = kanten.find((kante) => kante.num === '1');
                                    con = true;
                                } else {
                                    const ba = stepu[stepu.length - 1];
                                    if (ba) {
                                        w = ba.wpre;
                                        keller = ba.k;
                                        back = true;
                                        con = true;
                                        knoten.forEach((kn) => kn.setColor(nodeColor));
                                    }

                                }
                            } else {
                                stepu.push({ wpre: w, wpost: w, pop: '', push: '(Z)', k: [...keller], st: 1 });
                                // h(stepu[stepu.length - 1]);
                                let k = keller.join('').replace(new RegExp('Z' + '$'), ')Z(');
                                keller = [];
                                for (let i = 0; i < k.length; i++) {
                                    keller.push(k[i]);
                                }
                                trow = $('t_push_(Z)');
                                trow || console.log('da row push 1: ', '(Z)');
                                trow && (trow.style.backgroundColor = tactiveColor);
                                svg1 = $('push');
                                svg2 = $('push_(Z)');
                                // console.log('svgs: ', svg1.innerHTML, svg2);
                                svg1 && (svg1.style.fill = activeColor);
                                svg2 && (svg2.style.fill = activeColor);
                                edge = kanten.find((kante) => kante.num === '1');
                                con = true;
                            }

                        }
                    } else {
                        const ba = stepu[stepu.length - 1];
                        if (ba) {
                            w = ba.wpre;
                            keller = ba.k;
                            back = true;
                            con = true;
                            knoten.forEach((kn) => kn.setColor(nodeColor));
                        }
                    }
                }
            }
        }
    kell.innerHTML = keller.join('').replace(/[\\(]/g, 'k').replace(/[\\)]/g, '(').replace(/[k]/g, ')');
    feld.style.color = 'white';
    feld.innerHTML = w;
    
    if (!isEdge) {
        if (prev) prev.setInactive();
    }
    if (edge && isEdge) {
        edge.setActive();
        prev = edge;
    }
    isEdge = !isEdge;
    if (con) {
        setTimeout(() => {
            if (auto) test();
        }, speed);

    } else {
        if (!suc) {
            if(col){
                changeLetterColor(w, [0,1], 'red');
            } else {
                let indexe = steps.length > 0 ? steps[0].l :[];
                indexe && changeLetterColor(w, indexe, 'red');
                if(keller.length > 1){
                    knoten.forEach((k) => k.setColor(nodeColor));
                    activeNode = knoten.find((k) => k.getNumber() === 2);
                }
            }
            // kell.innerHTML = hist[0].k.join('').replace(/[\\(]/g, 'k').replace(/[\\)]/g, '(').replace(/[k]/g, ')');
            // feld.innerHTML =  hist[0].w;
        }
        // let end = prev && prev.isEnd();
        finishCheck(suc);
        console.log('finiche-----------------------', suc, hist);
    }
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
        // console.log('check exp stw: ', exp);

        if (exp.length < 4) {
            if (exp === 'AOA') {
                steps.push({ e: exp, r: 'AOA', i: exp.search('AOA') });
                stepss.push({ r: 'ZOZ', i: exp.replace(/[\\(\\)]/g, '').indexOf('AOA') });
                res = true;
            } else
                if (exp === '(A)') {
                    steps.push({ e: exp, r: '(A)', i: exp.search('\\(A\\)') });
                    stepss.push({ r: '(Z)', i: exp.indexOf('(A)') });
                    res = true;
                }
            break;
        }
        if (exp.length > 3) {
            if (exp.includes('(A)')) {
                steps.push({ e: exp, r: '(A)', i: exp.search('\\(A\\)') });
                stepss.push({ r: '(Z)', i: exp.indexOf('(A)') });
                exp = exp.replace('(A)', 'A');

                continue;
            } else if (exp.includes('AOA')) {
                steps.push({ e: exp, r: 'AOA', i: exp.search('AOA') });
                stepss.push({ r: 'ZOZ', i: exp.indexOf('AOA') });
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
    res && stepss.length === 0 && stepss.push({ r: 'Z', i: 0 });
    return res;
}

function iscorrect(e) {
    let res = false;
    let exp = '' + (e || genExp.value);
    exp = exp.replace(/\d/g, 'Z');

    exp.match(/[+ \- / *]/g) && steps.push({ e: exp, r: 'O' });
    exp = exp.replace(/[+ \- / *]/g, 'O');
    if (exp === 'Z') res = true;
    exp = exp.replaceAll('Z', 'A');
    let prev = exp;
    while (isOrderCorrect(exp).length === 0) {
        if (exp.length < 4) {
            if (exp === 'AOA') {
                res = true;
            } else
                if (exp === '(A)') {
                    res = true;
                }
            break;
        }
        if (exp.length > 3) {
            if (exp.includes('(A)')) {
                exp = exp.replace('(A)', 'A');
                continue;
            } else if (exp.includes('AOA')) {
                exp = exp.replace('AOA', 'A');
                continue;
            }
        }
        if (prev === exp) break;
        prev = exp;
    }

    console.log('check 2 res: ', res);
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
    for (let i = 0; i <= 3; i++) {
        knoten.push(new Knoten(i + ''));
    }

    // initColors();
    manageStates();

    //console.log('kanten: ',kanten);
}

class Kante {
    row;
    kante;
    start;
    end;
    svgRef;
    num;
    constructor(start, end, num = '') {
        this.start = start;
        this.end = end;
        this.num = num;

        let from = this.start;
        let to = this.end;
        this.svgRef = {
            arrow: document.getElementById('arrow' + from + '-' + to),
            arrow2: document.getElementById(num + 'arrow_' + from + '-' + to),
            letter: document.getElementById('letter' + from + '-' + to),
            arrowHead: (from - to) === 0 ? document.getElementById(num + 'arrowhead_' + from + '-' + to) : null,
        }
    }

    setActive() {
        this.setColor(activeColor);
        // let text = genText.textContent;
        // console.log('col: ', text);
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
        this.svgRef.arrow && (this.svgRef.arrow.style.stroke = color);
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
        this.number = this.name;
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

initProgram();

// check();
