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
  let fetchedData = fs.readFileSync("assets/data/data.json", "utf8");
  let parsedData = JSON.parse(fetchedData);
  //Check if data is an array
  if (!Array.isArray(parsedData)) {
    throw new Error("Fetched JSON is not an array!");
  }
  //Iterate through all items, check for certain keys
  let requiredKeys = [
    "page",
    "nav",
    "route",
    "title",
    "description",
    "events",
    "resources",
  ];
  parsedData.forEach((eachItem) => {
    requiredKeys.forEach((eachKey) => {
      if (!Object.prototype.hasOwnProperty.call(eachItem, eachKey)) {
        throw new Error(`${eachKey} is missing for a page data!`);
      }
    });
  });

  //Check if events and resources are both arrays for all items
  parsedData.forEach((eachItem) => {
    if (!Array.isArray(eachItem.events)) {
      throw new Error("Fetched JSON's events key is not an array!");
    }
    if (!Array.isArray(eachItem.resources)) {
      throw new Error("Fetched JSON's resources key is not an array!");
    }
  });

  //Check each item of events key, look for date, text and image keys
  requiredKeys = ["date", "text", "image"];
  parsedData.forEach((eachPage) => {
    eachPage.events.forEach((eachEvent) => {
      requiredKeys.forEach((eachKey) => {
        if (!Object.prototype.hasOwnProperty.call(eachEvent, eachKey)) {
          throw new Error(
            `${eachKey} is missing for an event in ${eachPage.page} page !`
          );
        }
      });
    });
  });

  //Check each resource for name and link
  requiredKeys = ["name", "link"];
  parsedData.forEach((eachPage) => {
    eachPage.resources.forEach((eachResource) => {
      requiredKeys.forEach((eachKey) => {
        if (!Object.prototype.hasOwnProperty.call(eachResource, eachKey)) {
          throw new Error(
            `${eachKey} is missing for an resource in ${eachPage.page} page !`
          );
        }
      });
    });
  });

  return parsedData;
}

// Route for the homepage
app.get("/", (req, res) => {
  let data = fetchJSON();
  let pageData = data.find((item) => item.page === "index");
  let currentPage = "index";
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
