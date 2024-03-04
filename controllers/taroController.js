const Taro = require("../models/taro.js");
const APIFeatures = require("../utils/apiFeatures.js");
const ErrorHandler = require("../utils/errorHandler.js");
const cloudinary = require("cloudinary");

// Create, Get, Update, Delete Posts
exports.newPost = async (req, res, next) => {
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
        folder: "taro",
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

  const taroPosts = await Taro.create(req.body);
  if (!taroPosts)
    return res.status(400).json({
      success: false,
      message: "Post not created",
    });

  res.status(201).json({
    success: true,
    taroPosts,
  });
};

exports.allPosts = async (req, res, next) => {
  const taroPosts = await Taro.find();
  let filteredPostsCount = taroPosts.length;

  res.status(200).json({
    success: true,
    filteredPostsCount,
    taroPosts,
  });
};

exports.getPosts = async (req, res, next) => {
  const resPerPage = 3;
  const postsCount = await Taro.countDocuments();

  const apiFeatures = new APIFeatures(Taro.find(), req.query).search().filter();

  apiFeatures.pagination(resPerPage);
  const taroPosts = await apiFeatures.query;
  let filteredPostsCount = taroPosts.length;

  res.status(200).json({
    success: true,
    resPerPage,
    postsCount,
    filteredPostsCount,
    taroPosts,
  });
};

exports.getSinglePost = async (req, res, next) => {
  const taroPosts = await Taro.findById(req.params.id);

  console.log(taroPosts);

  if (!taroPosts) {
    return next(new ErrorHandler("Post not found", 404));
  }

  res.status(200).json({
    success: true,
    taroPosts,
  });
};

exports.updatePost = async (req, res, next) => {
  let taroPosts = await Taro.findById(req.params.id);

  if (!taroPosts) {
    return next(new ErrorHandler("Post not found", 404));
  }

  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    // Deleting images associated with the post

    for (let i = 0; i < taroPosts.images.length; i++) {
      const result = await cloudinary.v2.uploader.destroy(
        taroPosts.images[i].public_id
      );
    }

    let imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "taro",
      });

      imagesLinks.push({
        public_id: result.public_id,

        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }

  taroPosts = await Taro.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    taroPosts,
  });
};

exports.deletePost = async (req, res, next) => {
  let taroPosts = await Taro.findById(req.params.id);

  if (!taroPosts) {
    return res.status(404).json({
      success: false,
      message: "Post not found",
    });
  }

  if (!taroPosts) {
    return next(new ErrorHandler("Post not found", 404));
  }
  taroPosts = await Product.findByIdAndRemove(req.params.id);

  res.status(200).json({
    success: true,
    taroPosts,
  });
};

// Post Reviews
exports.createPostReview = async (req, res, next) => {
  const { rating, comment, postId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const taroPosts = await Taro.findById(postId);
  const isReviewed = taroPosts.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    taroPosts.reviews.forEach((review) => {
      if (review.user.toString() === req.user._id.toString()) {
        review.comment = comment;
        review.rating = rating;
      }
    });
  } else {
    taroPosts.reviews.push(review);
    taroPosts.numOfReviews = taroPosts.reviews.length;
  }

  taroPosts.ratings =
    taroPosts.reviews.reduce((acc, item) => item.rating + acc, 0) /
    taroPosts.reviews.length;

  await taroPosts.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
};

exports.getPostReviews = async (req, res, next) => {
  const taroPosts = await Taro.findById(req.params.id);

  res.status(200).json({
    success: true,
    reviews: taroPosts.reviews,
  });
};

exports.deleteReview = async (req, res, next) => {
  const taroPosts = await Taro.findById(req.query.postId);
  console.log(taroPosts);

  const reviews = taroPosts.reviews.filter(
    (review) => review._id.toString() !== req.query.id.toString()
  );
  const numOfReviews = reviews.length;
  const ratings =
    taroPosts.reviews.reduce((acc, item) => item.rating + acc, 0) /
    reviews.length;

  await Taro.findByIdAndUpdate(
    req.query.id,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
};

//Chart
// exports.productCount = async (req, res, next) => {
//     const products = await Product.aggregate([
//         {
//             $group: {
//                 _id: "$name",
//                 totalStock: { $sum: "$stock" }
//             }
//         }
//     ]);

//     if (!products) {
//         return next(new ErrorHandler("No products found", 404));
//     }

//     const result = products.map(product => ({
//         name: product._id,
//         totalStock: product.totalStock
//     }));
//     console.log(result);

//     res.status(200).json({
//         success: true,
//         productStock: result
//         // totalProducts
//         // result
//     });
// }

// const totalSales = await Order.aggregate([
//     {
//         $group: {
//             _id: null,
//             total: { $sum: "$itemsPrice" }

//         },
//     },
// ])
// const sales = await Order.aggregate([
//     { $project: { _id: 0, "orderItems": 1, totalPrice: 1 } },
//     { $unwind: "$orderItems" },
//     {
//         $group: {
//             // _id: {month: { $month: "$paidAt" } },
//             _id: { product: "$orderItems.name" },
//             // total: {$sum: {$multiply: [ "$orderItemsprice", "$orderItemsquantity" ]}}
//             total: { $sum: { $multiply: ["$orderItems.price", "$orderItems.quantity"] } }
//         },
//     },
// ])

// if (!totalSales) {
//     return next(new ErrorHandler('error sales ', 404))
// }
// if (!sales) {
//     return next(new ErrorHandler('error sales ', 404))
// }
// let totalPercentage = {}
// totalPercentage = sales.map(item => {

//     console.log(((item.total / totalSales[0].total) * 100).toFixed(2))
//     percent = Number(((item.total / totalSales[0].total) * 100).toFixed(2))
//     total = {
//         name: item._id.product,
//         percent
//     }
//     return total
// })
// // return console.log(totalPercentage)
// res.status(200).json({
//     success: true,
//     totalPercentage,
// })
