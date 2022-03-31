const User = require('../models/users.js')
const jsonwebtoken =  require('jsonwebtoken')
const {secret} = require('../config')

class Users {
    async list(ctx) {
        ctx.body = await User.find();
    }

    async findById(ctx) {
        // 获取字段
        // localhost:3000/users/624320447587f74f053a8d1e?fields=location
        const {fields} = ctx.query;
        const selectFields =fields.split(';').filter(f=>f).map(f=>' +' +f).join('')
        const user =  await User.findById(ctx.params.id).select(selectFields)
            .populate("following location employments.company employments.job educations.school educations.major")
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
    // 关注者
    async listFollowing(ctx){
        // populate--->从指定字段中把id扩展为具体信息
        const user =  await User.findById(ctx.params.id)
            .select('+following')
            .populate('following')
        if(!user){
            ctx.throw(404,'用户不存在')
        }
        ctx.body = user.following;
    }
    // 检验用户存在与否的中间件
    async checkUserExist(ctx,next){
        const user =  await User.findById(ctx.params.id)
        if(!user){
            ctx.throw(404,'用户不存在')
        }
        await next()
    }
    // 关注某人
    async follow(ctx){
        const me =  await User.findById(ctx.state.user._id).select('+following');
        if(!me.following.map(id=>id.toString()).includes(ctx.params.id)){
            me.following.push(ctx.params.id)
            me.save()
        }
        ctx.status = 204
    }
    // 取消关注
    async unFollow(ctx){
        const me =  await User.findById(ctx.state.user._id).select('+following');
        const index =  me.following.map(id=>id.toString()).indexOf(ctx.params.id)
        if(index>-1){
            me.following.splice(index,1)
            me.save()
        }
        ctx.status = 204
    }

    // 关注话题
    async followTopic(ctx){
        const me =  await User.findById(ctx.state.user._id).select('+followingTopics');
        if(!me.followingTopics.map(id=>id.toString()).includes(ctx.params.id)){
            me.followingTopics.push(ctx.params.id)
            me.save()
        }
        ctx.status = 204
    }
    // 取消关注话题
    async unFollowTopic(ctx){
        const me =  await User.findById(ctx.state.user._id).select('+followingTopics');
        const index =  me.followingTopics.map(id=>id.toString()).indexOf(ctx.params.id)
        if(index>-1){
            me.followingTopics.splice(index,1)
            me.save()
        }
        ctx.status = 204
    }
    // 获取关注的话题
    async listFollowingTopics(ctx){
        // populate--->从指定字段中把id扩展为具体信息
        const user =  await User.findById(ctx.params.id)
            .select('+followingTopics')
            .populate('followingTopics')
        if(!user){
            ctx.throw(404,'用户不存在')
        }
        ctx.body = user.followingTopics;
    }
    // 获取粉丝列表
    async listFollowers(ctx){
        // 这里其实是包含逻辑，但是mongoose的语法非常灵活，{following:ctx.params.id}也可以表示包含逻辑
        ctx.body =  await User.find({following: ctx.params.id})
    }
}

module.exports = new Users()
