'use strict';

const accessToken = 'USwhYSK3BkBO9fvl7lJPyar8pjdK1KwI4c';
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
            "Authorization": "Bearer USwhYSK3BkBO9fvl7lJPyar8pjdK1KwI4c"
        })
    };

    fetch(url,options)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayResults(responseJson))
        .catch(err => {
            $("#error").append('<span id="errorMessage"> Deck not found try again. </span>');
        });

}

function displayResults(responseJson) {
    console.log(responseJson);
    $('#deckCards').empty();
    $("#error").empty();
    const deckClass = responseJson.class.name.en_US;
    const [deckCode, keys] = responseJson.deckCode.split('locale');
    $('#deckCards').append(
        `<hr><h4>This Hearthstone Deck's class is: <b>${deckClass}</b>.</h4>
   <input type="text" value=${deckCode} id="codeID"> <button onclick="copyCode()">Copy Deck Code</button>
   <span id=“copy_feedback"></span>`);

    hsDeck = responseJson.cards;


    hsDeck.sort((a, b) => {
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
        const id = hsDeck[i].id;

        if (attack === undefined && health === undefined) {
            $('.card-container').append(
                `<article class="card">
        <figure>
          <img class="card-image" src= "${imageUrl}" alt="${deckDescription}"> </figure>
          <div id ="${id}" class="card-text">
        <header class="card-title">
         <p>${name}</p>
          </header>
          <p class = "card-cost"> Mana: ${manaCost} </p>
          <main class="card-description">
          ${deckDescription}
          </main>
          </div>
          
      </article>`
            );
        } else {
            $('.card-container').append(
                `<article class="card">
        <figure> <img class="card-image" src= "${imageUrl}" alt="${deckDescription}"></figure>
      <div id ="${id}" class="card-text">
      <header class="card-title">
       <p>${name}</p>
        </header>
        <p class = "card-cost"> <b>Mana:</b> ${manaCost} </p>
        <p class = "card-stats"> <b>Attack:</b> ${attack} </p>
        <p class = "card-stats"> <b>Health:</b> ${health} </p>
        <main class="card-description">
        ${deckDescription}
        </main>
        </div>
          
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

    manaCardCount.sort(function(a, b) {
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
    for (const [key,value] of Object.entries(manaCardCount)) {
        $('table').append(
            `<tr><td> ${value.mana} </td><td>${value.count}</td>`
        );

    }
}


$(watchForm);
$(getRandom);