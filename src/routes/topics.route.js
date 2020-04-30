const topicsController = require("../controllers/topics.controller")

module.exports = (app) => {
    
    app.route('/topics')
        .post(topicsController.create)
        .get(topicsController.list)

    app.route('/topics/:id')
        .get(topicsController.getById)
        .put(topicsController.edit)
        .delete(topicsController.remove)

    app.route('/topics/:id/likes')
        .get(topicsController.getLikes)
        .post(topicsController.like)
        
}