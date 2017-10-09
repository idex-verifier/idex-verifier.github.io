'use strict';

import { connect } from 'react-redux';
import Input from '../components/Input';

export default connect(({
  rawData
}) => ({
  rawData
}), (dispatch) => ({
  onSetData(evt) {
    dispatch({
      type: 'SET_DATA',
      payload: evt.target.value
    });
  }
}))(Input);
