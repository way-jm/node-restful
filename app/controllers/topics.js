const Topics = require('../models/topics.js')

class TopicsCtl {
    async find(ctx) {
        const {page_size = 10} =  ctx.query;
        const page=Math.max(ctx.query.page * 1,1) -1;
        const pageSize= Math.max(page_size * 1,1);
        ctx.body = await Topics.find().limit(pageSize).skip(page * pageSize)
    }

    async findById(ctx) {
        // localhost:3000/topics/624320447587f74f053a8d1e?fields=location
        const {fields} = ctx.query;
        const selectFields =fields.split(';').filter(f=>f).map(f=>' +' +f).join('')
        const topic =  await Topics.findById(ctx.params.id).select(selectFields)
        if(!topic){
            ctx.throw(404,'话题未找到')
        }
        ctx.body =  topic
    }

    async create(ctx) {
        ctx.verifyParams({
            name: {type: 'string', required: true},
            avatar_url: {type: 'string', required: false},
            introduction: {type: 'string', required: false}
        })
        ctx.body = await new Topics(ctx.request.body).save()
    }
    async update(ctx) {
        ctx.verifyParams({
            name: {type: 'string', required: false},
            avatar_url: {type: 'string', required: false},
            introduction: {type: 'string', required: false}
        })
        const user = await Topics.findByIdAndUpdate(ctx.params.id,ctx.request.body)
        if(!user){
            ctx.throw(404,'话题未找到')
        }
        ctx.body =  user
    }
}

module.exports = new TopicsCtl()
