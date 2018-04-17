const Koa = require('koa');
const Router = require('koa-router')
const amqplib = require('amqplib')
const bodyParser = require('koa-bodyparser')
const app = new Koa()
const router = new Router()

console.log('amqp://rabbit')

const open = amqplib.connect('amqp://rabbit')
const queueName = 'log_queue'
const channel = open
  .then(conn => conn.createChannel())
  .then(ch => ({ ok: ch.assertQueue(queueName), ch }))
  .catch(console.warn)

open
  .then(conn => conn.createChannel())
  .then(function(ch) {
    return ch.assertQueue(queueName).then(function(ok) {
      ch.prefetch(10)
      return ch.consume(queueName, function(msg) {
        console.log('consume')
        if (msg !== null) {
          console.log(msg.content.toString())
          setTimeout(() => {
            ch.ack(msg);
            addToQueue(msg.content.toString())
          }, 2000)
        }
      });
    })
    })



const addToQueue = message => {
  channel.then(({ ch }) => {
    ch.sendToQueue(
      queueName,
      new Buffer(JSON.stringify(message))
    )
  })
}


router.get('/test', async ctx => {
  ctx.body = 'Hello World'
})

router.post('/job', async ctx => {
  Array.from({ length: 100 }).forEach((_, i) => {
    addToQueue(Object.assign({i}, ctx.request.body))
  })
  ctx.body = 'ok'
})

app
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods())


app.listen(3000)
