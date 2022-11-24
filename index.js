const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb'); 
const port = process.env.PORT || 5000;
require("dotenv").config();
require("colors");

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.MONGODB_ID}:${process.env.MONGODB_PASS}@cluster0.ha2hum3.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async() =>{
  try {
    client.connect()
    console.log("database connect");
  } catch (error) {
    console.log(error.message)
  }
}
run();
const resaleDevice = client.db("mobileCollection").collection("devices");
/*  
// get the items
app.get('/product')
app.get('/product/:id')
// post the items
app.post('/product')
// update the items
app.put('/product')
app.put('/product/:id')
// delete the items
app.delete('product/:id);
*/


// this is gate section

app.get("/", (req, res) => {
  try {
    res.send("phone server is running");
  } catch (error) {
    res.send(error.message);
  }
});

// this is post section
app.post("/user", (req, res) => {
  try {
    const { user } = req.body;

  } catch (error) {
    res.send(error.message);
  }
});

// login 


// this is update section

// this is delete section

app.listen(port, () => console.log(`${port} is running now`));
