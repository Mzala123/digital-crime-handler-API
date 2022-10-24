const amqblib = require('amqplib')

const publish = async () => {
  const connection = await amqblib.connect('amqp://localhost')
  return connection
}

module.exports = publish
