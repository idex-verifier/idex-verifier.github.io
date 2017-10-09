'use strict';

import TokenList from '../components/TokenList';
import { connect } from 'react-redux';

export default connect(({
  tokens,
  newToken,
  editingToken
}) => ({
  tokens,
  newToken,
  editingToken
}), (dispatch) => ({
  onUpdateTokenSymbol(token, evt) {
    dispatch({
      type: 'EDIT_TOKEN',
      payload: Object.assign({}, token, { symbol: evt.target.value })
    });
  },
  onUpdateTokenAddress(token, evt) {
    dispatch({
      type: 'EDIT_TOKEN',
      payload: Object.assign({}, token, { address: evt.target.value })
    });
  },
  onUpdateTokenPrecision(token, evt) {
    dispatch({
      type: 'EDIT_TOKEN',
      payload: Object.assign({}, token, { precision: +evt.target.value })
    });
  },
  onUpdateNewTokenSymbol(token, evt) {
    dispatch({
      type: 'EDIT_NEW_TOKEN',
      payload: Object.assign({}, token, { symbol: evt.target.value })
    });
  },
  onUpdateNewTokenAddress(token, evt) {
    dispatch({
      type: 'EDIT_NEW_TOKEN',
      payload: Object.assign({}, token, { address: evt.target.value })
    });
  },
  onUpdateNewTokenPrecision(token, evt) {
    dispatch({
      type: 'EDIT_NEW_TOKEN',
      payload: Object.assign({}, token, { precision: +evt.target.value })
    });
  },
  onSaveToken(token, evt) {
    evt.preventDefault();
    dispatch({
      type: 'UPDATE_TOKEN',
      payload: token
    });
  },
  onInsertToken(token, evt) {
    evt.preventDefault();
    dispatch({
      type: 'INSERT_TOKEN',
      payload: token
    });
  },
  onCancelEditToken() {
    dispatch({
      type: 'CANCEL_EDIT_TOKEN'
    });
  },
  onDeleteToken(token) {
    dispatch({
      type: 'DELETE_TOKEN',
      payload: token
    });
  },
  onEditToken(token) {
    dispatch({
      type: 'EDIT_TOKEN',
      payload: token
    });
  }
}))(TokenList);
  
