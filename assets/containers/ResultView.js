'use strict';

import { connect } from 'react-redux';
import ResultView from '../components/ResultView';
import signatureTypes from '../signature-types';
import BN from 'bignumber.js';

const FULL_PRECISION = 18;
BN.config({
  DECIMAL_PLACES: FULL_PRECISION 
});

const formatBNOutput = (v) => {
  v = v.toFormat && v.toFormat(18) || v;
  v = v.replace(/,/g, '');
  const i = v.lastIndexOf('.');
  if (~i) v = v.replace(/0+$/, '').replace(/\.$/, '');
  return v;
};

const castToPrecisionString = (bn, e) => formatBNOutput(new BN(bn).div('1' + Array(e + 1).join(0)).toFormat(FULL_PRECISION));

const ethToken = {
  symbol: 'ETH',
  precision: 18,
  address: '0x' + Array(41).join(0)
};

const amountSellIndex = signatureTypes.find(({ name }) => name.toLowerCase() === 'order').inputs.findIndex((v) => v.id === 'amountSell');
const amountBuyIndex = signatureTypes.find(({ name }) => name.toLowerCase() === 'order').inputs.findIndex((v) => v.id === 'amountBuy');
const insertPriceAt = amountSellIndex + 1;

export default connect(({
  result,
  tokens,
  error
}) => {
  tokens = [ ethToken ].concat(tokens);
  return {
    result: result && result.map((payload, callIndex, ary) => Object.assign({}, payload, {
      data: payload.data.map((v, valueIndex, dataValues) => {
        let swap, pair, sigType = signatureTypes.find(({ name }) => payload.call);
        if (sigType.rearg && sigType.rearg[payload.type] && (pair = sigType.rearg[payload.type].find((arg) => v.id === arg[(swap = 0)] || v.id === arg[(swap = 1)]))) v = dataValues.find(({ id }) => id === pair[swap ^ 1]);
        const {
          value,
          adjustTo,
          id
        } = v;
        let token, adjustedValue;
        let valueFormat = /^[0-9]+$/.test(String(value)) && ((adjustTo && ((token = tokens.find(({ address }) => address.toLowerCase() === debug(dataValues.find((v) => v.id === adjustTo).value))) && ((adjustedValue = castToPrecisionString(value, token.precision)) + ' ' + token.symbol) || (value + ' (no token data found)'))) || (callIndex === 0 && id === 'amount' && ((token = tokens.find(({ address }) => address.toLowerCase() === ary[1].data[1].value)) && ((adjustedValue = castToPrecisionString(value, token.precision)) + ' ' + token.symbol) || (value + ' (no token data found)')))) || value;
        if (/^0x[0-9a-fA-F]{40}$/.test(String(value)) && (token = tokens.find(({ address }) => address.toLowerCase() === value))) valueFormat += ' (' + token.symbol + ')';
        return Object.assign({}, v, {
          value: valueFormat,
          adjustedValue,
          id,
          originalValue: value,
          hasToken: Boolean(token)
        });
      })[payload.call.toLowerCase() === 'order' && 'reduce' || 'valueOf']((r, data, i, ary) => i === insertPriceAt ? (ary[amountSellIndex].hasToken && ary[amountBuyIndex].hasToken && r.concat([{
        name: 'Price',
        value: (payload.type === 'buy' && formatBNOutput(new BN(ary.find(({ id }) => id === 'amountSell').adjustedValue).div(ary.find(({ id }) => id === 'amountBuy').adjustedValue).toFormat(8)) || formatBNOutput(new BN(ary.find(({ id }) => id === 'amountBuy').adjustedValue).div(ary.find(({ id }) => id === 'amountSell').adjustedValue)))
      }, data]) || r.concat([{
        name: 'Price',
        value: 'Token data not available for price calculation'
      }, data])) : r.concat(data), [])
    })),
    error
  };
}, () =>({}))(ResultView);
