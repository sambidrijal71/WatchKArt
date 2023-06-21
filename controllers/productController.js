import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import orderModel from "../models/orderModel.js";
import fs from 'fs';
import slugify from "slugify";
import braintree from 'braintree';
import dotenv from 'dotenv'

dotenv.config()

export const createProductController = async (req, res) => {
  try {
    const { name, description, price, quantity, category, shipping } = req.fields;
    const { photo } = req.files;

    switch (true) {
      case !name:
        return res.status(200).send({ success: false, message: "Product Name is Required." })
      case !description:
        return res.status(200).send({ success: false, message: "Product Description is Required." })
      case !price:
        return res.status(200).send({ success: false, message: "Product Price is Required." })
      case !quantity:
        return res.status(200).send({ success: false, message: "Product Quantity is Required." })
      case !category:
        return res.status(200).send({ success: false, message: "Product Category is Required." })
      case !photo && !photo.size > 1000:
        return res.status(200).send({ success: false, message: "Product Photo is Required and should be less than 1 mb." })
    }

    const existingProduct = await productModel.findOne({ name });
    if (existingProduct) {
      return res.status(200).send({ success: false, message: `Product with name ${name} already exists.` })
    }

    const product = new productModel({ ...req.fields, slug: slugify(name) })

    const file = fs.readFileSync(photo.path)
    if (file.length === 0) {
      return res.status(200).send({ success: false, message: "Product Photo is Required." })
    }
    else {
      product.photo.data = file
      product.photo.contentType = photo.type;
    }

    await product.save();
    return res.status(201).send(
      {
        success: true,
        message: `Product ${name} created successfully.😊`,
        product
      });
  } catch (error) {
    console.log(`Error => ${error}`.bgRed);
    return res.status(500).send({
      success: false,
      message: "Something went wrong while creating the product.",
      error
    })
  }
}

export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, quantity, category, shipping } = req.fields;
    const { photo } = req.files;
    const { id } = req.params;

    switch (true) {
      case !name:
        return res.status(200).send({ success: false, message: "Product Name is Required." })
      case !description:
        return res.status(200).send({ success: false, message: "Product Description is Required." })
      case !price:
        return res.status(200).send({ success: false, message: "Product Price is Required." })
      case !quantity:
        return res.status(200).send({ success: false, message: "Product Quantity is Required." })
      case !category:
        return res.status(200).send({ success: false, message: "Product Category is Required." })
      case !photo && !photo.size > 1000:
        return res.status(200).send({ success: false, message: "Product Photo is Required and should be less than 1 mb." })
    }

    const product = await productModel.findByIdAndUpdate(id, { ...req.fields, slug: slugify(name) }, { new: true });

    const file = fs.readFileSync(photo.path).length
    if (file === 0) {
      return res.status(200).send({ success: false, message: "Product Photo is Required." })
    }
    else {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }
    await product.save();
    const updatedProduct = await productModel.findById(id).select("-photo")
    return res.status(201).send(
      {
        success: true,
        message: `Product ${name} updated successfully.😊`,
        updatedProduct
      });
  } catch (error) {
    console.log(`Error => ${error}`.bgRed);
    return res.status(500).send({
      success: false,
      message: "Something went wrong while updating product.",
      error
    })
  }
}

export const getProductController = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.findById(id).select("-photo").populate("category")
    res.status(200).send({ success: true, message: `Product fetched successfully.`, product })
  } catch (error) {
    console.log(`Error => ${error}`.bgRed);
    return res.status(500).send({
      success: false,
      message: "Something went wrong while fetching the product.",
      error
    })
  }
}

export const getAllProductsController = async (req, res) => {
  try {
    const products = await productModel.find().select("-photo").limit(12).sort({ createdAt: -1 })
    res.status(200).send({ success: true, message: `Products fetched successfully.`, total: products.length, products })
  } catch (error) {
    console.log(`Error => ${error}`.bgRed);
    return res.status(500).send({
      success: false,
      message: "Something went wrong while fetching all products.",
      error
    })
  }
}

