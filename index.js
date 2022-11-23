const express = require("express");
const cors = require("cors");
const app = express();

const port = process.env.PORT || 5000;
require("dotenv").config();
require("colors");

app.use(cors());
app.use(express.json());

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

// this is update section

// this is delete section

app.listen(port, () => console.log(`${port} is running now`));
