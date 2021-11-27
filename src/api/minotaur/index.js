import axios from 'axios';
import { store } from '../../redux/store';

import { SERVER_URL } from '../../utilities/config';

const minotaur = axios.create({ baseURL: SERVER_URL });

minotaur.interceptors.request.use((config) => {
  const token = store.getState().user.token;
  if (config.headers.Authorization == null && token != null) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default minotaur;
