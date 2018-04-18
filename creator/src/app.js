const Koa = require('koa');
const Router = require('koa-router')
const amqplib = require('amqplib')
const bodyParser = require('koa-bodyparser')
const app = new Koa()
const router = new Router()
const {
  sendToSubmitter
} = require('./queue.js')
console.log('Start')

router.get('/test', async ctx => {
  ctx.body = 'Hello World'
})

router.post('/job', async ctx => {
  Array.from({ length: 100 }).forEach((_, i) => {
    sendToSubmitter(Object.assign({i}, ctx.request.body))
  })
  ctx.body = 'ok'
})

app
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods())


app.listen(3000, () => {
  console.log('Listening')
})
