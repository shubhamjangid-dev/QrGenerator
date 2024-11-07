import { getEDC } from "./correctionHandle";
import { getByteData } from "./getByteData";

let length;
let codeword;
let qr;
let fillingOrder;
function makeSquare(i, j) {
  // outer black square
  let row = 0;
  let col = 0;
  while (col < 6) {
    qr[i + row][j + col] = 1;
    col++;
  }
  while (row < 6) {
    qr[i + row][j + col] = 1;
    row++;
  }
  while (col > 0) {
    qr[i + row][j + col] = 1;
    col--;
  }
  while (row > 0) {
    qr[i + row][j + col] = 1;
    row--;
  }
  // inner white square
  row = 1;
  col = 1;
  while (col < 5) {
    qr[i + row][j + col] = 0;
    col++;
  }
  while (row < 5) {
    qr[i + row][j + col] = 0;
    row++;
  }
  while (col > 1) {
    qr[i + row][j + col] = 0;
    col--;
  }
  while (row > 1) {
    qr[i + row][j + col] = 0;
    row--;
  }
  // outer white square
  row = -1;
  col = -1;
  while (col < 7) {
    if (i + row >= 0 && j + col >= 0 && i + row < length && j + col < length) qr[i + row][j + col] = 0;
    col++;
  }
  while (row < 7) {
    if (i + row >= 0 && j + col >= 0 && i + row < length && j + col < length) qr[i + row][j + col] = 0;
    row++;
  }
  while (col >= 0) {
    if (i + row >= 0 && j + col >= 0 && i + row < length && j + col < length) qr[i + row][j + col] = 0;
    col--;
  }
  while (row >= 0) {
    if (i + row >= 0 && j + col >= 0 && i + row < length && j + col < length) qr[i + row][j + col] = 0;
    row--;
  }
  //inner black square
  row = 2;
  while (row < 5) {
    col = 2;
    while (col < 5) {
      qr[i + row][j + col] = 1;
      col++;
    }
    row++;
  }
}
function makePositionSmallSquare(i, j) {
  // outer black square
  let row = 0;
  let col = 0;
  while (col < 4) {
    qr[i + row][j + col] = 1;
    col++;
  }
  while (row < 4) {
    qr[i + row][j + col] = 1;
    row++;
  }
  while (col > 0) {
    qr[i + row][j + col] = 1;
    col--;
  }
  while (row > 0) {
    qr[i + row][j + col] = 1;
    row--;
  }
  // inner white square
  row = 1;
  col = 1;
  while (col < 3) {
    qr[i + row][j + col] = 0;
    col++;
  }
  while (row < 3) {
    qr[i + row][j + col] = 0;
    row++;
  }
  while (col > 1) {
    qr[i + row][j + col] = 0;
    col--;
  }
  while (row > 1) {
    qr[i + row][j + col] = 0;
    row--;
  }
  // black dot
  qr[i + 2][j + 2] = 1;
}
function setFormatBits() {
  qr[8][0] = 1;
  qr[8][1] = 0;
  qr[8][2] = 0;
  qr[8][3] = 0;
  qr[8][4] = 0;
  qr[8][5] = 0;
  qr[8][6] = 1;
  qr[8][6] = 0;
  qr[8][7] = 0;
  qr[8][8] = 0;
  qr[7][8] = 1;
  qr[6][8] = 1;
  qr[5][8] = 1;
  qr[4][8] = 1;
  qr[3][8] = 1;
  qr[2][8] = 1;
  qr[1][8] = 0;
  qr[0][8] = 0;

  qr[8][length - 8] = 1;
  qr[8][length - 7] = 1;
  qr[8][length - 6] = 1;
  qr[8][length - 5] = 1;
  qr[8][length - 4] = 1;
  qr[8][length - 3] = 1;
  qr[8][length - 2] = 0;
  qr[8][length - 1] = 0;

  qr[length - 8][8] = 1;
  qr[length - 7][8] = 0;
  qr[length - 6][8] = 1;
  qr[length - 5][8] = 1;
  qr[length - 4][8] = 1;
  qr[length - 3][8] = 1;
  qr[length - 2][8] = 0;
  qr[length - 1][8] = 1;
}
function setTimingBits() {
  let i = 8;
  let j = 6;
  while (i <= length - 9) {
    qr[i][j] = 1;
    qr[i + 1][j] = 0;
    qr[j][i] = 1;
    qr[j][i + 1] = 0;
    i += 2;
  }
}
function getFillingOrder() {
  let i = length - 1;
  let j = length - 1;
  let dir = -1;
  let fillingOrder = [];
  while (j > -1) {
    if (i < 0) {
      j -= 2;
      i = 0;
      dir = 1;
    }
    if (i == length) {
      j -= 2;
      i = length - 1;
      dir = -1;
    }
    if (j == 6) j--;

    if (qr[i][j] == 255) fillingOrder.push([i, j]);
    j--;
    if (qr[i][j] == 255) fillingOrder.push([i, j]);
    j++;
    i += dir;
  }
  return fillingOrder;
}

function fillQr(url) {
  let fillIndex = 0;
  const byteData = getByteData(url);
  const data = getEDC(byteData, codeword);
  let num = 0;
  for (let i = 0; i < data.length && fillIndex < fillingOrder.length; i++) {
    let val = data[i];
    for (let s = 7; s >= 0 && fillIndex < fillingOrder.length; s--) {
      const [row, col] = fillingOrder[fillIndex];

      // qr[row][col] = num++;
      if (col % 3 == 0) {
        qr[row][col] = !((val >> s) & 1);
      } else {
        qr[row][col] = (val >> s) & 1;
      }
      fillIndex++;
    }
  }
  while (fillIndex < fillingOrder.length) {
    const [row, col] = fillingOrder[fillIndex];
    if (col % 3 == 0) {
      qr[row][col] = 1;
    } else {
      qr[row][col] = 0;
    }
    fillIndex++;
  }
}

function getVersion(urlLength) {
  if (urlLength < 12) {
    codeword = 26;
    return 1;
  } else if (urlLength < 24) {
    codeword = 44;
    return 2;
  } else if (urlLength < 40) {
    codeword = 70;
    return 3;
  } else if (urlLength < 70) {
    codeword = 100;
    return 4;
  } else if (urlLength < 250) {
    codeword = 346;
    return 10;
  }
}
function getQr(url) {
  length = getVersion(url.length) * 4 + 17;
  qr = Array.from({ length }, () => new Uint8Array(length).fill(255));
  fillingOrder = [];
  makeSquare(0, 0);
  makeSquare(length - 7, 0);
  makeSquare(0, length - 7);
  if (length > 21) makePositionSmallSquare(length - 9, length - 9);
  if (length == 57) {
    makePositionSmallSquare(length - 9, 26);
    makePositionSmallSquare(26, length - 9);
    makePositionSmallSquare(26, 26);
    makePositionSmallSquare(4, 26);
    makePositionSmallSquare(26, 4);
  }
  setFormatBits();
  setTimingBits();

  fillingOrder = getFillingOrder();
  fillQr(url);
  // qr.forEach(element => {
  //   console.log(element);
  // });

  // return qr;
  let QrCode = [];
  for (let i = 0; i < length; i++) {
    let row = [];
    for (let j = 0; j < length; j++) {
      row.push(qr[i][j]);
    }
    QrCode.push(row);
  }
  return QrCode;
}
export { getQr, getVersion };
