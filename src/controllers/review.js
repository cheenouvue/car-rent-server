import prisma from "../config/config.js";
import {
  sendEmpty,
  sendError,
  sendSuccess,
  sendUpdate,
} from "../service/reponseHandler.js";

// Create a Review
export const create = async (req, res) => {
  try {
    const { comment, carPoint, employeePoint, rentalId } = req.body;

    const rental = await prisma.rental.findUnique({
      where: { id: rentalId },
    });

    if (!rental) {
      return res.status(404).json({ message: "Rental not found" });
    }

    const existingReview = await prisma.review.findFirst({
      where: { rentalId },
    });

    const reviewData = {
      ...(comment && { comment }),
      ...(carPoint &&
        !isNaN(parseInt(carPoint)) && { carPoint: parseInt(carPoint) }),
      ...(employeePoint &&
        !isNaN(parseInt(employeePoint)) && {
          employeePoint: parseInt(employeePoint),
        }),
    };

    let review;
    if (existingReview) {
      // Update existing review
      review = await prisma.review.update({
        where: { id: existingReview.id },
        data: reviewData,
      });
    } else {
      // Create new review
      review = await prisma.review.create({
        data: {
          rentalId,
          ...reviewData,
        },
      });
    }

    return res
      .status(200)
      .json({ message: "Review saved successfully", data: review });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

// List All Reviews
export const list = async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        rental: {
          include: {
            car: true,
            employee: true,
            user: true,
          },
        },
      },
    });
    sendSuccess(res, "Successful", reviews);
  } catch (err) {
    sendError(res, "Error retrieving reviews");
  }
};

// Get Review By ID
export const listBy = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await prisma.review.findUnique({
      where: { id },
    });

    review ? sendSuccess(res, "Successful", review) : sendEmpty(res, "No Data");
  } catch (error) {
    sendError(res, error);
  }
};

// Update Review
export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment, carPoint, employeePoint } = req.body;
    const check = await prisma.review.findUnique({ where: { id } });
    if (!check) return sendEmpty(res, "No Data");

    const review = await prisma.review.update({
      where: { id },
      data: {
        comment,
        carPoint: parseInt(carPoint),
        employeePoint: parseInt(employeePoint),
      },
    });

    sendUpdate(res, "update Successful");
  } catch (error) {
    sendError(res, error);
  }
};

// Delete Review
export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const check = await prisma.review.findUnique({ where: { id } });
    if (!check) return sendEmpty(res, "No Data");

    await prisma.review.delete({ where: { id } });

    sendSuccess(res, "Review deleted successfully");
  } catch (err) {
    sendError(res, "Error deleting review");
  }
};

export const listByRentID = async (req, res) => {
  try {
    const { id } = req.params;
    const reviews = await prisma.review.findMany({
      where: { rentalId: id },
    });

    reviews.length > 0
      ? sendSuccess(res, "Successful", reviews)
      : sendEmpty(res, "No Data");
  } catch (error) {
    sendError(res, error);
  }
};