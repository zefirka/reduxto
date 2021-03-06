# reduxto [![Build Status](https://travis-ci.org/zefirka/reduxto.svg?branch=master)](https://travis-ci.org/zefirka/reduxto)

<img src="./static/reducto.gif" align="right" width="180"/>

reduxto is small and simple reducer creator for redux. If you're tired to write same code for every reducer, describe actions, constants, action-handlers then you may find reduxto useful. It's totally hackable and extensible, so if your approach to action naming, data types and structures in store, namespacing your actions is different then reduxto provides by standard, you can configure reduxto for yourself very easy. 

## Usage and ratio
[Look for examples, methods, configuring and extending in docs](#documentation)

Simplify your reducers creation with reduxto, use it and get ready reducer and actions. No constants, no manual action creation, no copy-paste logic in reducers.

```js 
// store/boxes.js
export {actions, reducer} = reduxto('boxes', {;
    0: {name: 'Default Box'}
});

// store/items.js
export {actions, reducer} = reduxto('items', {});

// store/reducer.js
import {reducer as boxes} from './boxes';
import {reducer as items} from './items';

export default combineReducers({
    boxes,
    items,
});
```

reduxtor will return object `{actions, reducer}`, where will be namespaced actions `get`, `getById`, `set`, `put`, `update`, `remove`, prefixed with reducer namespace, and ready action handlers for all non-get methods in reducer.

## Use it in sagas or in thunk
```js
// saga.js
import {actions} from './store/items';

function * watchGetItems() { 
    while (true) {
        yield take(actions.get) // take all actions with {type: 'items/getItems'}

        const items = yield call(getItemsFromApi);
        yield put(actions.set(items)) // emits action with {type: 'items/setItems', payload: items}
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

We belive that store must represent a kind of database on the client side. And it's good to divide roles in your application, when **reducers** are made for storing and manipulating data, **sagas/thunks** for handling asynchronous transactions and scenarios to manage application's behavior and **selectors** for prepare data for containers. In this approach store becomes more simplified and looks as DB: 

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

Mostly it's visible in projects with specified apis (JSONAPI, strict REST with resources). May be your storing model can be different, but anyway you will try to simplify and normalize your store.

In this case appears a neccessary for a lot of similiar actions over store. It's mostly about CRUD operations.

So we've decided that we can optimize reducer creation with reduxto.  


## Documentation
<a href="docs"></a>

### Reducer methods

By standard reduxto is made for work with flat objects in store, with ID as key property (normalized JSON API data) for example:

```
{
    boxes: {
        0: {
            boxName: 'first',
        },
        1: {
            boxName: 'second,
        }
    },
    items: {
        12: {
            itemName: 'content'
        }
    }
}
```

This sttructure will be ok. And reduxto will provide actions

#### Actions

Actions without handlers in reducers just for yousage in sagas/thunks
 - `get` 
 - `getById` (id as payload)

Actions with handlers:
 - `set` - fully replace state with new one (which in payload)
 - `put` - put with merge
 - `update` - updates element in state with `payload = {id: <element id>, value: <element value>}` (merge ig element exists) 
 - `remove` - remove element by id (id as payload)

```js
const defaultState = {}
const {actions, reducer} = reduxto('boxes', defaultState)

actions.get() // {type: 'boxes/getBoxes'}
actions.getById(12) // {type: 'boxes/getBoxesById', payload: 12}

actions.set({0: {name: 'BoxName', content: 'Box content'}}) // will fully replace state

/**
 * State now: 
 * {0: {name: 'BoxName', conten: 'Box content'}}
 */
actions.put({1: {name: 'BoxName', content: 'Box content'}, 0: {content: 'changed'}}) // will put to store new object (and merge if id's matching

/**
 * State now:
 * {0: {name: 'BoxName', conten: 'changed'}, 1: {name: 'BoxName', content: 'Box content'}}
 */

actions.update({id: 1, value: {name: 'changed too'}) // will update with value as a diff

/**
 * State now:
 * {0: {name: 'changed too', conten: 'changed'}, 1: {name: 'BoxName', content: 'Box content'}}
 */

actions.remove(1) //removes element with id 1

/**
 * State now:
 * {0: {name: 'changed too', conten: 'changed'}}
 */
```

## Extending and configuring

You can configure:
 - default action handlers which will be created by `reduxto`. 
 - action creator (by default it use something like [`redux-namespaced-actions`](http://npmjs.com/package/redux-namespaced-actions))
 - reducer creator

Let assume you want to create REST-like reducer with uppercase namespaced actions:

```js
redux.configure({
    actions: {
        get: null, // no action handler in reducer
        post: (state, action) => {...},
        put: (state, action) => {...},
        patch: (state, action) => {...},
        delete: (state, action) => {...}
    },
    actionCreator: (namespace) => (actionName) => (payload) => ({
        type: namespace + '_' + toSnakeCase(actionName).toUpperCase(),
        payload,
    }),
});
```

So when you call to `reduxto('posts')`, you will get next actions: 

```js
const {actions, reducer} = reduxto('posts', {})

actions.get(666) 
/**
 * {
 *      type: POSTS_GET,
 *      payload: 666
 * }
 */

actions.post({id: 667, value: 'post'})
/**
 * {
 *      type: POSTS_POST,
 *      payload: {id: 667, value: 'post'}
 * }
 */
```