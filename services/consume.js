const amqblib = require('amqplib')

const consume = async () => {
  const connection = await amqblib.connect('amqp://localhost')
  return connection
}

module.exports = consume
