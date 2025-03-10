const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

// Set EJS as the templating engine, define template directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "templates"));

// Serve static files
app.use(express.static(path.join(__dirname, "assets")));

// Fetch data from JSON file
function fetchJSON() {
  let jsonFile = fs.readFileSync("assets/data/data.json", "utf8");
  return JSON.parse(jsonFile);
}

// Route for the homepage
app.get("/", (req, res) => {
  let data = fetchJSON();
  let pageData = data.find((item) => item.page === "index");
  let currentPage = "index";
  console.log(data);
  res.render("layout", { pageData, data, currentPage });
});

// Route for the services page
app.get("/services", (req, res) => {
  let data = fetchJSON();
  let pageData = data.find((item) => item.page === "services");
  let currentPage = "services";
  res.render("layout", { pageData, data, currentPage });
});

// Route for the legal page
app.get("/legals", (req, res) => {
  let data = fetchJSON();
  let pageData = data.find((item) => item.page === "legals");
  let currentPage = "legals";
  res.render("layout", { pageData, data, currentPage });
});

// We can define a custom port in environmental variables, by default its served at 3000
let PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend server up and running at port ${PORT}`);
});
