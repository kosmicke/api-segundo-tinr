const { User } = require('../models/user.model');
const { encryptionKey } = require('../config/env');
const bcrypt = require('bcrypt');
const moment = require('moment');
const jwtsimple = require('jwt-simple');
const { body, buildValidation } = require('../helpers/validation-set.helper')
const { throwError } = require('../helpers/errors.helper')

const signIn = async (req, res) => {

    // Getting user from database
    let user = await User.findOne({ nickName: req.body.nickName })

    // Validating data
    if (!user) throwError(404, "User not found.")
    if (!await bcrypt.compare(req.body.password, user.password)) {
        throwError(401, "Incorrect data.")
    }
    if (user.status == 0) throwError(401, "User is disabled.")

    // Create token
    const tokenData = createJWT(user);

    // Response data
    const data = {
        ...tokenData,
        user: {
            name : user.name,
            nickName : user.nickName,
            email : user.email
        }
    }

    return res.status(200).send({ data })
}

const signUp = async (req, res) => {
    // Getting if nickName is in use by another user
    let foundUserNick = await User.findOne({ nickName: req.body.nickName  })
    if(foundUserNick) throwError(403, `User with nickName ${req.body.nickName} already exists.`)

    // Getting if nickName is in use by another user
    let foundUserEmail = await User.findOne({ email: req.body.email  })
    if(foundUserEmail) throwError(403, `User with email ${req.body.email} already exists.`)

    // Creating and saving user
    const user = new User(req.body);
    user.status = 1;
    user.password = await bcrypt.hash(user.password, 10)
    await user.save()

    // Returing
    return res.status(200).send({ message: "User created!", userId: user._id })
};

const createJWT = (user) => {

    // Generatng expiration date 
    const expiration = moment().utc().add({ days: 1 }).unix();

    // Generating token
    const token = jwtsimple.encode({
        user: user._id,
        exp: expiration,
    }, encryptionKey);

    // Returning
    return { token: token, token_exp: moment.unix(expiration).utc().format() }
}

module.exports = {
    signIn: [
        buildValidation(signIn, [
            body('nickName', `Value 'nickName' is rqeuired.`).exists(),
            body('password', `Value 'password' is required.`).exists()
        ])
    ],
    signUp: [
        buildValidation(signUp, [
            body('nickName', `Value 'nickName' is required.`).exists(),
            body('email', `Value 'email' is required.`).exists(),
            body('password', `Value 'password' is required.`).exists(),
            body('name', `Value 'name' is required.`).exists(),
            body('birthDay', `Value 'birthDay' is required.`).exists()
        ])
    ],
}