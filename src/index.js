import {capitalize, put, copy, unaryId} from './utils'

const DEFAULT_CONFIG = {
    strictInvariant: false,
    actions: {
        'get': null,
        'getById': null,
        'set': (_, {payload}) => payload,
        'put': put,
        'update': (state, {payload: {id, value}}) => ({...copy(state), [id]: {...state[id], ...value}}),
        'remove': (state, {payload}) => {
            const s = copy(state)
            delete s[payload]
            return s
        },
    },
    actionCreator: (namespace) => {
        return (actionName, payloadCreator = unaryId) => {
            const type = `${namespace}/${actionName}${capitalize(namespace)}`

            function actionCreator(...args) {
                const actionExtend = args ? payloadCreator(...args) : {}
                return {
                    type,
                    ...actionExtend,
                }
            }

            Object.defineProperties(actionCreator, {
                toString: {
                    enumerable: false,
                    value: () => type,
                },
                valueOf: {
                    enumerable: false,
                    value: () => type,
                }
            })

            return actionCreator
        }
    },
    reducerCreator: (actions, defaultState) => {
        return (state = defaultState, action) => {
            const {type} = action;
            if (actions[type]) {
                const newState = actions[type](state, action)

                if (reduxto.__config.strictInvariant) {
                    return JSON.parse(JSON.stringify(newState))
                }

                return newState
            }
        }
    }
}

function reduxto(namespace, defaultState, handlers = {}) {
    const createAction = reduxto.__config.actionCreator(namespace)

    const actions = Object.keys(reduxto.__config.actions).reduce((acc, operation) => ({
        ...acc,
        [operation]: createAction(operation)
    }), {})

    const defaultHandlers = reduxto.__config.actions

    const actionHandlers = {
        [actions.set]: defaultHandlers.set,
        [actions.put]: defaultHandlers.put,
        [actions.update]: defaultHandlers.update,
        [actions.remove]: defaultHandlers.remove,
        ...handlers,
    }

    const reducer = reduxto.__config.reducerCreator(actionHandlers, defaultState)

    return {
        reducer,
        actions,
    }
}

reduxto.__config = DEFAULT_CONFIG;

reduxto.configure = (cfg) => {
    const newActions =  {
        ...reduxto.__config.actions,
        ...(cfg.actions || {}),
    }

    reduxto.__config = {
        ...reduxto.__config,
        ...cfg,
        actions: newActions
    }
}

reduxto.configure.default = DEFAULT_CONFIG

export default reduxto
