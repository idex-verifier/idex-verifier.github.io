'use strict';

import React from 'react';

export default ({
  newToken,
  editingToken,
  tokens,
  onUpdateTokenSymbol,
  onUpdateTokenAddress,
  onUpdateTokenPrecision,
  onUpdateNewTokenSymbol,
  onUpdateNewTokenAddress,
  onUpdateNewTokenPrecision,
  onSaveToken,
  onInsertToken,
  onCancelEditToken,
  onDeleteToken,
  onEditToken
}) => <div className="token-container clearfix">
  <div className="add-token-container">
    <h2>Save New Token</h2>
    <form className="add-form" onSubmit={ onInsertToken.bind(null, newToken) }>
      <label htmlFor="new-symbol">Symbol</label>
        <input type="text" value={ newToken.symbol || '' } onChange={ onUpdateNewTokenSymbol.bind(null, newToken) } id="new-symbol" />
      <label htmlFor="new-address">Address</label>
        <input type="text" value={ newToken.address || '' } onChange={ onUpdateNewTokenAddress.bind(null, newToken) } id="new-address" />
      <label htmlFor="new-precision">Precision</label>
        <input type="text" value={ newToken.precision || '' } onChange={ onUpdateNewTokenPrecision.bind(null, newToken) } id="new-precision" />
      <input className="ui--button" type="submit" value="Save Token" />
    </form>
  </div>
  <hr />
  <div className="saved-token-container">
    <h2>Saved Tokens</h2>
    { tokens.length && <table>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Address</th>
            <th>Precision</th>
            <th>Edit</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          { tokens.map((v, i) => !v.editing && <tr key={ i }>
              <td>{ v.symbol }</td>
              <td>{ v.address }</td>
              <td>{ v.precision }</td>
              <td><a onClick={ onEditToken.bind(null, v) }>Edit</a></td>
              <td><a onClick={ onDeleteToken.bind(null, v) }>Remove</a></td>
            </tr> || <tr key={ i }>
              <td><input type="text" value={ editingToken.symbol } onChange={ onUpdateTokenSymbol.bind(null, editingToken) } /></td>
              <td><input type="text" value={ editingToken.address } onChange={ onUpdateTokenAddress.bind(null, editingToken) } /></td>
              <td><input type="text" value={ editingToken.precision } onChange={ onUpdateTokenPrecision.bind(null, editingToken) } /></td>
              <td><a onClick={ onSaveToken.bind(null, editingToken) }>Save</a> | <a onClick={ onCancelEditToken.bind(null, editingToken) }>Cancel</a></td>
            </tr>) }
        </tbody>
      </table> || <div>You have no tokens saved yet</div> }
    </div>
</div>;
