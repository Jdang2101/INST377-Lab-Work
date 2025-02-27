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

async function mainEvent() {
  const mainForm = document.querySelector(".main_form");
  const filterButton = document.querySelector("#filter_button");
  const loadDataButton = document.querySelector("#data_load");
  const generateListButton = document.querySelector("#generate");

  const loadAnimation = document.querySelector("#data_load_animation");
  console.log(loadAnimation)
  loadAnimation.style.display = "none";

  let currentList = [];

  loadDataButton.addEventListener("click", async (submitEvent) => {

    console.log("Loading data");
    loadAnimation.style.display = "inline-block";

    submitEvent.preventDefault();

    const results = await fetch(
      "https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json"
    );
    console.log(results);

    currentList = await results.json();

    loadAnimation.style.display = "none";
    console.table(currentList);
  });

  filterButton.addEventListener("click", (event) => {
    console.log("clicked FilterButton");
    event.preventDefault();
    const formData = new FormData(mainForm);
    const formProps = Object.fromEntries(formData);

    console.log(formProps);
    const newList = filterList(currentList, formProps.resto);

    console.log(newList);
    injectHTML(newList);
    console.log("list added")
  });

  generateListButton.addEventListener("click", (event) => {
    console.log("generate new list");
    const restaurantsList = cutRestaurantList(currentList);
    console.log(restaurantsList);
    injectHTML(restaurantsList);
  });
}

document.addEventListener("DOMContentLoaded", async () => mainEvent());