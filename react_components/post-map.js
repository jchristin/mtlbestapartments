/* global module:true, google, document */

"use strict";

var React = require("react"),
injectIntl = require("react-intl").injectIntl;

module.exports = injectIntl(React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired,
  },
  getInitialState: function() {
    return {
      buttondisable: true,
      selectedAddress: null,
    };
  },
  componentDidMount: function() {
    this.infowindow = new google.maps.InfoWindow();
    var center = new google.maps.LatLng(45.501689, -73.567256);

    var mapOptions = {
      center: center,
      zoom: 15,
    };

    // Create the map.
    this.map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

    // Apply style to the map.
    var styledMap = new google.maps.StyledMapType(require("./map-style"));
    this.map.mapTypes.set("map-style", styledMap);
    this.map.setMapTypeId("map-style");

    // Place marker.
    this.marker = new google.maps.Marker({
      position: center,
      map: this.map,
    });

    // Create the autocomplete object, restricting the search to geographical
    // location types.
    this.input = document.getElementById('autocomplete');
    var options = {
      types: ['geocode'],
      componentRestrictions: {country: 'ca'}
    };

    this.autocomplete = new google.maps.places.Autocomplete(this.input, options);

    // When the user selects an address from the dropdown, populate the address
    // fields in the form.
    this.autocomplete.addListener('place_changed', function() {

      this.infowindow.close();
      // Get the place details from the autocomplete object.
      var place = this.autocomplete.getPlace();

      // If the place has a geometry, then present it on a map.
      if (place.geometry.viewport) {
        this.map.fitBounds(place.geometry.viewport);
      } else {
        this.map.setCenter(place.geometry.location);
        this.map.setZoom(17);  // Why 17? Because it looks good.
      }

      this.marker.setPosition(place.geometry.location);
      this.marker.setVisible(true);

      var address = '';
      if (place.address_components) {
        address = [
          (place.address_components[0] && place.address_components[0].short_name || ''),
          (place.address_components[1] && place.address_components[1].short_name || ''),
          (place.address_components[4] && place.address_components[4].short_name || ''),
          (place.address_components[6] && place.address_components[6].short_name || ''),
          (place.address_components[8] && place.address_components[8].short_name || ''),
          (place.address_components[7] && place.address_components[7].short_name || '')
        ].join(' ');
      }

      this.setState({
        buttondisable: false,
        selectedAddress: address,
      });

      this.infowindow.setContent('<div><strong>Address selected</strong><br>' + address);
      this.infowindow.open(this.map, this.marker);


    }.bind(this));
  },
  handleInputChange: function() {
    this.infowindow.close();
    this.setState({
      buttondisable: true,
      selectedAddress: null
    });
  },
  handleValidateAddress: function() {
    this.setState({
      buttondisable: true
    });

    this.props.callback();
  },
	render: function() {
		var formatMessage = this.props.intl.formatMessage;
    var disabled = this.state.buttondisable ? " disabled" : "";
    var style = this.state.buttondisable ? " btn-default" : " btn-success";

		return React.DOM.div({
      id: "map"
    },
      React.DOM.hr(null),
      React.DOM.div(null, formatMessage({
				id: "postapt-map-title"
			})),
      React.DOM.input({
        id: "autocomplete",
        className: "form-control",
        placeholder: formatMessage({
            id: "postapt-map-input-caption"
          }),
        type: "text",
        name: formatMessage({
            id: "postapt-map-input-caption"
          }),
        onChange: this.handleInputChange
      }),
      React.DOM.div({
  			id: "map-canvas",
  		}),
      React.DOM.button({
        className: "btn" + disabled + style,
        onClick: this.handleValidateAddress
			}, formatMessage({
					id: "postapt-button"
				})
    ));
	}
}));
