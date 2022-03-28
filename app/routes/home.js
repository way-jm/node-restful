const Router = require('koa-router');
const {index} =  require('../controllers/home')
const HomeRouter = new Router();

HomeRouter.get('/', index)

module.exports = HomeRouter;
