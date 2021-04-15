const express = require("express");
const router = express.Router();
const path = require("path");
const mongoose = require("mongoose");
const shortid = require("shortid");
const moment = require("moment");
//Models
const AvailableProducts = require("../models/AvailableProducts");
const AnalysePerformance = require("../models/AnalysePerformance");
const KanbanCard = require("../models/KanbanCard");

function checkAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    let data = req.flash("message")[0];
    res.render(path.join(__dirname, "../", "/views/login"), {
      message: "",
      data,
    });
  }
}

router.get("/form", checkAuth, (req, res) => {
  res.render(path.join(__dirname, "../", "/views/fabric-sourcing-form.ejs"));
});

router.post("/form", checkAuth, async (req, res) => {
  let newCard = {};
  Object.keys(req.body).forEach(function (prop) {
    newCard[prop] = req.body[prop];
  });
  newCard.id = shortid.generate();
  let availablecard = await AvailableProducts.create(newCard);
  let analyzeCard = await AnalysePerformance.create(newCard);
  res.redirect("/fabric-sourcing/form");
});

router.get("/available-fabrics", async (req, res) => {
  let data = await AvailableProducts.find({}, "-_id -__v")
    .sort({ createdAt: -1 })
    .lean();
  res.render(path.join(__dirname, "../", "/views/availableProducts.ejs"), {
    data,
    moment,
  });
});

router.post("/filter", async (req, res) => {
  let obj = {};
  Object.keys(req.body).forEach(function (prop) {
    if (req.body[prop] && prop != "dateOfReceiving") {
      // obj[prop] = req.body[prop];
      obj[prop] = { $regex: new RegExp(req.body[prop], "i") };
    }
    if (req.body[prop] && prop == "dateOfReceiving") {
      obj[prop] = req.body[prop];
    }
  });
  let data = await AvailableProducts.find(obj, "-_id -__v")
    .sort({ createdAt: -1 })
    .lean();
  res.render(path.join(__dirname, "../", "/views/availableProducts.ejs"), {
    data,
    moment,
  });
});

router.get("/delete/:id", checkAuth, async (req, res) => {
  let id = req.params.id;
  let deletedCard = await AvailableProducts.findOneAndDelete({ id: id });
  res.redirect("/fabric-sourcing/available-fabrics");
});

router.post("/startTask", checkAuth, async (req, res) => {
  let id = req.body.id;
  let formLength = req.body.length;
  let date = req.body.date;
  let deletedCard = await AvailableProducts.findOneAndDelete({ id }).lean();
  let newAvailableCard = {};
  let newFabricInspectionCard = {};
  Object.keys(deletedCard).forEach(function (prop) {
    if (prop != "_id" || prop != "__v") {
      newAvailableCard[prop] = deletedCard[prop];
      newFabricInspectionCard[prop] = deletedCard[prop];
    }
  });

  delete newAvailableCard["_id"];
  delete newAvailableCard["__v"];
  delete newFabricInspectionCard["_id"];
  delete newFabricInspectionCard["__v"];
  newFabricInspectionCard.id = shortid.generate();
  newAvailableCard["length"] = deletedCard["length"] - formLength;
  newFabricInspectionCard["length"] = Number(formLength);
  if (newAvailableCard["length"] > 0) {
    let availablePushedCard = await AvailableProducts.create(newAvailableCard);
  }
  if (date.toString().length > 2) {
    newFabricInspectionCard.dateOfInspection = date;
  }
  let fabricPushedCard = await KanbanCard.create(newFabricInspectionCard);
  res.redirect("/fabric-sourcing/available-fabrics");
});

module.exports = router;
