const express = require("express");
const router = express.Router();

const {
  getOrders,

  newOrderManual,
  getOrder,
  getMyOrders,
  saveNewWebOrder,
} = require("../controllers/orderController");

router.get("/", getOrders);

router.get("/order", getOrder);

router.post("/new", saveNewWebOrder);

router.post("/new-manual", newOrderManual);

router.get("/get-my-orders", getMyOrders);

module.exports = router;
