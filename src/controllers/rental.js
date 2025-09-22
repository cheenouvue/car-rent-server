import { validationResult } from "express-validator";
import prisma from "../config/config.js";
import {
  sendEmpty,
  sendError,
  sendRemoveImage,
  sendSuccess,
  sendUpdate,
  sendUploadImage,
  sendValidator,
} from "../service/reponseHandler.js";
import { removeFile, uploadFile } from "../service/uploadService.js";

// CREATE function - to create a new rental entry
export const create = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return sendValidator(res, error);
  }
  try {
    const {
      first_name,
      last_name,
      phone,
      village,
      distrit,
      provinced,
      booking_pay,
      date_start_rent,
      date_end_rent,
      localtion,
      promotion_id,
      coupon_id,
      car_id,
      employee_id,
      bank_id,
      coupon_discount,
      Deposit,
      statu,
      employee_pay,
      pay_full,
    } = req.body;
    const id_or_passport = req.files?.id_or_passport;
    const dri_icenes = req.files?.dri_icenes;
    const pay_full_image = req.files?.pay_full_image;
    const pay_booking_image = req.files?.pay_booking_image; //new add
    const card_person = req.files?.card_person; //new add
    const user = await prisma.users.findUnique({
      where: { id: req?.user?.id },
    });
    const New_bank_id = bank_id ? bank_id : null;

    console.log("employee => ", employee_id);
    if (!user) {
      return sendEmpty(res, "user not found");
    }
    const car = await prisma.car.findUnique({ where: { id: car_id } });
    if (!car) {
      return sendEmpty(res, "car not found");
    }

    if (promotion_id) {
      const promotion = await prisma.promotions.findUnique({
        where: { id: promotion_id },
      });
      if (!promotion) {
        return sendEmpty(res, "promotion not found");
      }
    }
    if (coupon_id) {
      const coupon = await prisma.coupons.findUnique({
        where: { id: coupon_id },
      });
      if (!coupon) {
        return sendEmpty(res, "coupon not found");
      }
    }
    if (employee_id) {
      const employee = await prisma.employees.findUnique({
        where: { id: employee_id },
      });
      if (!employee) {
        return sendEmpty(res, "employee not found");
      }
    }

    const id_or_passport_name = await sendUploadImage(id_or_passport); //New change
    const dri_icenes_name = await sendUploadImage(dri_icenes); //New change
    const pay_booking_image_name = await sendUploadImage(pay_booking_image); //New change
    const card_person_name = await sendUploadImage(card_person); //New change

    const pay_full_image_name = await sendUploadImage(pay_full_image);

    // Create the rental data in the database
    const rental = await prisma.rental.create({
      data: {
        first_name: first_name,
        last_name: last_name,
        phone: parseInt(phone),
        village,
        distrit,
        provinced,
        id_or_passport: id_or_passport_name, //New change
        dri_icenes: dri_icenes_name, //New change
        pay_booking_image: pay_booking_image_name, //New change
        card_person: card_person_name, //New change
        booking_pay: parseFloat(booking_pay),
        date_start_rent: new Date(date_start_rent),
        date_end_rent: new Date(date_end_rent),
        ...(localtion && { localtion: localtion }),
        user_id: req.user.id,
        car_id,
        bank_id: New_bank_id,
        ...(promotion_id && { promotion_id: promotion_id }),
        ...(coupon_id && { coupon_id: coupon_id }),
        ...(employee_id && { employee_id: employee_id }),
        coupon_discount: parseFloat(coupon_discount),
        Deposit: parseFloat(Deposit),
        ...(employee_pay && { employee_pay: parseFloat(employee_pay) }),
        ...(statu && { statu: statu }),
        pay_full_image: pay_full_image_name,
        ...(pay_full && { pay_full: parseFloat(pay_full) }),
      },
    });

    return sendSuccess(res, "SuccessFul", rental);
  } catch (error) {
    console.error("Error creating rental:", error);
    return sendError(res, "Error creating rental: " + error.message);
  }
};

// LIST function - to get all rental entries
export const list = async (req, res) => {
  try {
    const rentals = await prisma.rental.findMany({
      orderBy: {
        createdAt: "desc", // ✅ เรียงจากใหม่ไปเก่า
      },
      include: {
        user: true,
        car: {
          include: {
            carType: true,
          },
        },
        bank: true,
        employee: true,
        promotion: true,
        coupon: true,
      },
    });
    return sendSuccess(res, "SuccessFul", rentals);
  } catch (error) {
    return sendError(res, "Error fetching rentals: ", error);
  }
};

