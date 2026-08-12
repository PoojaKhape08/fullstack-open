import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [value, setValue] = useState('')
  const [countries, setCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  useEffect(() => {
    if (!selectedCountry) {
      setWeather(null)
      return
    }

    const capital = selectedCountry.capital[0]
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&appid=${apiKey}`
      )
      .then(response => {
        setWeather(response.data)
      })
  }, [selectedCountry])

  const handleChange = (event) => {
    setValue(event.target.value)
    setSelectedCountry(null)
  }

  const showCountry = (country) => {
    setSelectedCountry(country)
  }

  const countriesToShow = countries.filter(country =>
    country.name.common
      .toLowerCase()
      .includes(value.toLowerCase())
  )

  const country = selectedCountry || (
    countriesToShow.length === 1
      ? countriesToShow[0]
      : null
  )

  return (
    <div>
      <h1>Countries</h1>

      <div>
        find countries:
        <input
          value={value}
          onChange={handleChange}
        />
      </div>

      {countriesToShow.length > 10 && (
        <p>Too many matches, specify another filter</p>
      )}

      {countriesToShow.length > 1 &&
        countriesToShow.length <= 10 &&
        !selectedCountry && (
          <ul>
            {countriesToShow.map(country => (
              <li key={country.cca3}>
                {country.name.common}
                <button onClick={() => showCountry(country)}>
                  show
                </button>
              </li>
            ))}
          </ul>
        )}

      {country && (
        <div>
          <h2>{country.name.common}</h2>

          <p>Capital: {country.capital}</p>

          <p>Area: {country.area}</p>

          <h3>Languages</h3>

          <ul>
            {Object.values(country.languages).map(language => (
              <li key={language}>{language}</li>
            ))}
          </ul>

          <img
            src={country.flags.png}
            alt={`Flag of ${country.name.common}`}
            width="150"
          />

          <h3>Weather in {country.capital[0]}</h3>

          {weather && (
            <div>
              <p>
                Temperature: {weather.main.temp} Celsius
              </p>

              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
              />

              <p>
                {weather.weather[0].description}
              </p>

              <p>
                Wind: {weather.wind.speed} m/s
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default App