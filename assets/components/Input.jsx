'use strict';

import React from 'react';

export default ({
  rawData,
  onSetData
}) => <div className="input-data">
  <h2>Input Transaction Data</h2>
  <textarea value={ rawData } onChange={ onSetData }></textarea>
</div>;
