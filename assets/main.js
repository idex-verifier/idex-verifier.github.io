'use strict';

import 'babel-polyfill';
import 'console-polyfill';
import './application';
import store from './store';
import './style/styles.css';
import identity from 'lodash/identity';

if (process.env.NODE_ENV === 'development') Object.assign(window, store, {
  debug: (v) => (console.log(v), v)
});
else window.debug = identity;
