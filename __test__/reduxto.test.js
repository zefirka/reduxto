import reduxto from '../src/'

describe('reduxto', () => {
    const {actions, reducer} = reduxto('test', {}, {
        ACTION: (state, {payload}) => {
            return {...state, [payload]: 'RESULT_OF_ACTION'}
        }
    })
    
    describe('actions', () => {
        
    })

    describe('action handlers', () => {
        let state = {}

        test(':set', () => {
            const data = {
                1: {
                    value: 1
                },
                2: {
                    value: 2,
                }
            }
        
            let newState = reducer(state, actions.set(data))

            expect(newState).toEqual(data)
            expect(newState).not.toBe(data)

            state = newState
        })

        test(':put', () => {
            const diff = {
                1: {
                    body: 'some'
                },
                3: {
                    value: 3
                }
            }

            let newState = reducer(state, actions.put(diff))

            expect(newState).toEqual({...state, ...({
                1: {body: 'some', value: 1},
                3: {value: 3}
            })})
            expect(newState).not.toBe(state)

            state = newState
        })
    })
   
})
