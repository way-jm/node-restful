const Router = require('koa-router');
const jsonwebtoken =  require('jsonwebtoken')
const jwt = require('koa-jwt')
const {secret} = require('../config')

const UserRouter = new Router({prefix: '/users'});
const {list, findById, create, update,
    del,login,checkOwner,listFollowing,follow,
    unFollow,listFollowers,checkUserExist,
    followTopic,unFollowTopic,listFollowingTopics,listQuestions,
    likeAnswer,unLikeAnswer,listLikingAnswers,
    dislikeAnswer,unDislikeAnswer,listDisLikingAnswers
} = require('../controllers/users.js')

const  {checkTopicExist} = require('../controllers/topics.js')
const {checkAnswerExist} = require('../controllers/answers')

// 用户认证
// const auth =  async (ctx,next)=>{
//     const {authorization=''} =  ctx.request.header;
//     const token = authorization.replace('Bearer ','')
//     try{
//         // 认证成功，把user信息放在ctx上
//         ctx.state.user= jsonwebtoken.verify(token, secret, null, null)
//     }catch (e){
//         ctx.throw(401,e.message)
//     }
//     await next()
// }
// koa-jwt
const auth = jwt({secret})
UserRouter.get('/', list)
UserRouter.get('/:id', findById)
UserRouter.post('/', create)
UserRouter.patch('/:id', auth, checkOwner,update)
UserRouter.delete('/:id',auth, checkOwner,del)
UserRouter.post('/login', login)
// 关注人列表
UserRouter.get('/:id/following', listFollowing)
// 关注某人
UserRouter.put('/following/:id', auth,checkUserExist,follow)
// 取消关注
UserRouter.delete('/following/:id', auth,checkUserExist,unFollow)
// 获取粉丝列表--》用户的关注人列表里面有指定id,代表就是指定人的粉丝
UserRouter.get('/:id/followers',listFollowers)

// 关注话题
UserRouter.put('/followingTopics/:id', auth,checkTopicExist,followTopic)
// 取消关注话题
UserRouter.delete('/followingTopics/:id', auth,checkTopicExist,unFollowTopic)
// 关注的话题列表
UserRouter.get('/:id/followingTopics', listFollowingTopics)
// 发表的问题列表
UserRouter.get('/:id/questions', listQuestions)

// 喜欢答案，再取消踩答案
UserRouter.put('/likeAnswer/:id', auth,checkAnswerExist,likeAnswer,unDislikeAnswer)
// 取消喜欢答案
UserRouter.delete('/unLikeAnswer/:id', auth,checkAnswerExist,unLikeAnswer)
// 喜欢答案列表
UserRouter.get('/:id/likingAnswers', listLikingAnswers)

// 踩答案，然后再取消赞答案
UserRouter.put('/dislikeAnswer/:id', auth,checkAnswerExist,dislikeAnswer,unLikeAnswer)
// 取消踩答案
UserRouter.delete('/unDislikeAnswer/:id', auth,checkAnswerExist,unDislikeAnswer)
// 踩答案列表
UserRouter.get('/:id/listDisLikingAnswers', listDisLikingAnswers)

module.exports = UserRouter;
