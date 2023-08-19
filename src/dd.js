
import { useState } from "react";
function D(){ 
let dd;
  async function tt(){ 
    const response = await fetch('http://localhost:2000/');
     var d = await response.json();
     dd=d
     console.log(dd[0].open);}

  async function ss(){await tt();

  }

  ss();
  console.log(dd)
  return(dd)
}
export default D;