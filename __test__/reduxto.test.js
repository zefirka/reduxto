import reduxto from '../src/'

describe('reduxto', () => {
    const {actions, reducer} = reduxto('test', {}, {
        ACTION: (state, {payload}) => {
            return {...state, [payload]: 'RESULT_OF_ACTION'}
        }
    })
    
    describe('actions', () => {
        test('actions should be correct', () => {
            expect(actions.set.toString()).toBe('test/setTest')
            expect(actions.get.toString()).toBe('test/getTest')
            expect(actions.getById.toString()).toBe('test/getByIdTest')
            expect(actions.put.toString()).toBe('test/putTest')
            expect(actions.update.toString()).toBe('test/updateTest')
            expect(actions.remove.toString()).toBe('test/removeTest')
        })

        test('should be correct action value', () => {
            expect(actions.set('data')).toEqual({
                type: 'test/setTest',
                payload: 'data',
            })
            expect(actions.get()).toEqual({
                type: 'test/getTest',
            })
            expect(actions.getById()).toEqual({
                type: 'test/getByIdTest',
            })
            expect(actions.put('data')).toEqual({
                type: 'test/putTest',
                payload: 'data',
            })
            expect(actions.update('data')).toEqual({
                type: 'test/updateTest',
                payload: 'data',
            })
            expect(actions.remove('data')).toEqual({
                type: 'test/removeTest',
                payload: 'data',
            })
        })
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
            expect(newState).not.toBe(state)

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
