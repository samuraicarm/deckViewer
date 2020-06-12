'use strict';

const accessToken = 'USL4yAhGdRDjdNZe6nRtU6f9yqWgAMb5fn';
const deckUrl = 'https://us.api.blizzard.com/hearthstone/deck/';
const deckInput = document.getElementById('deckInput');
const deckForm = document.getElementById('deckForm');
const defaultDeck = 'AAEBAaIHCLICrwSSlwPBrgOCsQPjtAObtgPLwAMLtAHtAs0DiAePlwP1pwO5rgP+rgOqrwPOrwPDtgMA';
const randomButton = document.getElementById('randomButton');
let hsDeck = [];

getDeck(defaultDeck);

function watchForm() {
  console.log("watch form");
  deckForm.addEventListener('submit', e => {
    console.log("I get called after the form is submitted.");
    e.preventDefault();
    const hearthStoneDeckId = deckInput.value;
    getDeck(hearthStoneDeckId);
    $('#deckForm')[0].reset();
    console.log(hearthStoneDeckId);
  });
}

function getRandom() {
  randomButton.addEventListener('click', e => {
    console.log("I get called after the button is clicked");
    const arrayIndex = Math.floor(Math.random() * randomHearthstoneDeck.length);
    const randomHSDeck = randomHearthstoneDeck[arrayIndex].id;
    console.log(randomHearthstoneDeck[arrayIndex]);
    e.preventDefault();
    getDeck(randomHSDeck);
  });
}



function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${key}=${params[key]}`);
  return queryItems.join('&');
}

function getDeck(hearthStoneDeckId) {
  const params = {
    locale: 'en_US',
    access_token: accessToken
  };
  const queryString = formatQueryParams(params);
  const url = deckUrl + hearthStoneDeckId + queryString;

  console.log(url);

  const options = {
    "headers": new Headers({
      "Authorization": "Bearer USL4yAhGdRDjdNZe6nRtU6f9yqWgAMb5fn"
    })
  };

  fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('js-error-message').text(`something went wrong: ${err.message}`);
    });

}

function displayResults(responseJson) {
  console.log(responseJson);
  $('#deckCards').empty();
  const deckClass = responseJson.class.name.en_US;
  const [deckCode, keys] = responseJson.deckCode.split('locale');
  $('#deckCards').append(
    `<hr><h4>This Hearthstone Deck's class is: <b>${deckClass}</b>.</h4>
   <input type="text" value=${deckCode} id="codeID"> <button onclick="copyCode()">Copy Deck Code</button>
   <span id=“copy_feedback"></span>`);

  hsDeck = responseJson.cards;
  //console.log(hsDeck);


  hsDeck.sort((a, b) => {
    // console.log(a.name.en_US)
    return a.name.en_US.localeCompare(b.name.en_US);
  });

  manaCostArray(hsDeck);

  displayDeckDetails(hsDeck);
}
function displayDeckDetails(hsDeck) {
  $('.card-container').empty();
  for (let i = 0; i < hsDeck.length; i++) {
    const imageUrl = hsDeck[i].image.en_US;
    const name = hsDeck[i].name.en_US;
    const manaCost = hsDeck[i].manaCost;
    const attack = hsDeck[i].attack;
    const health = hsDeck[i].health;
    const deckDescription = hsDeck[i].text.en_US;

    if (attack === undefined && health === undefined) {
      $('.card-container').append(
        `<article class="card">
        <figure class="card-image">
          <img src= "${imageUrl}" class="thumbnail" alt="${deckDescription}"></figure>
          <div id ="card-info" class="card-text">
        <header class="card-title">
         <p>${name}</p>
          </header>
          <p class = "card-cost"> Mana Cost: ${manaCost} </p>
          <main class="card-description">
          ${deckDescription}
          </main>
          </div>
          <button id="btn-show-text" class="buttonshow" onclick="showText(); changeButtonText();"> Show Card Text </button>
      </article>`
      );
    } else {
      $('.card-container').append(
        `<article class="card">
      <img src= "${imageUrl}" class="thumbnail" alt="${deckDescription}"></figure>
      <header class="card-title">
       <p>${name}</p>
        </header>
        <p class = "card-cost"> Mana Cost: ${manaCost} </p>
        <figure class="card-image">
        <main class="card-description">
        ${deckDescription}
        </main>
        <p class = "card-stats"> Attack: ${attack} Health: ${health} </p>
    </article>`
      );
    }
  }
}

function copyCode() {
  let copyText = document.getElementById("codeID");
  copyText.select();
  copyText.setSelectionRange(0, 99999);
  document.execCommand("copy");
  $("#deckCards").append('<span id=“copy_feedback">Code Copied</span>');
  //alert("Copied the text: " + copyText.value);
}

function manaCostArray(hsDeck) {
  let manaCostCards = [];
  hsDeck.sort();
  for (let i = 0; i < hsDeck.length; i++) {
    manaCostCards.push(hsDeck[i].manaCost);
  }

  console.log(manaCostCards);
  manaSpread(manaCostCards);
  return manaCostCards;
}

function manaSpread(manaCostCards) {
  let manaCardCount = [];
  let copy = manaCostCards.slice(0);
  for (let i = 0; i < manaCostCards.length; i++) {
    let myCount = 0;
    for (let w = 0; w < copy.length; w++) {
      if (manaCostCards[i] == copy[w]) {
        myCount++;
        delete copy[w];
      }
    }

    if (myCount > 0) {
      let a = new Object({});
      a.mana = manaCostCards[i];
      a.count = myCount;
      manaCardCount.push(a);
    }
  }

  manaCardCount.sort(function (a, b) {
    return a.mana - b.mana;
  });

  console.log(manaCardCount);
  showSummary(manaCardCount);
}

function showSummary(manaCardCount) {
  $('#deckSummary').empty();
  $('#deckSummary').append(
    `<table>
    <thead>
    <caption>Summary of Cards</caption>
    <tr><th>Mana Cost</th><th>Count</th></tr>
    </thead>
    </table>`
  );
  for (const [key, value] of Object.entries(manaCardCount)) {
    $('table').append(
      `<tr><td> ${key} </td><td>${value.count}</td>`
    );

  }
}

function showText() {
  let cardText = document.getElementById("card-info");
  if (cardText.style.display === "none") {
    cardText.style.display = "block";
  } else {
    cardText.style.display = "none";
  }
}

function changeButtonText() {
  console.log("change button text has been called");
  let buttonText = document.getElementById("btn-show-text");
  if (buttonText.innerHTML === "Show Card Text") {
    buttonText.innerHTML = "Hide Card Text";
  } else {
    buttonText.innerHTML = "Show Card Text";
  }
}

$(watchForm);
$(getRandom);

