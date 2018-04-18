const open = require('amqplib').connect('amqp://rabbit');

const createChannel = open.then(conn  => conn.createChannel())

const createSendToQueue = queueName => message => createChannel
.then(ch => {
  ch.assertQueue(queueName)
  .then(() => ch.sendToQueue(queueName, new Buffer(JSON.stringify(message))))
})

// const createConsumeQueue = queueName => callback => {
//   const channel = await createChannel
//   await ch.assertQueue(queueName)
//   ch.consume(queueName, msg => {
//     callback(msg.content.toString(), () => {
//       ch.ack(msg)
//     })
//   })
// }
const createConsumeQueue = queueName => callback => createChannel
.then(ch => {
  ch.assertQueue(queueName)
  .then(() => {
    ch.consume(queueName, msg => {
      callback(msg.content.toString(), () => {
        ch.ack(msg)
      })
    })
  })
})

const consumeSubmitter = createConsumeQueue('SUBMITTER')
const consumeFabricator = createConsumeQueue('SUBMITTER')

const sendToSubmitter = createSendToQueue('SUBMITTER')
const sendToFabricator = createSendToQueue('FABRICATOR')

module.exports = {
  sendToSubmitter,
  sendToFabricator,
  consumeSubmitter,
  consumeFabricator
}
