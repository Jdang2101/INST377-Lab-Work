function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function injectHTML(list) {
  console.log("fired injectHTML");
  const target = document.querySelector("#restaurant_list");
  target.innerHTML = "";
  list.forEach((item) => {
    const str = `<li>${item.name}</li>`;
    target.innerHTML += str;
  });
}

function filterList(list, query) {
  return list.filter((item) => {
    const lowerCaseName = item.name.toLowerCase();
    const lowerCaseQuery = query.toLowerCase();
    return lowerCaseName.includes(lowerCaseQuery);
  });
}

function cutRestaurantList(list) {
  console.log("fired cut list");
  const range = [...Array(15).keys()];
  return (newArray = range.map((item) => {
    const index = getRandomIntInclusive(0, list.length - 1);
    return list[index];
  }));
}

function initMap(){
  const carto = L.map('map').stView([51.505, -0.09], 13);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(carto);
}

async function mainEvent() {
  const mainForm = document.querySelector(".main_form");
  const loadDataButton = document.querySelector("#data_load");
  const generateListButton = document.querySelector("#generate");
  const textField = document.querySelector("#resto");


  const loadAnimation = document.querySelector("#data_load_animation");
  console.log(loadAnimation);
  loadAnimation.style.display = "none";
  generateListButton.classList.add("hidden");

const storedData = localStorage.getItem("storedData");
const parseData = JSON.parse(storedData);
if (parseData.length > 0) {
  generateListButton.classList.remove("hidden");
}

  // let storedList = [];
  let currentList = [];

  loadDataButton.addEventListener("click", async (submitEvent) => {
    console.log("Loading data");
    loadAnimation.style.display = "inline-block";

    submitEvent.preventDefault();

    const results = await fetch(
      "https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json"
    );
    console.log(results);

    const storedList = await results.json();
    localStorage.setItem('storedData', JSON.stringify(storedList));


    loadAnimation.style.display = "none";
    console.table(storedList);
  });

  // filterButton.addEventListener("click", (event) => {
  //   console.log("clicked FilterButton");
  //   event.preventDefault();
  //   const formData = new FormData(mainForm);
  //   const formProps = Object.fromEntries(formData);

  //   console.log(formProps);
  //   const newList = filterList(currentList, formProps.resto);

  //   console.log(newList);
  //   injectHTML(newList);
  //   console.log("list added");
  // });

  generateListButton.addEventListener("click", (event) => {
    console.log("generate new list");


    currentList = cutRestaurantList(storedList);
    console.log(currentList);
    injectHTML(currentList);
  });

  textField.addEventListener("input", (event) => {
    console.log("input", event.target.value);
    const newList = filterList(currentList, event.target.value);
    console.log(newList);
    injectHTML(newList);
  });
}

document.addEventListener("DOMContentLoaded", async () => mainEvent());
