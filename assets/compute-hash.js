'use strict';

import {
  subscribeToEvent,
  dispatch
} from './store';
import signatureTypes from './signature-types';
import method from 'lodash/method';
import difference from 'lodash/difference';
import Web3 from 'web3';
import sprintf from 'sprintf';
const { soliditySha3 } = new Web3().utils;
import {
  hashPersonalMessage,
  toBuffer,
  sha256,
  bufferToHex
} from 'ethereumjs-util';

const tradePayloadLength = signatureTypes.find(({ name }) => name.toLowerCase() === 'trade').inputs.length;

const orderTradePayloadLength = signatureTypes
  .filter(({ name }) => ['order', 'trade'].includes(name.toLowerCase()))
  .reduce((r, v) => r + v.inputs.length, 0);

const possibleMarketTypes = ['buy', 'sell'];

subscribeToEvent('VERIFY_PAYLOAD', (_, {
  rawData
}) => {
  const split = rawData.split(/\s+/g).map(method('trim')).filter(Boolean);
  let marketTypes = [];
  let firstMarketType = split[0].toLowerCase();
  // trades and orders must include buy or sell as the first token
  if (possibleMarketTypes.includes(firstMarketType)) {
    marketTypes = [ firstMarketType, difference(possibleMarketTypes, [ firstMarketType ])[0] ];
    split.splice(0, 1);
  }
  // trades concatenated with orders, handle one special case
  const chunked = split.length === orderTradePayloadLength ? [ split.slice(0, tradePayloadLength), split.slice(tradePayloadLength) ] : [ split ];
  const types = chunked.map((v) => signatureTypes.find(({ inputs }) => inputs.length === v.length)).filter(Boolean);
  if (!types.length) return dispatch({
    type: 'LOAD_ERROR',
    payload: 'Your payload must contain the same number of whitespace separated arguments as exists in the arguments to an IDEX signature function'
  });
  try {
    const hashes = types.map((v, callIndex) => {
      const raw = soliditySha3(...v.inputs.map(({ t }, valueIndex) => ({ t, v: chunked[callIndex][valueIndex] })));
      const sha256sum = debug(bufferToHex(sha256(toBuffer(raw))));
      const salted = bufferToHex(hashPersonalMessage(toBuffer(raw)));
      return { raw, sha256: sha256sum, salted };
    });
    let value, token;
    dispatch({
      type: 'LOAD_RESULT',
      payload: debug(types.map(({ inputs, name }, callIndex) => ({
        type: marketTypes[callIndex],
        call: name,
        data: inputs.map(({ type, name, id, adjustTo, stringMap }, valueIndex, ary) => ({
          type,
          name: sprintf(name, stringMap && stringMap[marketTypes[callIndex]] || marketTypes[callIndex]),
          id, 
          adjustTo,
          value: chunked[callIndex][valueIndex]
        })),
        hashes: hashes[callIndex]
      })))
    });
  } catch (err) {
    console.log(err.stack);
    dispatch({
      type: 'LOAD_ERROR',
      payload: err.message
    });
  }
});
