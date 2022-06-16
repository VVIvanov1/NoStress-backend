const asyncHandler = require("express-async-handler");

const Order = require("../models/orderModel");
const Lead = require("../models/leadModel");
const User = require("../models/userModel");

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
const getMyOrders = asyncHandler(async (req, res) => {
  const user = req.params.user;
  const myOrders = await Order.find(user);

  res.json(myOrders);
});

// @desc Save new order
// @route POST ...../api/newrequest
// @access From website
const newOrderWeb = asyncHandler(async (req, res) => {
  try {
    let ress = await saveNewWebOrder(req.body);
    res.status(200).json(req.body);
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
    let lead = await saveNewLead({ order: req.body, orderId: ress._id });
    res.status(200).json(ress);
  } catch (error) {
    console.log(error);
  }
});
async function saveNewWebOrder(obj) {
  console.log(obj);
  let parsed = obj;
  console.log(parsed);
  const ord = new Order({
    page: parsed.destination,
    name: parsed.name,
    phone: parsed.phone,
    status: "new",
    source: "Web",
  });
  await ord.save();
  return ord;
}

// @desc Function to save new order to Db
async function saveNewOrder(obj, source) {
  const user = await User.findOne({ email: obj.auth.email });
  let date = new Date().toLocaleDateString("ru", { timeZone: "Asia/Almaty" });
  let hours = new Date().getHours();
  let minutes = new Date().getMinutes();
  const ord = new Order({
    user: user._id,
    assignee: null,
    page: obj.destination,
    url: null,
    source: source,
    name: obj.name,
    phone: obj.phone,
    status: "in progress",
    comments: obj.comment
      ? [
          {
            text: obj.comment,
            user: user.name,
            date: `${date}, ${hours}:${minutes}`,
          },
        ]
      : [],
  });
  await ord.save();
  return ord;
}
async function saveNewLead(obj) {
  let lead = await Lead.findOne({ phone: obj.phone });
  if (!lead) {
    let newLead = await Lead.create({
      name: obj.name,
      phone: obj.phone,
      orders: [{ destination: obj.order.destination, order: obj.orderId }],
    });
  } else {
    lead.orders = [
      ...lead.orders,
      { destination: obj.order.destination, order: obj.orderId },
    ];
    await lead.save();
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
  getMyOrders,
  saveNewWebOrder,
  //   getNewOrders,
  //   getCurrentOrders,
  //   getClosedOrders,
  //   acceptOrder,
  //   getMyOrders,
  //   commentMyOrder,
  //   delegateMyOrder,
};
