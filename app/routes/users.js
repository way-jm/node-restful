const Router = require('koa-router');

const UserRouter = new Router({prefix: '/users'});
const {list, findById, create, update, del} = require('../controllers/users.js')
UserRouter.get('/', list)
UserRouter.get('/:id', findById)
UserRouter.post('/', create)
UserRouter.put('/:id', update)
UserRouter.delete('/:id', del)

module.exports = UserRouter;
