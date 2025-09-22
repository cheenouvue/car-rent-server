import prisma from "../config/config.js";
import { validationResult } from "express-validator";
import { sendCreated, sendDelete, sendEmpty, sendError, sendExsited, sendRemoveImage, sendSuccess, sendUpdate, sendUploadImage, sendValidator } from "../service/reponseHandler.js";

//create new employee
export const addEmployee = async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return sendValidator(res, error);
    }
    try {
        const { firstName, lastName, email, phone, village, distrit, provinced, salary, birthday, department, pricePerDay, gender } = req.body;
        const natinalIdCard = req.files?.natinal_id_card;
        const profile = req.files?.profile;

        const emailExsited = await prisma.employees.findUnique({ where: { email } });
        if (emailExsited) {
            return sendExsited(res, 'email is exsited');
        };

        const phoenExsited = await prisma.employees.findUnique({ where: { phone: parseInt(phone) } });
        if (phoenExsited) {
            return sendExsited(res, 'phone is exsited');
        }

        const natinalIdCarExsited = await prisma.employees.findUnique({ where: { natinalIdCard: natinalIdCard?.name } });
        if (natinalIdCarExsited) {
            return sendExsited(res, 'natinalIdCard is exsited');
        }
        const profileExsited = await prisma.employees.findUnique({ where: { profile: profile?.name } });
        if (profileExsited) {
            return sendExsited(res, 'profile is exsited');
        }

        const newProfile = await sendUploadImage(profile);
        const newNatinalIdCard = await sendUploadImage(natinalIdCard);

        const newEmployee = await prisma.employees.create({
            data: { firstName, lastName, gender, email, phone: parseInt(phone), village, distrit, provinced, natinalIdCard: newNatinalIdCard, profile: newProfile, salary: parseFloat(salary), birthday: new Date(birthday), department, pricePerDay: parseFloat(pricePerDay) }
        });
        sendCreated(res, 'create new employee successfully', newEmployee);
    } catch (error) {
        sendError(res, error);
    }
}

//get all employees
export const getAllEmployees = async (req, res) => {
    try {
        const employees = await prisma.employees.findMany();
        sendSuccess(res, 'get all employee successfully', employees);
    } catch (error) {
        sendEmpty(res, error);
    }
}

//get one employee
export const getOneEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await prisma.employees.findUnique({ where: { id } });
        if (!employee) {
            return sendEmpty(res, 'employee not found');
        }
        sendSuccess(res, 'get one employee successfully', employee);
    } catch (error) {
        sendError(res, error);
    }
}

//update salary
export const updateSalary = async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return sendValidator(res, error);
    }
    try {
        const { id } = req.params;
        const { salary } = req.body;
        const employee = await prisma.employees.findUnique({ where: { id } });
        if (!employee) {
            return sendEmpty(res, 'employee not found');
        }
        await prisma.employees.update({
            where: { id },
            data: { salary: parseFloat(salary) }
        });
        sendUpdate(res, 'update salary successfully');
    } catch (error) {
        sendError(res, error);
    }
}

//change phone number
export const changePhone = async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return sendValidator(res, error);
    }
    try {
        const { id } = req.params;
        const { phone } = req.body;
        const phoneInt = parseInt(phone);
        const employee = await prisma.employees.findUnique({ where: { id } });
        if (!employee) {
            return sendEmpty(res, 'employee not found');
        }
        if (employee.phone !== phoneInt) {
            const phoneExsited = await prisma.employees.findUnique({ where: { phone: phoneInt } });
            if (phoneExsited) {
                return sendExsited(res, 'phone is exsited');
            }
        }
        await prisma.employees.update({
            where: { id },
            data: { phone: phoneInt }
        });
        sendUpdate(res, 'change phone successfully');
    } catch (error) {
        sendError(res, error);
    }
}

//update department and pricePerDay
export const updatedepartment = async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return sendValidator(res, error);
    }
    try {
        const { id } = req.params;
        const { department, pricePerDay } = req.body;
        const employee = await prisma.employees.findUnique({ where: { id } });
        if (!employee) {
            return sendEmpty(res, 'employee not found');
        }
        await prisma.employees.update({
            where: { id },
            data: { department, pricePerDay: parseFloat(pricePerDay) }
        });
        sendUpdate(res, 'update department and price for employee successfully');
    } catch (error) {
        sendError(res, error);
    }
}

//update personal infornation
export const updatePersonalInfo = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, email, village, distrit, provinced, birthday } = req.body;
        const profile = req?.files?.profile;
        const natinal_id_card = req?.files?.natinal_id_card;

        const employee = await prisma.employees.findUnique({ where: { id } });
        if (!employee) {
            return sendEmpty(res, 'employee not found');
        }
        if (employee.email !== email) {
            const emailExsited = await prisma.employees.findUnique({ where: { email } });
            if (emailExsited) {
                return sendExsited(res, 'email is exsited');
            }
        }

        if (profile) {
            await sendRemoveImage(employee.profile);
        }
        const newProfile = await sendUploadImage(profile);

        if (natinal_id_card) {
            await sendRemoveImage(employee.natinalIdCard);
        }
        const newNatinalIdCard = await sendUploadImage(natinal_id_card);

        await prisma.employees.update({
            where: { id },
            data: { firstName, lastName, email, village, distrit, provinced, birthday: new Date(birthday), ...(natinal_id_card && { natinalIdCard: newNatinalIdCard }), ...(profile && { profile: newProfile }) }
        });
        sendUpdate(res, 'update personal infornation successfully');
    } catch (error) {
        sendError(res, error);
    }
}

//delete employee
export const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await prisma.employees.findUnique({ where: { id } });
        if (!employee) {
            return sendEmpty(res, 'employee not found');
        }
        sendRemoveImage(employee.profile);
        sendRemoveImage(employee.natinalIdCard);

        await prisma.employees.delete({ where: { id } });
        sendDelete(res, 'delete employee successfully');
    } catch (error) {
        sendError(res, error);
    }
}