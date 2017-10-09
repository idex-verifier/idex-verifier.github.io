'use strict';

import React from 'react';
import Input from '../containers/Input';
import ActionButton from '../containers/ActionButton';
import ResultView from '../containers/ResultView';
import TokenList from '../containers/TokenList';

export default () => <div className="main clearfix">
  <header className="header">
    <h1>IDEX Transaction Hash Verifier</h1>
  </header>

  <div className="left-container">
    <Input />
    <ActionButton />
    <TokenList />
  </div>

  <div className="right-container">
    <ResultView />
  </div>
  <div className="clearfix"></div>
  <div>IDEX-Verifier Source Code: <a href="https://github.com/idex-verifier/idex-verifier.github.io" target="_blank">https://github.com/idex-verifier/idex-verifier.github.io</a></div>
</div>;
