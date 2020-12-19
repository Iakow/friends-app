'use strict';

fetch('https://randomuser.me/api/?results=2')
  .then(response => response.json())
  .then(response => {
    const users = response.results;
    console.log(users)
    /* 
    user.picture.large;
    user.name.first + ' ' + user.name.last + ', ' + user.dob.age;
    /user.nat/ user.location.country + ', ' + user.location.city;
    lag.src = `https://www.countryflags.io/${user.nat}/flat/24.png`;
    */
  });

function mountCards() {
  const mountPoint = document.querySelector('.main-container');
  const fragment = document.createDocumentFragment();

  
  for (let i = 1; i <= 20; i++) {
    const card = document.createElement('div');
    card.className = 'card';
    fragment.append(card);
  }

  mountPoint.append(fragment);
}

mountCards();
