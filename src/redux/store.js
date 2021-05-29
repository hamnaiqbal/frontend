import { createStore } from 'redux';
import { loginReducer } from './reducer';

export const store = createStore(loginReducer);
