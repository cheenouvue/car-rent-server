import { validationResult } from "express-validator";
import prisma from "../config/config.js";
import {
  sendEmpty,
  sendError,
  sendRemoveIcon,
  sendRemoveImage,
  sendSuccess,
  sendUploadIcon,
  sendUploadImage,
  sendValidator,
} from "../service/reponseHandler.js";
import { removeFile, uploadFile } from "../service/uploadService.js";

// create
export const create = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return sendValidator(res, error);
  }           
  try {
    const { name } = req.body;
    const icon = req.files?.icon;
    const newIcon = await sendUploadImage(icon);
    const carType = await prisma.carType.create({
      data: {
        name: name,
        icon: newIcon,
      },
    });
    sendSuccess(res, "Success Create", carType);
  } catch (erro) {
    console.log(erro);
    sendError(res, "Create insurance Error");
  }
};

// list
export const list = async (req, res) => {
  try {
    const carType = await prisma.carType.findMany();
    sendSuccess(res, "Success list", carType);
  } catch (erro) {
    console.log(erro);
    sendError(res, "List carType Error");
  }
};

//listID
export const listID = async (req, res) => {
  try {
    const { id } = req.params;

    const carType = await prisma.carType.findUnique({
      where: {
        id,
      },
    });
    if (!carType) return sendEmpty(res, "No Data");
    sendSuccess(res, "Success", carType);
  } catch (erro) {
    console.log(erro);
    sendError(res, "ListID carType Error");
  }
};

//update
export const update = async (req, res) => {
  const error = validationResult(req);
  if(!error.isEmpty()) {
    return sendValidator(res, error);
  }
  try {
    const { id } = req.params;
    const { name } = req.body;
    const icon = req.files?.icon;
    const check = await prisma.carType.findUnique({
      where: {
        id: id,
      },
    });
    if (!check) return sendEmpty(res, "NO Date");
    if (icon) {
      await sendRemoveImage(check?.icon);
    }
    const newIcon = await sendUploadImage(icon);
    
    const carType = await prisma.carType.update({
      where: {
        id: id,
      },
      data: {
        name: name,
        ...(icon && { icon: newIcon })
      },
    });
    sendSuccess(res, "Success", carType);
  } catch (erro) {
    console.log(erro);
    sendError(res, "ListID carType Error");
  }
};

//remove
export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const check = await prisma.carType.findUnique({
      where: {
        id: id,
      },
    });
    if (!check) return sendEmpty(res, "NO Date");
    await sendRemoveImage(check?.icon);
    const carType = await prisma.carType.delete({
      where: {
        id: id,
      },
    });

    sendSuccess(res, "Success Delete", carType);
  } catch (erro) {
    console.log(erro);
    sendError(res, "Delete carType Error");
  }
};
