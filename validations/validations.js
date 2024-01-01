const { checkSchema } = require("express-validator");

//User Registration validation
exports.userRegisterValidator = checkSchema({
  firstName: {
    exists: {
      errorMessage: "UserName is required.",
      options: { checkFalsy: true },
    },
    isString: { errorMessage: "UserName should be string." },
    isLength: {
      options: { min: 3, max: 24 },
      errorMessage: "Name should be between 3-24 characters.",
    },
  },
  lastName: {
    exists: {
      errorMessage: "Last Name is required.",
      options: { checkFalsy: true },
    },
    isString: { errorMessage: "Last name should be string." },
    isLength: {
      options: { min: 3, max: 24 },
      errorMessage: "Name should be between 3-24 characters.",
    },
  },

  email: {
    isEmail: { errorMessage: "Please provide valid email." },
  },
  password: {
    exists: { errorMessage: "Password is required." },
    isString: { errorMessage: "Password should be string." },
    isLength: {
      options: { min: 5, max: 50 },
      errorMessage: "Password should be between 6-50 characters.",
    },
  },
  phone: {
    isNumeric: { errorMessage: "Phone Number shouldnot be string." },
    isLength: {
      options: { min: 10, max: 12 },
      errorMessage: "Phone Number should only contain 10-12 digits",
    },
  },
});

//User Login validation
exports.userLoginValidator = checkSchema({
  email: {
    isEmail: { errorMessage: "Please provide valid email." },
  },
  password: {
    exists: { errorMessage: "Password is required." },
    isString: { errorMessage: "Password should be string." },
    isLength: {
      options: { min: 5, max: 50 },
      errorMessage: "Password should be between 6-50 characters.",
    },
  },
});

//Category validation
exports.categoryValidator = checkSchema({
  title: {
    exists: {
      errorMessage: "Category Title is required.",
      options: { checkFalsy: true },
    },
    isString: { errorMessage: "Title should be string." },
    isLength: {
      options: { min: 2, max: 24 },
      errorMessage: "Title should be between 2-24 characters.",
    },
  },
});

//Sub Menu validation
exports.subMenuValidator = checkSchema({
  title: {
    exists: {
      errorMessage: "Title is required.",
      options: { checkFalsy: true },
    },
    isString: { errorMessage: "Title should be string." },
    isLength: {
      options: { min: 2, max: 24 },
      errorMessage: "Title should be between 2-24 characters.",
    },
  },
  id: {
    exists: {
      errorMessage: "Category ID is required.",
      options: { checkFalsy: true },
    },
    isString: { errorMessage: "ID should be string." },
    isLength: {
      options: { min: 3, max: 50 },
      errorMessage: "ID should be between 3-50 characters.",
    },
  },
  price: {
    exists: {
      errorMessage: "Price is required.",
      options: { checkFalsy: true },
    },
    isNumeric: { errorMessage: "Price shouldnot be string." },
    isLength: {
      options: { min: 1, max: 3 },
      errorMessage: "Price should only be 1-3 figured",
    },
  },
});

//Addons  validation
exports.addonsValidator = checkSchema({
  title: {
    exists: {
      errorMessage: "Title is required.",
      options: { checkFalsy: true },
    },
    isString: { errorMessage: "Title should be string." },
    isLength: {
      options: { min: 2, max: 24 },
      errorMessage: "Title should be between 2-24 characters.",
    },
  },
  id: {
    exists: {
      errorMessage: "Category ID is required.",
      options: { checkFalsy: true },
    },
    isString: { errorMessage: "ID should be string." },
    isLength: {
      options: { min: 3, max: 50 },
      errorMessage: "ID should be between 3-50 characters.",
    },
  },
  ids: {
    exists: {
      errorMessage: "Sub Menu ID is required.",
      options: { checkFalsy: true },
    },
    isString: { errorMessage: "ID should be string." },
    isLength: {
      options: { min: 3, max: 50 },
      errorMessage: "ID should be between 3-50 characters.",
    },
  },
  price: {
    isNumeric: { errorMessage: "Price shouldnot be string." },
    isLength: {
      options: { min: 1, max: 3 },
      errorMessage: "Price should only be 1-3 figured",
    },
  },
});
