//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const config = require('config');


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

const db = config.get('mongoURI');

mongoose.connect(db, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
  .then(() => console.log('mongodb connected...'))
  .catch(err => console.log(err));

const reportSchema = {
  userID: { type: [String] },
  marketID: { type: String },
  marketName: { type: String },
  cmdtyID: { type: String },
  marketType: { type: String },
  cmdtyName: { type: String },
  priceUnit: { type: String },
  convFctr: { type: Number },
  price: { type: Number },
};

const Report = mongoose.model("Report", reportSchema);

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.get("/post", function (req, res) {
  res.render("post");
})
app.get("/get", function (req, res) {
  res.render("get");
})

app.route("/reports")

  .get(function (req, res) {
    Report.find(function (err, foundReports) {
      if (!err) {
        res.send(foundReports);
      } else {
        res.send(err);
      }
    });
  })

  .post(function (req, res) {

    const newReport = new Report({
      userID: req.body.userID,
      marketID: req.body.marketID,
      marketName: req.body.marketName,
      cmdtyID: req.body.cmdtyID,
      marketType: req.body.marketType,
      cmdtyName: req.body.cmdtyName,
      priceUnit: req.body.priceUnit,
      convFctr: req.body.convFctr,
      price: Number(req.body.price)/Number(req.body.convFctr)
    });

    //console.log(newReport);

    Report.findOne({ marketID: req.body.marketID, cmdtyID:req.body.cmdtyID }, function (err, foundReport) {
      if (foundReport) {
        //console.log(foundReport.price);
        var id = foundReport._id;
        const n = foundReport.userID.length;
        foundReport.userID.push(req.body.userID);
        foundReport.price = (n * Number(foundReport.price) + Number(req.body.price)/Number(req.body.convFctr)) / (n + 1);

        foundReport.save();
        //console.log(foundReport.price);
        output = {
          status: "Successfully updated the price",
          reportID: id
        }
        res.send(output);
      }
      else {
        newReport.save(function (err) {
          if (err) {
            res.send(err);
          } else {
            output = {
              status: "Successfully added a new report",
              reportID: newReport._id
            }
            res.send(output);
          }
        });
      }
    });

  })

app.route("/reports/:reportID")
  .get(function (req, res) {
    const id = req.params.reportID;
    Report.findOne({ _id: id }, function (err, foundReport) {
      if (foundReport) {
        output = {
          "_id": foundReport._id,
          "cmdtyName": foundReport.cmdtyName,
          "cmdtyID": foundReport.cmdtyID,
          "marketID": foundReport.marketID,
          "marketName": foundReport.marketName,
          "users": foundReport.userID,
          "timestamp": Date.now(),
          "priceUnit": "Kg",
          "price": foundReport.price
        }
        //console.log("match found");
        res.send(output);
      } else {
        //console.log("didnt match");
        res.send("No report with matching id found!");
      }
    });
  })
  .post(function (req, res) {
    Report.findOne({ _id: req.body.reportID }, function (err, foundReport) {
      if (foundReport) {
        output = {
          "_id": foundReport._id,
          "cmdtyName": foundReport.cmdtyName,
          "cmdtyID": foundReport.cmdtyID,
          "marketID": foundReport.marketID,
          "marketName": foundReport.marketName,
          "users": foundReport.userID,
          "timestamp": Date.now(),
          "priceUnit": "Kg",
          "price": foundReport.price
        }
        //console.log("match found");
        res.send(output);
      } else {
        //console.log("didnt match");
        res.send("No report with matching id found!");
      }
    });
  })


app.route("/marketAndCommodity")

  .post(function (req, res) {
    Report.findOne({ marketID: req.body.marketID, cmdtyID: req.body.cmdtyID }, function (err, foundReport) {
      if (foundReport) {
        output = {
          "_id": foundReport._id,
          "cmdtyName": foundReport.cmdtyName,
          "cmdtyID": foundReport.cmdtyID,
          "marketID": foundReport.marketID,
          "marketName": foundReport.marketName,
          "users": foundReport.userID,
          "timestamp": Date.now(),
          "priceUnit": "Kg",
          "price": foundReport.price
        }
        res.send(output);
      } else {
        res.send("No report with matching market and commodity found!");
      }
    });
  })


app.listen(3000, function () {
  console.log("Server started on port 3000");
});
