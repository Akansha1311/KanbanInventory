const express = require("express");
const CuttingCards = require("../models/CuttingCards");
const router = express.Router();
const path = require("path");
const moment = require("moment");

//Model(s)
let CuttingBoardTodo = require("../models/cuttingBoardTodo");

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
  let data = await CuttingCards.find({}, "-_id -__v")
    .sort({ createdAt: -1 })
    .lean();
  res.render(path.join(__dirname, "../", "/views/cutting-cards.ejs"), {
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
  let data = await CuttingCards.find(obj, "-_id -__v")
    .sort({ createdAt: -1 })
    .lean();
  res.render(path.join(__dirname, "../", "/views/cutting-cards.ejs"), {
    data,
    moment,
  });
});

router.get("/start/:id", checkAuth, async (req, res) => {
  let id = req.params.id;
  let deletedCard = await CuttingCards.findOneAndDelete({ id: id }).lean();
  let newCuttingTodoCard = {};
  Object.keys(deletedCard).forEach(function (prop) {
    if (prop != "_id" || prop != "__v")
      newCuttingTodoCard[prop] = deletedCard[prop];
  });
  let inProgressCard = await CuttingBoardTodo.create(newCuttingTodoCard);
  res.redirect("/cutting-cards");
});

router.get("/delete/:id", checkAuth, async (req, res) => {
  let id = req.params.id;
  let deletedCard = await CuttingCards.findOneAndDelete({ id: id });
  res.redirect("/cutting-cards");
});

module.exports = router;
