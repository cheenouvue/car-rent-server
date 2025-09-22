import { check } from "express-validator";

export const registerValidation = [
  check("firstName").notEmpty().withMessage("firstName is required"),
  check("email").isEmail().withMessage("email is not true"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("your password should lkong than 6"),
];

export const loginValidation = [
  check("email").isEmail().withMessage("your email not true"),
  check("password").isLength({ min: 6 }).withMessage("your password not true"),
];

export const profileValidation = [
  check("firstName").notEmpty().withMessage("firstName is required"),
  check("lastName").notEmpty().withMessage("lastName is required"),
  check("profile").custom((value, { req }) => {
    if (!req?.files) {
      throw new Error("image is required");
    }
    if (!req?.files?.profile?.mimetype.startsWith("image/")) {
      throw new Error("image should be type image");
    }
    return true;
  }),
];

export const passworkValidation = [
  check("oldPassword")
    .isLength({ min: 6 })
    .withMessage("Old Password must be at least 8 characters long"),
  check("newPassword")
    .isLength({ min: 6 })
    .withMessage("New Password must be at least 8 characters long"),
];

export const employeeValidation = [
  // check('dept_id').notEmpty().withMessage('dept_id is required'),
  check("firstName").notEmpty().withMessage("firstName is required"),
  check("lastName").notEmpty().withMessage("lastName is required"),
  check("email").isEmail().withMessage("email not true"),
  check("phone").isInt().withMessage("phone should be number"),
  check("village").notEmpty().withMessage("village is required"),
  check("distrit").notEmpty().withMessage("distrit is required"),
  check("provinced").notEmpty().withMessage("provinced is required"),
  check("salary").isFloat().withMessage("salary should be number"),
  check("birthday").isISO8601().withMessage("birthday is required"),
  check("natinal_id_card").custom((value, { req }) => {
    if (!req?.files) {
      throw new Error("natinal_id_card is required");
    }
    if (!req?.files?.natinal_id_card?.mimetype.startsWith("image/")) {
      throw new Error("natinal_id_card should be type image");
    }
    return true;
  }),
  check("profile").custom((value, { req }) => {
    if (!req?.files) {
      throw new Error("profile is required");
    }
    if (!req?.files?.profile?.mimetype.startsWith("image/")) {
      throw new Error("profile should be type image");
    }
    return true;
  }),
  check("department").notEmpty().withMessage("department is required"),
  check("pricePerDay")
    .optional({ checkFalsy: true })
    .isFloat()
    .withMessage("pricePerDay should be number"),
];

export const updateSalaryValidation = [
  check("salary").isFloat().withMessage("salary should be number"),
];

export const changePhoneValidation = [
  check("phone").isInt().withMessage("phone should be number"),
];

export const departmentValidation = [
  check("department").notEmpty().withMessage("deptname is require"),
  check("pricePerDay")
    .optional({ checkFalsy: true })
    .isFloat()
    .withMessage("pricePerDay should be number"),
];

export const updatePersonalInfoValidation = [
  check("firstName").notEmpty().withMessage("firstName is require"),
  check("lastName").notEmpty().withMessage("lastName is require"),
  check("email").isEmail().withMessage("email not true"),
  check("village").notEmpty().withMessage("village is require"),
  check("distrit").notEmpty().withMessage("distrit is require"),
  check("provinced").notEmpty().withMessage("provinced is require"),
  check("birthday").isISO8601().withMessage("birthday is required"),
  check("profile").custom((value, { req }) => {
    if (!req?.files) {
      throw new Error("profile is required");
    }
    if (!req?.files?.profile?.mimetype.startsWith("image/")) {
      throw new Error("profile should be type image");
    }
    return true;
  }),
  check("natinal_id_card").custom((value, { req }) => {
    if (!req?.files) {
      throw new Error("natinal_id_card is required");
    }
    if (!req?.files?.natinal_id_card?.mimetype.startsWith("image/")) {
      throw new Error("natinal_id_card should be type image");
    }
    return true;
  }),
];

export const addStatuValidation = [
  check("statu").isInt().withMessage("statu should be number"),
  check("statu_user").notEmpty().withMessage("statu user is required"),
  check("statu_admin").notEmpty().withMessage("statu admin is required"),
  check("statu_car").notEmpty().withMessage("statu car is required"),
  check("icon_statu").custom((value, { req }) => {
    if (!req?.files) {
      throw new Error("icon statu is require");
    }
    if (req?.files?.icon_statu?.mimetype !== "image/svg+xml") {
      throw new Error("icon statu should be .svg");
    }
    return true;
  }),
];

export const updateStatuValidation = [
  check("statu").isInt().withMessage("statu should be number"),
  check("statu_user").notEmpty().withMessage("statu user is required"),
  check("statu_admin").notEmpty().withMessage("statu admin is required"),
  check("statu_car").notEmpty().withMessage("statu car is required"),
];

export const updateIconStatuValidation = [
  check("icon_statu").custom((value, { req }) => {
    if (!req?.files) {
      throw new Error("icon statu is require");
    }
    if (req?.files?.icon_statu?.mimetype !== "image/svg+xml") {
      throw new Error("icon statu should be .svg");
    }
    return true;
  }),
];

//promotions
export const addPromotionValidation = [
  check("titel").notEmpty().withMessage("title is required"),
  check("description").notEmpty().withMessage("description is required"),
  check("image").custom((value, { req }) => {
    if (!req?.files) {
      throw new Error("image is required");
    }
    if (!req?.files?.image?.mimetype.startsWith("image/")) {
      throw new Error("image should be type image");
    }
    return true;
  }),
  check("discount_type")
    .isString()
    .isIn(["percent", "currency"])
    .withMessage("discount_type should be percent or currency"),
  check("discount").isFloat().withMessage("discount should be number"),
  check("min_rent_amount")
    .isFloat()
    .withMessage("min_rent_amount should be number"),
  check("start_date").isISO8601().withMessage("start_date should be yy-mm-dd"),
  check("end_date").isISO8601().withMessage("end_date should be yy-mm-dd"),
];

//promotions update
export const updatePromotionValidation = [
  check("titel").notEmpty().withMessage("title is required"),
  check("description").notEmpty().withMessage("description is required"),
  check("image").custom((value, { req }) => {
    if (!req?.files) {
      return true;
    }
    if (!req?.files?.image?.mimetype.startsWith("image/")) {
      throw new Error("image should be type image");
    }
    return true;
  }),
  check("discount_type")
    .isString()
    .isIn(["percent", "currency"])
    .withMessage("discount_type should be percent or currency"),
  check("discount").isFloat().withMessage("discount should be number"),
  check("min_rent_amount")
    .isFloat()
    .withMessage("min_rent_amount should be number"),
  check("start_date").isISO8601().withMessage("start_date should be yy-mm-dd"),
  check("end_date").isISO8601().withMessage("end_date should be yy-mm-dd"),
];

export const TitelPromotionValidation = [
  check("titel").notEmpty().withMessage("title is required"),
  check("description").notEmpty().withMessage("description is required"),
  check("image").custom((value, { req }) => {
    if (!req?.files) {
      throw new Error("image is required");
    }
    if (!req?.files?.image?.mimetype.startsWith("image/")) {
      throw new Error("image should be type image");
    }
    return true;
  }),
];

export const pricePromotionValidation = [
  check("discount_type")
    .isString()
    .isIn(["percent", "currency"])
    .withMessage("discount_type should be percent or currency"),
  check("discount").isFloat().withMessage("discount should be number"),
  check("min_rent_amount")
    .isFloat()
    .withMessage("min_rent_amount should be number"),
];

export const datePromotionValidation = [
  check("start_date").isISO8601().withMessage("start_date should be yy-mm-dd"),
  check("end_date").isISO8601().withMessage("end_date should be yy-mm-dd"),
];

//coupons
export const addCouponValidation = [
  // check('user_id').notEmpty().withMessage('user_id is required'),
  check("description").notEmpty().withMessage("description is required"),
  check("discount").isFloat().withMessage("discount should be number"),
  check("start_date").isISO8601().withMessage("start date should be yy-mm-dd"),
  check("end_date").isISO8601().withMessage("end date should be yy-mm-dd"),
];

export const updateCouponValidation = [
  check("description").notEmpty().withMessage("description is required"),
  check("discount").isFloat().withMessage("discount is required"),
  check("start_date").isISO8601().withMessage("start date should be yy-mm-dd"),
  check("end_date").isISO8601().withMessage("end date should be yy-mm-dd"),
];

export const insuranceValidation = [
  check("name").notEmpty().withMessage("name is required"),
  check("icon").custom((value, { req }) => {
    if (!req?.files) {
      throw new Error("icon is required");
    }
    if (!req?.files?.icon?.mimetype.startsWith("image/")) {
      throw new Error("icon should be type image");
    }
    return true;
  }),
  check("level").notEmpty().withMessage("level is required"),
];

export const insuranceUpdateValidation = [
  check("name").notEmpty().withMessage("name is required"),
  check("icon").custom((value, { req }) => {
    if (!req?.files) {
      throw new Error("icon is required");
    }
    if (!req?.files?.icon?.mimetype.startsWith("image/")) {
      throw new Error("icon should be type image");
    }
    return true;
  }),
  check("level").notEmpty().withMessage("level is required"),
];

//cartype
export const carTypeValidation = [
  check("name").notEmpty().withMessage("name is required"),
  check("icon").custom((value, { req }) => {
    if (!req?.files) {
      return true;
    }
    if (!req?.files?.icon?.mimetype.startsWith("image/")) {
      throw new Error("icon should be just type image");
    }
    return true;
  }),
];

//car
export const carValidation = [
  check("name").notEmpty().withMessage("name is required"),
  check("year").notEmpty().withMessage("year is required"),
  check("plate_city").notEmpty().withMessage("plate_city is required"),
  check("plate_text").notEmpty().withMessage("plate_text is required"),
  check("plate_number").isInt().withMessage("plate_number should be number"),
  check("gps").notEmpty().withMessage("gps is required"),
  check("car_seat").notEmpty().withMessage("car_seat is required"),
  check("car_gear").notEmpty().withMessage("car_gear is required"),
  check("color").notEmpty().withMessage("color is required"),
  check("status").notEmpty().withMessage("status is required"),
  check("price").isFloat().withMessage("price should be number"),
  check("image_profile").custom((value, { req }) => {
    if (!req?.files) {
      throw new Error("image_profile is required");
    }
    if (!req?.files?.image_profile?.mimetype.startsWith("image/")) {
      throw new Error("image_profile should be type image");
    }
    return true;
  }),
  check("image_front").custom((value, { req }) => {
    if (!req?.files) {
      throw new Error("image_front is required");
    }
    if (!req?.files?.image_front?.mimetype.startsWith("image/")) {
      throw new Error("image_front should be type image");
    }
    return true;
  }),
  check("image_side").custom((value, { req }) => {
    if (!req?.files) {
      throw new Error("image_side is required");
    }
    if (!req?.files?.image_side?.mimetype.startsWith("image/")) {
      throw new Error("image_side should be type image");
    }
    return true;
  }),
  check("image_behind").custom((value, { req }) => {
    if (!req?.files) {
      throw new Error("image_behind is required");
    }
    if (!req?.files?.image_behind?.mimetype.startsWith("image/")) {
      throw new Error("image_behind should be type image");
    }
    return true;
  }),
  check("image_in").custom((value, { req }) => {
    if (!req?.files) {
      throw new Error("image_in is required");
    }
    if (!req?.files?.image_in?.mimetype.startsWith("image/")) {
      throw new Error("image_in should be type image");
    }
    return true;
  }),
];

export const carStatuValidation = [
  check("statu").notEmpty().withMessage("statu is required"),
];

export const updateCarValidation = [
  check("name").notEmpty().withMessage("name is required"),
  check("year").notEmpty().withMessage("year is required"),
  check("plate_city").notEmpty().withMessage("plate_city is required"),
  check("plate_text").notEmpty().withMessage("plate_text is required"),
  check("plate_number").isInt().withMessage("plate_number should be number"),
  check("gps").notEmpty().withMessage("gps is required"),
  check("car_seat").notEmpty().withMessage("car_seat is required"),
  check("car_gear").notEmpty().withMessage("car_gear is required"),
  check("color").notEmpty().withMessage("color is required"),
  check("image_profile").custom((value, { req }) => {
    if (!req?.files) {
      return true;
    }
    if (!req?.files?.image_profile?.mimetype.startsWith("image/")) {
      throw new Error("image_profile should be type image");
    }
    return true;
  }),
  check("image_front").custom((value, { req }) => {
    if (!req?.files) {
      return true;
    }
    if (!req?.files?.image_front?.mimetype.startsWith("image/")) {
      throw new Error("image_front should be type image");
    }
    return true;
  }),
  check("image_side").custom((value, { req }) => {
    if (!req?.files) {
      return true;
    }
    if (!req?.files?.image_side?.mimetype.startsWith("image/")) {
      throw new Error("image_side should be type image");
    }
    return true;
  }),
  check("image_behind").custom((value, { req }) => {
    if (!req?.files) {
      return true;
    }
    if (!req?.files?.image_behind?.mimetype.startsWith("image/")) {
      throw new Error("image_behind should be type image");
    }
    return true;
  }),
  check("image_in").custom((value, { req }) => {
    if (!req?.files) {
      return true;
    }
    if (!req?.files?.image_in?.mimetype.startsWith("image/")) {
      throw new Error("image_in should be type image");
    }
    return true;
  }),
];
export const updatePriceValidation = [
  check("price").isFloat().withMessage("price should be number"),
];

//bank
export const bankValidation = [
  check("name").notEmpty().withMessage("mame is required"),
  check("icon").custom((value, { req }) => {
    if (!req?.files) {
      throw new Error("icon is required");
    }
    if (!req?.files?.icon?.mimetype.startsWith("image/")) {
      throw new Error("icon should be just type image");
    }
    return true;
  }),
  check("qr_code").custom((value, { req }) => {
    if (!req?.files) {
      throw new Error("qr_code is required");
    }
    if (!req?.files?.qr_code?.mimetype.startsWith("image/")) {
      throw new Error("qr_code should be type image");
    }
    return true;
  }),
];

export const rentalValidation = [
  check("car_id").notEmpty().withMessage("car_id is required"),
  check("first_name").notEmpty().withMessage("first_name is required"),
  check("last_name").notEmpty().withMessage("last_name is required"),
  check("phone").isInt().withMessage("phone is required"),
  check("village").notEmpty().withMessage("village is required"),
  check("distrit").notEmpty().withMessage("distrit is required"),
  check("provinced").notEmpty().withMessage("provinced is required"),
  check("date_start_rent").isISO8601().withMessage("date_start_rent is required"),
  check("date_end_rent").isISO8601().withMessage("date_end_rent is required"),
];
