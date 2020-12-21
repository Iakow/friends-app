'use strict';

const cardsAmount = 100;
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
  const fragment = document.createDocumentFragment();
  
  arr.forEach(cardEl => {
    fragment.append(cardEl);
  })
  
  mountPoint.innerHTML = '';
  mountPoint.append(fragment)
}

/* запрашиваем данные и перестраиваем */
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


const filterNameInpt = document.querySelector('#filter-name');
const filterAgeMinInpt = document.querySelector('#filter-age-min');
const filterAgeMaxInpt = document.querySelector('#filter-age-max');
const filterGenderInpt = document.querySelector('#filter-sex');
const sortAgeInpt = document.querySelector('#sort-age');
const sortNameInpt = document.querySelector('#sort-name');
const resetInpt = document.querySelector('#reset');

filterNameInpt.addEventListener('input', () => {
  filterNameInpt.value = filterNameInpt.value.trim();
  applyFilters();
});

filterAgeMinInpt.addEventListener('input', e => {
  if (e.target.value === '0') e.target.value = '';
  applyFilters();
})

filterAgeMaxInpt.addEventListener('input', e => {
  if (e.target.value === '0') e.target.value = '';
  applyFilters();
})

filterGenderInpt.addEventListener('click', () => {
  const value = filterGenderInpt.value;

  if (!value) {
    filterGenderInpt.value = 'female'
  } else if (value === 'female') {
    filterGenderInpt.value = 'male'
  } else if (value === 'male') {
    filterGenderInpt.value = ''
  }

  applyFilters();
})

sortAgeInpt.addEventListener('click', (e) => {
  const value = e.target.value;
  sortNameInpt.value = '';

  if (!value) {
    e.target.value = 'up';
  } else if (value === 'up') {
    e.target.value = 'down';
  } else if (value === 'down') {
    e.target.value = '';
  }

  applyFilters();
});

sortNameInpt.addEventListener('click', (e) => {
  const value = e.target.value;
  sortAgeInpt.value = '';

  if (!value) {
    e.target.value = 'up';
  } else if (value === 'up') {
    e.target.value = 'down';
  } else if (value === 'down') {
    e.target.value = '';
  }

  applyFilters();
});

resetInpt.addEventListener('click', () => {
  resetInpt.disabled = true;
  resetFilters();
  mountCards(allCardElements);
})


/*
    Плохо, что каждый раз срабатывает 5 циклов
    А как иначе?
    Лушче бы при каждом клике воздействовать на некий глобальный массив
    
    Еще можно бы попытаться сохранять какие-то массивы.
    У меня есть две взаимоисключащие сортирвоки и фильтрация по полу - это комбинации можно было бы построить заранее. Но это пиздец как сложно.

    Возможно, если перемонтировать по одной карте, на телефоне все было бы плавнее.
    Может быть даже как-то асинхронно.
    Ведь на самом деле ж мне надо в первую очередь перестроить то, что на экране.
*/

function applyFilters() {
  const filteredArr = [...allCardElements]
    .filter(filterByName)
    .filter(filterByAge)
    .filter(filterBySex)
    .sort(sortByAge)
    .sort(sortByName)

  if (JSON.stringify(allCardElements) === JSON.stringify(filteredArr)) resetInpt.disabled = true
  else resetInpt.disabled = false;
  

  mountCards(filteredArr);

  function filterByName(user) {
    const firstName = user.userData.name.first.toLowerCase();
    const lastName = user.userData.name.last.toLowerCase();
    const input = filterNameInpt.value.toLowerCase();

    return (firstName.startsWith(input) || lastName.toLowerCase().startsWith(input));
  }

  function filterByAge(user) {
    const min = filterAgeMinInpt.value;
    const max = filterAgeMaxInpt.value;
    const { age } = user.userData.dob;

    if (!min && !max) return user;
    if (min && !max) return +age >= +min;
    if (!min && max) return +age <= +max;
    if (min && max) return +age >= +min && +age <= +max
  }

  function filterBySex(user) {
    const input = filterGenderInpt.value;
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
    const input = sortAgeInpt.value;
    if (input === 'down') {
      return +user2.userData.dob.age - +user1.userData.dob.age;
    } else if (input === 'up') {
      return +user1.userData.dob.age - +user2.userData.dob.age;
    } else if (input === '') {
      return 0;
    }
  }

  function sortByName(user1, user2) {
    const input = sortNameInpt.value;
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

function resetFilters() {
  filterNameInpt.value = '';
  filterAgeMinInpt.value = '';
  filterAgeMaxInpt.value = '';
  filterGenderInpt.value = '';
  sortAgeInpt.value = '';
  sortNameInpt.value = '';
}
