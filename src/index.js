import { fetchCountries } from './js/fetchCountries.js';

const DEBOUNCE_DELAY = 300;

const inputSearchBox = document.querySelector('#search-box');
const countryList = document.querySelector('#country-list');
const countryInfo = document.querySelector('#country-info');

let countryToSearch = '';

function clearAll() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}

function viewCountryCardMarker(country) {
  const readyCard = `<div class="CountryCardMarker">
        <div class="CountryCardHeader">
            <img src="${
              country.flags.svg
            }" alt="Country flag" width="55", height="35">
            <h2 class="CountryCardName"> ${country.name.official}</h2>
        </div>
            <p class="CountryCardAttribute">Capital: <span class="CountryCardAttributeValue">${
              country.capital
            }</span></p>
            <p class="CountryCardAttribute">Population: <span class="CountryCardAttributeValue">${
              country.population
            }</span></p>
            <p class="CountryCardAttribute">Languages: <span class="CountryCardAttributeValue">${Object.values(
              country.languages
            ).join(',')}</span></p>
    </div>`;
  countryInfo.innerHTML = readyCard;
}

function viewCountryList(countries) {
  const countriesAsListOfItems = countries
    .map(
      country =>
        `<li class="CountryListItem">
            <img src="${country.flags.svg}" alt="Country flag" width="40", height="30">
            <span class="CountryListName">${country.name.official}</span>
        </li>`
    )
    .join('');
  countryList.insertAdjacentHTML('beforeend', countriesAsListOfItems);
}

function onInputChange() {
  countryToSearch = inputSearchBox.value.trim();
  clearAll();
  if (countryToSearch === '') {
    return;
  } else
    fetchCountries(countryToSearch)
      .then(countries => {
        console.log(countries.length);
        if (countries.length == 1) {
          console.log('Pojedynczy wynik');
          viewCountryCardMarker(countries[0]);
        } else if (countries.length < 10 && countries.length > 1) {
          console.log('Wiele wyników');
          viewCountryList(countries);
        } else {
          clearAll();
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        }
      })
      .catch(errorText => {
        clearAll();
        Notiflix.Notify.failure('Oops, there is no country with that name.');
      });
}

inputSearchBox.addEventListener(
  'input',
  _.debounce(onInputChange, DEBOUNCE_DELAY)
);
