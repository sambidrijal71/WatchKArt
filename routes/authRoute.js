import express from 'express';
import { loginController, registerController, testController, forgotPasswordController, updateProfileController, getOrdersController, getAllOrdersController, ordersStatusController } from '../controllers/authController.js';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';

const router = express.Router();


router.post('/register', registerController);
router.post('/login', loginController);

router.post('/forgotpassword', forgotPasswordController)
router.get('/test', requireSignIn, isAdmin, testController);

//authentication

router.get('/user-auth', requireSignIn, (req, res) => { res.status(200).send({ ok: true }) })

router.put('/profile', requireSignIn, updateProfileController)

router.get('/admin-auth', requireSignIn, isAdmin, (req, res) => { res.status(200).send({ ok: true }) })

//orders

router.get('/orders', requireSignIn, getOrdersController)

// all orders
router.get('/getallorders', requireSignIn, isAdmin, getAllOrdersController)

router.put('/order-status/:orderId', requireSignIn, isAdmin, ordersStatusController)




export default router