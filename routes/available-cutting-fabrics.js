const express = require("express");
const AvailableCuttingFabrics = require("../models/AvailableCuttingFabrics");
const router = express.Router();
const path = require("path");
const moment = require("moment");

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
