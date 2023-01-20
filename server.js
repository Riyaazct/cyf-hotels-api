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

// GET HOTELS

app.get("/hotels/", (req, res) => {
  pool
    .query("SELECT * FROM hotels")
    .then((result) => res.json(result.rows))
    .catch((error) => {
      console.error(error);
      res.status(500).json(error);
    });
});

// GET HOTEL BY ID
// EXERCISE 2

app.get("/hotels/:hotelId", (req, res) => {
  const hotelId = req.params.hotelId;

  pool
    .query("SELECT * FROM hotels WHERE id=$1", [hotelId])
    .then((result) => res.json(result.rows))
    .catch((error) => {
      console.error(error);
      res.status(500).json(error);
    });
});

// CREATE NEW HOTEL (ref week 3 SQL syllabus)
// EXERCISE 1

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
            console.error(error);
            res.status(500).json(error);
          });
      }
    });
}); // end of create new hotel

// CREATE NEW CUSTOMER
// EXERCISE 1

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
            console.error(error);
            res.status(500).json(error);
          });
      }
    });
});

// GET ALL CUSTOMERS ORDERED BY NAME
// EXERCISE 2
app.get("/customers", (req, res) => {
  const query = "SELECT * FROM customers ORDER BY name";
  pool
    .query(query)
    .then((result) => res.json(result.rows))
    .catch((error) => {
      console.log(error);
      res.status(500).json(error);
    });
});

// GET CUSTOMER BY ID
// EXERCISE 2

app.get("/customers/:id", (req, res) => {
  const customerId = req.params.id;

  pool
    .query("SELECT * from customers where id=$1", [customerId])
    .then((result) => res.json(result.rows))
    .catch((error) => {
      console.error(error);
      res.status(500).json(error);
    });
});

// GET BOOKINGS FOR CUSTOMER BY ID
//EXERCISE 2

app.get("/customers/:customerId/bookings", (req, res) => {
  const customerId = req.params.customerId;

  pool
    .query(
      `select b.checkin_date, b.nights as "number of nights", h.name as "hotel name", h.postcode 
       from customers c
       inner join bookings b 
       on b.customer_id = c.id
       inner join hotels h
       on h.id = b.hotel_id
       where c.id = $1`,
      [customerId]
    )
    .then((result) => res.json(result.rows))
    .catch((error) => {
      console.error(error);
      res.status(500).json(error);
    });
});

// PORT

app.listen(port, function () {
  console.log(
    `Server is listening on port ${port}. Ready to accept requests!`
  );
});
