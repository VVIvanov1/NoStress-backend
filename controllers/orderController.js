const asyncHandler = require("express-async-handler");

const Order = require("../models/orderModel");
const Lead = require("../models/leadModel");

// @desc    Get orders
// @route   GET ...../api/
// @access  Public
const getOrders = asyncHandler(async (req, res) => {
  // res.status(200).json({ message: "test_" });
  const orders = await Order.find({});

  if (!orders) {
    res.status(400);
    throw new Error("No orders found");
  } else {
    res.status(200).json(orders);
  }
});

// @desc Save new order
// @route POST ...../api/newrequest
// @access From website
const newOrderWeb = asyncHandler(async (req, res) => {
  try {
    let ress = await saveNewOrder(req.body, "Web");
    // console.log(ress);

    res.status(200).json({ status: "ok" });
  } catch (error) {
    console.log(error);
  }
});

// @desc Save new manual order
// @route POST ...../api/new-manual
// @access From website
const newOrderManual = asyncHandler(async (req, res) => {
  try {
    let ress = await saveNewOrder(req.body, "Manual");
    let lead = await saveNewLead(req.body);
    res.status(200).json({ status: "ok" });
  } catch (error) {
    console.log(error);
  }
});

// @desc Function to save new order to Db
async function saveNewOrder(obj, source) {
  const ord = new Order({
    user: obj.user,
    assignee: null,
    page: obj.page,
    url: obj.url,
    source: source,
    name: obj.name,
    phone: obj.phone,
    status: "New",
    comments: [],
  });
  await ord.save();
}
async function saveNewLead(obj) {
  let lead = await Lead.findOne({ phone: obj.phone });
  if (!lead) {
    let newLead = await Lead.create({
      name: obj.name,
      phone: obj.phone,
      orders: [obj.page],
    });
    console.log("it is done!");
  }
}
// @desc Function to retrieve speciffic order by ID
// @route GET /api/:id
const getOrder = asyncHandler(async (req, res) => {
  try {
    let orderId = req.query.id;

    const order = await Order.findById(orderId);

    res.json(order);
  } catch (error) {
    console.log(error);
  }
});

module.exports = {
  getOrders,
  newOrderWeb,
  newOrderManual,
  getOrder,
  //   getNewOrders,
  //   getCurrentOrders,
  //   getClosedOrders,
  //   acceptOrder,
  //   getMyOrders,
  //   commentMyOrder,
  //   delegateMyOrder,
};
