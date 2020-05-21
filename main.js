'use strict'

const accessToken = 'USJyg1LLNQZDm9jqIBxN5KGpTjgc72ejp4'
const deckUrl = 'https://us.api.blizzard.com/hearthstone/deck/';
const deckInput = document.getElementById('deckInput');
const deckForm = document.getElementById('deckForm');
const defaultDeck = 'AAEBAaIHCLICrwSSlwPBrgOCsQPjtAObtgPLwAMLtAHtAs0DiAePlwP1pwO5rgP+rgOqrwPOrwPDtgMA';
const randomButton = document.getElementById('randomButton');

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
      "Authorization": "Bearer USJyg1LLNQZDm9jqIBxN5KGpTjgc72ejp4" })
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
  for (let i=0; i < responseJson.cards.length; i++){
    const name = responseJson.cards[i].name.en_US;
    const imageUrl = responseJson.cards[i].image.en_US;
   
    $('#deckCards').append(
      `<li><h3>${name}</h3></li>
      <li><p><img src= "${imageUrl}"></p></li>`
    );
    $('#deckList').removeClass('hidden');
  }
 }

$(watchForm);
$(getRandom);

