'use strict';

const cardsAmount = 20;
const allCardElements = [];

fetch(`https://randomuser.me/api/?results=${cardsAmount}`)
  .then(response => response.json())
  .then(response => {
    const users = response.results; // array

    users.forEach((user, index) => {
      const card = document.createElement('li');
      card.className = 'card';
      card.innerHTML = (
        `<img src="${user.picture.large}" height="128" width="128">
         <p>${user.name.first} ${user.name.last}, ${user.dob.age}</p>
         <p>${user.location.country}, ${user.location.city}</p>
         <img src="https://www.countryflags.io/${user.nat}/flat/24.png">`
      )

      allCardElements[index] = card;
    })

    function mountCards() {
      const mountPoint = document.querySelector('.main-container');
      mountPoint.innerHTML = '';
      const fragment = document.createDocumentFragment();

      allCardElements.forEach(cardEl => {
        fragment.append(cardEl);
      })

      mountPoint.append(fragment)
    }

    mountCards();
  });

const mountPoint = document.querySelector('.main-container');
const fragment = document.createDocumentFragment();

for (let i = 1; i <= cardsAmount; i++) {
  const card = document.createElement('li');
  card.className = 'card';

  fragment.append(card);
}

mountPoint.append(fragment);
