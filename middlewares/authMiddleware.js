import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken';


export const requireSignIn = async (req, res, next) => {
  try {
    const decode = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: `Couldn't authenticate user, invalid JWT.`, error })
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id).exec();
    if (user.role !== 1) {
      return res.status(401).send({
        success: false,
        message: "UnAuthorized Access",
      });
    }
    else {
      next();
    }
  }
  catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: `User is not an admin.`, error })
  }
}