import path from 'path';
import fs from 'fs';

export const sendCreated = (res, message, data) => {
    return res.status(201).json({ status: true, message, data: data });
}
export const sendSuccess = (res, message, data) => {
    return res.status(200).json({ status: true, message, data: data });
}
export const sendUpdate = (res, message) => {
    return res.status(200).json({ status: true, message });
}
export const sendDelete = (res, message) => {
    return res.status(200).json({ status: true, message });
}
export const sendEmpty = (res, message) => {
    return res.status(400).json({ status: false, message });
}
export const sendError = (res, error) => {
    return res.status(500).json({ errors: error.message });
}
export const sendExsited = (res, message) => {
    return res.status(401).json({ status: false, message });
}
export const sendValidator = (res, error) => {
    return res.status(400).json({ status: false, errors: error.array().map(e => ({ msg: e.msg, path: e.path })) })
}

export const sendUploadImage = async (data) => {
    if (!data) return;
    const uploadDir = path.join(path.resolve(), 'src/uploads/images');
    const fileExt = path.extname(data.name);
    const fileName = path.basename(data.name, fileExt);
    const uniqueName = `${fileName}-${Date.now()}${fileExt}`;

    const uploadPath = path.join(uploadDir, uniqueName);

    await data.mv(uploadPath);
    return uniqueName;
}
export const sendUploadImageForm = async (data) => {
    console.log(data)
    if (!data) return;
    const uploadDir = path.join(path.resolve(), 'src/uploads/images');
    const fileExt = path.extname(data.name);
    const fileName = path.basename(data.name, fileExt);
    const uniqueName = `${fileName}${fileExt}`;

    const uploadPath = path.join(uploadDir, uniqueName);

    await data.mv(uploadPath);
    return uniqueName;
}

export const sendUploadIcon = async (data) => {
    if (!data) return;
    const uploadDir = path.join(path.resolve(), 'src/uploads/icons');
    const fileExt = path.extname(data.name);
    const fileName = path.basename(data.name, fileExt);
    const uniqueName = `${fileName}-${Date.now()}${fileExt}`;

    const uploadPath = path.join(uploadDir, uniqueName);

    await data.mv(uploadPath);
    return uniqueName;
}

export const sendRemoveImage = async (data) => {
    if (!data) return;
    const uploadDir = path.join(path.resolve(), 'src/uploads/images');
    const uploadPath = path.join(uploadDir, data);

    if (fs.existsSync(uploadPath)) {
        fs.unlinkSync(uploadPath)
    }
    return;
}
export const sendRemoveIcon = async (data) => {
    if (!data) return;
    const uploadDir = path.join(path.resolve(), 'src/uploads/icons');
    const uploadPath = path.join(uploadDir, data);

    if (fs.existsSync(uploadPath)) {
        fs.unlinkSync(uploadPath)
    }
    return;
}