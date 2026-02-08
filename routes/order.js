import express from "express";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";

const router = express.Router();
router.post("/", async (req, res) => {
  try {
    const { userId } = req.body;
    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    const order = await Order.create({
      userId,
      items: cart.items,
      totalAmount: cart.totalPrice,
    });
    res.status(201).json({
      message: "Order placed successfully",
      order,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .populate("items.productId", "title price image");

    if (orders.length === 0) {
      return res.status(200).json({ message: "No orders found" });
    }

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
