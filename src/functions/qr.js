import { getEDC } from "./correctionHandle";
import { getByteData } from "./getByteData";

length = 2 * 4 + 17;
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

  qr[8][17] = 1;
  qr[8][18] = 1;
  qr[8][19] = 1;
  qr[8][20] = 1;
  qr[8][21] = 1;
  qr[8][22] = 1;
  qr[8][23] = 0;
  qr[8][24] = 0;

  qr[17][8] = 1;
  qr[18][8] = 0;
  qr[19][8] = 1;
  qr[20][8] = 1;
  qr[21][8] = 1;
  qr[22][8] = 1;
  qr[23][8] = 0;
  qr[24][8] = 1;
}
function setTimingBits() {
  let i = 8;
  let j = 6;
  while (i <= 16) {
    qr[i][j] = 1;
    qr[i + 1][j] = 0;
    qr[j][i] = 1;
    qr[j][i + 1] = 0;
    i += 2;
  }
}
function getFillingOrder() {
  let i = 24;
  let j = 24;
  let dir = -1;
  let fillingOrder = [];
  while (j > -1) {
    if (i < 0) {
      j -= 2;
      i = 0;
      dir = 1;
    }
    if (i == 25) {
      j -= 2;
      i = 24;
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
  const data = getEDC(byteData, 44);
  let num = 0;
  for (let i = 0; i < data.length && fillIndex < fillingOrder.length; i++) {
    let val = data[i];
    for (let s = 7; s >= 0; s--) {
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

function getQr(url) {
  qr = Array.from({ length }, () => new Uint8Array(length).fill(255));
  fillingOrder = [];
  makeSquare(0, 0);
  makeSquare(18, 0);
  makeSquare(0, 18);
  makePositionSmallSquare(16, 16);
  setFormatBits();
  setTimingBits();

  fillingOrder = getFillingOrder();
  fillQr(url);
  // qr.forEach(element => {
  //   console.log(element);
  // });

  // return qr;
  let QrCode = [];
  for (let i = 0; i < 25; i++) {
    let row = [];
    for (let j = 0; j < 25; j++) {
      row.push(qr[i][j]);
    }
    QrCode.push(row);
  }
  return QrCode;
}
export { getQr };
