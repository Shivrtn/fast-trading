










const express=require('express');
const app =express();

const cors=require('cors');
app.use(cors());

const fs = require('fs');
const filePath=  'C:\\Users\\shiv\\Desktop\\New folder\\jupiter notebook\\all strategy position\\financial_data.json';
app.get("/",(req,res)=>{ 
  console.log('logged in')
  
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading JSON file:', err);
    return;
  }

  try {
    const jsonData = JSON.parse(data);
    res.json(jsonData);

    // You can now work with the parsed JSON data as a JavaScript object
  } catch (parseError) {
    console.error('Error parsing JSON:', parseError);
  }
});
})
app.listen(2000,()=>console.log('accessed'));



// Serve static files from a directory (optional)
// app.use(express.static(path.join(__dirname, 'public')));

// Define an API endpoint to serve JSON data
// app.get('/api/data', (req, res) => {
   
// });

// app.listen(port, () => {
//     console.log(`Server is listening on port ${port}`);
// });
