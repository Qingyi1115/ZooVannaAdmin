import React from 'react';
import PropTypes from 'prop-types';
import { FormLabel, FormNumberInput } from '../../components/style/export';
import PropertyStyle from './shared-property-style';
export default function PropertyNumber(_ref) {
  var value = _ref.value,
    onUpdate = _ref.onUpdate,
    onValid = _ref.onValid,
    configs = _ref.configs,
    sourceElement = _ref.sourceElement,
    internalState = _ref.internalState,
    state = _ref.state;
  var update = function update(val) {
    var number = parseFloat(val);
    if (isNaN(number)) {
      number = 0;
    }
    if (configs.hook) {
      return configs.hook(number, sourceElement, internalState, state).then(function (_val) {
        return onUpdate(_val);
      });
    }
    return onUpdate(number);
  };
  return /*#__PURE__*/React.createElement("table", {
    className: "PropertyNumber",
    style: PropertyStyle.tableStyle
  }, /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    style: PropertyStyle.firstTdStyle
  }, /*#__PURE__*/React.createElement(FormLabel, null, configs.label)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(FormNumberInput, {
    value: value,
    onChange: function onChange(event) {
      return update(event.target.value);
    },
    onValid: onValid,
    min: configs.min,
    max: configs.max
  })))));
}
PropertyNumber.propTypes = {
  value: PropTypes.any.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onValid: PropTypes.func,
  configs: PropTypes.object.isRequired,
  sourceElement: PropTypes.object,
  internalState: PropTypes.object,
  state: PropTypes.object.isRequired
};