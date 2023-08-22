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
        let i = 500;
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


}


  return (
    <div className="App" style={{backgroundColor:'darksalmon'}}>
      <header style={{
        height:'40px',
        backgroundColor:'greenyellow',
        fontSize:'36px',
        fontFamily:'Roboto, sans-serif'}}>trading simulater </header>

      <div style={{display:'flex',border:"solid 2px yellow"}}> pos:<div style={{marginRight:" 30px"}}>{pos}</div>   fund:<div   style={{marginRight:" 30px"}}>{fund}</div> unrealizese pl:<div style={{backgroundColor:pl<0?"red":"green" ,marginRight:" 30px"}} >{pl.toFixed(2)}</div> order qnt:<div style={{marginRight:" 30px"}}> {qnt}</div> realized pl: <div style={{backgroundColor:cb<0?"red":"green" ,marginRight:" 30px"}}>{cb.toFixed(2)}</div></div>
     

  <div style={{marginTop:'20px',display:"flex"}}>

  <div ref={chartContainerRef} style={{ width: '87vw', height: '400px',marginLeft:'5px' }}>   </div>
  

    <div style={{backgroundColor:'chocolate'}}> 
    <div style={{backgroundColor:'ThreeDFace' ,padding:'10px',borderRadius:"10px",marginBottom:'10px'}}>
      <label>symbol</label><br/>
      <input type='text' value={'not workes'} style={{width:"10vw"}} ></input>


      <input type='submit' onClick={onSubmit} style={{backgroundColor:'burlywood'}}></input>

    </div>

    <div style={{backgroundColor:'gray'}}>
          <label style={{marginTop:'30px'}} >enter qnty</label>
          <input  onChange={setq} style={{width:'8vw',borderColor:"darkslategrey"}} id='qnt' type='number' max={2} min={1}></input>    <button style={{backgroundColor:'Highlight',borderRadius:'8px'}} onClick={setmaxq}>Maxqnt</button><br/>

        </div>
          <div>
           <button style={{backgroundColor:'green',width:'5vw',marginTop:'10px'}} onClick={buy}>Buy</button>     
           <button style={{backgroundColor:'red',width:'5vw'}} onClick={sell}>Sell</button>
           </div>
           <br/>
           <button onClick={squareOff} style={{color:'red',backgroundColor:'black' ,width:'10vw',height:'30px' ,border:"solid red"}}>square off</button>
           <br/>
           <h4 style={{backgroundColor:'green'}}>buy:{buy_price.toFixed(2)}</h4><br/>
           <h4 style={{backgroundColor:'red'}}>sell:{sell_price.toFixed(2)}</h4>

        
    </div>

</div>
{/* <input id='qnt' onChange={setq}>enter qnt</input> */}
\    </div>
  );
}

export default App;
