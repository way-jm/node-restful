const Answers = require('../models/answers.js')
const User = require("../models/users");

class AnswersCtl {
    async find(ctx) {
        ctx.body = await Answers
            .find({$or:
                    [
                        {content:1},
                        {questionId:ctx.params.questionId}
                    ]})

    }
    async checkAnswerExist(ctx,next){
        const answer =  await Answers.findById(ctx.params.id).select('+answerer')
        if(!answer){
            ctx.throw(404,'答案不存在')
        }
        // 只有在路由包含questionId才检查
        if(ctx.params.questionId && answer.questionId !==ctx.params.questionId){
            ctx.throw(404,'该问题下没有此答案')
        }
        ctx.state.answer =  answer
        await next()
    }
    async findById(ctx) {
        const {fields=''} = ctx.query;
        const selectFields =fields.split(';').filter(f=>f).map(f=>' +' +f).join('')
        const topic =  await Answers.findById(ctx.params.id)
            .select(selectFields).populate('answerer')
        if(!topic){
            ctx.throw(404,'答案未找到')
        }
        ctx.body =  topic
    }

    async create(ctx) {
        ctx.verifyParams({
            content: {type: 'string', required: true},
        })
        ctx.body = await new Answers({
            ...ctx.request.body,
            answerer:ctx.state.user._id,
            questionId:ctx.params.questionId
        }).save()
    }
    async checkAnswerer(ctx,next){
        const {answer} = ctx.state;
        if(answer.answerer.toString() !== ctx.state.user._id){
            ctx.throw(403,'无权删除')
        }
        await next();
    }
    async update(ctx) {
        ctx.verifyParams({
            content: {type: 'string', required: false},
        })
        //const question = await Questions.findByIdAndUpdate(ctx.params.id,ctx.request.body)
        const answer = await ctx.state.answer.update(ctx.request.body)
        if(!answer){
            ctx.throw(404,'答案未找到')
        }
        ctx.body =  answer
    }
    async del(ctx) {
        const answer = await Answers.findByIdAndRemove(ctx.params.id)
        if(!answer){
            ctx.throw(404,'答案未找到')
        }
        ctx.set('Allow', 'GET,POST')
        ctx.status = 204
    }
}

module.exports = new AnswersCtl()
