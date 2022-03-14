import logo from './logo.svg';
import './App.css';
import React, {useState} from "react"

function App() {
  const [file, setFile] = useState("");
  const [array, setArray] = useState([]);

  const fileReader = new FileReader();

  const handleOnChange = (e) => {
    setFile(e.target.files[0]);
  };

  const csvFileToArray = string => {
    const csvRows = string.split(/\r?\n/);

    const array_values = csvRows.map(i => {
      const values = i.split(", ");
      return values;
    });
    
    setArray(getHighestPair(array_values));
    
  };

  const handleOnSubmit = () => {
    if (file) {
      fileReader.onload = function (event) {
        const text = event.target.result;
        csvFileToArray(text);
      };

      fileReader.readAsText(file);
    }
  };


  function getHighestPair(arr) {
    let pairs = {};
    let daysTogether = {};
    if (arr)
      arr.forEach((el1) => {
        arr.slice(arr.indexOf(el1) + 1, arr.length).forEach((el2) => {
          if (el1[0] !== el2[0]) {
            if (el1[1] === el2[1]) {
              const startDate1 = new Date(el1[2]);
              const endDate1 = el1[3] === "NULL" ? new Date() : new Date(el1[3]);
              const startDate2 = new Date(el2[2]);
              const endDate2 = el2[3] === "NULL" ? new Date() : new Date(el2[3]);
              if (startDate1 <= endDate2 && startDate2 <= endDate1) {
                const start = startDate1 <= startDate2 ? startDate2 : startDate1;
                const end = endDate1 <= endDate2 ? endDate1 : endDate2;
                if (end >= startDate2) {
                  const diffTime = Math.abs(end - start);
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  const x = `${el1[0]}${el2[0]}`;
  
                  if (!daysTogether[x]) Object.assign(daysTogether, { [x]: 0 });
                  daysTogether[x] = 1 * daysTogether[x] + diffDays;
  
                  if (!pairs[x]) Object.assign(pairs, { [x]: [] });
                  pairs[x] = [...pairs[x], [el1[0], el2[0], el1[1], diffDays]];
                }
              }
            }
          }
        });
      });

    return Object.keys(pairs).length !== 0 ? pairs[
      Object.keys(daysTogether).reduce((a, b) =>
        daysTogether[a] > daysTogether[b] ? a : b
      )
    ] : ["No common projects"]
  }


  return (
    <div style={{ textAlign: "center", paddingTop: "40px" }}>
        <input
          type={"file"}
          id={"csvFileInput"}
          accept={".csv"}
          onChange={handleOnSubmit()}
          onInput={handleOnChange}
        />
       
      <br />
        { array[0] === "No common projects" ? (<h1>No pairs</h1>) : (
                <table id='results'>
                <thead>
                    <tr>
                      <th>Employee ID #1</th>
                      <th>Employee ID #2</th>
                      <th>Project ID</th>
                      <th>Days worked</th>
                    </tr>
                </thead>
                <tbody>
                  {array.map((item) => (
                    <tr key={item.id}>
                      {Object.values(item).map((val) => (
                        <td>{val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
                </table>
        )}
    </div>
  );
}

export default App;
