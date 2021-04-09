const router = require("express").Router();
const path = require("path");
let moment = require("moment");

//Models
let AnalysePerformance = require("../models/AnalysePerformance");

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
  let data = await AnalysePerformance.find({}, "-_id -__v")
    .sort({ createdAt: -1 })
    .lean();
  res.render(path.join(__dirname, "../", "/views/analyse"), {
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
  let data = await AnalysePerformance.find(obj, "-_id -__v")
    .sort({ createdAt: -1 })
    .lean();
  res.render(path.join(__dirname, "../", "/views/analyse.ejs"), {
    data,
    moment,
  });
});

router.get("/delete/:id", checkAuth, async (req, res) => {
  let id = req.params.id;
  let deletedCard = await AnalysePerformance.findOneAndDelete({ id: id });
  res.redirect("/analyze");
});

module.exports = router;
