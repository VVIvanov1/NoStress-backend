const asyncHandler = require("express-async-handler");

const Order = require("../models/orderModel");
const Lead = require("../models/leadModel");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

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
// @desc Function to get user id from headers
function getUserId(obj) {
  const jwtoken = obj.split(" ")[1];
  const decoded = jwt.decode(jwtoken, process.env.JWT_SECRET);
  return decoded.id._id;
}
// retrieve my current or closed orders
// aka http://localhost:5000/orders/get-my-orders?closed=true
const getMyOrders = asyncHandler(async (req, res) => {
  let userId = getUserId(req.headers.authorization);
  try {
    const myOrders = await Order.find({ user: userId });
    if (myOrders) {
      myOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      if (!req.query.closed) {
        let currentOrders = myOrders.filter((o) => o.status === "in progress");
        res.status(200).json(currentOrders);
      } else {
        let currentOrders = myOrders.filter((o) => o.status === "closed");
        res.status(200).json(currentOrders);
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});

// @desc Save new order
// @route POST ...../api/newrequest
// @access From website
// const newOrderWeb = asyncHandler(async (req, res) => {
//   console.log(req.body);
//   try {
//     let ress = await saveNewWebOrder(req.body);
//     let lead = await saveNewLead({ order: req.body, orderId: ress._id });
//     res.status(200).json(req.body);
//   } catch (error) {
//     console.log(error);
//   }
// });

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

const saveNewWebOrder = asyncHandler(async (req, res) => {
  // console.log(req.body);
  // res.status(200).json({ message: "ok" });
  try {
    let newOrder = await saveNewWeb(req.body);
    res.status(200).json({ status: "ok" });
  } catch (error) {
    console.error(error);
    res.status(400);
  }
});
// {
// 2022-06-17T15:19:54.543809+00:00 app[web.1]: name: 'PAFNUTY',
// 2022-06-17T15:19:54.543809+00:00 app[web.1]: Phone: '87022936891',
// 2022-06-17T15:19:54.543809+00:00 app[web.1]: tranid: '5380228:3481174361',
// 2022-06-17T15:19:54.543809+00:00 app[web.1]: formid: 'form445829603',
// 2022-06-17T15:19:54.543810+00:00 app[web.1]: formname: 'Borovoe'
// 2022-06-17T15:19:54.543810+00:00 app[web.1]: }
async function saveNewWeb(obj) {
  // let parsed = JSON.parse(Object.keys(obj));

  const ord = new Order({
    page: obj.formname,
    name: obj.name,
    phone: obj.Phone,
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
