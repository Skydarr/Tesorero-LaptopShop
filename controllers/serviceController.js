const Service = require("../models/service");
const APIFeatures = require("../utils/apiFeatures.js");
const ErrorHandler = require("../utils/errorHandler");
const cloudinary = require("cloudinary");


// Create, Get, Update, Delete Service
exports.newService = async (req, res, next) => {
    let images = []
    if (typeof req.body.images === 'string') {
        images.push(req.body.images)
    } else {
        images = req.body.images
    }

    let imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
        let imageDataUri = images[i]
        // console.log(imageDataUri)
        try {
            const result = await cloudinary.v2.uploader.upload(`${imageDataUri}`, {
                folder: 'services',
                width: 150,
                crop: "scale",
            });

            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url
            })

        } catch (error) {
            console.log(error)
        }

    }

    req.body.images = imagesLinks
    req.body.user = req.user.id;

    const service = await Service.create(req.body);
    if (!service)
        return res.status(400).json({
            success: false,
            message: 'Service not created'
        })


    res.status(201).json({
        success: true,
        service
    })
};

exports.getService = async (req, res, next) => {
    const services = await Service.find();
    let filteredServicesCount = services.length;

    res.status(200).json({
        success: true,
        // count: services.length,
        filteredServicesCount,
        services,
    });
    // return next(new ErrorHandler("my error", 400));
};

exports.getSingleService = async (req, res, next) => {
    const service = await Service.findById(req.params.id);

    console.log(service);

    if (!service) {
        return next(new ErrorHandler("Service not found", 404));
    }

    res.status(200).json({
        success: true,
        service,
    });
};

exports.updateService = async (req, res, next) => {
    let service = await Service.findById(req.params.id);

    if (!Service) {
        return next(new ErrorHandler("Service not found", 404));
    }

    let images = [];

    if (typeof req.body.images === "string") {
        images.push(req.body.images);
    } else {
        images = req.body.images;
    }

    if (images !== undefined) {
        // Deleting images associated with the product

        for (let i = 0; i < product.images.length; i++) {
            const result = await cloudinary.v2.uploader.destroy(
                product.images[i].public_id
            );
        }

        let imagesLinks = [];

        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: "products",
            });

            imagesLinks.push({
                public_id: result.public_id,

                url: result.secure_url,
            });
        }

        req.body.images = imagesLinks;
    }

    service = await Service.findByIdAndUpdate(req.params.id, req.body, {
        new: true,

        runValidators: true,

        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,

        service,
    });
};

exports.deleteService = async (req, res, next) => {
    let service = await Service.findById(req.params.id);

    if (!service) {
        return res.status(404).json({
            success: false,

            message: "Service not found",
        });
    }

    if (!service) {
        return next(new ErrorHandler("Service not found", 404));
    }
    service = await Service.findByIdAndRemove(req.params.id)
    // await Product.find();

    res.status(200).json({
        success: true,

        service,
    });
};

// Product Reviews
exports.createServiceReviews = async (req, res, next) => {

    const { rating, comment, serviceId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }

    const service = await Service.findById(serviceId);

    const isReviewed = service.reviews.find(
        r => r.user.toString() === req.user._id.toString()
    )

    if (isReviewed) {

        service.reviews.forEach(review => {
            if (review.user.toString() === req.user._id.toString()) {
                review.comment = comment;
                review.rating = rating;
            }
        })

    } else {
        service.reviews.push(review);
        service.numOfReviews = service.reviews.length
    }

    service.ratings = service.reviews.reduce((acc, item) => item.rating + acc, 0) / service.reviews.length

    await service.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        review
    })
};

exports.getServiceReviews = async (req, res, next) => {
    const service = await Service.findById(req.params.id);

    res.status(200).json({
        success: true,
        reviews: service.reviews
    });
};