// LIST BY ID function - to get a rental entry by ID
export const listBy = async (req, res) => {
  try {
    const { id } = req.params;
    const rental = await prisma.rental.findUnique({
      where: { id: id },
      include: {
        user: true,
        car: {
          include: {
            carType: true,
            insurance: true,
          },
        },
        bank: true,
        promotion: true,
        coupon: true,
        employee: true,
      },
    });

    if (!rental) {
      return sendEmpty(res, "Rental not found");
    }

    return sendSuccess(res, "SuccessFul", rental);
  } catch (error) {
    return sendError(res, "Error fetching rental by ID: ", error);
  }
};

// get one by user_id
export const getOneByUserId = async (req, res) => {
  try {
    const rental = await prisma.rental.findMany({
      where: { user_id: req.user?.id },
    });
    if (!rental) {
      sendEmpty(res, "you did not to rental");
    }
    return sendSuccess(res, "SuccessFul", rental);
  } catch (error) {
    sendError(res, error);
  }
};

// UPDATE function - to update a rental entry by ID
export const update = async (req, res) => {
  try {
    const { id } = req.params; // Extract id from URL params
    const {
      first_name,
      last_name,
      phone,
      booking_pay,
      usersId,
      carId,
      employeesId,
      bankId,
    } = req.body;
    const passport = req.files?.passport;
    const identity_card = req.files?.identity_card;
    const dri_icenes = req.files?.dri_icenes;
    const pay_image = req.files?.pay_image;

    // Get the existing rental data
    const check = await prisma.rental.findUnique({
      where: { id: parseInt(id) }, // Ensure `id` is parsed as an integer
    });

    if (!check) {
      return sendError(res, "Rental not found.");
    }

    // Handle file uploads if new files are provided, otherwise use existing files
    const passportFileName = passport
      ? await uploadFile(passport)
      : check.passport;
    const identityCardFileName = identity_card
      ? await uploadFile(identity_card)
      : check.identity_card;
    const driIcFileName = dri_icenes
      ? await uploadFile(dri_icenes)
      : check.dri_icenes;
    const payImageFileName = pay_image
      ? await uploadFile(pay_image)
      : check.pay_image;

    // Remove old files if new ones are uploaded
    if (passport && check.passport) removeFile(check.passport);
    if (identity_card && check.identity_card) removeFile(check.identity_card);
    if (dri_icenes && check.dri_icenes) removeFile(check.dri_icenes);
    if (pay_image && check.pay_image) removeFile(check.pay_image);

    // Update the rental data in the database
    const rental = await prisma.rental.update({
      where: { id: parseInt(id) }, // Ensure `id` is parsed as an integer
      data: {
        first_name,
        last_name,
        phone: parseInt(phone), // Ensure phone is an integer
        passport: passportFileName,
        identity_card: identityCardFileName,
        dri_icenes: driIcFileName,
        pay_image: payImageFileName,
        booking_pay: parseFloat(booking_pay), // Ensure booking_pay is a float
        usersId: usersId,
        carId: carId,
        employeesId: employeesId,
        bankId: bankId,
      },
    });

    return sendSuccess(res, "Rental updated successfully", rental);
  } catch (error) {
    console.error("Error updating rental:", error);
    return sendError(res, "Error updating rental: " + error.message);
  }
};

//update statu
export const updateStatuRental = async (req, res) => {
  try {
    const { id, statu } = req.params;
    const rental = await prisma.rental.findUnique({ where: { id } });
    if (!rental) {
      return sendEmpty(res, "rental no found");
    }
    await prisma.rental.update({
      where: { id },
      data: { statu },
    });
    sendUpdate(res, "update successfully");
  } catch (error) {
    sendError(res, error);
  }
};

//update statu_pay_full
// export const updateStatuPayFullRental = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const rental = await prisma.rental.findUnique({ where: { id } });
//     if (!rental) {
//       return sendEmpty(res, "rental no found");
//     }
//     await prisma.rental.update({
//       where: { id },
//       data: { statu_pay_full: true },
//     });
//     sendUpdate(res, "update successfully");
//   } catch (error) {
//     sendError(res, error);
//   }
// };

//update pay_full_image
export const updateReceipt = async (req, res) => {
  try {
    const { id } = req.params;
    const pay_full_image = req?.files?.pay_full_image;

    const rental = await prisma.rental.findUnique({ where: { id } });
    if (!rental) {
      return sendEmpty(req, "rental no found");
    }

    await sendUploadImage(pay_full_image);

    // console.log('statu => ', statu)

    await prisma.rental.update({
      where: { id },
      data: {
        statu: "paying",
        pay_full_image: pay_full_image?.name,
      },
    });
    sendUpdate(res, "update successfully");
  } catch (error) {
    sendError(res, error);
  }
};

