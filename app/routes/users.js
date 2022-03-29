const Router = require('koa-router');
const jsonwebtoken =  require('jsonwebtoken')
const jwt = require('koa-jwt')
const {secret} = require('../config')

const UserRouter = new Router({prefix: '/users'});
const {list, findById, create, update, del,login,checkOwner} = require('../controllers/users.js')

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


module.exports = UserRouter;
