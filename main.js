'use strict';

const accessToken = 'USNpaOqf11Sjty1TdzkR781sALs9fIOLSh';
const deckUrl = 'https://us.api.blizzard.com/hearthstone/deck/';
const deckInput = document.getElementById('deckInput');
const deckForm = document.getElementById('deckForm');
const defaultDeck = 'AAEBAaIHCLICrwSSlwPBrgOCsQPjtAObtgPLwAMLtAHtAs0DiAePlwP1pwO5rgP+rgOqrwPOrwPDtgMA';
const randomButton = document.getElementById('randomButton');
let hsDeck = [];

$(document).ready(function(){
    console.log("ready");
  });
  
  getDeck(defaultDeck);

function watchForm() {
    console.log("watch form");
    deckForm.addEventListener('submit', e => {
    console.log("I get called after the form is submitted.");
    e.preventDefault();
    const hearthStoneDeckId = deckInput.value;
    getDeck(hearthStoneDeckId);
    $('#deckForm')[0].reset();
    console.log(hearthStoneDeckId );
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
      "Authorization": "Bearer USNpaOqf11Sjty1TdzkR781sALs9fIOLSh" })
  };
   
    fetch(url, options)
    .then(response => {
        if (response.ok){
            return response.json();
        }
        throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {$('js-error-message').text(`something went wrong: ${err.message}`);
  });

}

function displayResults (responseJson) {
  console.log(responseJson);
  $('#deckCards').empty();
  const deckClass = responseJson.class.name.en_US;
  const [deckCode, keys] = responseJson.deckCode.split('locale');
  $('#deckCards').append(
   `<hr><h4>This Hearthstone Deck's class is: <b>${deckClass}</b>.</h4>
   <input type="text" value=${deckCode} id="codeID"> <button onclick="copyCode()">Copy Deck Code</button>`);

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
  for (let i=0; i < hsDeck.length; i++){
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
        <header class="card-title">
         <p>${name}</p>
          </header>
          <p class = "card-cost"> Mana Cost: ${manaCost} </p>
          <main class="card-description">
          ${deckDescription}
          </main>
  
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
  alert("Copied the text: " + copyText.value);
}

function manaCostArray(hsDeck) {
  let manaCostCards = [];
  hsDeck.sort();
  for (let i = 0; i < hsDeck.length; i++ ) {
        manaCostCards.push(hsDeck[i].manaCost);
  }
  
  //console.log(manaCostCards);
  manaSpread(manaCostCards);
  return manaCostCards;
} 

function manaSpread(manaCostCards) {
  let manaCardCount = [];
  // make a copy of the input array
  let copy = manaCostCards.slice(0);
 // console.log('the array has been copied')
  // first loop goes over every element
  for (let i = 0; i < manaCostCards.length; i++) {
    let myCount = 0;	
    // loop over every element in the copy and see if it's the same
    for (let w = 0; w < copy.length; w++) {
      if (manaCostCards[i] == copy[w]) {
        // increase amount of times duplicate is found
        myCount++;
        // sets item to undefined
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
    
    manaCardCount.sort(function(a,b) {
      return a.mana-b.mana;
    });

    console.log(manaCardCount);
    showSummary(manaCardCount);
}

function showSummary (manaCardCount){
  $('#deckSummary').empty();
  $('#deckSummary').append(
    `<p><b> Mana Cost Summary</b></p>`
  );
  for (const [key,value] of Object.entries(manaCardCount)){
    $('#deckSummary').append(
      `<ul>
      <li> Mana Cost: ${key} Count: ${value.count}</li>
      </ul>`
    );

  }
}

$(watchForm);
$(getRandom);

