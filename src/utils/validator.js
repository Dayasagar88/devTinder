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

module.exports = {
    validateSignupData
}