const validator = require("validator");


const validateSignupData = (req) => {
    const {fullName , lastName, emailId, password} = req.body;

    if(!fullName){
        throw new Error("Invalid full name!")
    }
    if(!emailId && !validator.isEmail(emailId)){
        throw new Error("Invalid email address!")
    }
    if(!password && !validator.isStrongPassword(password)){
        throw new Error("Please enter strong and secure password!")
    } 
    
}

const validateEditProfileDate = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "age",
    "skills",
    "photoUrl",
    "gender",
    "about",
  ];

  // Ensure all keys in req.body are allowed
  const isValidAllowedFields = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );

  return isValidAllowedFields;
};


module.exports = {
    validateSignupData,
    validateEditProfileDate
}