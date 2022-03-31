const Router = require('koa-router');
const QuestionsRouter = new Router({prefix: '/questions'});
const {find, findById, create, update,checkQuestionExist,checkQuestioner,del
} = require('../controllers/questions.js')
const jwt = require("koa-jwt");
const {secret} = require("../config");

const auth = jwt({secret})
QuestionsRouter.get('/',find)
QuestionsRouter.get('/:id', checkQuestionExist,findById)
QuestionsRouter.post('/', auth,create)
QuestionsRouter.patch('/:id', auth,checkQuestionExist,checkQuestioner,update)
QuestionsRouter.delete('/:id', auth,checkQuestionExist,checkQuestioner,del)



module.exports = QuestionsRouter;
