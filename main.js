'use strict'

const accessToken = 'USn17IWh838feaSMB6HlAZRMQin1FwT9Jq'
const deckUrl = 'https://us.api.blizzard.com/hearthstone/deck/';
const deckInput = document.getElementById('deckInput');
const deckForm = document.getElementById('deckForm');
const defaultDeck = 'AAEBAaIHCLICrwSSlwPBrgOCsQPjtAObtgPLwAMLtAHtAs0DiAePlwP1pwO5rgP+rgOqrwPOrwPDtgMA';
const randomButton = document.getElementById('randomButton');
let hsDeck = [];

$(document).ready(function(){
    console.log("ready");
  });
  
$(function() {
    console.log('App loaded! Waiting for submit!');
  });

  getDeck(defaultDeck);

function watchForm() {
    console.log("watch form");
    deckForm.addEventListener('submit', e => {
    console.log("I get called after the form is submitted.");
    e.preventDefault();
    const hearthStoneDeckId = deckInput.value;
    getDeck(hearthStoneDeckId);
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
    .map(key => `${key}=${params[key]}`)
    return queryItems.join('&');
}

function getDeck(hearthStoneDeckId) {
    const params = {
    locale: 'en_US',
    access_token: accessToken
    };
    const queryString = formatQueryParams(params)
    const url = deckUrl + hearthStoneDeckId + queryString;

    console.log(url);

    const options = {
    "headers": new Headers({
      "Authorization": "Bearer USn17IWh838feaSMB6HlAZRMQin1FwT9Jq" })
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
  const deckClass = responseJson.class.name.en_US;;
  const [deckCode, keys] = responseJson.deckCode.split('locale');
  $('#deckCards').append(
   `<hr><h4>This Hearthstone Deck's class is: <b>${deckClass}</b>.</h4>
   <input type="text" value=${deckCode} id="codeID"> <button onclick="copyCode()">Copy Deck Code</button>`);


   
   hsDeck = responseJson.cards;
   console.log(hsDeck);
  

   hsDeck.sort((a, b) => {
    console.log(a.name.en_US)
    return a.name.en_US.localeCompare(b.name.en_US)
  });

  

   displayDeckDetails(hsDeck);
 
  function displayDeckDetails(hsDeck) {
  for (let i=0; i < hsDeck.length; i++){
    const imageUrl = hsDeck[i].image.en_US;
    const name = hsDeck[i].name.en_US;
    const manaCost = hsDeck[i].manaCost;
    const attack = hsDeck[i].attack;
    const health = hsDeck[i].health;
    const deckDescription = hsDeck[i].text.en_US;
   

    $('#deckDetails').append(
      `<p>Card Name: ${name}</p>
      <p> Card Text: ${deckDescription}</p>
      <p> Mana Cost: ${manaCost}</p>
      <p> Attack: ${attack} Health: ${health}</p>
      <p class ="deckimage"><img src= "${imageUrl}" alt="${deckDescription}"></p>
      <hr>`
    );
  
  }

 
}
}

function copyCode() {
  let copyText = document.getElementById("codeID");
  copyText.select();
  copyText.setSelectionRange(0, 99999)
  document.execCommand("copy");
  alert("Copied the text: " + copyText.value);
}


$(watchForm);
$(getRandom);

