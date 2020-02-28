export const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1)
export const unaryId = (payload, key) => ({payload, key})

export const copy = (state) => {
    if (Array.isArray(state)) {
        return state.map(copy)
    }

    if (typeof state === 'object' && state !== null) {
        const s = {}

        for(const [id, value] of Object.entries(state)) {
            s[id] = copy(value);
        }

        return s
    }

    return state
}

export const put = (state, {payload, key = 'id'}) => {
    if (Array.isArray(state)) {
        const s = copy(state).map(item => {
            const m = payload.find((i) => i[key] === item[key])
            return m || item;
        });

        payload.forEach((item) => {
            if (!state.find((i) => i[key] === item[key])) {
                s.push(item)
            }
        })

        return s
    }

    const s = {}

    for(const [id, value] of Object.entries(state)) {
        if (payload[id]) {
            s[id] = {...value, ...payload[id]}
        } else {
            s[id] = {...value}
        }
    }

    for(const [id, value] of Object.entries(payload)) {
        if (!s[id]) {
            s[id] = value
        }
    }

    return s
}

export const update = (state, {payload: {id, value, key = 'id'}}) => {
    return Array.isArray(state)
        ? state.map((item) => {
            if (item[key] === id) {
                return value
            }
            return copy(item)
        })
        : ({...copy(state), [id]: {...state[id], ...value}})
}

export const remove = (state, {payload}) => {
    if (Array.isArray(state)) {
        const s = state.filter((item) => {
            return typeof payload.key !== 'undefined' ? item[payload.key] !== payload.value : item.id !== payload
        })

        return s
    }

    const s = copy(state)
    delete s[payload]
    return s
}