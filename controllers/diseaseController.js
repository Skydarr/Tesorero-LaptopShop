const Disease = require("../models/disease.js");
const APIFeatures = require("../utils/apiFeatures.js");
const ErrorHandler = require("../utils/errorHandler.js");
const cloudinary = require("cloudinary");

// Create, Get, Update, Delete Diseases
exports.newDisease = async (req, res, next) => {
  let images = [];
  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  let imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    let imageDataUri = images[i];
    try {
      const result = await cloudinary.v2.uploader.upload(`${imageDataUri}`, {
        folder: "diseases",
        width: 150,
        crop: "scale",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    } catch (error) {
      console.log(error);
    }
  }

  req.body.images = imagesLinks;
  req.body.user = req.user.id;

  const disease = await Disease.create(req.body);
  if (!disease)
    return res.status(400).json({
      success: false,
      message: "Disease post not created",
    });

  res.status(201).json({
    success: true,
    disease,
  });
};

exports.getDisease = async (req, res, next) => {
  const disease = await Disease.find();
  let filteredDiseasesCount = disease.length;

  res.status(200).json({
    success: true,
    filteredDiseasesCount,
    disease,
  });
};

exports.getSingleDisease = async (req, res, next) => {
  const disease = await Disease.findById(req.params.id);

  console.log(disease);

  if (!disease) {
    return next(new ErrorHandler("Disease post not found", 404));
  }

  res.status(200).json({
    success: true,
    disease,
  });
};

exports.updateDisease = async (req, res, next) => {
  let disease = await Disease.findById(req.params.id);

  if (!disease) {
    return next(new ErrorHandler("Disease post not found", 404));
  }

  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    // Deleting images associated with the disease

    for (let i = 0; i < product.images.length; i++) {
      const result = await cloudinary.v2.uploader.destroy(
        product.images[i].public_id
      );
    }

    let imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "diseases",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }

  disease = await Disease.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    disease,
  });
};

exports.deleteDisease = async (req, res, next) => {
  let disease = await Disease.findById(req.params.id);

  if (!disease) {
    return res.status(404).json({
      success: false,
      message: "Disease post not found",
    });
  }

  if (!disease) {
    return next(new ErrorHandler("Disease post not found", 404));
  }
  disease = await Disease.findByIdAndRemove(req.params.id);

  res.status(200).json({
    success: true,
    disease,
  });
};
