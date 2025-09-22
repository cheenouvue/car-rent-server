import { validationResult } from "express-validator";
import prisma from "../config/config.js";
import {
  sendCreated,
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
    const { name, level } = req.body;
    const icon = req.files?.icon;
    const newIcon = await sendUploadImage(icon);
    const insurance = await prisma.insurance.create({
      data: {
        name,
        icon: newIcon,
        level
      },
    });
    sendCreated(res, " SuccessFull", insurance);
  } catch (erro) {
    console.log(erro);
    sendError(res, "Create insurance Error");
  }
};

export const list = async (req, res) => {
  try {
    const insurance = await prisma.insurance.findMany({});
    sendCreated(res, " SuccessFull", insurance);
  } catch (erro) {
    console.log(erro);
    res.status(500).json({ message: "List insurance Error " });
  }
};

export const listID = async (req, res) => {
  try {
    const { id } = req.params;
    const insurance = await prisma.insurance.findUnique({
      where: {
        id: id,
      },
    });
    insurance
      ? sendSuccess(res, "success", insurance)
      : sendEmpty(res, "NO Data");
  } catch (erro) {
    console.log(erro);
    res.status(500).json({ message: "ListID insurance Error " });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, level } = req.body;
    const icon = req?.files?.icon;
    const check = await prisma.insurance.findUnique({
      where: { id },
    });
    if (!check) return sendEmpty(res, "NO Data");
    // const iconFileName = icon ? await uploadFile(icon) : check.icon;
    // if (icon && check.icon) removeFile(check.icon);
    if (icon) {
      if (check.icon) sendRemoveImage(check.icon);
    }
    const newIcon = await sendUploadImage(icon);

    const insurance = await prisma.insurance.update({
      where: {
        id: id,
      },
      data: {
        name: name,
        level,
        ...(icon && {icon: newIcon})
      },
    });
    sendSuccess(res, "Success Update ", insurance);
  } catch (erro) {
    console.log(erro);
    res.json({ message: "updateinsurance Error " });
  }
};

export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('id => ', id);
    const check = await prisma.insurance.findUnique({
      where: { id },
    });
    if (!check) return sendEmpty(res, "NO Date");
    sendRemoveImage(check?.icon);

    // if (check.icon) removeFile(check.icon);
    const insurance = await prisma.insurance.delete({
      where: {
        id,
      },
    });
    sendSuccess(res, "Success Delete", insurance);
  } catch (error) {
    console.log(error);
    res.json({ errors: error.message });
  }
};