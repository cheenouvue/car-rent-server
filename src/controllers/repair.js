import { param } from "express-validator";
import prisma from "../config/config.js";
import {
  sendCreated,
  sendDelete,
  sendEmpty,
  sendError,
  sendRemoveImage,
  sendSuccess,
  sendUpdate,
  sendUploadImage,
} from "../service/reponseHandler.js";
import { removeFile, uploadFile } from "../service/uploadService.js";
//create
export const insertRepair = async (req, res) => {
  try {
    const { receiptPrice, rental_id } = req.body;
    const receiptImg = req?.files?.receiptImg;

    const rental = await prisma.rental.findUnique({
      where: {
        id: rental_id,
      },
    });
    if (!rental) return sendEmpty(res, "rental not found");

    const newReceiptImag = await sendUploadImage(receiptImg);
    const data = await prisma.repair.create({
      data: { rental_id, receiptImg: newReceiptImag, receiptPrice: parseFloat(receiptPrice) }
    });

    sendCreated(res, 'successfully', data);
  } catch (error) {
    sendError(res, error);
  }
};

//list
export const list = async (req, res) => {
  try {
    const repair = await prisma.repair.findMany();
    sendSuccess(res, "SuccessFul", repair);
  } catch (err) {
    sendError(res, "Error paymen ");
  }
};

//listById
export const listBy = async (req, res) => {
  try {
    const { id } = req.params;

    const repair = await prisma.repair.findUnique({
      where: { id },
    });

    repair
      ? sendSuccess(res, "SuccessFul", repair)
      : sendEmpty(res, "repair not found");
  } catch (error) {
    console.error("Error fetching repair:", error);
    sendError(res, "Error repair");
  }
};

//updata
export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { receiptPrice } = req.body;
    const receiptImg = req.files?.receiptImg;

    const repair = await prisma.repair.findUnique({
      where: {
        id: id,
      },
    });
    if (!repair) return sendEmpty(res, "repair not found");

    if (receiptImg) await sendRemoveImage(repair?.receiptImg);

    const receiptPriceNew = parseFloat(receiptPrice);

    const receiptImgNew = await sendUploadImage(receiptImg);

    await prisma.repair.update({
      where: {
        id: id,
      },
      data: {
        receiptPrice: receiptPriceNew,
        receiptImg: receiptImgNew,
      },
    });

    sendUpdate(res, "SuccessFul Update");
  } catch (error) {
    sendError(res, error);
  }
};

//remove
export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const check = await prisma.repair.findUnique({
      where: {
        id: id,
      },
    });
    if (!check) return sendEmpty(res, "No Data");
    if (check.receiptImg) await sendRemoveImage(check.receiptImg);
    await prisma.repair.delete({
      where: {
        id: id,
      },
    });
    sendDelete(res, "delete SuccessFul");
  } catch (error) {
    sendError(res, error);
  }
};
