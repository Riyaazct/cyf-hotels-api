const express = require("express");
const app = express();
const port = process.env.PORT || 3001;
const { Pool } = require("pg");

app.use(express.json());

const pool = new Pool({
  user: "riyaaz",
  host: "dpg-ce3qiskgqg4c9hg7eop0-a.oregon-postgres.render.com",
  database: "cyf_hotels_dheb",
  password: "0z5obwjPD37C4kxGbV68pkNn4V6a2fpo",
  port: 5432,
  ssl: { rejectUnauthorized: false },
});

app.get("/hotels", (req, res) => {
  pool
    .query("SELECT * FROM hotels")
    .then((result) => res.json(result.rows))
    .catch((error) => {
      console.error(error);
      res.status(500).json(error);
    });
});

// CREATE NEW HOTEL (ref week 3 SQL syllabus)
app.post("/hotels", (req, res) => {
  // store queries in respective variables
  const newHotelName = req.body.name;
  const newHotelRooms = req.body.rooms;
  const newHotelPostcode = req.body.postcode;

  // check that data passed is positive integer
  if (!Number.isInteger(newHotelRooms) || newHotelRooms <= 0) {
    return res
      .status(400)
      .send("The number of rooms should be a positive integer.");
  }
  pool
    // check that the name for hotel being created isn't already created
    .query("SELECT * FROM hotels WHERE name=$1", [newHotelName])
    .then((result) => {
      // if result returns and its length is greater than zero then there is a hotel with the same name.
      if (result.rows.length > 0) {
        return res
          .status(400)
          .send("An hotel with the same name already exists!");
      } else {
        const query =
          "INSERT INTO hotels (name, rooms, postcode) VALUES ($1, $2, $3)";
        pool
          .query(query, [
            newHotelName,
            newHotelPostcode,
            newHotelRooms,
          ])
          .then(() => res.send("Hotel created"))
          .catch((error) => {
            console.log(error);
            res.status(500).json(error);
          });
      }
    });
}); // end of create new hotel

// GET ALL CUSTOMERS

app.get("/customers", (req, res) => {
  const query = "SELECT * FROM customers";
  pool
    .query(query)
    .then((result) => res.json(result.rows))
    .catch((error) => {
      console.log(error);
      res.status(500).json(error);
    });
});

// CREATE NEW CUSTOMER

app.post("/customers", (req, res) => {
  const newCustomerName = req.body.name;
  const newCustomerEmail = req.body.email;
  const newCustomerAddress = req.body.address;
  const newCustomerCity = req.body.city;
  const newCustomerPostcode = req.body.postcode;
  const newCustomerCountry = req.body.country;

  pool
    .query("SELECT * FROM customers WHERE name=$1", [newCustomerName])
    .then((result) => {
      if (result.rows.length > 0) {
        return res
          .status(400)
          .send("A Customer with the same name already exists");
      } else {
        const query =
          "INSERT INTO customers (name, email, address, city, postcode, country) VALUES ($1,$2,$3,$4,$5,$6)";
        pool
          .query(query, [
            newCustomerName,
            newCustomerEmail,
            newCustomerAddress,
            newCustomerCity,
            newCustomerPostcode,
            newCustomerCountry,
          ])
          .then(() => res.send("Customer created"))
          .catch((error) => {
            console.log(error);
            res.status(500).json(error);
          });
      }
    });
});

app.listen(port, function () {
  console.log(
    `Server is listening on port ${port}. Ready to accept requests!`
  );
});
