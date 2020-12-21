'use strict';

const USERS_AMOUNT = 100;
const ALL_USER_CARDS = [];

(function mountPlaceHolders() {
  const mountPoint = document.querySelector('.main-container');
  const fragment = document.createDocumentFragment();

  for (let i = 1; i <= USERS_AMOUNT; i++) {
    const card = document.createElement('li');
    card.className = 'card';

    fragment.append(card);
  }

  mountPoint.append(fragment);
})();

function mountCards(arr) {
  const mountPoint = document.querySelector('.main-container');
  const fragment = document.createDocumentFragment();

  arr.forEach(cardEl => {
    fragment.append(cardEl);
  })

  mountPoint.innerHTML = '';
  mountPoint.append(fragment)
}

fetch(`https://randomuser.me/api/?results=${USERS_AMOUNT}`)
  .then(response => response.json())
  .then(response => {
    const users = response.results;

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

      ALL_USER_CARDS[index] = card;
    })

    mountCards(ALL_USER_CARDS);
  });

document.querySelector('aside').addEventListener('input', (e) => {
  const { id } = e.target;

  if (id === 'filter-name') {
    e.target.value = e.target.value.trim();
  }

  if (id === 'filter-age-min' || id === 'filter-age-max') {
    if (e.target.value === '0') e.target.value = '';
  }

  applyFilters();
});

document.querySelector('aside').addEventListener('click', (e) => {

  const { id, value } = e.target;

  if (id === 'filter-sex') {
    if (!value) {
      e.target.value = 'female'
    } else if (value === 'female') {
      e.target.value = 'male'
    } else if (value === 'male') {
      e.target.value = ''
    }
  } else if (id === 'sort-age') {
    document.querySelector('#sort-name').value = '';

    if (!value) {
      e.target.value = 'up';
    } else if (value === 'up') {
      e.target.value = 'down';
    } else if (value === 'down') {
      e.target.value = '';
    }
  } else if (id === 'sort-name') {
    document.querySelector('#sort-age').value = '';

    if (!value) {
      e.target.value = 'up';
    } else if (value === 'up') {
      e.target.value = 'down';
    } else if (value === 'down') {
      e.target.value = '';
    }
  } else {
    return
  }

  applyFilters();
})

document.querySelector('#reset').addEventListener('click', (e) => {
  e.target.disabled = true;

  document.querySelectorAll('.filter').forEach(ctrl => ctrl.value = '');

  mountCards(ALL_USER_CARDS);
})

function applyFilters() {
  const filteredArr = [...ALL_USER_CARDS]
    .filter(filterByName)
    .filter(filterByAge)
    .filter(filterBySex)
    .sort(sortByAge)
    .sort(sortByName)

  mountCards(filteredArr);

  const ctrls = document.querySelectorAll('.filter');
  document.querySelector('#reset').disabled = ([...ctrls].every(ctrl => ctrl.value === ''))

  function filterByName(user) {
    const firstName = user.userData.name.first.toLowerCase();
    const input = document.querySelector('#filter-name').value.toLowerCase();

    return (firstName.startsWith(input));

  }

  function filterByAge(user) {
    const min = document.querySelector('#filter-age-min').value;
    const max = document.querySelector('#filter-age-max').value;
    const { age } = user.userData.dob;

    if (!min && !max) return user;
    if (min && !max) return +age >= +min;
    if (!min && max) return +age <= +max;
    if (min && max) return +age >= +min && +age <= +max
  }

  function filterBySex(user) {
    const input = document.querySelector('#filter-sex').value;
    debugger;

    if (input === 'male') {
      return user.userData.gender === 'male';
    } else if (input === 'female') {
      return user.userData.gender === 'female';
    } else if (input === '') {
      return true;
    }
  }

  function sortByAge(user1, user2) {
    const input = document.querySelector('#sort-age').value;
    if (input === 'down') {
      return +user2.userData.dob.age - +user1.userData.dob.age;
    } else if (input === 'up') {
      return +user1.userData.dob.age - +user2.userData.dob.age;
    } else if (input === '') {
      return 0;
    }
  }

  function sortByName(user1, user2) {
    const input = document.querySelector('#sort-name').value;
    const name1 = user1.userData.name.first + user1.userData.name.last;
    const name2 = user2.userData.name.first + user2.userData.name.last;

    if (input === 'up') {
      if (name1 > name2) return 1;
      if (name1 < name2) return -1;
      if (name1 === name2) return 0;
    } else if (input === 'down') {
      if (name1 < name2) return 1;
      if (name1 > name2) return -1;
      if (name1 === name2) return 0;
    } else if (input === '') {
      return 0;
    }
  }
}
