const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");

app.use(express.json());
app.use(express.static(path.join("client/build")));

// Connection URL
const url =
  "mongodb+srv://getachwe:getachwe391@cluster0.yf9a90b.mongodb.net/?retryWrites=true&w=majority";

// Connect to MongoDB
mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

// Define a schema for your data

const MyDataSchema = mongoose.Schema({
  name: String,
  id: String,
  address: String,
  birthdate: Date,
  phone: String,
  mobile: String,
  vaccine1_date: Date,
  vaccine1_manufacturer: String,
  vaccine2_date: Date,
  vaccine2_manufacturer: String,
  positive_test_date: Date,
  recovery_date: Date,
});

// Define a model using your schema
const MyData = mongoose.model("MyData", MyDataSchema);

// Define your API routes
app.get("/api/data", async (req, res) => {
  try {
    // Retrieve all data from your MongoDB collection
    const data = await MyData.find();
    res.json(data);
  } catch (err) {
    console.error("Error retrieving data from MongoDB", err);
    res.status(500).send("Error retrieving data from MongoDB");
  }
});

app.post("/api/data", async (req, res, next) => {
  const {
    name,
    phone,
    mobile,
    address,
    vaccine1_date,
    vaccine2_date,
    vaccine1_manufacturer,
    vaccine2_manufacturer,
    positive_test_date,
    recovery_date,
  } = req.body;

  if (
    !name ||
    !phone ||
    !mobile ||
    !address ||
    !vaccine1_date ||
    !vaccine2_date ||
    !vaccine1_manufacturer ||
    !vaccine2_manufacturer ||
    !positive_test_date ||
    !recovery_date
  ) {
    return res.status(400).send("Please fill in all required fields");
  }
  try {
    // Create a new document in your MongoDB collection
    const newData = new MyData(req.body);

    await newData.save();
    res.send("Data saved successfully");
    console.log(newData);
  } catch (err) {
    console.error("Error saving data to MongoDB", err);
    res.status(500).send("Error saving data to MongoDB");
  }
});

app.delete("/api/data", async (req, res) => {
  try {
    // מוחק את כל המסמכים ממסד הנתונים
    await MyData.deleteMany({});
    res.status(200).send("All MyData deleted successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting MyData");
  }
});

app.get("*", (req, res) => {
  res.sendFile(__dirname + "/client/build/index.html");
});

// Start the server
const port = 4000;
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
