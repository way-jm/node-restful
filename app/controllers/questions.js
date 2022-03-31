const Questions = require('../models/questions.js')
const User = require("../models/users");

class QuestionsCtl {
    async find(ctx) {
        const {page_size = 10} =  ctx.query;
        const page=Math.max(ctx.query.page * 1,1) -1;
        const pageSize= Math.max(page_size * 1,1);
        ctx.body = await Questions
            // .find({name:/abc/})
            .find({$or:
                    [
                        {title:new RegExp(ctx.query.q)},
                        {description:new RegExp(ctx.query.q)}
                    ]})
            .limit(pageSize)
            .skip(page * pageSize)
    }
    async checkQuestionExist(ctx,next){
        const question =  await Questions.findById(ctx.params.id).select('+questioner')
        if(!question){
            ctx.throw(404,'问题不存在')
        }
        ctx.state.question =  question
        await next()
    }
    async findById(ctx) {
        // localhost:3000/topics/624320447587f74f053a8d1e?fields=location
        const {fields=''} = ctx.query;
        const selectFields =fields.split(';').filter(f=>f).map(f=>' +' +f).join('')
        const topic =  await Questions.findById(ctx.params.id)
            .select(selectFields).populate('questioner topics')
        if(!topic){
            ctx.throw(404,'问题题未找到')
        }
        ctx.body =  topic
    }

    async create(ctx) {
        ctx.verifyParams({
            title: {type: 'string', required: true},
            description: {type: 'string', required: false},
        })
        ctx.body = await new Questions({...ctx.request.body,questioner:ctx.state.user._id}).save()
    }
    async checkQuestioner(ctx,next){
        const {question} = ctx.state;
        if(question.questioner.toString() !== ctx.state.user._id){
            ctx.throw(403,'无权删除')
        }
        await next();
    }
    async update(ctx) {
        ctx.verifyParams({
            title: {type: 'string', required: false},
            description: {type: 'string', required: false},
        })
        //const question = await Questions.findByIdAndUpdate(ctx.params.id,ctx.request.body)
        const question = await ctx.state.question.update(ctx.request.body)
        if(!question){
            ctx.throw(404,'话题未找到')
        }
        ctx.body =  question
    }
    async del(ctx) {
        const question = await Questions.findByIdAndRemove(ctx.params.id)
        if(!question){
            ctx.throw(404,'问题未找到')
        }
        ctx.set('Allow', 'GET,POST')
        ctx.status = 204
    }
}

module.exports = new QuestionsCtl()
