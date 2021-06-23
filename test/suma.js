const assert = require('assert')
const {validate} = require('../src/commonjs/herbs.cjs')


describe('suma', () => {

    describe('valid validators', () => {

        it('multiple validators with valid value', () => {
            const value = 'text'
            const validations = {
                presence: true,
                allowNull: false,
                type: String,
                length: {
                    minimum: 3,
                    maximum: 5,
                    is: 4
                }
            }
            const ret = validate(value, validations)
            assert.deepStrictEqual(ret, { value: value, errors: [] })
        })

        it('multiple validators with invalid value', () => {
            const value = 'text'
            const validations = {
                presence: true,
                allowNull: false,
                type: Number,
                length: {
                    minimum: 5,
                    maximum: 3,
                    is: 3
                }
            }
            const ret = validate(value, validations)
            assert.deepStrictEqual(ret, {
                value: 'text',
                errors: [
                    { wrongType: 'Number' },
                    { isTooShort: 5 },
                    { isTooLong: 3 },
                    { wrongLength: 3 }
                ]
            })
        })

    })


    describe('invalid validators', () => {

        it('should throw an error', (done) => {
            const value = 1
            const validations = { notAValidValidator: true }
            try {
                // eslint-disable-next-line no-unused-vars
                const ret = validate(value, validations)
                done('Error')
            }
            catch (err) {
                assert.deepStrictEqual(err.message, 'Unknown validator "notAValidValidator"')
                done()
            }
        })

    })
})
