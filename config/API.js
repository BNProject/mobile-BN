import axios from 'axios';

const BaseURL = 'http://212.237.35.40:3030';
// const BaseURL = 'https://a027c2a621e7.ngrok.io';

const API = axios.create({
  baseURL: BaseURL,
});

export {API, BaseURL};
