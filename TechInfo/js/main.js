var genButton = document.getElementById('gen_but');
var genText = document.getElementById('gen_tex');
var inputAl = document.getElementById('eingabe');
var maxLength = 10;
var minLength = 5;

function generateRandomWord(){
    let length = getRandomNumber(minLength, maxLength-minLength);
    
    let inputs = inputAl.innerHTML.replaceAll(" ","").split(",");
    let secondLetter = ["T",P]
    let resultWord = inputs[0];
    for(let i = 0; i < length-2; i++){
        resultWord += inputs[getRandomNumber(2,inputs.length-3)]
    }
    resultWord += inputs[1];
    console.log(inputs);
    genText.value = resultWord;
    

}

getRandomNumber = (s, l) => {
    return s+Math.round(Math.random()*l);
}