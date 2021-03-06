(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.reduxto = factory());
}(this, function () { 'use strict';

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

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
  var unaryId = function unaryId(payload, key) {
    return {
      payload: payload,
      key: key
    };
  };
  var copy = function copy(state) {
    if (Array.isArray(state)) {
      return state.map(copy);
    }

    if (_typeof(state) === 'object' && state !== null) {
      var s = {};

      var _arr = Object.entries(state);

      for (var _i = 0; _i < _arr.length; _i++) {
        var _arr$_i = _slicedToArray(_arr[_i], 2),
            id = _arr$_i[0],
            value = _arr$_i[1];

        s[id] = copy(value);
      }

      return s;
    }

    return state;
  };
  var put = function put(state, _ref) {
    var payload = _ref.payload,
        _ref$key = _ref.key,
        key = _ref$key === void 0 ? 'id' : _ref$key;

    if (Array.isArray(state)) {
      var _s = copy(state).map(function (item) {
        var m = payload.find(function (i) {
          return i[key] === item[key];
        });
        return m || item;
      });

      payload.forEach(function (item) {
        if (!state.find(function (i) {
          return i[key] === item[key];
        })) {
          _s.push(item);
        }
      });
      return _s;
    }

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
  var update = function update(state, _ref2) {
    var _ref2$payload = _ref2.payload,
        id = _ref2$payload.id,
        value = _ref2$payload.value,
        _ref2$payload$key = _ref2$payload.key,
        key = _ref2$payload$key === void 0 ? 'id' : _ref2$payload$key;
    return Array.isArray(state) ? state.map(function (item) {
      if (item[key] === id) {
        return value;
      }

      return copy(item);
    }) : _objectSpread({}, copy(state), _defineProperty({}, id, _objectSpread({}, state[id], value)));
  };
  var remove = function remove(state, _ref3) {
    var payload = _ref3.payload;

    if (Array.isArray(state)) {
      var _s2 = state.filter(function (item) {
        return typeof payload.key !== 'undefined' ? item[payload.key] !== payload.value : item.id !== payload;
      });

      return _s2;
    }

    var s = copy(state);
    delete s[payload];
    return s;
  };

  var DEFAULT_CONFIG = {
    actions: {
      'get': null,
      'getById': null,
      'set': function set(_, _ref) {
        var payload = _ref.payload;
        return payload;
      },
      'put': put,
      'update': update,
      'remove': remove
    },
    actionCreator: function actionCreator(namespace) {
      return function (actionName) {
        var payloadCreator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : unaryId;
        var type = "".concat(namespace, "/").concat(actionName).concat(capitalize(namespace));

        function actionCreator() {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          var actionExtend = args ? payloadCreator.apply(void 0, args) : {};
          return _objectSpread({
            type: type
          }, actionExtend);
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
          return actions[type](state, action);
        }
      };
    }
  };

  function reduxto(namespace, defaultState) {
    var handlers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var createAction = reduxto.__config.actionCreator(namespace);

    var actions = {};
    var additionalHandlers = {};
    Object.entries(handlers).forEach(function (_ref2) {
      var _ref3 = _slicedToArray(_ref2, 2),
          actionName = _ref3[0],
          handler = _ref3[1];

      if (handler === null) {
        actions[actionName] = createAction(actionName);
      } else {
        additionalHandlers[actionName] = handler;
      }
    });
    Object.keys(reduxto.__config.actions).forEach(function (operation) {
      actions[operation] = createAction(operation);
    });
    var defaultHandlers = Object.entries(actions).reduce(function (acc, _ref4) {
      var _ref5 = _slicedToArray(_ref4, 2),
          actionName = _ref5[0],
          actionBody = _ref5[1];

      return _objectSpread({}, acc, _defineProperty({}, actionBody, reduxto.__config.actions[actionName] || function (state) {
        console.warn('No action ' + actionName + 'is configured');
        return state;
      }));
    }, {});

    var actionHandlers = _objectSpread({}, defaultHandlers, additionalHandlers);

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
