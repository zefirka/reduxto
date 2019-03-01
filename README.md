# Reducto

Reducto is small and simple reducer creator. Sometime you can find out then most of your reducers look similiar. If you're tired to write same code for every reducer, describe actions, describe actions handlers then you may find reducto useful. It's totally hackable and extensible, so if you're approach to action naming, data types in store, namespacing your actions is different then reducto provides by standard, you can easy configure reducto for yourself. 

## Usage and ratio
[Look for examples, methods, configuring and extending in docs](#docs)

Simplify your reducers creation with reducto, use it and get ready reducer and actions. No constants, no manual action creation, no copy-paste logic in reducers.

```js 
// store/boxes.js
export {actions, reducer} = reducto('boxes', {;
    0: {name: 'Default Box'}
});

// store/items.js
export {actions, reducer} = reducto('items', {});

// store/reducer.js
import {reducer as boxes} from './boxes';
import {reducer as items} from './items';

export default combineReducers({
    boxes,
    items,
});
```

Reductor will return object `{actions, reducer}`, where will be namespaced actions `get`, `getById`, `set`, `put`, `update`, `remove`, prefixed with reducer namespace, and ready action handlers for all non-get methods in reducer.

## Use it in sagas or in thunk
```js
// saga.js
import {actions} from './store/items';

function * watchGetItems() { 
    while (true) {
        yield take(actions.get) // take all actions with {type: 'boxes/getBoxes'}

        const items = yield call(getItemsFromApi);
        yield put(actions.set(items)) // emits action with {type: 'boxes/setBoxes', payload: items}
    }
}
```

## Use it in container

```js
// container.js

import {actions as boxesActions} from 'store/boxes'
import {actions as itemsActions} from 'store/items'
import Component from 'components/Component'

export connect(mapDispatchToProps, {
    getBoxes: boxesActions.get,
    getItems: itemsActions.get
})
```

### Ratio

I belive that reducers must represent a kind of database on the client side. And it's good to divide roles in your frontend. So reducers are made for storing data, sagas/thunks for handling asynchronous transactions and scenarios to manage application's behavior and selectors for prepare data for containers. In this approach store becomes more simplified and looks as DB: 

```
{
    ui: {
        // data for UI
    }
    data: {
        boxes: {
            [id]: {...}
        },
        items: {
            [id]: {...}
        }
    }
}
```

You may find out that for you data types for storing models can be different, but anyway you will try to simplify and normalize your store. 

In this case appears a neccessary for a lot of similiar actions over store. It's mostly about `set`, `update`, `merge` and `put` operations. So we've decided that we can optimize reducer creation with reducto.  


## Standart reducto methods
<a href="docs"></a>

Reducto

```js
const defaultState = {}
const {actions, reducer} = reducto('boxes', defaultState)

actions.get() // {type: 'boxes/getBoxes'}
actions.getById(12) // {type: 'boxes/getBoxesById', payload: 12}

actions.set({0: {name: 'BoxName', conten: 'Box content'}}) // will fully replace state
```

## Extending and configuring

TBD