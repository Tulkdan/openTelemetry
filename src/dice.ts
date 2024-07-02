import { trace } from '@opentelemetry/api'

const tracer = trace.getTracer('dice-lib')

const rollOnce = (min: number, max: number) => {
  return tracer.startActiveSpan('rollOnce', (span) =>  {
    const result = Math.floor(Math.random() * (max - min) + min)
	span.end()
	return result
  })
}

export const rollTheDice = (rolls: number, min: number, max: number) => {
  return tracer.startActiveSpan('rollTheDice', (span) =>  {
    const result: number[] = []
    for (let i = 0; i < rolls; i++) {
	  result.push(rollOnce(min, max))
    }
	span.end()
    return result
  })
}
