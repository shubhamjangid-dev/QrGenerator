import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { getQr, getVersion } from "./functions/qr";
function App() {
  const [url, setUrl] = useState("");
  const [size, setSize] = useState(21);
  const [data, setData] = useState(null);
  const create = () => {
    const code = getQr(url);
    setSize(getVersion(url.length) * 4 + 17);
    setData(code);
  };

  return (
    <div className="max-w-screen-lg min-h-screen bg-gray-200 mx-auto py-10">
      <h1 className="text-4xl">Qr Generator</h1>
      <div className="max-w-96 flex flex-col mx-auto my-3 space-y-2">
        <input
          className=" w-600 p-2 rounded-md"
          placeholder="enter url"
          value={url}
          onChange={e => {
            setUrl(e.target.value);
          }}
        />
        <button
          className=" w-600 bg-black text-white rounded-md py-2"
          onClick={create}
        >
          Generate
        </button>
      </div>
      <div
        className={`max-w-[${12 * size}px] grid ${size == 21 ? "grid-cols-21" : size == 25 ? "grid-cols-25" : size == 29 ? "grid-cols-29" : size == 33 ? "grid-cols-33" : "grid-cols-57"} mx-auto my-3`}
      >
        {data &&
          data.map(row =>
            row.map(ele => (
              <div
                key={Math.random()}
                className={`w-3 h-3 text-[8px]${ele & 1 ? " bg-black text-white" : " bg-white"}`}
              ></div>
            ))
          )}
      </div>
    </div>
  );
}

export default App;
