const koa = require('koa');
const Routing = require('./routes/index');
const bodyParser = require('koa-bodyparser')
const koaJsonError = require('koa-json-error')
const koaParameter = require('koa-parameter')
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
// 注册中间件，注意是router.routes()
app.use(bodyParser())
app.use(koaParameter(app))
Routing(app)

app.listen(3000);
