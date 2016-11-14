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
        return {
            NbOfBedroom: _.fill(Array(5), false),
            buttonDisable: true
        };
    },
    handleChange: function(number, NbOfBedroom) {
        for (var i = 0; i < 5; i += 1) {
            this.bedrooms[i] = false;
        }

        this.bedrooms[number] = NbOfBedroom;

        var bedSelected = _.some(this.bedrooms, function(bedroom) {
            return bedroom === true;
        });

        if (bedSelected && NbOfBedroom) {
            this.bed = number;
        } else {
            this.bed = 0;
        }

        this.setState({
            buttonDisable: !bedSelected,
            NbOfBedroom: this.bedrooms
        });
    },
    createButton: function(number, label) {
        var NbOfBedroom = this.state.NbOfBedroom[number];

        return React.DOM.button({
            type: "button",
            className: "btn btn-secondary" + (NbOfBedroom ? " active" : ""),
            onClick: this.handleChange.bind(this, number, !NbOfBedroom)
        }, label
    );
    },
    handleValidateBed: function() {
        if (!this.state.buttonDisable) {
            this.setState({
                buttonDisable: true
            });
            this.props.callback(this.bed);
        }
    },
    render: function() {
        var formatMessage = this.props.intl.formatMessage;
        var disabled = this.state.buttonDisable ? " disabled" : "";
        var style = this.state.buttonDisable ? " btn-default" : " btn-success";

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
        })
    )));
    }
}));
