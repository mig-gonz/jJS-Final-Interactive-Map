// Obtain the user's current location.
// Map the location on a Leaflet map.
// Allow the user to select a business type from a list and map the five nearest locations on the map using the Foursquare API.

let markers = {};
let coords = [];
let map = {};
let businesses = [];

// main/map function
function mainMap() {
  const map = L.map("map").setView([51.505, -0.09], 13);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
  const marker = L.marker([48.87007, 2.346453]);
  marker.addTo(map).bindPopup("<p1><b>The Hoxton, Paris</b></p1>").openPopup();

  for (let i = 0; i < businesses.length; i++) {
    this.markers = L.marker([businesses[i].lat, businesses[i].long])
      .bindPopup(`<p1>${businesses[i].name}</p1>`)
      .addTo(map);
  }
}

mainMap();

// my obtain user coordinates function
async function getCoords() {
  pos = await new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
  return [pos.coords.latitude, pos.coords.longitude];
}
// forsquare data
async function foursquareData(business) {
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: "fsq3W7lbQ9/kmVINE0wQTCsDRp3C9pUuAGoYo/eJEa9Xr8w=",
    },
  };
  let limit = 5;
  let lat = myMap.coordinates[0];
  let lon = myMap.coordinates[1];
  let response = await fetch(
    `https://api.foursquare.com/v3/places/search?&query=${business}&limit=${5}&ll=${lat}%2C${lon}`,
    options
  );
  let data = await response.text();
  let parsedData = JSON.parse(data);
  let businesses = parsedData.results;
  return businesses;
}
// process foursquare array
function automate(data) {
  let businesses = data.map((element) => {
    let location = {
      name: element.name,
      lat: element.geocodes.main.latitude,
      long: element.geocodes.main.longitude,
    };
    return location;
  });
  return businesses;
}

// onload
window.onload = async () => {
  const coords = getCoords();
  mainMap.coordinates = coords;
};

document.getElementById("mybtn").addEventListener("click", async (event) => {
  let business = document.getElementById("deffer-options").value;
  let data = await getFoursquare(business);
  mainMap.businesses = automate(data);
});
