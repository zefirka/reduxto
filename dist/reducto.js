(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.reducto = factory());
}(this, function () { 'use strict';

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      var ownKeys = Object.keys(source);

      if (typeof Object.getOwnPropertySymbols === 'function') {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }

      ownKeys.forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    }

    return target;
  }

  var capitalize = function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  var unaryId = function unaryId(payload) {
    return {
      payload: payload
    };
  };

  var config = {
    strictInvariant: true,
    actions: {
      'get': null,
      'getById': null,
      'set': function set(_, _ref) {
        var payload = _ref.payload;
        return payload;
      },
      'put': function put(state, _ref2) {
        var payload = _ref2.payload;
        return _objectSpread({}, state, payload);
      },
      'update': function update(state, _ref3) {
        var _ref3$payload = _ref3.payload,
            id = _ref3$payload.id,
            value = _ref3$payload.value;
        return _objectSpread({}, state, _defineProperty({}, id, value));
      },
      'remove': function remove(state, _ref4) {
        var payload = _ref4.payload;

        var s = _objectSpread({}, state);

        delete s[payload];
        return s;
      }
    },
    reducerName: function reducerName(namespace) {
      return capitalize(namespace);
    },
    actionCreator: function actionCreator(namespace) {
      return function (actionName) {
        var payloadCreator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : unaryId;
        return function () {
          var actionData = payloadCreator.apply(void 0, arguments);
          return _objectSpread({
            type: "".concat(namespace, "/").concat(actionName)
          }, actionData);
        };
      };
    },
    reducerCreator: function reducerCreator(actions, defaultState) {
      return function () {
        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
        var action = arguments.length > 1 ? arguments[1] : undefined;
        var type = action.type;

        if (actions[type]) {
          var newState = actions[type](state, action);

          if (reducto.__config.strictInvariant) {
            return JSON.parse(JSON.stringify(newState));
          }

          return newState;
        }
      };
    }
  };

  function reducto(namespace, defaultState) {
    var handlers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var reducerName = reducto.__config.getRedcureName(namespace);

    var createAction = reducto.__config.getActionCreator(namespace);

    var actions = Object.keys(reducro.__config.actions).reduce(function (acc, operation) {
      return _objectSpread({}, acc, _defineProperty({}, operation, createAction(operation + reducerName)));
    }, {});
    var reducer = handleActions(_objectSpread({}, handlers), defaultState);
    return {
      reducer: reducer,
      actions: actions
    };
  }

  reducto.__config = config;

  reducto.configure = function (cfg) {
    reducto.__config = _objectSpread({}, reducto.__config, {
      cfg: cfg
    });
  };

  return reducto;

}));
