import { param, validationResult } from "express-validator";
import prisma from "../config/config.js";
import {
  sendEmpty,
  sendError,
  sendRemoveIcon,
  sendRemoveImage,
  sendSuccess,
  sendUpdate,
  sendUploadImage,
  sendValidator,
} from "../service/reponseHandler.js";
import { removeFile, uploadFile } from "../service/uploadService.js";

//create
export const create = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return sendValidator(res, error);
  }
  try {
    const { name, year, plate_city, plate_text, plate_number, gps, car_seat, car_gear, color, status, price, car_type_id, insurance_id, book, deposit } = req.body;
    const image_profile = req?.files?.image_profile;
    const image_front = req.files?.image_front;
    const image_side = req?.files?.image_side;
    const image_behind = req?.files?.image_behind;
    const image_in = req?.files?.image_in;

    const carType = await prisma.carType.findUnique({ where: { id: car_type_id } });
    if (!carType) {
      return sendEmpty(res, 'car type id not found');
    }

    const insurance = await prisma.insurance.findUnique({ where: { id: insurance_id } });
    if (!insurance) {
      return sendEmpty(res, 'insurance id not found');
    }
    const newImage_profile = await sendUploadImage(image_profile);
    const newImage_front = await sendUploadImage(image_front);
    const newImage_side = await sendUploadImage(image_side);
    const newImage_behind = await sendUploadImage(image_behind);
    const newImage_in = await sendUploadImage(image_in);

    const parsedPrice = parseFloat(price);
    const parsed_plate_number = parseInt(plate_number);

    const car = await prisma.car.create({
      data: {
        name: name,
        image_profile: newImage_profile,
        image_front: newImage_front,
        image_side: newImage_side,
        image_behind: newImage_behind,
        image_in: newImage_in,
        year: year,
        plate_city: plate_city,
        plate_text: plate_text,
        plate_number: parsed_plate_number,
        gps: gps,
        car_seat: car_seat,
        car_gear: car_gear,
        color: color,
        status: status,
        price: parsedPrice,
        carTypeId: car_type_id,
        insuranceId: insurance_id,
        book: parseFloat(book),
        deposit: parseFloat(deposit),
      },
    });
    sendSuccess(res, "Success", car);
  } catch (err) {
    console.log(err);
    sendError(res, "Car Erro ");
  }
};

// list
export const list = async (req, res) => {
  try {
    const car = await prisma.car.findMany({
      include: {
        carType: true,
        insurance: true
      },
    });
    sendSuccess(res, "Success", car);
  } catch (err) {
    console.log(err);
    sendError(res, "Car Erro ");
  }
};

// listby
export const listBy = async (req, res) => {
  try {
    const { id } = req.params;

    // Find cars based on filters
    const car = await prisma.car.findUnique({
      where: { id },
      include: {
        carType: true,
        insurance: true
      }
    });
    if (!car) {
      return sendEmpty(res, 'car not found');
    }
    sendSuccess(res, "Success", car);
  } catch (err) {
    console.error(err);
    sendError(res, "Car Error");
  }
};

// List cars by price range
export const listPrice = async (req, res) => {
  try {
    const { min_price, max_price } = req.query;

    console.log("Received min_price:", min_price, "max_price:", max_price); // Log received values

    let whereCondition = {};

    // Apply price filter only if min_price or max_price is provided
    if (min_price !== undefined || max_price !== undefined) {
      whereCondition.price = {};

      if (min_price !== undefined) {
        whereCondition.price.gte = parseFloat(min_price); // Convert to float
      }
      if (max_price !== undefined) {
        whereCondition.price.lte = parseFloat(max_price); // Convert to float
      }
    }

    // Find cars based on the filter
    const cars = await prisma.car.findMany({
      where: whereCondition,
      select: {
        id: true,
      },
    });

    // Check if no cars were found
    if (cars.length === 0) {
      return sendEmpty(res, "No car found in this price range.");
    }

    sendSuccess(res, "Cars retrieved successfully.", cars);
  } catch (err) {
    console.error(err);
    sendError(res, "Car Price Error");
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      year,
      plate_city,
      plate_text,
      plate_number,
      gps,
      car_seat,
      car_gear,
      color
    } = req.body;
    const image_profile = req.files?.image_profile;
    const image_front = req.files?.image_front;
    const image_side = req.files?.image_side;
    const image_behind = req.files?.image_behind;
    const image_in = req.files?.image_in;

    const check = await prisma.car.findUnique({ where: { id } });
    if (!check) return sendEmpty(res, "car not found");

    if (image_profile) {
      sendRemoveImage(check?.image?.image_profile);
    }
    if (image_front) {
      sendRemoveImage(check?.image?.image_front);
    }
    if (image_side) {
      sendRemoveImage(check?.image?.image_side);
    }
    if (image_behind) {
      sendRemoveImage(check?.image?.image_behind);
    }
    if (image_in) {
      sendRemoveImage(check?.image?.image_in);
    }

    const newImage_profile = await sendUploadImage(image_profile);
    const newImage_front = await sendUploadImage(image_front);
    const newImage_side = await sendUploadImage(image_side);
    const newImage_behind = await sendUploadImage(image_behind);
    const newImage_in = await sendUploadImage(image_in);

    // const all_image = {
    //   ...(image_profile ? { image_profile: image_profile?.name } : { image_profile: check?.image?.image_profile }),
    //   ...(image_front ? { image_front: image_front?.name } : { image_front: check?.image?.image_front }),
    //   ...(image_side ? { image_side: image_side?.name } : { image_side: check?.image?.image_side }),
    //   ...(image_behind ? { image_behind: image_behind?.name } : { image_behind: check?.image?.image_behind }),
    //   ...(image_in ? { image_in: image_in?.name } : { image_in: check?.image?.image_in }),
    // }
    const car = await prisma.car.update({
      where: {
        id,
      },
      data: {
        name: name,
        ...(image_profile && { image_profile: newImage_profile }),
        ...(image_front && { image_front: newImage_front }),
        ...(image_side && { image_side: newImage_side }),
        ...(image_behind && { image_behind: newImage_behind }),
        ...(image_in && { image_in: newImage_in }),
        year: year,
        plate_city: plate_city,
        plate_text: plate_text,
        plate_number: parseInt(plate_number),
        gps: gps,
        car_seat: car_seat,
        car_gear: car_gear,
        color: color,
      },
    });
    sendSuccess(res, "Success", car);
  } catch (err) {
    console.log(err);
    sendError(res, "Car Erro ");
  }
};

