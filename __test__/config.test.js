import reduxto from '../src/'

describe('reduxto config', () => {

    describe('reducer with arrays', () => {
        const configActions = {
            put: (state, {payload}) => state.concat(payload),
            update: (state, {payload: {id, value}}) => {
                const newState = JSON.parse(JSON.stringify(state))
                return newState.map(s => s.id === id ? {...s, ...value} : s)
            },
            remove: (state, {payload}) => state.filter(s => s.id !== payload),
        }

        reduxto.configure({
            actions: configActions
        })

        test('should extend config', () => {
            expect(reduxto.__config.actions).toEqual({
                ...reduxto.configure.default.actions,
                ...configActions,
            })
        })

        const {reducer, actions} = reduxto('test', [])
        let state = []

        test(':set', () => {
            const list = [{id: 1, value: 'a'}, {id: 2, value: 'b'}]

            let newState = reducer(state, actions.set(list))

            expect(newState).toEqual(list)
            expect(newState).not.toBe(state)

            state = newState
        })

        test(':put', () => {
            const elem = [{id: 3, value: 'c'}]
            let newState = reducer(state, actions.put(elem))

            expect(newState).toEqual(state.concat(elem))
            expect(newState).not.toBe(state)

            state = newState
        })

        test(':update', () => {
            const elem = {value: 'd'}
            let newState = reducer(state, actions.update({id: 3, value: elem}))
            const result = [{id: 1, value: 'a'}, {id: 2, value: 'b'}, {id: 3, value: 'd'}]
            expect(newState).toEqual(result)
            expect(newState).not.toBe(state)

            state = newState
        })

        test(':delete', () => {
            let newState = reducer(state, actions.remove(2))
            newState = reducer(newState, actions.remove(3))
    
            expect(newState).toEqual([{id: 1, value: 'a'}])
            expect(newState).not.toBe(state)

            state = newState
        })
    })

    describe('action creation', () => {
        const toSnakeCase = s => s.replace(/\.?([A-Z])/g, function (x,y){return "_" + y.toLowerCase()}).replace(/^_/, "")

        const actionCreator = (namespace) => {
            return function(actionName) {
                return payload => ({
                    type: namespace + '_' + toSnakeCase(actionName).toUpperCase(),
                    payload,
                })
            }
        }

        reduxto.configure({
            actionCreator,
        })

        const {actions} = reduxto('TEST')

        test('actions should name correctly', () => {
            expect(actions.get().type).toBe('TEST_GET')
            expect(actions.getById().type).toBe('TEST_GET_BY_ID')
            expect(actions.set().type).toBe('TEST_SET')
            expect(actions.update().type).toBe('TEST_UPDATE')
            expect(actions.put().type).toBe('TEST_PUT')
            expect(actions.remove().type).toBe('TEST_REMOVE')
        })
    })
})
