'use strict';

const cardsAmount = 20;
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
    console.log(users[0])

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


const selection = {
  ageSorting: 0,
  nameSorting: 0,
  genderFiltering: 0,

  applyFilters() {
    const filteredArr = [...allCardElements]
      .sort(selection.sortByAge)
      .sort(selection.sortByName)
      .filter(selection.filterBySex);

    mountCards(filteredArr);
    console.log(selection)
  },

  sortByAge(user1, user2) {
    if (selection.ageSorting === 1) {
      return +user2.userData.dob.age - +user1.userData.dob.age;
    } else if (selection.ageSorting === -1) {
      return +user1.userData.dob.age - +user2.userData.dob.age;
    } else if (selection.ageSorting === 0) {
      return 0;
    }
  },

  sortByName(user1, user2) {
    if (selection.nameSorting === 1) {
      if (user1.userData.name.first > user2.userData.name.first) return 1;
      if (user1.userData.name.first < user2.userData.name.first) return -1;
      if (user1.userData.name.first === user2.userData.name.first) return 0;
    } else if (selection.nameSorting === -1) {
      if (user1.userData.name.first < user2.userData.name.first) return 1;
      if (user1.userData.name.first > user2.userData.name.first) return -1;
      if (user1.userData.name.first === user2.userData.name.first) return 0;
    } else if (selection.nameSorting === 0) {
      return 0;
    }
  },

  filterBySex(user) {
    if (selection.genderFiltering === 1) {
      return user.userData.gender === 'male';
    } else if (selection.genderFiltering === -1) {
      return user.userData.gender === 'female';
    } else if (selection.genderFiltering === 0) {
      return true;
    }
  }
}

document.querySelector('#sort-age').addEventListener('click', () => {
  selection.nameSorting = 0;

  if (selection.ageSorting === 0) {
    selection.ageSorting = 1;
  } else if (selection.ageSorting === 1) {
    selection.ageSorting = -1;
  } else if (selection.ageSorting === -1) {
    selection.ageSorting = 0;
  }

  selection.applyFilters();
});

document.querySelector('#filter-sex').addEventListener('click', () => {
  if (selection.genderFiltering === 0) {
    selection.genderFiltering = 1;
  } else if (selection.genderFiltering === 1) {
    selection.genderFiltering = -1;
  } else if (selection.genderFiltering === -1) {
    selection.genderFiltering = 0;
  }

  selection.applyFilters();
})

document.querySelector('#sort-name').addEventListener('click', () => {
  selection.ageSorting = 0;
  if (selection.nameSorting === 0) {
    selection.nameSorting = 1;
  } else if (selection.nameSorting === 1) {
    selection.nameSorting = -1;
  } else if (selection.nameSorting === -1) {
    selection.nameSorting = 0;
  }

  selection.applyFilters();
})
