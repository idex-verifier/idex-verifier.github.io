'use strict';

import ActionButton from '../components/ActionButton';
import { connect } from 'react-redux';

export default connect(() => ({}), (dispatch) => ({
  onVerify() {
    dispatch({
      type: 'VERIFY_PAYLOAD'
    });
  }
}))(ActionButton);
