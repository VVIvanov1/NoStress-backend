const express = require("express");
const router = express.Router();

const {
  getOrders,
  newOrderWeb,
  newOrderManual,
  getOrder,
  getMyOrders,
} = require("../controllers/orderController");

router.get("/", getOrders);

router.get("/order", getOrder);

router.post("/new", newOrderWeb);

router.post("/new-manual", newOrderManual);

router.get("/get-my-orders", getMyOrders);

module.exports = router;
