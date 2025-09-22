import prisma from "../config/config.js";
import { sendDelete, sendEmpty, sendError, sendRemoveImage, sendSuccess, sendUploadImage } from "../service/reponseHandler.js";

export const createPenalty = async (req, res) => {
    try {
        const { rental_id, penaltyPrice, detail } = req.body;
        const penaltyImg = req.files?.penaltyImg;
        const rental = await prisma.rental.findUnique({ where: { id: rental_id } });
        if (!rental) {
            return sendEmpty(res, 'rental not found');
        }
        const penaltyImgNew = await sendUploadImage(penaltyImg);
        const penaltyPriceNew = parseFloat(penaltyPrice)
        const data = await prisma.penalty.create({
            data: {
                rental_id,
                penaltyPrice: penaltyPriceNew,
                penaltyImg: penaltyImgNew,
                detail
            }
        });
        sendSuccess(res, 'carete success', data)
    } catch (error) {
        console.error(error);
        sendError(res, error);
    }
}

export const getAllPenalty = async (req, res) => {
    try {
        const penalty = await prisma.penalty.findMany();
        sendSuccess(res, 'success', penalty);
    } catch (error) {
        console.error(error);
        sendError(res, error);
    }
}

export const getOnePenalty = async (req, res) => {
    try {
        const { id } = req.params;
        const penalty = await prisma.penalty.findUnique({ where: { id } });
        if (!penalty) {
            return sendEmpty(res, 'penalty not found')
        }
        sendSuccess(res, 'success', penalty);
    } catch (error) {
        console.error(error);
        sendError(res, error);
    }
}

export const updatePenalty = async (req, res) => {
    try {
        const { id } = req.params;
        const { penaltyPrice, detail } = req.body;
        const penaltyImg = req.files?.penaltyImg;
        const penalty = await prisma.penalty.findUnique({ where: { id } });
        if (!penalty) {
            return sendEmpty(res, 'penalty not found');
        }
        if (penaltyImg) {
            await sendRemoveImage(penalty?.penaltyImg);
        }

        const penaltyImgNew = await sendUploadImage(penaltyImg);
        const penaltyPriceNew = parseFloat(penaltyPrice);



        const data = await prisma.penalty.update({
            where: { id },
            data: { penaltyPrice: penaltyPriceNew, penaltyImg: penaltyImgNew, detail }
        });
        sendSuccess(res, 'success', data);
    } catch (error) {
        console.error(error);
        sendError(res, error);
    }
}

export const deletePenalty = async (req, res) => {
    try {
        const { id } = req.params;
        const penalty = await prisma.penalty.findUnique({ where: { id } });
        if (!penalty) {
            return sendEmpty(res, 'penalty not found');
        }
        await sendRemoveImage(penalty?.penaltyImg);
        await prisma.penalty.delete({ where: { id } });
        sendDelete(res, 'delete success');
    } catch (error) {
        console.error(error);
        sendError(res, error);
    }
}