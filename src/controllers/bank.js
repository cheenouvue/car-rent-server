import { validationResult } from "express-validator";
import prisma from "../config/config.js";
import {
  sendEmpty,
  sendError,
  sendRemoveImage,
  sendSuccess,
  sendUploadImage,
  sendValidator,
} from "../service/reponseHandler.js";
import { removeFile, uploadFile } from "../service/uploadService.js";
export const create = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return sendValidator(res, error);
  }
  try {
    const { name } = req.body;
    const icon = req.files?.icon;
    const qr_code = req.files?.qr_code;

    const newIcon = await sendUploadImage(icon);
    const newQr_code = await sendUploadImage(qr_code);

    const bank = await prisma.bank.create({
      data: {
        name: name,
        icon: newIcon,
        qr_code: newQr_code,
      },
    });
    sendSuccess(res, "Successfully created bank entry", bank);
  } catch (error) {
    console.error(error);
    sendError(res, "Error creating bank entry");
  }
};

// list
export const list = async (req, res) => {
  try {
    const bank = await prisma.bank.findMany();
    sendSuccess(res, "Success list", bank);
  } catch (erro) {
    console.log(erro);
    sendError(res, "List bank Error");
  }
};

//listID
export const listID = async (req, res) => {
  try {
    const { id } = req.params;
    const bank = await prisma.bank.findUnique({
      where: {
        id: id,
      },
    });
    if (!bank) {
      return sendEmpty(res, "NO Image");
    }
    sendSuccess(res, "Success", bank);
  } catch (erro) {
    console.log(erro);
    sendError(res, "ListID bank Error");
  }
};

//update
export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const icon = req?.files?.icon;
    const qr_code = req?.files?.qr_code;
    const bankCheck = await prisma.bank.findUnique({ where: { id: id } });
    if (!bankCheck) return res.status(400).json({ message: "NO Date" });

    if (icon) {
      await sendRemoveImage(bankCheck?.icon);
      
    }
    const newIcon = await sendUploadImage(icon);

    if (qr_code) {
      await sendRemoveImage(bankCheck?.qr_code);
      
    }
    const newQr_code = await sendUploadImage(qr_code);

    const bank = await prisma.bank.update({
      where: { id: id },
      data: { name, ...(icon && { icon: newIcon }), ...(qr_code && { qr_code: newQr_code }) },
    });

    sendSuccess(res, "Success", bank);
  } catch (error) {
    console.log(error);
    sendError(res, "ListID bank Error");
  }
};

//remove
export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const bankCheck = await prisma.bank.findUnique({ where: { id: id } });
    if (!bankCheck) return sendEmpty(res, "NO Date");

    sendRemoveImage(bankCheck?.icon);
    sendRemoveImage(bankCheck?.qr_code);

    const bank = await prisma.bank.delete({
      where: {
        id: id,
      },
    });
    sendSuccess(res, "Success Delete", bank);
  } catch (erro) {
    console.log(erro);
    sendError(res, "Delete bank Error");
  }
};
