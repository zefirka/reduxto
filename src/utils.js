export const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1)
export const unaryId = (payload) => ({payload})

export const copy = (state) => {
    const s = {}

    for(const [id, value] of Object.entries(state)) {
        s[id] = {...value}
    }
    
    return s
}

export const put = (state, {payload}) => {
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
