import express from "express";
import Product from "../models/Product.js";

const router = express.Router();
router.post("/", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
