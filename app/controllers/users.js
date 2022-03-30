const User = require('../models/users.js')
const jsonwebtoken =  require('jsonwebtoken')
const {secret} = require('../config')

class Users {
    async list(ctx) {
        ctx.body = await User.find();
    }

    async findById(ctx) {
        // 获取字段
        const {fields} = ctx.query;
        const selectFields =fields.split(';').filter(f=>f).map(f=>' +' +f).join('')
        const user =  await User.findById(ctx.params.id).select(selectFields)
        if(!user){
            ctx.throw(404,'用户未找到')
        }
        ctx.body =  user
    }

    async create(ctx) {
        ctx.verifyParams({
            name: {type: 'string', required: true},
            password: {type: 'string', required: true}
        })
        const {name} = ctx.request.body
        const repeatUser = await  User.findOne({name})
        if(repeatUser){ctx.throw(409,'该用户已经存在')}
        ctx.body = await new User(ctx.request.body).save()
    }
    async checkOwner(ctx,next){
        if(ctx.params.id!== ctx.state.user._id){
            ctx.throw(403)
            return
        }
        await next()
    }
    async update(ctx) {
        ctx.verifyParams({
            name: {type: 'string', required: false},
            password: {type: 'string', required: false},
            avatar_url: {type: 'string', required: false},
            gender: {type: 'string', required: false},
            headLine: {type: 'string', required: false},
            location: {type: 'array', itemType:'string',required: false},
            employments: {type: 'array', itemType:'object',required: false},
            educations: {type: 'array', itemType:'object',required: false},
        })
        const user = await User.findByIdAndUpdate(ctx.params.id,ctx.request.body)
        if(!user){
            ctx.throw(404,'用户未找到')
        }
        ctx.body =  user
    }

    async del(ctx) {
        const user = await User.findByIdAndRemove(ctx.params.id)
        if(!user){
            ctx.throw(404,'用户未找到')
        }
        ctx.set('Allow', 'GET,POST')
        ctx.status = 204
    }
    // 登录
    async login(ctx){
        ctx.verifyParams({
            name: {type: 'string', required: true},
            password: {type: 'string', required: true}
        })
        const user = await  User.findOne(ctx.request.body)
        if(!user) {ctx.throw(401,'用户名或密码错误')}
        const {_id,name} = user
        // 生成签名
        const token = jsonwebtoken.sign({_id,name},secret,{expiresIn: '1d'}, null)
        ctx.body =  {token}
    }
}

module.exports = new Users()
