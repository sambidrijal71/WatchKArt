import categoryModel from '../models/categoryModel.js'
import slugify from 'slugify'

export const createCategoryController = async (req, res) => {

  try {
    const { name } = req.body;
    if (!name) {
      return res.status(200).send({ success: false, message: "Category Name is required." })
    }
    const existingCategory = await categoryModel.findOne({ name })
    if (existingCategory) {
      return res.status(200).send({ success: false, message: "Category already exists." })
    }

    const category = await new categoryModel({ name, slug: slugify(name) }).save()
    return res.status(201).send(
      {
        success: true,
        message: `Category ${name} created.😊`,
        category
      });
  } catch (error) {
    console.log(`Error => ${error}`.bgRed);
    return res.status(500).send({
      success: false,
      message: "Something went wrong while creating category.",
      error
    })
  }
}

export const updateCategoryController = async (req, res) => {

  try {
    const { name } = req.body;
    const { id } = req.params;
    if (!name) {
      return res.status(200).send({ success: false, message: "Category Name is required." })
    }
    const existingCategory = await categoryModel.findOne({ name })
    if (existingCategory) {
      return res.status(200).send({ success: false, message: "Cannot update same category." })
    }
    const category = await categoryModel.findByIdAndUpdate(id, { name, slug: slugify(name) }, { new: true })
    return res.status(200).send(
      {
        success: true,
        message: `Category ${name} successfully updated.😊`,
        category
      });
  } catch (error) {
    console.log(`Error => ${error}`.bgRed);
    return res.status(500).send({
      success: false,
      message: "Something went wrong while updating category.",
      error
    })
  }
}

export const getCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    const getCategory = await categoryModel.findById(id)
    return res.status(200).send(
      {
        success: true,
        message: `Category fetched successfully.😊`,
        getCategory
      });
  } catch (error) {
    console.log(`Error => ${error}`.bgRed);
    return res.status(500).send({
      success: false,
      message: "Something went wrong while updating category.",
      error
    })
  }
}

export const getAllCategoryController = async (req, res) => {
  try {
    const getCategory = await categoryModel.find()
    return res.status(200).send(
      {
        success: true,
        message: `Category fetched successfully.😊`,
        getCategory
      });
  } catch (error) {
    console.log(`Error => ${error}`.bgRed);
    return res.status(500).send({
      success: false,
      message: "Something went wrong while updating category.",
      error
    })
  }
}

export const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    await categoryModel.findByIdAndDelete(id)
    return res.status(200).send(
      {
        success: true,
        message: `Category successfully deleted.😊`,
      });
  } catch (error) {
    console.log(`Error => ${error}`.bgRed);
    return res.status(500).send({
      success: false,
      message: "Something went wrong while updating category.",
      error
    })
  }
}

export const deleteAllCategoryController = async (req, res) => {
  try {
    await categoryModel.deleteMany()
    return res.status(200).send(
      {
        success: true,
        message: `All categories deleted successfully updated.😊`,
      });
  } catch (error) {
    console.log(`Error => ${error}`.bgRed);
    return res.status(500).send({
      success: false,
      message: "Something went wrong while updating category.",
      error
    })
  }
}





