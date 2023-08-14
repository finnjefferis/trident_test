"use client";

import styles from "./page.module.css";
import Papa from "papaparse";
import { useState, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Decimation,
} from "chart.js";
import { Line } from "react-chartjs-2";

export default function Home() {
  const [lineData, setLineData] = useState([]);

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Decimation
  );

  const options = {
    responsive: true,
    indexAxis: "x",

    plugins: {
      legend: {
        position: "left",
        // fullSize: true,
        maxHeight: 9999,
        maxWidth: 300,
      },
      title: {
        display: true,
        text: "Trident Telemetry Line Chart",
      },
    },
  };

  const labels = [];

  function buildDatasets(lineData) {
    let cleanData = lineData;
    const datasets = [];

    for (let i = 1; i < lineData.length / 10; i++) {
      // Create a new object without the "Date/Time" key

      const newDataArray = lineData.map((item) => {
        const newItem = { ...item };
        delete newItem["Date/Time"];
        return newItem;
      });

      console.log("new", newDataArray); // The new array of objects without the "Date/Time" key
      console.log(lineData);

      const dataset = {
        label: lineData[i]["Date/Time"],
        data: newDataArray[i],
        showLine: true,
        borderColor: `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
          Math.random() * 256
        )}, ${Math.floor(Math.random() * 256)})`,
        backgroundColor: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
          Math.random() * 256
        )}, ${Math.floor(Math.random() * 256)}, 0.5)`,
      };
      console.log("dataset", dataset);
      datasets.push(dataset);
    }

    return datasets;
  }

  const datasets = buildDatasets(lineData);

  const data = {
    labels,
    datasets,
    parsing: false,
    options: {
      scales: {
        xAxes: [
          {
            type: "linear",
            position: "bottom",
          },
        ],
        yAxes: [
          {
            type: "linear",
          },
        ],
      },
    },
  };

  function handleFile(evt) {
    Papa.parse(evt[0], {
      header: true,
      dynamicTyping: true,
      complete: function (results) {
        console.log(results);
        setLineData(results.data);
      },
    });
  }

  // drag drop file component
  function DragDropFile() {
    // drag state
    const [dragActive, setDragActive] = useState(false);
    // ref
    const inputRef = useRef(null);

    // handle drag events
    const handleDrag = function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
      } else if (e.type === "dragleave") {
        setDragActive(false);
      }
    };

    // triggers when file is dropped
    const handleDrop = function (e) {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files);
      }
    };

    // triggers when file is selected with click
    const handleChange = function (e) {
      e.preventDefault();
      if (e.target.files && e.target.files[0]) {
        handleFile(e.target.files);
      }
    };

    // triggers the input when the button is clicked
    const onButtonClick = () => {
      inputRef.current.click();
    };

    return (
      <form
        id="form-file-upload"
        onDragEnter={handleDrag}
        onSubmit={(e) => e.preventDefault()}
      >
        <div>
          <p>Drag and drop your file here or</p>
          <button className="upload-button" onClick={onButtonClick}>
            Upload a file
          </button>
        </div>
        <input
          ref={inputRef}
          type="file"
          id="input-file-upload"
          multiple={true}
          onChange={handleChange}
        />
        <label
          id="label-file-upload"
          htmlFor="input-file-upload"
          className={dragActive ? "drag-active" : ""}
        ></label>
        {dragActive && (
          <div
            id="drag-file-element"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          ></div>
        )}
      </form>
    );
  }

  return (
    <div>
      <DragDropFile />

      <Line options={options} data={data} />
    </div>
  );
}
