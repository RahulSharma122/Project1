import React, { useState } from 'react';

import Chart from "react-apexcharts";
import ReactApexChart from 'react-apexcharts';
import ApexCharts from 'apexcharts';
import "./App.css";
const App = () => {
  const [histogramData, setHistogramData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
 const[btnch, setBtnch] = useState(false);
  const fetchData = async () => {
    setBtnch(true)
    setIsLoading(true);
    try {
      const response = await fetch('https://www.terriblytinytales.com/test.txt');
      const text = await response.text();
      const words = text.split(/\s+/);
      const wordCount = {};
      words.forEach((word) => {
        wordCount[word] = (wordCount[word] || 0) + 1;
      });
      const sortedWords = Object.keys(wordCount).sort(
        (a, b) => wordCount[b] - wordCount[a]
      );
      const top20Words = sortedWords.slice(0, 20).map((word) => ({
        word,
        count: wordCount[word],
      }));
      setHistogramData(top20Words);
      setState((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {
            categories: top20Words.map((data) => data.word)
          }
        },
        series: [
          {
            ...prevState.series[0],
            data: top20Words.map((data) => data.count)
          }
        ]
      }));
    } catch (error) {
      console.error('Error:', error);
    }
    setIsLoading(false);
  }

  const [state, setState] = useState({
    options: {
      chart: {
        id: "basic-bar"
      },
      xaxis: {
        categories: []
      }
    },
    series: [
      {
        name: "Word Count",
        data: []
      },
    ]
  });

  const exportCSV = () => {
    const csvData = histogramData
      .map((data) => `${data.word},${data.count}`)
      .join('\n');
    const csvBlob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const csvURL = URL.createObjectURL(csvBlob);
    const link = document.createElement('a');
    link.href = csvURL;
    link.setAttribute('download', 'histogram.csv');
    link.click();
  };

  return (
    <div className='backgr'>
      <div className='submitbtn'>
       { !btnch && <button onClick={fetchData} disabled={isLoading} className='btn1'>
          Submit
        </button>}
      </div>
      <div>
        {histogramData.length > 0 && (
          <div>
            <h2>Frequency</h2>
            <ReactApexChart
              options={state.options}
              series={state.series}
              type="bar"
              height={290}
            />
          </div>
        )}
        </div>
        <div className='exportbtn'>
          { btnch && <button onClick={exportCSV} className='btn2'>Export</button>}
        </div>
        </div>
      )
    }

export default App;