// export const updatePayFull = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { statu } = req.body;
//     const pay_full_image = req?.files?.pay_full_image;

//     const rental = await prisma.rental.findUnique({ where: { id } });
//     if (!rental) {
//       return sendEmpty(req, "rental no found");
//     }

//     await sendUploadImage(pay_full_image);

//     // console.log('statu => ', statu)

//     await prisma.rental.update({
//       where: { id },
//       data: {
//         statu_pay_full: true,
//         statu: "paying",
//         pay_full_image: pay_full_image?.name,
//       },
//     });
//     sendUpdate(res, "update successfully");
//   } catch (error) {
//     sendError(res, error);
//   }
// };

// REMOVE function - to delete a rental entry by ID
export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const check = await prisma.rental.findUnique({
      where: { id: id },
    });

    if (!check) {
      return sendEmpty(res, "Rental not found.");
    }

    // Delete the images if they exist
    if (check.id_or_passport) sendRemoveImage(check.id_or_passport);
    if (check.dri_icenes) sendRemoveImage(check.dri_icenes);
    if (check.pay_image) sendRemoveImage(check.pay_image);
    if (check.pay_booking_image) sendRemoveImage(check.pay_booking_image);

    // Delete the rental entry
    const rental = await prisma.rental.delete({
      where: { id: id },
    });

    return sendSuccess(res, "successfully.", rental);
  } catch (error) {
    return sendError(res, "Error deleting rental: ", error);
  }
};
//New add :
export const getUserRentlist = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return sendValidator(res, error);
  }
  try {
    const rentals = await prisma.rental.findMany({
      where: {
        user_id: req.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        car: true,
        promotion: true,
        coupon: true,
      },
    });
    return sendSuccess(res, "SuccessFul", rentals);
  } catch (error) {
    return sendError(res, "Error fetching rentals: ", error);
  }
};

export const payFullRental = async (req, res) => {
  try {
    const { id } = req.params;
    const { statu, pay_full } = req.body;
    const pay_full_image = req.files?.pay_full_image;

    const pay_full_image_new = await sendUploadImage(pay_full_image);
    const test = await prisma.rental.update({
      where: { id: id },
      data: {
        pay_full_image: pay_full_image_new,
        ...(pay_full && { pay_full: parseFloat(pay_full) }),
        ...(statu ? { statu: statu } : { statu: 'paying' })
      },
    });
    sendSuccess(res, "Success Create test", test);
  } catch (erro) {
    console.log(erro);
    sendError(res, "Create insurance Error");
  }
};

export const listDate = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const rental = await prisma.rental.findMany({
      where: {
        date_start_rent: {
          lte: new Date(endDate),
        },
        date_end_rent: {
          gte: new Date(startDate),
        },
      },
      select: {
        car_id: true,
        employee_id: true,
        statu: true,
      },
    });

    if (!rental || rental.length === 0) {
      return res.status(200).json({
        message: "Rental not found for the given dates.",
      });
    }

    return sendSuccess(res, "Successful", rental);
  } catch (error) {
    console.error(error);
    return sendError(res, "Error fetching rental by dates.", error);
  }
};

export const rentalCheck = async (req, res) => {
  try {
    const { startDate, endDate, carId } = req.query;

    const start = new Date(startDate?.trim());
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate?.trim());
    end.setHours(23, 59, 59, 999);

    const rentals = await prisma.rental.findMany({
      where: {
        date_start_rent: { lte: end },
        date_end_rent: { gte: start },
        car_id: carId,
        deletestatu: false,
      },
      select: { user_id: true },
    });

    const isConflict = rentals.some((r) => r.user_id !== req.user?.id);

    return res.status(200).json({
      success: true,
      conflict: isConflict,
      message: isConflict
        ? "ລົດນີ້ຖືກຈອງແລ້ວໂດຍຜູ້ໃຊ້ຄົນອື່ນ"
        : "ລົດພ້ອມໃຫ້ຈອງ",
    });
  } catch (error) {
    console.error("RentalCheck Error:", error); // ✅ สำคัญ! แสดง error ใน console
    return res.status(500).json({
      success: false,
      message: "ເກີດຂໍ້ຜິດພາດ",
      error: error.message, // ส่งกลับข้อความผิดพลาดด้วย
    });
  }
};

//userDelete
export const userDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const rental = await prisma.rental.findUnique({ where: { id } });
    if (!rental) {
      return sendEmpty(res, "rental no found");
    }
    await prisma.rental.update({
      where: { id },
      data: { deletestatu: true },
    });
    sendUpdate(res, "userDelete successfully");
  } catch (error) {
    sendError(res, error);
  }
};
