// this is our entry file, we get data from user interface.
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login } from './login';

//DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form');

//DELEGATION
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    console.log(email, password);
    e.preventDefault(); //this prevent's the form,from loading any other page

    //Values
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}
