const validator = require("validator");

const validateSignUpData = (req) => {
  const { name, email, password } = req.body;

  if (validator.isEmpty(name)) throw new Error("Name invalid");
  if (!validator.isEmail(email)) throw new Error("Email invalid");
  if (!validator.isStrongPassword(password))
    throw new Error("Password not strong");
};

const validateUpdateProfileData = (req) => {
  const allowedUpdateFields = ["name", "age", "photoUrl", "gender"];

  Object.keys(req.body).forEach((key) => {
    if (!allowedUpdateFields.includes(key))
      throw new Error("Can update only " + allowedUpdateFields.join(", "));
  });
};

module.exports = {
  validateSignUpData,
  validateUpdateProfileData,
};
