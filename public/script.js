const searchInput = document.getElementById('city-input')
const unitCel = document.querySelector('.weather-unit-celsius')
const unitFar = document.querySelector('.weather-unit-farhenite')
const outputCity = document.querySelector('.weather-city')
const outDateTime = document.getElementById('output-date-time')
const outDesc = document.getElementById('output-desc')
const outImage = document.querySelector('.weather-icon')
const temp = document.getElementById('weather-temp')
const minTemp = document.getElementById('min-temp')
const maxTemp = document.getElementById('max-temp')
const realFeel = document.querySelector('.weather-real-feel')
const humidity = document.querySelector('.weather-humidity')
const wind = document.querySelector('.weather-wind')
const pressure = document.querySelector('.weather-pressure')
// console.log(unitCel);

const apiKey = `add_your_key_here`
const coordAPIURL = `http://api.openweathermap.org/geo/1.0/direct`
const revCoordAPIURL = `http://api.openweathermap.org/geo/1.0/reverse`
const weatherAPIURL = `https://api.openweathermap.org/data/2.5/weather`
const iconURL = `https://openweathermap.org/img/wn/`
let unit = `metric`

// EVENT LISTENER THAT CALLS SOME FUNCTIONS WHEN SOME CITY IS SUBMITTED IN THE FORM
searchInput.addEventListener('submit', (event) => {
    event.preventDefault();

    const city = document.querySelector('.weather-search-form').value;
    fetchCoordinates(city)
});

// FUNCTIONS THAT CHANGE THE UNIT OF THE VALUES
unitCel.addEventListener('click', () => {
    if(unit !== `metric`){
        unit = `metric`
        const city = document.querySelector('.weather-search-form').value;
        fetchCoordinates(city)
    }
})

unitFar.addEventListener('click', () => {
    if(unit !== `imperial`){
        unit = `imperial`
        const city = document.querySelector('.weather-search-form').value;
        fetchCoordinates(city)
    }
})

// FUNCTION THAT FETCHES THE COORDINATES IF THE CITY IS GIVEN
function fetchCoordinates(city){
    if(city.trim === ""){
        console.error("Please enter a city name");
        return;
    }

    const url = `${coordAPIURL}?q=${city}&appid=${apiKey}`
    fetch(url)
        .then( (response) => response.json() )
        .then( (data) => {
            // console.log(data[0].lat);
            if (data && data.length > 0) {
                const latitude = data[0].lat;
                const longitude = data[0].lon;
                fetchWeather(latitude, longitude)
            } else {
                console.error("No data returned from teh API");
            }
        } )
        .catch( (error) => {
            console.error('Error fetching data', error);
        } )
}

// FUNCTION THAT FETCHES WEATHER DETAILS AND WRITES IT INTO THE WEBSITE
function fetchWeather(lat, lon){
    const url = `${weatherAPIURL}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`

    fetch(url)
        .then( (response) => response.json() )
        .then( (data) => {
            console.log(data);

            fetchCity(lat, lon)
            outDateTime.textContent = convertDateTime(data.dt,data.timezone)
            outDesc.textContent = `${data.weather[0].description}`
            outImage.innerHTML = `<img src="${iconURL}${data.weather[0].icon}@4x.png" alt="">`
            temp.innerHTML = ` <p id="weather-temp" class="text-4xl">${data.main.temp}&#176</p>`
            minTemp.innerHTML = `<p class="m-2" id="min-temp">Min: ${data.main.temp_min}&#176</p>`
            maxTemp.innerHTML = `<p class="m-2" id="max-temp">Max: ${data.main.temp_max}&#176</p>`
            realFeel.innerHTML = `<p class="weather-real-feel">${data.main.feels_like}&#176</p>`
            humidity.textContent = `${data.main.humidity} %`
            pressure.textContent = `${data.main.pressure} hPa`
            if(unit === `metric`){
                wind.textContent = `${data.wind.speed} m/s`
            } else{
                wind.textContent = `${data.wind.speed} mph`
            }
            
        } )
}

// REVERSE FUNCTION OF FetchCoordinates(); THIS OUTPUTS CITY AND IT'S COUNTRY WHEN LAT AND LON IS GIVEN
function fetchCity(lat, lon){
    const url = `${revCoordAPIURL}?lat=${lat}&lon=${lon}&appid=${apiKey}`

    fetch(url)
        .then( (response) => response.json() )
        .then( (data) => {
            // console.log(data[0]);

            outputCity.textContent = `${data[0].name}, ${data[0].country}`
        } )
        .catch( (error) => {
            console.error('Error fetching data', error);
        } )
}

// FUNCTION THAT RETURNS DATE AND TIME IN CORRECT FORMAT THAT IS NEEDED FOR THE WEBSITE IN LOCAL TIME
function convertDateTime(unixtime, offset){
    const clientOffset = new Date().getTimezoneOffset();
    const offsetTimestamp = (unixtime + (clientOffset * 60) + offset)
    const date = new Date(offsetTimestamp * 1000)

    const day = date.toLocaleDateString("en-US", { weekday: 'long' });
    const month = date.toLocaleDateString("en-US", { month: 'long' });
    const dayOfM = date.getDate();
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day}, ${month} ${dayOfM}, ${year} at ${hours}:${minutes}`
}
