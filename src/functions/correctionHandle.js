const LOG = new Uint8Array(256);
const EXP = new Uint8Array(256);
for (let exponent = 1, value = 1; exponent < 256; exponent++) {
  value = value > 127 ? (value << 1) ^ 285 : value << 1;
  LOG[value] = exponent % 255;
  EXP[exponent % 255] = value;
}
// console.log(LOG);

function mul(a, b) {
  return a && b ? EXP[(LOG[a] + LOG[b]) % 255] : 0;
}
function div(a, b) {
  return EXP[(LOG[a] + LOG[b] * 254) % 255];
}

function polyMul(poly1, poly2) {
  // This is going to be the product polynomial, that we pre-allocate.
  // We know it's going to be `poly1.length + poly2.length - 1` long.
  const coeffs = new Uint8Array(poly1.length + poly2.length - 1);

  // Instead of executing all the steps in the example, we can jump to
  // computing the coefficients of the result
  for (let index = 0; index < coeffs.length; index++) {
    let coeff = 0;
    for (let p1index = 0; p1index <= index; p1index++) {
      const p2index = index - p1index;
      // We *should* do better here, as `p1index` and `p2index` could
      // be out of range, but `mul` defined above will handle that case.
      // Just beware of that when implementing in other languages.
      coeff ^= mul(poly1[p1index], poly2[p2index]);
    }
    coeffs[index] = coeff;
  }
  return coeffs;
}

function polyRest(dividend, divisor) {
  const quotientLength = dividend.length - divisor.length + 1;
  // Let's just say that the dividend is the rest right away
  let rest = new Uint8Array(dividend);
  for (let count = 0; count < quotientLength; count++) {
    // If the first term is 0, we can just skip this iteration
    if (rest[0]) {
      const factor = div(rest[0], divisor[0]);
      const subtr = new Uint8Array(rest.length);
      subtr.set(polyMul(divisor, [factor]), 0);
      rest = rest.map((value, index) => value ^ subtr[index]).slice(1);
    } else {
      rest = rest.slice(1);
    }
  }
  return rest;
}

function getGeneratorPoly(degree) {
  let lastPoly = new Uint8Array([1]);
  for (let index = 0; index < degree; index++) {
    lastPoly = polyMul(lastPoly, new Uint8Array([1, EXP[index]]));
  }
  return lastPoly;
}

function getEDC(data, codewords) {
  const degree = codewords - data.length;
  const messagePoly = new Uint8Array(codewords);
  messagePoly.set(data, 0);
  const poly = polyRest(messagePoly, getGeneratorPoly(degree));
  return [...data, ...poly];
}

export { getEDC };

// console.log(getEDC(data, 44));