//update statu
export const updateCarStatu = async (req, res) => {
  try {
    const { id, statu } = req.params;
    const car = await prisma.car.findUnique({ where: { id } });
    if (!car) {
      return sendEmpty(res, 'car not found');
    }
    await prisma.car.update({
      where: { id },
      data: { status: statu }
    });
    sendUpdate(res, 'update car statu successfully');
  } catch (error) {
    sendError(res, error);
  }
}

//update insurance
export const updateInsurance = async (req, res) => {
  try {
    const { id, insurance_id } = req.params;
    const insurance = await prisma.insurance.findUnique({ where: { id: insurance_id } });
    if (!insurance) {
      return sendEmpty(res, 'insurance not found');
    }
    const car = await prisma.car.findUnique({ where: { id } });
    if (!car) {
      return sendEmpty(res, 'car not found');
    }
    await prisma.car.update({
      where: { id },
      data: { insuranceId: insurance_id }
    });
    sendUpdate(res, 'update insurance successfully');
  } catch (error) {
    sendError(res, error);
  }
}

//update car type
export const updateCarType = async (req, res) => {
  try {
    const { id, car_type_id } = req.params;
    const carType = await prisma.carType.findUnique({ where: { id: car_type_id } });
    if (!carType) {
      return sendEmpty(res, 'carType not found');
    }
    const car = await prisma.car.findUnique({ where: { id } });
    if (!car) {
      return sendEmpty(res, 'car not found');
    }
    await prisma.car.update({
      where: { id },
      data: { carTypeId: car_type_id }
    });
    sendUpdate(res, 'update carType successfully');
  } catch (error) {
    sendError(res, error);
  }
}

//update price
export const updatePrice = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return sendValidator(res, error);
  }
  try {
    const { id } = req.params;
    const { price, book, deposit } = req.body;
    const car = await prisma.car.findUnique({ where: { id } });
    if (!car) {
      return sendEmpty(res, 'car not found');
    }
    await prisma.car.update({
      where: { id },
      data: { price: parseFloat(price), book: parseFloat(book), deposit: parseFloat(deposit) }
    });
    sendUpdate(res, 'update price successfully');
  } catch (error) {
    sendError(res, error);
  }
}

//remove
export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const check = await prisma.car.findUnique({
      where: {
        id: id,
      },
    });
    if (!check) return sendEmpty(res, "NO Data");

    sendRemoveImage(check?.image?.image_profile);
    sendRemoveImage(check?.image?.image_front);
    sendRemoveImage(check?.image?.image_side);
    sendRemoveImage(check?.image?.image_behind);
    sendRemoveImage(check?.image?.image_in);

    const car = await prisma.car.delete({
      where: {
        id: id,
      },
    });
    sendSuccess(res, "Success", car);
  } catch (err) {
    console.log(err);
    sendError(res, "Car Erro ");
  }
};


//New Add 
export const listGear = async (req, res) => {
  try {
    const { gearAuto, gearManual } = req.query;

    // Create filter array based on non-empty values
    let car_gear = [];
    if (gearAuto?.trim()) car_gear.push(gearAuto);
    if (gearManual?.trim()) car_gear.push(gearManual);

    // Create conditionally filtered query
    const whereClause =
      car_gear.length > 0 ? { car_gear: { in: car_gear } } : {}; // Empty filter = get all cars

    const car = await prisma.car.findMany({
      where: whereClause,
      select: {
        id: true,
      },
    });

    sendSuccess(res, "Success", car);
  } catch (err) {
    console.log(err);
    sendError(res, "CarGear Error");
  }
};
