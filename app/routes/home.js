const Router = require('koa-router');
const {index,upload} =  require('../controllers/home')
const HomeRouter = new Router();

HomeRouter.get('/', index)
HomeRouter.post('/upload', upload)

module.exports = HomeRouter;
