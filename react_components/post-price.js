/* global module:true */

"use strict";

var React = require("react"),
injectIntl = require("react-intl").injectIntl,
priceFormater = require("./price-formater");

module.exports = injectIntl(React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },
  getInitialState: function() {
    return {
      price: 2000,
      buttondisable: false
    };
  },
  componentDidMount: function() {
      var Slider = require("bootstrap-slider");
      this.slider = new Slider("#slider-price", {
          min: 50,
          max: 4000,
          step: 50,
          value: this.state.price,
          tooltip: "hide"
      });

      this.slider.on("slide", function(event) {
          this.updateUi(event);
      }.bind(this));

      this.slider.on("slideStop", function(event) {
          this.updateUi(event);
      }.bind(this));
  },
  updateUi: function(event) {
      this.setState({
          price: event
      });
  },
  handleValidate: function() {
      this.setState({
          buttondisable: true
      });

      this.props.callback(this.state.price);
  },
  render: function() {
      var formatMessage = this.props.intl.formatMessage;
      var disabled = this.state.buttondisable ? " disabled" : "";
      var style = this.state.buttondisable ? " btn-default" : " btn-success";

      return React.DOM.div({
          id: this.props.id
      },
      React.DOM.h4({
          className: "card-title"
      }, formatMessage({
          id: "postapt-price-title"
      })),
      React.DOM.i(null, formatMessage({
          id: "postapt-price-caption"
      })),
      React.createElement(priceFormater, {
          price: this.state.price
      }),
      React.DOM.div(null,
          React.DOM.input({
              type: "text",
              id: "slider-price"
          })
      ),
      React.DOM.div(null,
          React.DOM.button({
              className: "btn" + disabled + style,
              onClick: this.handleValidate
          }, formatMessage({
              id: "postapt-button"
          })
      ))
  );
  }
}));
