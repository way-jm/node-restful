const koa = require('koa');
const Routing = require('./routes/index');
const path = require('path')
const koaBody = require('koa-body')
const koaJsonError = require('koa-json-error')
const koaParameter = require('koa-parameter')
const koaStatic = require('koa-static')
const mongoose = require('mongoose')
const {connectionStr} = require('./config.js')
mongoose.connect(connectionStr,()=>{
    console.info('connect success')
})
mongoose.connection.on('error',console.error)

const app = new koa();
app.use(koaJsonError({
    postFormat: (e, {stack, ...rest}) => process.env.NODE_ENV === 'production' ? rest : {stack, ...rest}
}))
// koa-static
app.use(koaStatic(path.join(__dirname,'public')))
// 注册中间件，注意是router.routes()
app.use(koaBody({
    // 启用文件
    multipart:true,
    formidable:{
        // 上传目录
        uploadDir:path.join(__dirname,'public/uploads'),
        // 保留扩展名
        keepExtensions:true
    }
}))
app.use(koaParameter(app))
Routing(app)

app.listen(3000);
