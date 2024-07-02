import Fastify from 'fastify'
import { trace } from '@opentelemetry/api'

import { rollTheDice } from './dice'

const tracer = trace.getTracer('dice-server', '0.1.0')

const fastify = Fastify()

fastify.get('/', async (_, reply) => {
  reply.type('application/json').code(200)
  return { hello: 'world' }
})

fastify.get<{ Querystring: { rolls?: number } }>('/rolldice', (request, reply) => {
  return tracer.startActiveSpan('/rolldice', (span) => {
    const rolls = request.query.rolls ? parseInt(request.query.rolls.toString()) : NaN

    if (isNaN(rolls)) {
	  span.addEvent('Missing roll argument')
	  span.end()

      reply
        .type('application/json')
        .code(400)
        .send({ error: "Request parameter 'rolls' is missing or not a number." })
      return
    }

	span.end()
    reply
      .type('application/json')
      .send(JSON.stringify(rollTheDice(rolls, 1, 6)))
  })
})

fastify.listen({ port: 3000 }, (_, address) => {
  console.log(`Listening in port ${address}`)
})

