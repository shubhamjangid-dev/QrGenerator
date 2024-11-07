const getByteData = url => {
  const messageByte = new Uint8Array(url.length + 2);

  messageByte[0] = 4;
  messageByte[1] = url.length;
  for (let i = 0; i < url.length; i++) {
    messageByte[i + 2] = url.charCodeAt(i);
  }

  let byteData = new Uint8Array(url.length + 2);
  for (let i = 0; i <= url.length; i++) {
    byteData[i] = (messageByte[i] << 4) + (messageByte[i + 1] >> 4);
  }
  byteData[url.length + 1] = messageByte[url.length + 1] << 4;
  return byteData;
};

export { getByteData };
