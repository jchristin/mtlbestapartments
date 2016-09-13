"use strict";

var React = require("react");

module.exports = React.createClass({
	displayName: "Modal",
	componentDidMount: function() {
		global.jQuery("#modal").modal("show");

		global.jQuery("#modal").on("hidden.bs.modal", function() {
			if (this.props.onRequestClose) {
				this.props.onRequestClose();
			}
		}.bind(this));
	},
	componentWillUnmount: function() {
		global.jQuery("#modal").modal("hide");
	},
	render: function() {
		return React.DOM.div({
				"className": "modal",
				"id": "modal",
				"tabIndex": "-1",
				"role": "dialog",
				"aria-labelledby": "modal",
				"aria-hidden": "true"
			},
			React.DOM.div({
					className: "modal-dialog",
					role: "document"
				},
				React.DOM.div({
						className: "modal-content"
					},
					React.DOM.div({
							className: "modal-header"
						},
						React.DOM.button({
								"type": "button",
								"className": "close",
								"data-dismiss": "modal",
								"aria-label": "Close"
							},
							React.DOM.span({
								"aria-hidden": "true"
							}, "×")
						)
					),
					React.DOM.div({
							className: "modal-body"
						},
						React.DOM.div({
								className: "container-fluid"
							},
							this.props.children
						)
					)
				)
			)
		);
	}
});
