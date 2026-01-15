export const API_BASE_URL = __DEV__
  ? 'http://192.168.40.42:8000/api'
  : 'https://api.menara-agung.com/v1';

export const API_TIMEOUT = 30000;

export const API_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};
