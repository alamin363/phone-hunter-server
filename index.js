const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
require("dotenv").config();
require("colors");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.MONGODB_ID}:${process.env.MONGODB_PASS}@cluster0.ha2hum3.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    client.connect();
    console.log("database connect");
  } catch (error) {
    console.log(error.message);
  }
};
run();
const resaleDeviceCollection = client
  .db("mobileCollection")
  .collection("devices");
const userCollection = client.db("mobileCollection").collection("user");
const sellerCollection = client.db("mobileCollection").collection("seller");
const productsCollection = client.db("mobileCollection").collection("devices");
const bookingCollection = client.db("mobileCollection").collection("booking");
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

// const updateDoc = {
//   $set:{
//     paid: true,
//     transactionId: data.transactionId
//   }
// }

// this is gate section

app.get("/", (req, res) => {
  try {
    res.send("phone server is running");
  } catch (error) {
    res.send(error.message);
  }
});

app.get("/category", async(req, res) => {
  try {

    // const query = { category: 82488123 }
    const query = { }
    const products = await productsCollection.find(query).toArray();
    res.send(products)

  } catch (error) {
    res.send(error.message)
  }
});
app.get("/category/:id", async(req, res) => {
  try {
    const query = {_id:ObjectId(req.params.id) }
    const AllData = await productsCollection.find(query).toArray();
    res.send(AllData)

  } catch (error) {
    res.send(error.message)
  }
});
app.get("/bookingProduct", async (req, res) => {
  try {
    const email = req.query.email
    const query = {users: email}
    const result = await bookingCollection.find(query).toArray();
    res.send(result)
  } catch (error) {
    res.send(error.message)
  }
})

// this is post section
app.post("/user", async (req, res) => {
  try {
    const result = await userCollection.insertOne(req.body);
    res.send(result);
  } catch (error) {
    res.send(error.message);
  }
});
app.post("/bookingProduct", async (req, res) => {
  try {
    console.log(req.body)
    const result = await bookingCollection.insertOne(req.body);
    res.send(result)
  } catch (error) {
    res.send(error.message)
  }
});


// login

// this is update section

// this is delete section

app.listen(port, () => console.log(`${port} is running now`));
