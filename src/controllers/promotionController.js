import prisma from '../config/config.js';
import { validationResult } from 'express-validator';
import { sendCreated, sendDelete, sendEmpty, sendError, sendExsited, sendRemoveImage, sendSuccess, sendUpdate, sendUploadImage, sendValidator } from '../service/reponseHandler.js';

//create new promotion
export const addPromotion = async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return sendValidator(res, error);
    }
    try {
        const { titel, description, discount_type, discount, min_rent_amount, start_date, end_date } = req.body;
        const image = req?.files?.image;
        const newImage = await sendUploadImage(image);
        const addPromotion = await prisma.promotions.create({
            data: { titel, description, image: newImage, discount_type, discount: parseFloat(discount), min_rent_amount: parseFloat(min_rent_amount), start_date: new Date(start_date), end_date: new Date(end_date) }
        });
        sendCreated(res, 'create new promotion successfully', addPromotion);
    } catch (error) {
        sendError(res, error);
    }
}

//get all promotions
export const getAllPromotions = async (req, res) => {
    try {
        const promotions = await prisma.promotions.findMany();
        sendSuccess(res, 'get All promotion successfully', promotions);
    } catch (error) {
        sendError(res, error);
    }
}

//get one promotion
export const getOnePromotion = async (req, res) => {
    try {
        const { id } = req.params;
        const promotion = await prisma.promotions.findUnique({ where: { id } });
        if (!promotion) {
            return sendEmpty(res, 'promotion not found');
        }
        sendSuccess(res, 'get one promotion sccessfully', promotion);
    } catch (error) {
        sendError(res, error);
    }
}

//update titel promotion
// export const updateTitelPromotion = async (req, res) => {
//     const error = validationResult(req);
//     if (!error.isEmpty()) {
//         return sendValidator(res, error);
//     }
//     try {
//         const { id } = req.params;
//         const { titel, description } = req.body;
//         const image = req?.files?.image;
//         const promotion = await prisma.promotions.findUnique({ where: { id } });
//         if (!promotion) {
//             return sendEmpty(res, 'promotion not found');
//         }
//         if (image.name !== promotion.image) {
//             sendRemoveImage(promotion.image);
//             await sendUploadImage(image);
//         }
//         await prisma.promotions.update({
//             where: { id },
//             data: { titel, description, image: image.name }
//         });
//         sendUpdate(res, 'update titel promotion successfully');
//     } catch (error) {
//         sendError(res, error);
//     }
// }

//update promotion
export const updatePromotion = async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return sendValidator(res, error);
    }
    try {
        const { id } = req.params;
        const { titel, description, discount_type, discount, min_rent_amount, start_date, end_date } = req.body;
        const image = req?.files?.image;
        const promotion = await prisma.promotions.findUnique({ where: { id } });
        if (!promotion) {
            return sendEmpty(res, 'promotion not found');
        }

        if (image) {
            sendRemoveImage(promotion?.image);
        }
        const newImage = await sendUploadImage(image);

        await prisma.promotions.update({
            where: { id },
            data: { titel, description, ...(image && { image: newImage }), discount_type, discount: parseFloat(discount), min_rent_amount: parseFloat(min_rent_amount), start_date: new Date(start_date), end_date: new Date(end_date) }
        });
        sendUpdate(res, 'update price promotion successfully');
    } catch (error) {
        sendError(res, error);
    }
}

//update statu
export const updateStatus = async (req, res) => {
    try {
        const { id, status } = req.params;
        const promotion = await prisma.promotions.findUnique({ where: { id } });
        if (!status) {
            return sendEmpty(res, 'statu is empty')
        }
        if (!promotion) {
            return sendEmpty(res, 'promotion not found');
        }
        if (promotion.status == status) {
            return sendExsited(res, 'statu is exsited');
        }
        await prisma.promotions.update({
            where: { id },
            data: { status: status }
        })
        sendUpdate(res, 'update statu successfully')
    } catch (error) {
        sendError(res, error);
    }
}

//update statu to inactive
// export const updateStatuInactive = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const promotion = await prisma.promotions.findUnique({ where: { id } });
//         if (!promotion) {
//             return sendEmpty(res, 'promotion not found');
//         }
//         if (promotion.status == 'inactive') {
//             return sendExsited(res, 'statu is same');
//         }
//         await prisma.promotions.update({
//             where: { id },
//             data: { status: 'inactive' }
//         })
//         sendUpdate(res, 'update statu to inactive successfully')
//     } catch (error) {
//         sendError(res, error);
//     }
// }

//update statu to expired
// export const updateStatuExpired = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const promotion = await prisma.promotions.findUnique({ where: { id } });
//         if (!promotion) {
//             return sendEmpty(res, 'promotion not found');
//         }
//         if (promotion.status == 'expired') {
//             return sendExsited(res, 'statu is same');
//         }
//         await prisma.promotions.update({
//             where: { id },
//             data: { status: 'expired' }
//         })
//         sendUpdate(res, 'update statu to expired successfully')
//     } catch (error) {
//         sendError(res, error);
//     }
// }

//update start date and end date
export const updateDatePromotion = async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return sendValidator(res, error);
    }
    try {
        const { id } = req.params;
        const { start_date, end_date } = req.body;
        const promotion = await prisma.promotions.findUnique({ where: { id } });
        if (!promotion) {
            return sendEmpty(res, 'promotion not found');
        }
        await prisma.promotions.update({
            where: { id },
            data: { start_date: new Date(start_date), end_date: new Date(end_date) }
        });
        sendUpdate(res, 'update date promotion successfully');
    } catch (error) {
        sendError(res, error);
    }
}

//delete promotion
export const deletePromotion = async (req, res) => {
    try {
        const { id } = req.params;
        const promotion = await prisma.promotions.findUnique({ where: { id } });
        if (!promotion) {
            return sendEmpty(res, 'promotion not found');
        }
        sendRemoveImage(promotion.image);
        await prisma.promotions.delete({ where: { id } });
        sendDelete(res, 'delete promotion successfully');
    } catch (error) {
        sendError(res, error);
    }
}