(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.reduxto = factory());
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

  var DEFAULT_CONFIG = {
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
    actionCreator: function actionCreator(namespace) {
      return function (actionName) {
        var payloadCreator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : unaryId;
        var type = "".concat(namespace, "/").concat(actionName).concat(capitalize(namespace));

        function actionCreator() {
          return _objectSpread({
            type: type
          }, payloadCreator.apply(void 0, arguments));
        }

        Object.defineProperties(actionCreator, {
          toString: {
            enumerable: false,
            value: function value() {
              return type;
            }
          },
          valueOf: {
            enumerable: false,
            value: function value() {
              return type;
            }
          }
        });
        return actionCreator;
      };
    },
    reducerCreator: function reducerCreator(actions, defaultState) {
      return function () {
        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
        var action = arguments.length > 1 ? arguments[1] : undefined;
        var type = action.type;

        if (actions[type]) {
          var newState = actions[type](state, action);

          if (reduxto.__config.strictInvariant) {
            return JSON.parse(JSON.stringify(newState));
          }

          return newState;
        }
      };
    }
  };
  var config = DEFAULT_CONFIG;

  function reduxto(namespace, defaultState) {
    var _objectSpread4;

    var handlers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var createAction = reduxto.__config.actionCreator(namespace);

    var actions = Object.keys(reduxto.__config.actions).reduce(function (acc, operation) {
      return _objectSpread({}, acc, _defineProperty({}, operation, createAction(operation)));
    }, {});
    var defaultHandlers = reduxto.__config.actions;

    var actionHandlers = _objectSpread((_objectSpread4 = {}, _defineProperty(_objectSpread4, actions.set, defaultHandlers.set), _defineProperty(_objectSpread4, actions.put, defaultHandlers.put), _defineProperty(_objectSpread4, actions.update, defaultHandlers.update), _defineProperty(_objectSpread4, actions.remove, defaultHandlers.remove), _objectSpread4), handlers);

    var reducer = reduxto.__config.reducerCreator(actionHandlers, defaultState);

    return {
      reducer: reducer,
      actions: actions
    };
  }

  reduxto.__config = config;

  reduxto.configure = function (cfg) {
    var newActions = _objectSpread({}, reduxto.__config.actions, cfg.actions || {});

    reduxto.__config = _objectSpread({}, reduxto.__config, cfg, {
      actions: newActions
    });
  };

  reduxto.configure.default = DEFAULT_CONFIG;

  return reduxto;

}));
