'use strict';

import React from 'react';
export default ({
  onVerify
}) => <div className="action-button">
  <button onClick={ onVerify }>Hash Transaction</button>
  <button>Reset</button>
</div>
