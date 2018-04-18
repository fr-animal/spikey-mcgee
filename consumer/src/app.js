const {
  consumeSubmitter
} = require('./queue.js')

console.log('Start')

consumeSubmitter((message, acknowledge) => {
  console.log('I work!', message)
  acknowledge()
})
