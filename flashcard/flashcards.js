var trueAnswer = 0;
    var falseAnswer = 0;
    function init(rawCSV) {
      //TODO: recalculer les stats qd on click sur choosepackage
      document.querySelector('#choosePackage').addEventListener('click', () => { document.querySelector('#packageSelectorDiv').classList.remove('hidden'); })
      document.querySelector('#raz').addEventListener('click', () => { localStorage.removeItem('questionsData'); location.reload(); });
      document.querySelector('#export').addEventListener('click', () => {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(localStorage.getItem("questionsData")));
        element.setAttribute('download', 'export.json');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      });
      questionsArray = load_cards(rawCSV);
      populatePackageSelector(questionsArray);
      document.querySelector('#validatePackage').addEventListener('click', () => { start(questionsArray) });
    }

    function start(questionsArray) {
      getStat();
      //TODO:rendre enabled le bouton si un choix est coché
      //test if question there are questions.
      var n = getStat();
      if (n > 0) { document.body.classList.remove('end'); }
      document.querySelector('#packageSelectorDiv').classList.add('hidden');
      var choosenQuestion = drawQuestion(questionsArray);
      if (choosenQuestion == "end") {
        return;
      }
      displayQuestion(choosenQuestion);
      //SM-2 implementation from https://en.wikipedia.org/wiki/SuperMemo#Description_of_SM-2_algorithm		
      document.querySelectorAll(".feedbackButton").forEach(el => {
        el.addEventListener('click', () => {
          let i = questionsArray.findIndex((element) => {
            return element == choosenQuestion;
          });
          var q = el.dataset.grade;
          var result = SM2_algo(
            q,
            questionsArray[i].n,
            questionsArray[i].EF,
            questionsArray[i].I,
            questionsArray[i].dD
          );
          if (q >= 1) { trueAnswer++; console.log('ok'); } else { falseAnswer++; console.log('nok'); }
          questionsArray[i].n = result.n;
          questionsArray[i].EF = result.EF;
          questionsArray[i].I = result.I;
          questionsArray[i].dD = result.dD;
          console.log(choosenQuestion);
          getStat(questionsArray);
          document.querySelector("#content").classList.remove('flipped');
          choosenQuestion = drawQuestion(questionsArray);
          if (choosenQuestion == "end") {
            return;
          }
          displayQuestion(choosenQuestion, questionsArray);
          writeLS(questionsArray);
        })
      });
    }

    function populatePackageSelector(qArray) {
      var packageList = []
      qArray.forEach((el) => {
        if (!packageList.includes(el.paquet)) {
          packageList.push(el.paquet);
        }
      });
      packageList.forEach((el) => {
        var label = document.createElement('label');
        //find known_quest, due_quest, never_seen
        var kq, dq, ns, dn;
        dn = Date.now();
        var qArrayFiltered = qArray.filter(i => i.paquet == el);
        //TODO update stat
        ns = qArrayFiltered.filter(q => (q['dD'] == undefined)).length;
        dq = qArrayFiltered.filter(q => (q['dD'] <= dn)).length;
        kq = qArrayFiltered.filter(q => (q['dD'] > dn)).length;
        label.innerText = el;
        label.innerHTML += "<span id='packageStat'> ( <span title='questions sues' style='color:green'>" + kq +
          "</span> − <span title='questions en cours d'apprentissage'  style='color:blue'>" +
          dq +
          "</span> − <span title='questions non vues' style='color:white'>" +
          ns + " )</span>";
        var input = document.createElement('input');
        input.type = 'checkbox';
        input.value = el;
        var span = document.createElement('span');
        span.classList.add('checkmark');
        label.append(input, span);
        document.querySelector('#packageSelector').append(label);
      });
    }

    function load_cards(rawCSV) {
      flashCardsData = {};
      //flashCardsData structure :
      //flashCardsData = {
      //	flashCards: [
      //		{
      //		question : null,
      //		reponse : null,
      //    hash : null,
      //		correct: null,
      //		error: null,
      //		dueDate: null
      //		}
      //	]
      //}
      flashCardsData.flashCards = JSON.parse(window.localStorage.getItem('questionsData'));
      if (flashCardsData.flashCards == null) { flashCardsData.flashCards = []; }
      arr = rawCSV.split(/\r?\n/);
      var farr = arr.filter((a) => { if (/\S/.test(a)) { return a; } });
      for (let i = 0; i < farr.length; i++) {
        questObj = {};
        questObj.paquet = farr[i].split(";")[0].split('|')[0];
        questObj.question = farr[i].split(";")[0].split('|')[1];
        questObj.reponse = farr[i].split(";")[1];
        questObj.hash = hash_code(questObj.question + questObj.reponse);
        if (!flashCardsData.flashCards.some(el => el.hash == questObj.hash)) {
          flashCardsData.flashCards.push(questObj);
        } else {
          console.log('question déjà là');
        }
      }
      writeLS(flashCardsData.flashCards);
      return flashCardsData.flashCards;
    }
    function flipCard() {
      document.querySelector("#content").classList.add("flipped");
    }
    function getStat(questionsArray) {
      var filteredQuestions = filterQuestions(questionsArray);
      // var neverSeenQuestions = questionsArray.filter((q) => {
      //   if (q.dD == undefined) {
      //     return q;
      //   }
      // });
      var ns = filteredQuestions.filter(q => (q['dD'] == undefined)).length;
      var D = Date.now();
      dq = filteredQuestions.filter((q) => { q.dD < D; }).length;
      var kq = filteredQuestions.length - dq - ns;
      trueRatio = Math.round((trueAnswer / (falseAnswer + trueAnswer)) * 100);
      if (isNaN(trueRatio)) {
        trueRatio = "−−";
      }
      document.querySelector("#stat").innerHTML =
        "<span title='questions sues' style='color:green'>" +
        kq +
        "</span> − <span title='questions en cours d'apprentissage'  style='color:blue'>" +
        dq +
        "</span> − <span title='questions non vues' style='color:gray'>" +
        ns +
        "</span><span title='pourcentage de réponses correctes pour cette session'> [" + trueRatio + "%]";
      return (ns + dq);
    }
    function SM2_algo(q, n = 0, EF = 2.5, I = 0, dD = Date.now()) {
      //I en heures, on applique un coeff ×8 pour cela. Ce qui fait 10 répétitions max en 163h (moins d'une semaine). Pour un truc au plus long cours on pourra
      // plutôt viser 10 répétitions en 4 mois, soit un coeff de ×125 avec I toujours en heures
      if (q >= 1) {
        if (n == 0) {
          I = 0.02;//adaptation 1 −> 0.02 pour avoir un rappel au bout d'une min 30
        } else {
          if (n == 1) {
            I = 6;
          } else {
            I = Math.round(I * EF);
          }
        }
        n++;
      } else {
        n = 0;
        I = 1;
      }
      var dn = Date.now();
      EF = EF + (0.1 - (2 - q) * 0.08 + (2 - q) * 0.02);
      EF = Math.max(1.3, EF);
      dD = dn + I * 8 * 3600 * 1000;
      output = { n: n, EF: EF, I: I, dD: dD };
      return output;
    }
    function writeLS(questionsArray) {
      localStorage.setItem("questionsData", JSON.stringify(questionsArray));
    }
    function getChoosenPackage() {
      var choosenPackage = []
      document.querySelectorAll('#packageSelector input').forEach((el) => {
        if (el.checked) {
          choosenPackage.push(el.value);
        }
      });
      return choosenPackage;
    }
    function filterQuestions(qArray) {
      var choosenPackage = getChoosenPackage();
      var D = Date.now();
      var filteredQuestions = questionsArray.filter((q) => {
        if (choosenPackage.includes(q.paquet)) {
          return q;
        }
      });
      return filteredQuestions;
    }
    function drawQuestion(questionsArray) {
      var D = Date.now();
      var choosenPackage = getChoosenPackage();
      var filteredQuestions = filterQuestions(questionsArray).filter(i => i.dD < D);
      var neverSeenQuestions = questionsArray.filter((q) => {
        if (q.dD == undefined) {
          if (choosenPackage.includes(q.paquet)) {
            return q;
          }
        }
      });
      // draw 3 new questions
      const neverSeenQuestionsSh = neverSeenQuestions.sort(
        () => 0.5 - Math.random()
      );
      let selectedQuestions = neverSeenQuestionsSh.slice(0, 3);
      var ballotBox = filteredQuestions.concat(selectedQuestions);
      if (ballotBox.length == 0) {
        document.body.classList.add('end');
        return "end";
      } else {
        var i = Math.floor(Math.random() * ballotBox.length);
        return ballotBox[i];
      }
    }
    function displayQuestion(question, questionsData) {
      var cardFrame1 = document.querySelector("#card .side1");
      cardFrame1.innerHTML = question.question;
      var cardFrame2 = document.querySelector("#card .side2");
      cardFrame2.innerHTML = question.reponse;
      document.querySelector("#flip").addEventListener("click", () => {
        document.querySelector("#content").classList.add("flipped");
      });
    }
    function hash_code(s) {
      for (var i = 0, h = 0; i < s.length; i++)
        h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
      return h;
    }
	   init(rawCSV);
