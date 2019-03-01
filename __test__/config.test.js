import reducto from '../index'
import { exportSpecifier } from '@babel/types';

describe('reducto config', () => {

    describe('with arrays', () => {
        const configActions = {
            put: (state, {payload}) => state.concat(payload),
            update: (state, {id, value}) => {
                const newState = JSON.parse(JSON.stringify(state))
                return newState.map(s => {
                    if (s.id === id) {
                        return value
                    }

                    return s
                })
            },
            remove: (state, {payload}) => state.filter(s => s.id !== payload),
        }

        reducto.configure({
            actions: configActions
        })

        test('should extend config', () => {
            expect(reducto.__config.actions).toEqual({
                ...reducto.configure.default.actions,
                ...configActions,
            })
        })

        const {reducer, actions} = reducto('test', [])
        let state = []
        const list = [{id: 1, value: 'a'}, {id: 2, value: 'b'}]

        test(':set', () => {
            let newState = reducer(state, actions.set(list))

            expect(newState).toEqual(list)
            expect(newState).not.toBe(state)

            state = newState
        })

    })
})
