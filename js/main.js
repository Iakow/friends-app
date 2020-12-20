'use strict';

const cardsAmount = 200;
const allCardElements = [];

(function mountPlaceHolders() {
  const mountPoint = document.querySelector('.main-container');
  const fragment = document.createDocumentFragment();

  for (let i = 1; i <= cardsAmount; i++) {
    const card = document.createElement('li');
    card.className = 'card';

    fragment.append(card);
  }

  mountPoint.append(fragment);
})();

/* монтируеум из allCardElements */
function mountCards(arr) {
  const mountPoint = document.querySelector('.main-container');
  /* очищаем main-container */
  mountPoint.innerHTML = '';
  const fragment = document.createDocumentFragment();

  arr.forEach(cardEl => {
    fragment.append(cardEl);
  })

  mountPoint.append(fragment)
}

fetch(`https://randomuser.me/api/?results=${cardsAmount}`)
  .then(response => response.json())
  .then(response => {
    const users = response.results;

    /* строим allCardElements */
    users.forEach((userData, index) => {
      const card = document.createElement('li');
      card.className = 'card';
      card.userData = userData;

      const flag = `<img src="https://www.countryflags.io/${userData.nat}/flat/24.png">`;
      card.innerHTML = ([
        `<div class="card-cover" style="background-image: url('${userData.picture.large}')"></div>`,
        `<img class="card-photo" src="${userData.picture.large}" height="128" width="128">`,
        `<p class="card-name">${userData.name.first} ${userData.name.last}, ${userData.dob.age}</p>`,
        `<p class="card-addr">${flag}${userData.location.country}, ${userData.location.city}</p>`,
        `<p class="card-phone">${userData.phone}</p>`,
        `<p class="card-email">${userData.email}</p>`
      ].join('\n'))

      allCardElements[index] = card;
    })

    mountCards(allCardElements);
  });

function sortByAge() {
  const newArr = [...allCardElements].sort((user1, user2) => {
    //return user1.userData.dob.age - user2.userData.dob.age // это по возрастающей
    return user2.userData.dob.age - user1.userData.dob.age // это по убывающей
  })

  mountCards(newArr);
}

const selection = {
  ageSorting: 0,

  sortByAge() {
    let sortFunc;
    if (selection.ageSorting === 0) {
      selection.ageSorting = 1;
      sortFunc = (user1, user2) => +user2.userData.dob.age - +user1.userData.dob.age;
    } else if (selection.ageSorting === 1) {
      selection.ageSorting = -1;
      sortFunc = (user1, user2) => +user1.userData.dob.age - +user2.userData.dob.age;
    } else {
      selection.ageSorting = 0;
      sortFunc = (user1, user2) => 0;
    }

    const newArr = [...allCardElements].sort(sortFunc);

    mountCards(newArr);
    console.log(selection.ageSorting)
  }
}

document.querySelector('#sort-age').addEventListener('click', selection.sortByAge);

/* ок, далее. Где хранить данные сортировок и фильтров?
   Думал о замыкании, но сортировка по имени должна ж сбрасывать сортировку по возрасту
   поэтому они должны храниться в одном месте.
   В объекте?
*/
