'use strict';

import React from 'react';
import { title } from 'change-case';

export default ({
  result,
  error
}) => <div className="results-container">
  { error && <div className="error">{ error }</div> }
  { !error && result && <div>
    { result.length === 2 && <div className="notification">{ debug(result[1].hashes.raw) === result[0].data[0].value && <div className="match">The order being filled matches the computed hash</div> || <div className="mismatch">The order hash you are signing does not match the supplied order parameters, do not sign this message!</div> }</div> }
    <div className="full-info">
      <h2>Full Hash Information</h2>
      { result.map(({
          type,
          call,
          data,
          hashes
        }, i, ary) => <div key={ i }>
          { call.toLowerCase() === 'order' && <h3>Maker { type } Order</h3> || <h3>Taker { type } Order</h3> }
          { data.map(({
              name,
              value
            }, i) => <div key={ i }>
               <div><span className="label">{ name }:</span><br/>{ value }</div>
            </div>) }
          <div>{ ary.length > 1 && call.toLowerCase() === 'order' && <span className="label">Taker verification hash: </span> || <span className="label">Raw sha3: </span> }<span>{ hashes.raw }</span></div>
          <div><span className="label">Ledger (sha256 of raw hash):</span><br/>{ hashes.sha256 }</div>
          <div><span className="label">MetaMask (salted sha3 of raw hash):</span><br/>{ hashes.salted }</div>
          <hr />
        </div>) }
      </div>
  </div> }
</div>;
   
