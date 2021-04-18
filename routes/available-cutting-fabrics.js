const express = require("express");
const AvailableCuttingFabrics = require("../models/AvailableCuttingFabrics");
const router = express.Router();
const path = require("path");
const shortid = require("shortid");
const moment = require("moment");
const CuttingCard = require("../models/CuttingCards");

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

router.get("/", async (req, res) => {
  //Get data from availabe-cutting-fabrics Model
  let data = await AvailableCuttingFabrics.find({}, "-_id -__v")
    .sort({ createdAt: -1 })
    .lean();
  res.render(
    path.join(__dirname, "../", "/views/available-cutting-fabrics.ejs"),
    {
      data,
      moment,
    }
  );
});

router.post("/startTask", checkAuth, async (req, res) => {
  let id = req.body.id;
  let formLength = req.body.length;
  let dateOfCutting = req.body.dateOfCutting;
  let average = req.body.average;
  let deletedCard = await AvailableCuttingFabrics.findOneAndDelete({
    id,
  }).lean();
  let newAvailableCard = {};
  let newCuttingCard = {};
  Object.keys(deletedCard).forEach(function (prop) {
    if (prop != "_id" || prop != "__v") {
      newAvailableCard[prop] = deletedCard[prop];
      newCuttingCard[prop] = deletedCard[prop];
    }
  });

  delete newAvailableCard["_id"];
  delete newAvailableCard["__v"];
  delete newAvailableCard["createdAt"];
  delete newCuttingCard["createdAt"];
  delete newCuttingCard["_id"];
  delete newCuttingCard["__v"];
  newCuttingCard.id = shortid.generate();
  newAvailableCard["length"] = deletedCard["length"] - formLength;
  newCuttingCard["length"] = Number(formLength);
  if (average) {
    newCuttingCard["average"] = average;
  }
  if (newAvailableCard["length"] > 0) {
    let availablePushedCard = await AvailableCuttingFabrics.create(
      newAvailableCard
    );
  }
  if (dateOfCutting.toString().length > 2) {
    newCuttingCard.dateOfCutting = dateOfCutting;
  }
  let cuttingCardsPushedCard = await CuttingCard.create(newCuttingCard);
  res.redirect("/available-fabrics-for-cutting");
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
  let data = await AvailableCuttingFabrics.find(obj, "-_id -__v")
    .sort({ createdAt: -1 })
    .lean();
  res.render(
    path.join(__dirname, "../", "/views/available-cutting-fabrics.ejs"),
    {
      data,
      moment,
    }
  );
});

router.get("/delete/:id", checkAuth, async (req, res) => {
  let id = req.params.id;
  let deletedCard = await AvailableCuttingFabrics.findOneAndDelete({ id: id });
  res.redirect("/available-fabrics-for-cutting");
});

module.exports = router;
