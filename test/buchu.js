const { ok, deepEqual }  = require('assert')
const {usecase, step, Ok, Err, request, entity, field, id} = require('../src/commonjs/herbs.cjs')

describe('A use case', () => {

  describe('the simplest use case', () => {

    const anEntity = entity('anEntiy',{
      id: id(Number),
      stringField: field(String)    
  })

    const givenTheSimplestUseCase = () => {
      const uc = usecase('A use case', {
        'A step': step(() => { return Ok() }),
        'A second step': step({
          'step 1': step(() => { return Ok() }),
          'step 2': step(() => { return Ok() }),
        })
      })
      return uc
    }

    it('should initiate', () => {
      //given
      const uc = givenTheSimplestUseCase()
      //then
      ok(uc.description == 'A use case')
    })

    context('returning Ok', () => {

      it('should run', async () => {
        //given
        const uc = givenTheSimplestUseCase()
        //when
        const ret = await uc.run()
        //then
        ok(ret.isOk)
      })

      it('should audit', async () => {
        //given
        const uc = givenTheSimplestUseCase()
        //when
        await uc.run()
        //then

        deepEqual(uc.auditTrail, {
          type: 'use case',
          description: 'A use case',
          transactionId: uc._mainStep._auditTrail.transactionId,
          elapsedTime: uc._mainStep._auditTrail.elapsedTime,
          return: { Ok: {} },
          request: null,
          steps: [
            { type: 'step', description: 'A step', return: { Ok: '' }, elapsedTime: uc._auditTrail.steps[0].elapsedTime },
            {
              type: 'step', description: 'A second step', return: { Ok: {} }, elapsedTime: uc._auditTrail.steps[1].elapsedTime, steps: [
                { type: 'step', description: 'step 1', return: { Ok: '' }, elapsedTime: uc._auditTrail.steps[1].steps[0].elapsedTime },
                { type: 'step', description: 'step 2', return: { Ok: '' }, elapsedTime: uc._auditTrail.steps[1].steps[1].elapsedTime }
              ]
            }]
        })
      })

      it('should receive a request entity', () => {
        //given
        const schemaExpected = {
            stringField: String, 
            id: Number
        }

        //when
        const requestResult = request.from(anEntity)

        //then
        deepEqual(requestResult, schemaExpected)        
    })

    })

    context('returning Err', () => {

      const givenTheSimplestUseCaseWithError = () => {
        const uc = usecase('A use case', {
          'A misstep': step(() => { return Err() })
        })
        return uc
      }

      it('should run', async () => {
        //given
        const uc = givenTheSimplestUseCaseWithError()
        //when
        const ret = await uc.run()
        //then
        ok(ret.isErr)
      })
    })

    

  })


})
