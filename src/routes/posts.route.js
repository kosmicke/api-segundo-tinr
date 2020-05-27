const postsController = require("../controllers/posts.controller")
const { authorize } = require("../controllers/authentication.controller")

module.exports = (app) => {
    
    app.route('/posts')
        .post(authorize, postsController.create)
        .get(postsController.list)

    app.route('/posts/:id')
        .put(postsController.edit)
        .delete(postsController.remove)

    app.route('/posts/:id/likes')
        .get(postsController.getLikes)
        .post(postsController.like)
        
}