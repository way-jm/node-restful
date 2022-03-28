const koa = require('koa');
const Routing =  require('./routes/index');
const bodyParser =  require('koa-bodyparser')

const app = new koa();

// 注册中间件，注意是router.routes()
app.use(bodyParser())
Routing(app)

app.listen(3000);
