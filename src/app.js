const Koa = require('koa');
const Router = require('koa-router')
const amqplib = require('amqplib')
const bodyParser = require('koa-bodyparser')
const app = new Koa()
const router = new Router()
const {
  sendToSubmitter,
  consumeSubmitter
} = require('./queue.js')

router.get('/test', async ctx => {
  ctx.body = 'Hello World'
})

router.post('/job', async ctx => {
  Array.from({ length: 100 }).forEach((_, i) => {
    sendToSubmitter(Object.assign({i}, ctx.request.body))
  })
  ctx.body = 'ok'
})

consumeSubmitter((message, acknowledge) => {
  console.log('I work!', message)
  acknowledge()
})

app
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods())


app.listen(3000)
