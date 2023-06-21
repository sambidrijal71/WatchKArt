import express from 'express';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
import { createProductController, updateProductController, getProductController, getAllProductsController, deleteProductController, deleteAllProductsController, getPhotoController, productFiltersController, productCountController, productListController, productSearchController, relatedProductsController, categoryProductsController, braintreeTokenController, brainTreePaymentController } from '../controllers/productController.js';
import formidable from 'express-formidable'

const router = express.Router();

router.post('/create-product', requireSignIn, isAdmin, formidable(), createProductController);

router.put('/update-product/:id', requireSignIn, isAdmin, formidable(), updateProductController);

router.get('/get-product/:id', getProductController);
router.get('/getallproducts', getAllProductsController);

router.delete('/delete-product/:id', requireSignIn, isAdmin, deleteProductController);
router.delete('/deleteallproducts', requireSignIn, isAdmin, deleteAllProductsController);

router.get('/getproductphoto/:id', getPhotoController);

router.post('/product-filter', productFiltersController)

router.get('/product-count', productCountController)

router.get('/product-list/:page', productListController)

router.get('/productsearch/:keyword', productSearchController)

router.get('/related-products/:pid/:cid', relatedProductsController)

router.get('/category-products/:cid', categoryProductsController)

//payment routes

//token
router.get('/braintree/token', braintreeTokenController)

//payment

router.post('/braintree/payment', requireSignIn, brainTreePaymentController)



export default router;