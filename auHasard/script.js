var namesArray = [];
var i=0;

var pickButton = document.querySelector('button#pick');
pickButton.style.display='none';

var kickButton = document.querySelector('button#kick');
kickButton.style.display = 'none';
kickButton.addEventListener('click',kickWinner);

var validateButton = document.querySelector('#validate');
validateButton.addEventListener('click',validNames);

var nameDisplayDiv = document.querySelector('#nameDisplay');

var namesInputDiv = document.querySelector('#namesInput');

function init(){
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

  if (urlParams.has('names')){
    const urlNames = urlParams.get('names')
    namesArray = urlNames.split(',');
    goForPicking();
  }



}

function goForPicking(){
  namesInputDiv.style.display = 'none';
  validateButton.style.display = 'none';
  pickButton.style.display='revert';
  pickButton.addEventListener('click',function(){pickOne(namesArray);});
}

function kickWinner(){
  let winner = document.querySelector('#nameDisplay').innerHTML;
  namesArray = namesArray.filter(e => e !== winner);
  kickButton.style.display = 'none';
  console.log({namesArray});
}

function validNames() {
  var namesArray = document.querySelector('#namesInput').innerText.split(/\r|\n/);
  namesArray = namesArray.filter(item => item);
  urlParamsStr = namesArray.join().replaceAll(/[\u202F\u00A0\u2000\u2001\u2003]/g, " ").replaceAll(/ *.EME./g,'').replaceAll('\"','');
  var newUrl = location.protocol + '//' + location.host + location.pathname + '?names=' + urlParamsStr;
  window.location.href = newUrl;
  goForPicking();
}

function pickOne(names) {
  kickButton.style.display = 'none';
  document.querySelector('#nameDisplay').classList.remove('winner');
  pickButton.style.display='none';
  names=shuffleArray(names);
  var randTime = (Math.floor(Math.random() * 2000) + 1000);
  var randTime1 = (Math.floor(Math.random() * 2000) + 1000);
  var randTime2 = (Math.floor(Math.random() * 500) + 500);
  var serie1 = setInterval(function(){displayNextName(names);}, 100);
  setTimeout(function(){
    clearInterval(serie1);
    var serie2 = setInterval(function(){displayNextName(names);}, 200);
    setTimeout(function(){
      clearInterval(serie2);
      var serie3 = setInterval(function(){displayNextName(names);}, 500);
      setTimeout(function(){
        clearInterval(serie3);
        setTimeout(function(){dispWinner()},500);
      },randTime2);
    },randTime1);
  }, randTime);
    
  
}

function shuffleArray(array){
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

function displayNextName(names){
  nameDisplayDiv.innerText = names[i];
  if (((i+1)) >= names.length){
    i=0;
  }else{
    ((i++));
  }
}

function dispWinner() {
  pickButton.style.display='revert';
  kickButton.style.display = 'revert';
  document.querySelector('#nameDisplay').classList.add('winner');
  confetti({
  particleCount: 200,
  spread: 80,
  origin: { y: 0.6 }
});
  confetti({particleCount: 200,spread: 80,origin: { x: 0.8,y: 0.6 }});
  setTimeout(function(){confetti({particleCount: 200,spread: 80,origin: { x: 0.2,y: 0.6 }})},500);
  setTimeout(function(){confetti({particleCount: 200,spread: 80,origin: { x: 0.5,y: 0.6 }})},800);
  setTimeout(function(){confetti({particleCount: 200,spread: 80,origin: { x: 0.8,y: 0.6 }})},1100);

var end = Date.now() + (5 * 1000);

// go Buckeyes!

(function frame() {
  confetti({
    particleCount: 2,
    angle: 60,
    spread: 55,
    origin: { x: 0 },
  });
  confetti({
    particleCount: 2,
    angle: 120,
    spread: 55,
    origin: { x: 1 },
  });

  if (Date.now() < end) {
    requestAnimationFrame(frame);
  }
}());


}

init();