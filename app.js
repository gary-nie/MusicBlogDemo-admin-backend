const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router')
const router = new Router()
const cors = require('koa2-cors')
const koaBody = require('koa-body')
const ENV = 'wechatcloud-582k5'
app.use(cors({
  origin: ['http://10.64.130.20:9528'],
  credentials: true
}))
app.use(async (ctx,next) => {
  // ctx.body = 'Hello World';'http://localhost:9528',
  ctx.state.env=ENV
  await next()

});

app.use(koaBody({
  multipart:true,
}))

const playlist = require('./controller/playlist.js')
const swiper = require('./controller/swiper.js')
const blog = require('./controller/blog.js')

router.use('/playlist', playlist.routes())
router.use('/swiper', swiper.routes())
router.use('/blog', blog.routes())
app.use(router.routes())
app.use(router.allowedMethods())




app.listen(3000, () => {
  console.log('服务已经运行在3000端口')
})