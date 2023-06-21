import express from 'express';
import { createCategoryController, updateCategoryController, getCategoryController, getAllCategoryController, deleteCategoryController, deleteAllCategoryController } from '../controllers/categoryController.js';
import { requireSignIn, isAdmin } from '../middlewares/authMiddleware.js'
const router = express.Router();

router.post('/create-category', requireSignIn, isAdmin, createCategoryController);

router.put('/update-category/:id', requireSignIn, isAdmin, updateCategoryController);

router.get('/get-category/:id', getCategoryController);
router.get('/getallcategories', getAllCategoryController);

router.delete('/delete-category/:id', requireSignIn, isAdmin, deleteCategoryController);
router.delete('/deleteallcategories', requireSignIn, isAdmin, deleteAllCategoryController);




export default router;