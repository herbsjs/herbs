const {spec, scenario, given, when, check, state} = require('../src/commonjs/herbs.cjs').specs
const assert = require('assert')

describe('A spec', () => {
  context('generic', () => {
    context('before run', () => {
      const givenTheSimplestGenericSpec = () => {
        const ASpec = spec({
          'A simple scenario': scenario({
            info: 'A simple scenario',
            'Given a input': given(() => ({
              id: 'a',
            })),
            'When running': when((ctx) => {
              ctx.id = 'b'
            }),
            'Check another output': check((ctx) => {
              assert.ok(ctx.id === 'b')
            }),
          }),
        })

        return ASpec
      }

      it('should document its structure', async () => {
        //given
        const instance = givenTheSimplestGenericSpec()

        //when
        const ret = await instance.doc()

        //then
        assert.deepStrictEqual(
          ret,
          {
            type: 'spec',
            scenarios: [
              {
                type: 'scenario',
                description: 'A simple scenario',
                info: 'A simple scenario',
                samples: [],
                givens: [{ type: 'given', description: 'Given a input', value: { id: 'a' }, isFunction: true }],
                whens: [{ type: 'when', description: 'When running' }],
                checks: [{ type: 'check', description: 'Check another output' }]
              }]
          },
        )
      })
    })

    context('passing', () => {
      const givenTheSimplestGenericSpec = () => {
        const ASpec = spec({
          'A simple scenario': scenario({
            info: 'A simple scenario',
            'Given a input': given(() => ({
              id: 'a',
            })),
            'When running': when((ctx) => {
              ctx.id = 'b'
            }),
            'Check another output': check((ctx) => {
              assert.ok(ctx.id === 'b')
            }),
          }),
        })

        return ASpec
      }

      it('should run', async () => {
        //given
        const instance = givenTheSimplestGenericSpec()
        //when
        const ret = await instance.run()
        //then
        // - firts, it should not throw a exception, then:
        assert.strictEqual(ret, state.passed)
        assert.strictEqual(
          instance.scenarios[0].description,
          'A simple scenario',
        )
        assert.strictEqual(instance.scenarios[0].state, state.passed)
      })

    })

  })
})