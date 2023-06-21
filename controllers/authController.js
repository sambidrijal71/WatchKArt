import userModel from '../models/userModel.js'
import { hashPassword, comparePassword } from '../helpers/authHelper.js'
import jwt from 'jsonwebtoken'
import orderModel from '../models/orderModel.js';

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;
    switch (true) {
      case !name:
        return res.status(200).send({ success: false, message: "Name is Required." });
      case !email:
        return res.status(200).send({ success: false, message: "Email is Required." });
      case !password:
        return res.status(200).send({ success: false, message: "Password is Required." });
      case !phone:
        return res.status(200).send({ success: false, message: "Phone is Required." });
      case !address:
        return res.status(200).send({ success: false, message: "Address is Required." });
      case !answer:
        return res.status(200).send({ success: false, message: "Answer is Required." });
    }
    const existingUser = await userModel.findOne({ email }).exec();
    if (existingUser) {
      return res.status(200).send({ success: false, message: "User already exists, please login." });
    }
    const hashedPassword = await hashPassword(password)
    const newUser = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer,
    }).save();

    newUser.password = undefined
    return res.status(201).send(
      {
        success: true,
        message: "User registered successfully.😊",
        newUser
      });

  } catch (error) {
    console.log(`Error => ${error}`.bgRed);
    res.status(500).send({
      success: false,
      message: "Something went wrong while registering a user.",
      error
    })
  }
}

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(200).send({ success: false, message: "Email is Required." });
    }
    if (!password) {
      return res.status(200).send({ success: false, message: "Password is Required." });
    }
    const existingUser = await userModel.findOne({ email }).exec();
    if (!existingUser) {
      return res.status(200).send({ success: false, message: "Either Email or Password is invalid, please try again." });
    }
    const comparedPassword = await comparePassword(password, existingUser.password);
    if (!comparedPassword) {
      return res.status(200).send({ success: false, message: "Invalid password, please try again." });
    }

    const token = jwt.sign({ _id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

    existingUser.password = undefined
    return res.status(200).send(
      {
        success: true,
        message: `Welcome ${existingUser.name}.😊`,
        existingUser,
        token
      });
  } catch (error) {
    console.log(`Error => ${error}`.bgRed);
    res.status(500).send({
      success: false,
      message: "Something went wrong while registering a user.",
      error
    })
  }
}

export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, password } = req.body;
    if (!email) {
      return res.status(200).send({ success: false, message: "Email is Required." });
    }
    if (!answer) {
      return res.status(200).send({ success: false, message: "Answer is Required." });
    }
    if (!password) {
      return res.status(200).send({ success: false, message: "Password is Required." });
    }
    const existingUser = await userModel.findOne({ email }).exec();
    if (!existingUser) {
      return res.status(200).send({ success: false, message: "User does not exist, please try again." });
    }
    const comparedPassword = await comparePassword(password, existingUser.password)
    if (comparedPassword) {
      return res.status(200).send({ success: false, message: "Existing password and new password cannot be same, please try again." });
    }
    if (answer === existingUser.answer) {
      const hashedPassword = await hashPassword(password)
      await userModel.updateOne({ password: hashedPassword });
    }
    else {
      return res.status(200).send({ success: false, message: "Wrong answer provided, please try again." });
    }
    existingUser.password = undefined
    return res.status(200).send(
      {
        success: true,
        message: `Password changed successfully.😊`,
        existingUser,
      });
  } catch (error) {
    console.log(`Error => ${error}`.bgRed);
    res.status(500).send({
      success: false,
      message: "Something went wrong while registering a user.",
      error
    })
  }
}

export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await userModel.findById(req.user._id);
    //password
    if (password && password.length < 6) {
      return res.json({ error: "Passsword is required and 6 character long" });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated SUccessfully",
      updatedUser,
    });
  } catch (error) {
    console.log(`Error => ${error}`.bgRed);
    res.status(500).send({
      success: false,
      message: "Something went wrong while registering a user.",
      error
    })
  }
}

export const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel.find({ buyer: req.user._id }).populate("products", "-photo").populate("buyer", "name");
    res.json(orders)
  } catch (error) {
    console.log(`Error => ${error}`.bgRed);
    res.status(500).send({
      success: false,
      message: "Something went wrong while getting orders.",
      error
    })
  }
}

export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel.find({}).populate("products", "-photo").populate("buyer", "name").sort({ createdAt: '-1' });
    res.json(orders)
  } catch (error) {
    console.log(`Error => ${error}`.bgRed);
    res.status(500).send({
      success: false,
      message: "Something went wrong while getting all orders.",
      error
    })
  }
}

export const ordersStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body
    const orders = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true })
    res.json(orders)
  } catch (error) {
    console.log(`Error => ${error}`.bgRed);
    res.status(500).send({
      success: false,
      message: "Something went wrong while updating status.",
      error
    })
  }
}

export const testController = async (req, res) => {
  res.status(200).send({
    success: true,
    message: 'Protected Route'
  })
}
