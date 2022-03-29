const User = require('../models/users.js')

class Users {
    async list(ctx) {
        ctx.body = await User.find();
    }

    async findById(ctx) {
        const user =  await User.findById(ctx.params.id)
        if(!user){
            ctx.throw(404,'用户未找到')
        }
        ctx.body =  user
    }

    async create(ctx) {
        ctx.verifyParams({
            name: {type: 'string', required: true}
        })
        ctx.body = await new User(ctx.request.body).save()
    }

    async update(ctx) {
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
}

module.exports = new Users()