export const deleteProductController = async (req, res) => {
  try {
    const { id } = req.params;
    await productModel.findByIdAndDelete(id)
    res.status(200).send({ success: true, message: `Product deleted successfully.` })
  } catch (error) {
    console.log(`Error => ${error}`.bgRed);
    return res.status(500).send({
      success: false,
      message: "Something went wrong while deleting the product.",
      error
    })
  }
}

export const deleteAllProductsController = async (req, res) => {
  try {
    await productModel.deleteMany()
    res.status(200).send({ success: true, message: `All products deleted successfully.` })
  } catch (error) {
    console.log(`Error => ${error}`.bgRed);
    return res.status(500).send({
      success: false,
      message: "Something went wrong while deleting all products.",
      error
    })
  }
}

export const getPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id).select("photo");
    if (product.photo.data) {
      res.set('Content-Type', product.photo.contentType)
      res.status(200).send(product.photo.data)
    }
  } catch (error) {
    console.log(`Error => ${error}`.bgRed);
    return res.status(500).send({
      success: false,
      message: "Something went wrong while fetching product photo.",
      error
    })
  }
}

export const productFiltersController = async (req, res) => {

  try {
    const { checked, radio } = req.body;
    let args = {}
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] }
    const products = await productModel.find(args);
    res.status(200).send({ success: true, products })
  } catch (error) {
    console.log(`Error => ${error}`.bgRed);
    return res.status(500).send({
      success: false,
      message: "Something went wrong while fetching product photo.",
      error
    })
  }

}

export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount()
    res.status(200).send({ success: true, total });
  } catch (error) {
    console.log(`Error => ${error}`.bgRed);
    return res.status(500).send({
      success: false,
      message: "Something went wrong on pagination.",
      error
    })
  }
}

export const productListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(`Error => ${error}`.bgRed);
    return res.status(500).send({
      success: false,
      message: "Something went wrong on product page list.",
      error
    })
  }
}

export const productSearchController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const resutls = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.json(resutls);
  } catch (error) {
    console.log(`Error => ${error}`.bgRed);
    return res.status(500).send({
      success: false,
      message: "Something went wrong on product search.",
      error
    })
  }
}

export const relatedProductsController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid }
      }).select("-photo").limit(4).populate("category")
    res.status(200).send({ success: true, products })
  } catch (error) {
    console.log(`Error => ${error}`.bgRed);
    return res.status(500).send({
      success: false,
      message: "Something went wrong on product search.",
      error
    })
  }
}

export const categoryProductsController = async (req, res) => {
  try {
    const { cid } = req.params;
    const category = await categoryModel.findById(cid);
    const products = await productModel.find({ category }).populate("category")
    res.status(200).send({ success: true, category, products })
  } catch (error) {
    console.log(`Error => ${error}`.bgRed);
    return res.status(500).send({
      success: false,
      message: "Something went wrong on getting category products.",
      error
    })
  }
}

//Payment
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});


//payment gateway API

export const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err)
      }
      else {
        res.send(response)
      }
    })
  } catch (error) {
    console.log(`Error => ${error}`.bgRed);
    return res.status(500).send({
      success: false,
      message: "Something went wrong on getting braintree token.",
      error
    })
  }
}

export const brainTreePaymentController = async (req, res) => {
  try {
    const { cart, nonce } = req.body;
    let total = 0;
    cart.map(i => total += i.price)
    let newTransaction = gateway.transaction.sale({
      amount: total,
      paymentMethodNonce: nonce,
      options: {
        submitForSettlement: true
      }
    },
      async function (err, result) {
        if (result) {
          const order = await new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id
          }).save()
          res.json({ ok: true })
        }
        else {
          res.status(500).send(err)
        }
      })
  } catch (error) {
    console.log(`Error => ${error}`.bgRed);
    return res.status(500).send({
      success: false,
      message: "Something went wrong on sending payment.",
      error
    })
  }
}