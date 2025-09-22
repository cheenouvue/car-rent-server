import { validationResult } from "express-validator";
import prisma from "../config/config.js";
import {
  sendEmpty,
  sendError,
  sendRemoveImage,
  sendSuccess,
  sendUploadImage,
  sendUploadImageForm,
  sendValidator,
} from "../service/reponseHandler.js";
import bcrypt from "bcryptjs";
import path from "path";
import fs from "fs";
import { generateOTP, sendOTPEmail } from "../utils/otpMail.js";

//getAllUser
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.users.findMany();
    sendSuccess(res, "get all users successfully", users);
  } catch (error) {
    res.status(500).json({ errors: error.message });
  }
};

//getOneUser
export const getOneUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.users.findUnique({ where: { id } });
    if (!user) {
      return res.status(400).json({ message: "didn't have your userId" });
    }
    sendSuccess(res, "successfully", user);
  } catch (error) {
    res.status(500).json({ errors: error.message });
  }
};

//getUserProfile
export const getUserProfile = async (req, res) => {
  try {
    const user = await prisma.users.findUnique({ where: { id: req.user.id } });
    if (!user) {
      return res.status(400).json({ message: "your profile is not foun" });
    }
    sendSuccess(res, "successfully", user);
  } catch (error) {
    res.status(500).json({ errors: error.message });
  }
};

//update Role to user
export const updateRoleUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.users.findUnique({ where: { id } });
    if (!user) {
      return res.status(400).json({ message: "user is empty" });
    }
    const roleUser = await prisma.users.update({
      where: { id },
      data: { role: "user" },
    });
    sendSuccess(res, "update to role user successfully", roleUser);
  } catch (error) {
    res.status(500).json({ errors: error.message });
  }
};
//update Role to Admin
export const updateRoleAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.users.findUnique({ where: { id } });
    if (!user) {
      return res.status(400).json({ message: "user is empty" });
    }
    const roleAdmin = await prisma.users.update({
      where: { id: user.id },
      data: { role: "admin" },
    });
    sendSuccess(res, "update to role admin successfully", roleAdmin);
  } catch (error) {
    res.status(500).json({ errors: error.message });
  }
};

//update Role to SuperAdmin
export const updateRoleSuperAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.users.findUnique({ where: { id } });
    if (!user) {
      return res.status(400).json({ message: "user is empty" });
    }
    const roleSuperAdmin = await prisma.users.update({
      where: { id: user.id },
      data: { role: "superAdmin" },
    });
    sendSuccess(res, "update to role superAdmin successfully", roleSuperAdmin);
  } catch (error) { }
};

//update Role to sofer
export const updateRoleSofer = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.users.findUnique({ where: { id } });
    if (!user) {
      return res.status(400).json({ message: "user is empty" });
    }
    const roleSofer = await prisma.users.update({
      where: { id: id },
      data: { role: "sofer" },
    });
    sendSuccess(res, "update to role sofer successfully", roleSofer);
  } catch (error) { }
};

//update Profile
export const updateProfile = async (req, res) => {
  try {
    const { firstName } = req.body;
    const profile = req?.files?.profile;
    const user = await prisma.users.findUnique({ where: { id: req.user.id } });
    if (!user) {
      return sendEmpty(res, "user not found");
    }

    if (profile) {
      await sendRemoveImage(user?.profile);
    }
    const newProfile = await sendUploadImage(profile);

    const updateProfile = await prisma.users.update({
      where: { id: req.user.id },
      data: { firstName, ...(profile && { profile: newProfile }) },
    });
    sendSuccess(res, "update your profile successfully", updateProfile);
  } catch (error) {
    res.status(500).json({ errors: error.message });
  }
};

