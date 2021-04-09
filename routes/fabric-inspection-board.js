const express = require("express");
const router = express.Router();
const path = require("path");
const KanbanCard = require("../models/KanbanCard");
const FabricInspectionBoardInProgress = require("../models/FabricInspectionBoardInProgress");
const FabricInspectionBoardCompleted = require("../models/FabricInspectionBoardCompleted");
let NotificationBoard = require("../models/NotificationBoard");
let AvailableCuttingFabrics = require("../models/AvailableCuttingFabrics");
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

//Method = GET
//Route = /fabric-inspection-board
router.get("/", async (req, res) => {
  let Kanbandata = await KanbanCard.find({}, "-_id -__v").lean().limit(5);
  let inProgressData = await FabricInspectionBoardInProgress.find(
    {},
    "-_id -__v"
  ).lean();
  let completedData = await FabricInspectionBoardCompleted.find({}, "-_id -__v")
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();
  res.render(path.join(__dirname, "../", "/views/fabric-inspection-board"), {
    data: Kanbandata,
    inProgress: inProgressData,
    completed: completedData,
    moment,
  });
});

router.get("/:id", checkAuth, async (req, res) => {
  let id = req.params.id;
  let deletedCard = await KanbanCard.findOneAndDelete({ id: id }).lean();
  let newInProgressCard = {};
  Object.keys(deletedCard).forEach(function (prop) {
    if (prop != "_id" || prop != "__v")
      newInProgressCard[prop] = deletedCard[prop];
  });
  let inProgressCard = await FabricInspectionBoardInProgress.create(
    newInProgressCard
  );
  res.redirect("/fabric-inspection-board");
});

router.get("/completed/:id", checkAuth, async (req, res) => {
  let id = req.params.id;
  let deletedCard = await FabricInspectionBoardInProgress.findOneAndDelete({
    id: id,
  }).lean();
  let newCompletedCard = {};
  Object.keys(deletedCard).forEach(function (prop) {
    if (prop != "_id" || prop != "__v")
      newCompletedCard[prop] = deletedCard[prop];
  });
  let completedCard = await FabricInspectionBoardCompleted.create(
    newCompletedCard
  );
  // don't push the cards to cutting Board TODO. rather push them to available cutting fabrics
  let availableCuttingFabricsCard = await AvailableCuttingFabrics.create(
    newCompletedCard
  );

  newCompletedCard.dept = "fabric";
  delete newCompletedCard._id;
  let notificationData = {
    dept: "One task completed by Fabric Inspection Department",
  };
  let notifiction = await NotificationBoard.create(notificationData);

  res.redirect("/fabric-inspection-board");
});

router.get("/edit/:id", async (req, res) => {
  let id = req.params.id;
  let currentCard = await FabricInspectionBoardInProgress.findOne(
    {
      id: id,
    },
    "-_id -__v"
  ).lean();
  res.render(path.join(__dirname, "../", "/views/edit-fabric-card.ejs"), {
    data: currentCard,
  });
});

router.post("/edit/:id", async (req, res) => {
  let id = req.params.id;
  let deletedCard = await FabricInspectionBoardInProgress.findOneAndDelete({
    id: id,
  }).lean();
  let newCompletedCard = {};
  Object.keys(req.body).forEach(function (prop) {
    newCompletedCard[prop] = req.body[prop].trim();
  });
  let completedCard = await FabricInspectionBoardCompleted.create(
    newCompletedCard
  );
  let notificationData = {
    dept: "One task completed by Fabric Inspection Department",
  };

  let availableCuttingFabricsCard = await AvailableCuttingFabrics.create(
    newCompletedCard
  );
  let notification = await NotificationBoard.create(notificationData);

  res.redirect("/fabric-inspection-board");
});

module.exports = router;
