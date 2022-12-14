const express = require("express");
const cors = require("cors");
const app = express();
const jwt = require("jsonwebtoken");
// .env paitece na ????????????
const stripe = require("stripe")(
  "pk_test_51M6B1DFokKCixQB7Y8Z9czvVpjrMle29Y2irFLPNQSdqcVpEPrmRSxwwJM2i8EzhBnIeMuevF1Gx63LCYz1hObUo00FNk82CFQ"
);
console.log(process.env.STRIP_KEY);
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

function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.send("unauthorized access");
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
    if (err) {
      return res.send({ message: "UserNot Valid" });
    }
    req.decoded = decoded;
    next();
  });
}

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
const paymentsCollection = client.db("mobileCollection").collection("payments");

// const update = {
//   $set:{
//     paid: true,
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
    const result = await allProductCollection
      .find({})
      .project({ image: 1 })
      .toArray();
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
    const users = await userCollection.find({ role: "user" }).toArray();
    res.send(users);
  } catch (error) {
    res.send(error.message);
  }
});
app.get("/seller", async (req, res) => {
  try {
    const seller = await userCollection.find({ role: "seller" }).toArray();
    res.send(seller);
  } catch (error) {
    res.send(error.message);
  }
});
// create jwt ----
app.get("/jwtgenaretor/:email", async (req, res) => {
  try {
    const email = req.params.email;
    console.log(email);
    const query = { email: email };
    const user = await userCollection.findOne(query);
    if (user) {
      const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, {
        expiresIn: "10h",
      });
      return res.send({ accessToken: token });
    }
    res.send({ accessToken: "" });
  } catch (error) {
    console.log(error.message);
  }
});
// PROBLAME IS BOGE BRO
app.get("/user/:email", async (req, res) => {
  try {
    const query = { email: req.params.email };
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


app.post("/create-payment-phone", async (req, res) => {
  try {
    const bookingPhone = req.body;
  const price = bookingPhone.price;
  const amount = price * 100;

  const paymentIntent = await stripe.paymentIntents.create({
    currency: "usd",
    amount: amount,
    payment_method_types: ["card"],
  });
  res.send({
    clientSecret: paymentIntent.client_secret,
  });
  } catch (error) {
    res.send(error.message)
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
  }})
app.put("/verified/:id", async (req, res) => {
  try {
    const query = { _id: ObjectId(req.params.id) };
    const options = { upsert: true };
    const updated = {
      $set: {
        verified: true
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
    console.log(req.params.id);
    const query = { _id: ObjectId(req.params.id) };
    const result = await userCollection.deleteOne(query);
    res.send(result);
  } catch (error) {
    res.send(error.message);
  }
});

// login

// this is update section

// this is delete section

app.listen(port, () => console.log(`${port} is running now`));
