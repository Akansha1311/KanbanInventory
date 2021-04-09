const express = require("express");
const router = express.Router();
const path = require("path");
const mongoose = require("mongoose");
const shortid = require("shortid");
//Models
const CuttingCards = require("../models/CuttingCards");

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

router.get("/", checkAuth, (req, res) => {
  res.render(path.join(__dirname, "../", "/views/cutting-issuing-card.ejs"));
});

router.post("/", checkAuth, async (req, res) => {
  let newCard = {};
  Object.keys(req.body).forEach(function (prop) {
    newCard[prop] = req.body[prop].trim();
  });
  newCard.id = shortid.generate();
  let card = await CuttingCards.create(newCard);
  res.redirect("/cutting-issuing-card");
});

module.exports = router;
