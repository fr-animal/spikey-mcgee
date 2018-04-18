const open = require('amqplib').connect('amqp://rabbit');

const createChannel = open.then(conn  => conn.createChannel())

const queue = async queueName => {
  const ch = await createChannel
  await ch.assertQueue(queueName)
  return ch
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

module.exports = {
  consumeSubmitter,
  consumeFabricator
}
