function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
import React from 'react';
import PropTypes from 'prop-types';
import { MdArrowBack as Arrow } from 'react-icons/md';
import * as SharedStyle from '../../shared-style';
var breadcrumbStyle = {
  margin: '1.5em',
  display: 'flex'
};
var breadcrumbTextStyle = {
  fontSize: '20px',
  cursor: 'pointer'
};
var breadcrumbLastTextStyle = _objectSpread(_objectSpread({}, breadcrumbTextStyle), {}, {
  fontWeight: 'bolder',
  color: SharedStyle.SECONDARY_COLOR.main
});
var breadcrumbTabStyle = {
  fill: SharedStyle.COLORS.black,
  fontSize: '24px',
  marginLeft: '10px',
  marginRight: '10px'
};
var CatalogBreadcrumb = function CatalogBreadcrumb(_ref) {
  var names = _ref.names;
  var labelNames = names.map(function (name, ind) {
    var lastElement = ind === names.length - 1;
    return /*#__PURE__*/React.createElement("div", {
      key: ind,
      style: {
        display: 'flex'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: !lastElement ? breadcrumbTextStyle : breadcrumbLastTextStyle,
      onClick: name.action || null
    }, name.name), !lastElement ? /*#__PURE__*/React.createElement(Arrow, {
      style: breadcrumbTabStyle
    }) : null);
  });
  return /*#__PURE__*/React.createElement("div", {
    style: breadcrumbStyle
  }, labelNames);
};
CatalogBreadcrumb.propTypes = {
  names: PropTypes.arrayOf(PropTypes.object).isRequired
};
export default CatalogBreadcrumb;