const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment");

let AvailableProductsSchema = new Schema(
  {
    fabricName: {
      type: String,
    },
    fabricContent: {
      type: String,
    },
    fabricColour: {
      type: String,
    },
    dateOfReceiving: {
      type: Date,
    },
    dateOfInspection: {
      type: Date,
    },
    length: {
      type: String,
    },
    afterInspection: {
      type: String,
    },
    id: {
      type: String,
    },
    supplierName: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    published: {
      type: String,
      default: () => moment().format("llll"),
    },
  },
  { strict: false }
);

module.exports = mongoose.model("AvailableProducts", AvailableProductsSchema);
