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
        const response = await fetch("https://fsserver.onrender.com/post", {
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
       const r=parseInt(100*Math.random());

      candlestickSeries.setData(candlestickData.slice(1,r));

      // Show candles one by one with a delay of 1 second
      const showCandlesWithDelay = () => {
        let i = r;
        const interval = setInterval(() => {
          if (i < candlestickData.length) {
            ivalue(i);
            const currentCandle = candlestickData[i];

          


            candlestickSeries.update(currentCandle);
            i++;
          } else {
            clearInterval(interval);
          }
        }, 1500);
      };

      showCandlesWithDelay();

      chart.timeScale().fitContent();

    }
  }, [loading, candlestickData]);


  useEffect(() => {
    plFunction();
  }, [buy_price, pos, iloc, qnt, candlestickData, sell_price]);

  function buy(){
    var price=parseFloat(candlestickData[iloc].close);
    // console.log(parseInt(fund/price))
    if(pos===0 ){ if(fund>(Math.abs(qnt)*price)){ 
   
    pvalue(parseInt(pos)+parseInt(qnt));
    bvalue((price));
    fvalue((fund-(price*Math.abs(qnt))));}
    else{
      alert("qnt less =<"+parseInt(fund/price))
    }

  }
   else if(pos<0){
    var price=parseFloat(candlestickData[iloc].close);
    bvalue((price));
    fvalue(parseFloat(fund+(sell_price+(sell_price-price))*Math.abs(pos)));
    cbvalue(parseFloat(cb+pl));
    pvalue(0);

    plvalue(0);


   }

  }
  function setmaxq(){
    var num=(fund/parseInt(parseFloat(candlestickData[iloc].close)));
    qvalue(parseInt(num-(num/10)));

    document.getElementById('qnt').value=parseInt(num-(num/10))
  }


  function sell(){
    var price=parseFloat(candlestickData[iloc].close);

    // console.log(parseInt(fund/price));
    if(pos===0){ if(fund>(Math.abs(qnt)*price)){ 
    pvalue(parseInt(pos)-parseInt(qnt));
    svalue(price);
    fvalue((fund-(price*Math.abs(qnt))));
  }
    
    else{
      alert("qnt less =<"+parseInt(fund/price))
    }
  }
   else if(pos>0){
    var price=parseFloat(candlestickData[iloc].close);
    svalue((price));
    fvalue(parseFloat(fund+(price*Math.abs(pos))));
    cbvalue(parseFloat(cb+pl));
    plvalue(0);
    pvalue(0);



   }

  }
  function setq(){
    var qv=document.getElementById('qnt').value;
    qvalue(qv);
    var price=parseFloat(candlestickData[iloc].close);

    var tn= (price*Math.abs(qnt));
   
  }

function plFunction(){ 

  if(pos>0){ 
    plvalue(((parseFloat(candlestickData[iloc].close)-buy_price)*Math.abs(pos)));
     }
  else if(pos<0){ 
    plvalue(((parseFloat(sell_price-parseFloat(candlestickData[iloc].close)))*Math.abs(pos)));
     }}


  function squareOff(){
    if (pos>0){
      var price=parseFloat(candlestickData[iloc].close);
      svalue(price);
      fvalue((fund+(price*Math.abs(pos))));
      pvalue(parseInt(0));
      cbvalue(parseFloat(cb+pl));
      plvalue(0);
    }
    else if(pos<0){
      var price=parseFloat(candlestickData[iloc].close);
    bvalue(price);
    fvalue(parseFloat(fund+(sell_price+(sell_price-price))*Math.abs(pos)));
    pvalue((parseInt(0)));

    cbvalue(parseFloat(cb+pl));
    plvalue(0);
    }
  }
function onSubmit(){
  console.log('hy submit');
  const fetchData = async () => {
    try {
      const response = await fetch("https://fsserver.onrender.com/post", {
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


}


return (
  <div className="App" style={{ backgroundColor: 'darksalmon' }}>
      <header className=" text-center text-bg-light bg-info" style={{ height: '40px', fontSize: '30px', fontFamily: 'Roboto, sans-serif' }}>Trading Simulator</header>

      <div className="d-flex border border-warning p-1">
          <div className="me-4">pos: {pos}</div>
          <div className="me-4">fund: {fund}</div>
          <div className={`me-4 ${pl < 0 ? 'bg-danger' : 'bg-success'}`}>unrealized pl: {pl.toFixed(2)}</div>
          <div className="me-4">order qnt: {qnt}</div>
          <div className={`bg-${cb < 0 ? 'danger' : 'success'} me-4`}>realized pl: {cb.toFixed(2)}</div>
      </div>

      <div className="mt-3 d-flex">
          <div ref={chartContainerRef} className="flex-grow-1 bg-info" style={{ height: '400px', marginLeft: '5px' }}></div>

          <div className="bg-warning">
              <div className="bg-light p-3 rounded-bottom mb-2">
                  <label>Symbol</label>
                  <h3>Nifty-50</h3>
              </div>

              <div className="bg-secondary p-2">
                  <label className="mt-3">Enter Quantity</label>
                  <input onChange={setq} className="form-control mb-2" style={{ maxWidth: '8rem' }} id="qnt" type="number" max={2} min={1} />
                  <button className="btn btn-primary mb-3" onClick={setmaxq}>Max Quantity</button>
              </div>

              <div className="text-center">
                  <button className="btn btn-success me-2" onClick={buy}>Buy</button>
                  <button className="btn btn-danger" onClick={sell}>Sell</button>
              </div>

              <button onClick={squareOff} className="btn btn-dark mt-2">Square Off</button>
              <div className="bg-success mt-2">Buy: {buy_price.toFixed(2)}</div>
              <div className="bg-danger">Sell: {sell_price.toFixed(2)}</div>
          </div>
      </div>
  </div>
);





}

export default App;
