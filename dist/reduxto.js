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

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  var capitalize = function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  };
  var unaryId = function unaryId(payload) {
    return {
      payload: payload
    };
  };
  var copy = function copy(state) {
    var s = {};

    var _arr = Object.entries(state);

    for (var _i = 0; _i < _arr.length; _i++) {
      var _arr$_i = _slicedToArray(_arr[_i], 2),
          id = _arr$_i[0],
          value = _arr$_i[1];

      s[id] = _objectSpread({}, value);
    }

    return s;
  };
  var put = function put(state, _ref) {
    var payload = _ref.payload;
    var s = {};

    var _arr2 = Object.entries(state);

    for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
      var _arr2$_i = _slicedToArray(_arr2[_i2], 2),
          id = _arr2$_i[0],
          value = _arr2$_i[1];

      if (payload[id]) {
        s[id] = _objectSpread({}, value, payload[id]);
      } else {
        s[id] = _objectSpread({}, value);
      }
    }

    var _arr3 = Object.entries(payload);

    for (var _i3 = 0; _i3 < _arr3.length; _i3++) {
      var _arr3$_i = _slicedToArray(_arr3[_i3], 2),
          id = _arr3$_i[0],
          value = _arr3$_i[1];

      if (!s[id]) {
        s[id] = value;
      }
    }

    return s;
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
      'put': put,
      'update': function update(state, _ref2) {
        var _ref2$payload = _ref2.payload,
            id = _ref2$payload.id,
            value = _ref2$payload.value;
        return _objectSpread({}, copy(state), _defineProperty({}, id, value));
      },
      'remove': function remove(state, _ref3) {
        var payload = _ref3.payload;
        var s = copy(state);
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

  reduxto.__config = DEFAULT_CONFIG;

  reduxto.configure = function (cfg) {
    var newActions = _objectSpread({}, reduxto.__config.actions, cfg.actions || {});

    reduxto.__config = _objectSpread({}, reduxto.__config, cfg, {
      actions: newActions
    });
  };

  reduxto.configure.default = DEFAULT_CONFIG;

  return reduxto;

}));
