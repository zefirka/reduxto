import {capitalize, put, update, remove, unaryId} from './utils'

const DEFAULT_CONFIG = {
    actions: {
        'get': null,
        'getById': null,
        'set': (_, {payload}) => payload,
        'put': put,
        'update': update,
        'remove': remove,
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
                return actions[type](state, action)
            }
        }
    }
}

function reduxto(namespace, defaultState, handlers = {}) {
    const createAction = reduxto.__config.actionCreator(namespace)

    const actions = {};
    const additionalHandlers = {};
    
    Object.entries(handlers).forEach(([actionName, handler]) => {
        if (handler === null) {
            actions[actionName] = createAction(actionName)
        } else {
            additionalHandlers[actionName]  = handler;
        }
    })

    Object.keys(reduxto.__config.actions).forEach((operation) => {
        actions[operation] = createAction(operation);
    });

    const defaultHandlers = Object.entries(actions).reduce((acc, [actionName, actionBody]) => {
        return {
            ...acc,
            [actionBody]: reduxto.__config.actions[actionName] || function(state) {
                console.warn('No action ' + actionName + 'is configured')
                return state
            }
        };
    }, {})

    const actionHandlers = {
        ...defaultHandlers,
        ...additionalHandlers,
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
