/* global module:true */

"use strict";

var React = require("react"),
injectIntl = require("react-intl").injectIntl,
_ = require("lodash");

module.exports = injectIntl(React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    componentDidMount: function() {
        this.bed = 0;
    },
    getInitialState: function() {
        this.bedrooms = [];

        for (var i = 0; i < 5; i += 1) {
            this.bedrooms.push(false);
        }

        return {
            checked: this.bedrooms,
            buttondisable: true
        };
    },
    handleChange: function(number, checked) {
        for (var i = 0; i < 5; i += 1) {
            this.bedrooms[i] = false;
        }

        this.bedrooms[number] = checked;

        var bedSelected = _.some(this.bedrooms, function(bedroom) {
            return bedroom === true;
        });

        if (bedSelected && checked) {
            this.bed = number;
        } else {
            this.bed = 0;
        }

        this.setState({
            buttondisable: !bedSelected,
            checked: this.bedrooms
        });
    },
    createButton: function(number, label) {
        var checked = this.state.checked[number];

        return React.DOM.button({
            type: "button",
            className: "btn btn-secondary" + (checked ? " active" : ""),
            onClick: this.handleChange.bind(this, number, !checked)
        }, label
    );
    },
    handleValidateBed: function() {
        if (!this.state.buttondisable) {
            this.setState({
                buttondisable: true
            });
            this.props.callback(this.bed);
        }
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
            id: "postapt-bed-title"
        })), React.DOM.div({
            className: "btn-group",
            role: "group"
        },
        this.createButton(0, "Studio"),
        this.createButton(1, "1"),
        this.createButton(2, "2"),
        this.createButton(3, "3"),
        this.createButton(4, "4+")
    ),
    React.DOM.div(null,
        React.DOM.button({
            className: "btn" + disabled + style,
            onClick: this.handleValidateBed
        }, formatMessage({
            id: "postapt-button"
        })
    )));
    }
}));
