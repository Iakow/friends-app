'use strict';

const cardsAmount = 20;
const allCardElements = [];

fetch(`https://randomuser.me/api/?results=${cardsAmount}`)
  .then(response => response.json())
  .then(response => {
    const users = response.results; // array
    console.log(users);

    users.forEach((user, index) => {
      const card = document.createElement('li');
      card.className = 'card';
      const flag = `<img src="https://www.countryflags.io/${user.nat}/flat/24.png">`;
      card.innerHTML = ([
        `<div class="card-cover" style="background-image: url('${user.picture.large}')"></div>`,
        `<img class="card-photo" src="${user.picture.large}" height="128" width="128">`,
        `<p class="card-name">${user.name.first} ${user.name.last}, ${user.dob.age}</p>`,
        `<p class="card-addr">${flag}${user.location.country}, ${user.location.city}</p>`,
        `<p class="card-phone">${user.phone}</p>`,
        `<p class="card-email">${user.email}</p>`
      ].join('\n'))

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
