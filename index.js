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
const allProductCollection = client
  .db("mobileCollection")
  .collection("allProduct");
const categoryCollection = client.db("mobileCollection").collection("category");
const AdvertiseCollection = client
  .db("mobileCollection")
  .collection("Advertise");
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

app.get("/category", async (req, res) => {
  try {
    const result = await categoryCollection.find({}).toArray();
    res.send(result);
  } catch (error) {
    res.send(error.message);
  }
});

app.get("/category/:id", async (req, res) => {
  try {
    const query = { catagory: req.params.id };
    const AllData = await allProductCollection.find(query).toArray();
    res.send(AllData);
  } catch (error) {
    res.send(error.message);
  }
});
app.get("/myproduct", async (req, res) => {
  try {
    const email = req.query.email;
    const query = { email: email };
    const result = await allProductCollection.find(query).toArray();
    res.send(result);
  } catch (error) {
    res.send(error.message);
  }
});
app.get("/product", async (req, res) => {
  try {
    const result = await allProductCollection.find({}).project({image: 1}).toArray();
    res.send(result);
  } catch (error) {
    res.send(error.message);
  }
});
app.get("/bookingProduct", async (req, res) => {
  try {
    const email = req.query.email;
    const query = { users: email };
    const result = await bookingCollection.find(query).toArray();
    res.send(result);
  } catch (error) {
    res.send(error.message);
  }
});
app.get("/user", async (req, res) => {
  try {
    const users = await userCollection.find({}).toArray();
    res.send(users);
  } catch (error) {
    res.send(error.message);
  }
});
// PROBLAME IS BOGE BRO
app.get("/user/:email", async (req, res) => {
  try {
    const query = {email: req.params.email}
    const user = await userCollection.findOne(query);
    res.send(user);
  } catch (error) {
    res.send(error.message);
  }
});
app.get("/Advertise", async (req, res) => {
  try {
    const result = await AdvertiseCollection.find({}).toArray();
    res.send(result);
  } catch (error) {
    res.send({ error: error.message });
  }
});

// this is post section
app.post("/user", async (req, res) => {
  try {
    console.log(req.body);
    const result = await userCollection.insertOne(req.body);
    res.send(result);
  } catch (error) {
    res.send(error.message);
  }
});
app.post("/bookingProduct", async (req, res) => {
  try {
    const product = req.body;
    const result = await bookingCollection.insertOne(product);
    res.send(result);
  } catch (error) {
    res.send(error.message);
  }
});

app.post("/Advertise", async (req, res) => {
  try {
    // console.log(req.body);
    const result = await AdvertiseCollection.insertOne(req.body);
    res.send(result);
  } catch (error) {
    res.send({ error: error.message });
  }
});

app.put("/admin/:id", async (req, res) => {
  try {
    // const query = {}
    // const user = await userCollection.findOne(query);

    // if (user?.role !== 'admin') {
    //     return res.status(403).send({ message: 'forbidden access' })
    // }

    const query = { _id: ObjectId(req.params.id) };
    const options = { upsert: true };
    const updated = {
      $set: {
        role: "admin",
        isAdmin: true,
      },
    };
    const result = await userCollection.updateOne(query, updated, options);
    res.send(result);
  } catch (error) {
    res.send(error.message);
  }
});

app.post("/postdata", async (req, res) => {
  try {
    const result = await allProductCollection.insertOne(req.body);
    res.send(result);
  } catch (error) {
    res.send(error.message);
  }
});

app.delete("/product/:id", async (req, res) => {
  try {
    const query = { _id: ObjectId(req.params.id) };
    const result = await allProductCollection.deleteOne(query);
    res.send(result);
  } catch (error) {
    res.send(error.message);
  }
});

app.delete("/ads/:id", async (req, res) => {
  try {
    const query = { id: req.params.id };
    const result = await AdvertiseCollection.deleteOne(query);
    res.send(result);
  } catch (error) {
    res.send(error.message);
  }
});
// delete user and seller by admin
app.delete("/usersseler/:id", async (req, res) => {
  try {
    const query = { _id: ObjectId(req.params.id )};
    // const result = await userCollection.deleteOne(query);
    // res.send(result);
  } catch (error) {
    res.send(error.message);
  }
});

// login

// this is update section

// this is delete section

app.listen(port, () => console.log(`${port} is running now`));
