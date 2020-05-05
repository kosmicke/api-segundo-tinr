const usersController = require("../controllers/users.controller")

module.exports = (app) => {
    
    app.route('/users/:search')
        .get(usersController.getByParam)
        
}