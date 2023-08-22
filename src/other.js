import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import './App.css';

function App() {
  const chartContainerRef = useRef(null);
  let chart;
  let areaSeries;
  let candlestickSeries;

  const [candlestickData, setCandlestickData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [iloc,ivalue]=useState(0);
  const [pos,pvalue]=useState(0);
  const [fund,fvalue]=useState(100000);
  const [buy_price,bvalue]=useState(0)
  const [sell_price,svalue]=useState(0);
  const [pl,plvalue]=useState(0);
  const [qnt,qvalue]=useState(1);
  const [cb,cbvalue]=useState(0);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:2000/post", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
          key1: 'value1',
          key2: 'value2'
        })
        });
          
  

        const jsonData = await response.json();
        setCandlestickData(jsonData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!loading) {
      const chartOptions = {
        layout: {
          textColor: 'black',
          background: {
            type: 'solid',
            color: 'white',
          },
        },
      };

      chart = createChart(chartContainerRef.current, chartOptions);

      areaSeries = chart.addAreaSeries({
        lineColor: '#2962FF',
        topColor: '#2962FF',
        bottomColor: 'rgba(41, 98, 255, 0.28)',
      });

    

      candlestickSeries = chart.addCandlestickSeries({
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderVisible: false,
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350',
      });

      // Show candles one by one with a delay of 1 second
      const showCandlesWithDelay = () => {
        let i = 0;
        const interval = setInterval(() => {
          if (i < candlestickData.length) {
            ivalue(i);
            const currentCandle = candlestickData[i];

          


            candlestickSeries.update(currentCandle);
            i++;
          } else {
            clearInterval(interval);
          }
        }, 2000);
      };

      showCandlesWithDelay();

      chart.timeScale().fitContent();

    }
  }, [loading, candlestickData]);
  return (
    <div className="App" style={{backgroundColor:'darksalmon'}}>
      <header style={{
        height:'40px',
        backgroundColor:'greenyellow',
        fontSize:'36px',
        fontFamily:'Roboto, sans-serif'}}>trading simulater </header>



  <div ref={chartContainerRef} style={{ width: '87vw', height: '400px',marginLeft:'5px' }}>   </div></div>)}
export default App