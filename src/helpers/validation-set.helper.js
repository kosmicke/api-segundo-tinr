const { validationResult, body, param} = require('express-validator');

const buildValidation = (route, validationSet) => {
    if(!Array.isArray(validationSet)) validationSet = []
    return [...validationSet, checkValidation, route]
}

const checkValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }else{
        next()
    }
}

module.exports = {
    buildValidation,
    body,
    param
}