const apiKey = "56a064b53171cc14879b0e22c8fd391e";

const getUserLocationInfo = async () => {
  try {
    var url = "https://api.ipify.org?format=json";
    const response = await fetch(url);
    const data = await response.json();
    if (data.ip) {
      const userData = await fetch(`https://ipapi.co/${data.ip}/json/`);
      const userInfo = await userData.json();
      if (userInfo.latitude && userInfo.longitude) {
        await fetchWeatherData(userInfo.latitude, userInfo.longitude, userInfo);
      } else {
        console.log("Missing location information");
      }
    }
  } catch (error) {
    console.log("Error fetching IP address", error);
  }
};

getUserLocationInfo();

async function fetchWeatherData(latitude, longitude, userInfo) {
  try {
    const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
    const weatherResp = await fetch(apiUrl);
    const data = await weatherResp.json();
    displayWeatherData(data, userInfo);
  } catch (error) {
    console.log("error===", error);
  }
}

function displayWeatherData(data, userInfo) {
  const iframe = document.getElementById("mapIframe");
  const newSrc = `https://maps.google.com/maps?q=${data.lat},${data.lon}&z=15&output=embed`;
  iframe.src = newSrc;
  const feelsLikeInCelsius = data.current.feels_like - 273.15;

  document.getElementById("lat").innerText = `Lat : ${data.lat}`;
  document.getElementById("long").innerText = `Long : ${data.lon}`;
  document.getElementById("location").innerText = `Location : ${userInfo.city}`;
  document.getElementById("windspeed").innerText = `Wind speed : ${data.current.wind_speed}kmph`;
  document.getElementById("humidity").innerText = `Humidity : ${data.current.humidity}`;
  document.getElementById("timezone").innerText = `Time-zone : ${userInfo.utc_offset}`;
  document.getElementById("pressure").innerText = `Pressure : ${(data.current.pressure* 0.00000986923).toFixed(4)}atm`;
  document.getElementById("windDirection").innerText = `Wind Direction : ${getWindDirection(data.current.wind_deg)}`;
  document.getElementById("uvIndex").innerText = `UV Index : ${data.current.uvi}`;
  document.getElementById("feelslike").innerText = `Feels Like : ${feelsLikeInCelsius.toFixed(2)} °C`;
}


function getWindDirection(degrees) {
        const directions = ['North', 'N0rth-East', 'East', 'South-East', 'South', 'South-West', 'West', 'North-West'];
        const index = Math.round((degrees % 360) / 45);
        return directions[index];
    }