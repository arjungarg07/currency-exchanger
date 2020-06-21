const axios = require("axios");
// API's Calls
// ExchangeRate :http://data.fixer.io/api/latest?access_key=f68b13604ac8e570a00f7d8fe7f25e1b&format=1
// Countries: https://restcountries.eu/rest/v2/currency/${currencyCode}

// 1st function getExchangeRate
const getExchangeRate = async (fromCurrency, toCurrency) => {
  const response = await axios.get(
    "http://data.fixer.io/api/latest?access_key=f68b13604ac8e570a00f7d8fe7f25e1b&format=1"
  );
  // Base:EURO
  const rate = response.data.rates;
  const euro = 1 / rate[fromCurrency];
  const exchangeRate = euro * rate[toCurrency];

  if (isNaN(exchangeRate)) {
    throw new Error(`Unable to get currency ${fromCurrency} and ${toCurrency}`);
  }
  // console.log(exchangeRate);
  return exchangeRate;
};
// 2nd function getCountries
const getCountries = async (toCurrency) => {
  try {
    const response = await axios.get(
      `https://restcountries.eu/rest/v2/currency/${toCurrency}`
    );
    let listOfCountries = [];
    response.data.map((country) => {
      listOfCountries.push(country.name);
    });
    return listOfCountries;
  } catch (error) {
    throw new Error(`Unable to get Countries that use ${toCurrency}`);
  }
};
// 3rd convertCurrency
const convertCurrency = async (fromCurrency, toCurrency, amount) => {
  const exchangeRate = await getExchangeRate(fromCurrency, toCurrency);
  const convertedAmount = amount * exchangeRate.toFixed(2);
  const countries = await getCountries(toCurrency);
  return `${amount} ${fromCurrency} is worth ${convertedAmount} ${toCurrency}.You can spend these in folllowing countries:${countries}`;
};
// getExchangeRate('INR','USD');
// getCountries('INR');
convertCurrency("INR", "USD", 350000)
  .then((message) => {
    console.log(message);
  })
  .catch((error) => {
    console.log(error.message);
  });
