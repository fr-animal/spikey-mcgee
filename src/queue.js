const open = require('amqplib').connect('amqp://rabbit');

const createChannel = open.then(conn  => conn.createChannel())

const queue = async queueName => {
  const ch = await createChannel
  await ch.assertQueue(queueName)
  return ch
}

const createSendToQueue = queueName => async message => {
  const ch = await queue(queueName)
  ch.sendToQueue(queueName, new Buffer(JSON.stringify(message)))
}

const createConsumeQueue = queueName => async callback => {
  const ch = await queue(queueName)
  ch.consume(queueName, msg => {
    callback(msg.content.toString(), () => {
      ch.ack(msg)
    })
  })
}

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
