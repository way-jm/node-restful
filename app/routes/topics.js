const Router = require('koa-router');
const TopicsRouter = new Router({prefix: '/topics'});
const {find, findById, create, update,
} = require('../controllers/topics.js')
const jwt = require("koa-jwt");
const {secret} = require("../config");

const auth = jwt({secret})
TopicsRouter.get('/',find)
TopicsRouter.get('/:id', findById)
TopicsRouter.post('/', auth,create)
TopicsRouter.patch('/:id', auth,update)



module.exports = TopicsRouter;
