'use strict';

import React from 'react';
import store from './store';
import './compute-hash';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import Verifier from './containers/Verifier';

render(
  <Provider store={ store }>
    <Verifier />
  </Provider>,
  document.getElementById('root')
);
