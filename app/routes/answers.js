const Router = require('koa-router');
const AnswersRouter = new Router({prefix: '/questions/:questionId/answers'});
const {find, findById, create, update,checkAnswerExist,checkAnswerer,del
} = require('../controllers/answers.js')
const jwt = require("koa-jwt");
const {secret} = require("../config");

const auth = jwt({secret})
AnswersRouter.get('/',find)
AnswersRouter.get('/:id', checkAnswerExist,findById)
AnswersRouter.post('/', auth,create)
AnswersRouter.patch('/:id', auth,checkAnswerExist,checkAnswerer,update)
AnswersRouter.delete('/:id', auth,checkAnswerExist,checkAnswerer,del)

module.exports = AnswersRouter;