//update profile by id
export const updateProfileById = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName } = req.body;
    const profile = req?.files?.profile;
    const user = await prisma.users.findUnique({ where: { id } });
    if (!user) {
      return sendEmpty(res, "user not found");
    }

    if (profile) {
      await sendRemoveImage(user?.profile);
    }
    const newProfile = await sendUploadImage(profile);

    const updateProfile = await prisma.users.update({
      where: { id },
      data: { firstName, ...(profile && { profile: newProfile }) },
    });
    sendSuccess(res, "update your profile successfully", updateProfile);
  } catch (error) {
    res.status(500).json({ errors: error.message });
  }
};

//delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("id =>", id);
    const user = await prisma.users.findUnique({ where: { id } });
    console.log("user => ", user);
    if (!user) {
      return res.status(400).json({ message: "cann't delete user by your id" });
    }

    sendRemoveImage(user?.profile);

    const deleteUser = await prisma.users.delete({ where: { id } });
    sendSuccess(res, "delete user successfully", deleteUser);
  } catch (error) {
    res.status(500).json({ errors: error.message });
  }
};

//change password
export const changePassword = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return sendValidator(res, error);
  }
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await prisma.users.findUnique({ where: { id: req.user.id } });
    if (!user) {
      return res.status(400).json({ message: "user not foun" });
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "old password not ture" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);

    const changePassword = await prisma.users.update({
      where: { id: user.id },
      data: { password: hashPassword },
    });
    sendSuccess(res, "change password successfully", changePassword);
  } catch (error) {
    sendError(res, message);
  }
};

//delete otp
const deleteOtpUser = async (user_id) => {
  await prisma.users.update({
    where: { id: user_id },
    data: { otp: {} },
  });
};

//create opt
export const sendOTPEmailController = async (req, res) => {
  try {
    const { user_id, email } = req.params;
    const user = await prisma.users.findUnique({ where: { id: user_id } });
    if (!user) {
      return sendEmpty(res, "user not found");
    }
    const generateOtp = generateOTP();
    const otp = {
      code: generateOtp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    };
    await prisma.users.update({
      where: { id: user_id },
      data: { otp: otp },
    });

    await sendOTPEmail(email, generateOtp);

    res
      .status(200)
      .json({ message: "OPT sent successfully", expiresAt: otp?.expiresAt });
  } catch (error) {
    console.error("Error sending OTP via email:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyOTPAndDeleteAccountController = async (req, res) => {
  try {
    const { user_id, otp } = req.params;
    console.log(otp);
    const user = await prisma.users.findUnique({ where: { id: user_id } });
    if (!user) {
      return sendEmpty(res, "user not found");
    }
    if (!user?.otp || !user?.otp?.code || !user?.otp?.expiresAt) {
      return sendEmpty(res, "OTP not found or exppired");
    }

    const currentTimestampu = new Date().getTime();
    if (otp !== user?.otp?.code || currentTimestampu > user?.otp?.expiresAt) {
      return sendEmpty(res, "Invalid or expired OTP");
    }
    await deleteOtpUser(user_id);
    res.status(200).json({ message: "User account deleted successfully" });
  } catch (error) {
    console.error("Error deleting user account:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//New add
export const getOneForUser = async (req, res) => {
  console.log("req.user.id ", req.user.id);
  try {
    const getOneForUser = await prisma.users.findUnique({
      where: { id: req.user.id },
      select: {
        firstName: true,
        email: true,
        profile: true,
        statu: true,
      },
    });

    sendSuccess(res, "Success", getOneForUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const uploadImage = async (req, res) => {
  try {
    if (!req.files || !req.files.images) {
      return sendEmpty(res, "กรุณาเลือกไฟล์อย่างน้อย 1 รูป");
    }

    const files = Array.isArray(req.files.images)
      ? req.files.images
      : [req.files.images];

    const fileNames = [];

    for (const file of files) {
      await sendUploadImageForm(file);
      fileNames.push(file.name);
    }

    return sendSuccess(res, "อัปโหลดรูปภาพสำเร็จ", { fileNames });
  } catch (error) {
    return sendError(res, error);
  }
};
