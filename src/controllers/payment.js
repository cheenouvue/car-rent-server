import prisma from "../config/config.js";
import {
  sendEmpty,
  sendError,
  sendSuccess,
} from "../service/reponseHandler.js";
import { removeFile, uploadFile } from "../service/uploadService.js";
//create
export const create = async (req, res) => {
  try {
    const { price, rentalId } = req.body;
    const image = req.files?.image;

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice)) {
      return res.status(400).json({ message: "Invalid price format" });
    }

    const imageFileName = image ? await uploadFile(image) : null;

    const payment = await prisma.payment.create({
      data: {
        price: parsedPrice,
        image: imageFileName,
        rentalId: rentalId,
      },
    });

    sendSuccess(res, "Successful Payment", payment);
  } catch (err) {
    console.error(err);
    sendError(res, "Error in Payment");
  }
};

//list
export const list = async (req, res) => {
  try {
    const payment = await prisma.payment.findMany();
    sendSuccess(res, "SuccessFul", payment);
  } catch (err) {
    sendError(res, "Error paymen ");
  }
};

//listById
export const listBy = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Requested ID:", id);

    const payment = await prisma.payment.findUnique({
      where: { id },
    });

    console.log("Payment Data:", payment);

    payment
      ? sendSuccess(res, "SuccessFul", payment)
      : sendEmpty(res, "Not Data");
  } catch (err) {
    console.error("Error fetching payment:", err);
    sendError(res, "Error payment");
  }
};

//updata
export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { price, rentalId } = req.body;
    const image = req.files?.image;

    const check = await prisma.payment.findUnique({
      where: {
        id: id,
      },
    });
    if (!check) return sendEmpty(res, "No Data");
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice)) {
      return res.status(400).json({ message: "Invalid price format" });
    }
    const imageFileName = image ? await uploadFile(image) : check.image;

    if (image && check.image) removeFile(check.image);

    const payment = await prisma.payment.update({
      where: {
        id: id,
      },
      data: {
        price: parsedPrice,
        image: imageFileName,
        rentalId: rentalId,
      },
    });

    sendSuccess(res, "SuccessFul Update", payment);
  } catch (err) {
    sendError(res, "Error paymen ");
  }
};

//remove
export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const check = await prisma.payment.findUnique({
      where: {
        id: id,
      },
    });
    if (!check) return sendEmpty(res, "No Data");
    if (check.image) removeFile(check.image);
    const payment = await prisma.payment.delete({
      where: {
        id: id,
      },
    });
    sendSuccess(res, "SuccessFul", payment);
  } catch (err) {
    sendError(res, "Error paymen ");
  }
};
