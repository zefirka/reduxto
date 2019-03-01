const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1)
const unaryId = (payload) => ({payload})

const config = {
    strictInvariant: true,
    actions: {
        'get': null,
        'getById': null,

        'set': (_, {payload}) => payload,
        'put': (state, {payload}) => ({...state, ...payload}),
        'update': (state, {payload: {id, value}}) => ({...state, [id]: value}),
        'remove': (state, {payload}) => {
            const s = {...state}
            delete s[payload]
            return s
        },
    },
    reducerName: (namespace) => {
        return capitalize(namespace);
    },
    actionCreator: (namespace) => {
        return (actionName, payloadCreator = unaryId) => (...args) => {
            const actionData = payloadCreator(...args)

            return {
                type: `${namespace}/${actionName}`,
                ...actionData    
            }
        }
    },
    reducerCreator: (actions, defaultState) => {
        return (state = defaultState, action) => {
            const {type} = action;

            if (actions[type]) {
                const newState = actions[type](state, action)

                if (reducto.__config.strictInvariant) {
                    return JSON.parse(JSON.stringify(newState))
                }

                return newState
            }
        }
    }
}

function reducto(namespace, defaultState, handlers = {}) {
    const reducerName = reducto.__config.getRedcureName(namespace)
    const createAction = reducto.__config.getActionCreator(namespace)

    const actions = Object.keys(reducro.__config.actions).reduce((acc, operation) => ({
        ...acc,
        [operation]: createAction(operation + reducerName)
    }), {})

    const reducer = handleActions({
        ...handlers,
    }, defaultState)

    return {
        reducer,
        actions,
    }
}

reducto.__config = config;

reducto.configure = (cfg) => {
    reducto.__config = {...reducto.__config, cfg}
}

export default reducto
