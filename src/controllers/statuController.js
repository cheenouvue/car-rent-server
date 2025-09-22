import prisma from "../config/config.js";
import { validationResult } from "express-validator";
import { sendCreated, sendDelete, sendEmpty, sendError, sendExsited, sendSuccess, sendUpdate, sendValidator } from "../service/reponseHandler.js";
import path from 'path';
import fs from 'fs';

export const addStatu = async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return sendValidator(res, error);
    }
    try {
        const { statu, statu_user, statu_admin, statu_car } = req.body;
        const icon_statu = req?.files?.icon_statu;
        const uploadDir = path.join(path.resolve(), 'src/uploads/icons');
        const uploadPath = path.join(uploadDir, icon_statu.name);
        await icon_statu.mv(uploadPath);
        const statuExsited = await prisma.status.findUnique({ where: { statu: parseInt(statu) } });
        if (statuExsited) {
            return sendExsited(res, 'statu is exsited');
        }
        const statuUserExsited = await prisma.status.findUnique({ where: { statu_user } });
        if (statuUserExsited) {
            return sendExsited(res, 'statu user is exsited');
        }
        const statuAdminExsited = await prisma.status.findUnique({ where: { statu_admin } });
        if (statuAdminExsited) {
            return sendExsited(res, 'statu admin is exsited');
        }
        const statuCarExsited = await prisma.status.findUnique({ where: { statu_car } });
        if (statuCarExsited) {
            return sendExsited(res, 'statu car is exsited');
        }
        const iconStatuExsited = await prisma.status.findUnique({ where: { icon_statu: icon_statu.name } });
        if (iconStatuExsited) {
            return sendExsited(res, 'icon statu is exsited');
        }
        const addStatu = await prisma.status.create({ data: { statu: parseInt(statu), statu_user, statu_admin, statu_car, icon_statu: icon_statu.name } });
        sendCreated(res, 'create statu successfully', addStatu);
    } catch (error) {
        sendError(res, error);
    }
}

//get all status
export const getAllStatus = async (req, res) => {
    try {
        const status = await prisma.status.findMany();
        sendSuccess(res, 'get all status successfully', status);
    } catch (error) {
        sendError(res, error);
    }
}

//get one statu
export const getOneStatu = async(req, res) => {
    try {
        const {id} = req.params;
        const statu = await prisma.status.findUnique({ where: {id} });
        if(!statu) {
            return sendEmpty(res, 'statu not found');
        }
        sendSuccess(res, 'get one statu successfully', statu);
    } catch (error) {
        sendError(res, error);
    }
}

//delete statu
export const deleteStatu = async (req, res) => {
    try {
        const { id } = req.params;
        const statu = await prisma.status.findUnique({ where: { id } });
        if (!statu) {
            return sendEmpty(res, 'statu not found');
        }
        const uploadDir = path.join(path.resolve(), 'src/uploads/icons');
        const uploadPath = path.join(uploadDir, statu.icon_statu);
        if (fs.existsSync(uploadPath)) {
            fs.unlinkSync(uploadPath);
        }
        await prisma.status.delete({ where: { id } });
        sendDelete(res, 'delete statu successfully')
    } catch (error) {
        sendError(res, error);
    }
}

//update statu
export const updateStatu = async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return sendValidator(res, error);
    }
    try {
        const { id } = req.params;
        const { statu, statu_user, statu_admin, statu_car } = req.body;
        const status = parseInt(statu);
        const selOneStatu = await prisma.status.findUnique({ where: { id } });
        if (!selOneStatu) {
            return sendEmpty(res, 'statu not found');
        }
        if (selOneStatu.statu !== status) {
            const statuExsited = await prisma.status.findUnique({ where: { statu: status } });
            if (statuExsited) {
                return sendExsited(res, 'statu is exsited');
            }
        }
        if (selOneStatu.statu_user !== statu_user) {
            const statuUserExsited = await prisma.status.findUnique({ where: { statu_user } });
            if (statuUserExsited) {
                return sendExsited(res, 'statu user is exsited');
            }
        }
        if (selOneStatu.statu_admin !== statu_admin) {
            const statuAdminExsited = await prisma.status.findUnique({ where: { statu_admin } });
            if (statuAdminExsited) {
                return sendExsited(res, 'statu admin is exsited');
            }
        }
        if (selOneStatu.statu_car !== statu_car) {
            const statuCarExsited = await prisma.status.findUnique({ where: { statu_car } });
            if (statuCarExsited) {
                return sendExsited(res, 'statu car is exsited');
            }
        }
        await prisma.status.update({
            where: { id },
            data: { statu: status, statu_user, statu_admin, statu_car }
        });
        sendUpdate(res, 'update statu successfully');
    } catch (error) {
        sendError(res, error);
    }
}

//update icon statu
export const changeIconStatu = async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return sendValidator(res, error);
    }
    try {
        const { id } = req.params;
        const icon_statu = req?.files?.icon_statu;
        const statu = await prisma.status.findUnique({ where: { id } });
        if (!statu) {
            return sendEmpty(res, 'statu not found');
        }
        if (statu.icon_statu !== icon_statu.name) {
            const iconExsited = await prisma.status.findUnique({ where: { icon_statu: icon_statu.name } })
            if (iconExsited) {
                return sendExsited(res, 'icon statu is exsited');
            }
        }
        if (statu.icon_statu == icon_statu.name) {
            return sendEmpty(res, 'icon statu is same');
        }
        const uploadDir = path.join(path.resolve(), 'src/uploads/icons');
        const uploadPathRemore = path.join(uploadDir, statu.icon_statu);
        if (fs.existsSync(uploadPathRemore)) {
            fs.unlinkSync(uploadPathRemore);
        }
        const uploadPath = path.join(uploadDir, icon_statu.name);
        await icon_statu.mv(uploadPath);
        await prisma.status.update({
            where: { id },
            data: { icon_statu: icon_statu.name }
        });
        sendUpdate(res, 'update icon statu successfully');
    } catch (error) {
        sendError(res, error);
    }
}