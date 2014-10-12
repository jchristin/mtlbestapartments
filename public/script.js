var map;

var directionsService;

var FlatMarkers = [];
var SearchPointAddress = [];

var uiFlatMarkersIndex                  = 0;
var uiSearchPointAddressIndex       = 0;

// var rssFeed  = "http://www.google.fr";
// var rssFeed  = 'http://montreal.kijiji.ca/f-SearchAdRss?AdType=2&CatId=214&Keyword=village&Location=1700281';
// var rssFeed  = 'http://www.kijiji.ca/rss-srp-appartement-condo-4-1-2/ville-de-montreal/c214l1700281';
// var rssFeed  = 'http://www.kijiji.ca/rss-srp-2-bedroom-apartments-condos/ville-de-montreal/village/k0c214l1700281?ad=offering';
   
/***************************************************************************************\

Function:       Initialize

Description:    Initialize all services.

Parameters:     None.

Return Value:   None.

Comments:       None.

\***************************************************************************************/
function initialize() {
    var data;

    //
    // Instantiate a directions service.
    //
   directionsService = new google.maps.DirectionsService();
    
    //
    // Create a map and center it on Montreal.
    //
    var Montreal = new google.maps.LatLng(45.506, -73.556);
    var mapOptions = {
        zoom: 12,
        center: Montreal,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    //
    // Load map
    //
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    
    //
    // Set markers
    //
    $(document).ready(function() {
        $.get("api/flats",function(data,status){
            fSetAllMarkerOnMapFlatFiltered(data);
        });
    });
}


/***************************************************************************************\

Function:           fSetAMarkerOnMap

Description:        Set a marker on the map.

Parameters:         address            Given address to place.

Return Value:       None.

Comments:           None.

\***************************************************************************************/
function fSetAMarkerOnMap(oLatLng, eType, isDragable) {
    var IsValidType = false;

    switch (eType) 
    {
        case "Station" :
            pinColor    = "FFFFFF";    // White
            IsValidType    = true;
            break;
                
        case "ValidFlat" :
            pinColor    = "f80808";    // Big red
            IsValidType = true;
            break;
                
        case "NotValidFlat" :
            pinColor    = "f69e9e";    // Low red
            IsValidType = true;
            break;
                
        case "Search" :
            pinColor    = "B8B8B8";    // Grey
            IsValidType = true;
            break;

        default :
            pinColor    = "000000";    // Black
            IsValidType = true;
            break;
    }
            
    if (IsValidType == true)
    {
        oMarker = new google.maps.Marker();
            
        var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
                                        new google.maps.Size(21, 34),
                                        new google.maps.Point(0,0),
                                        new google.maps.Point(10, 34));

        if (isDragable)
        {
            google.maps.event.addListener(oMarker, 'dragend', update);
                    
            oMarker.setDraggable (isDragable);
            oMarker.setTitle('Drag me !! ');
            
        }

        oMarker.setIcon(pinImage);
        oMarker.setAnimation(google.maps.Animation.DROP);
        oMarker.setPosition(oLatLng);
        oMarker.setMap(map);
        
        if (isDragable)
        {
            SearchPointAddress.push(oMarker);
        }
        else
        {
            FlatMarkers.push(oMarker);
        }
    }
}


/***************************************************************************************\

Function:           update

Description:       Update

Parameters:        None.

Return Value:      None.

Comments:       None.

\***************************************************************************************/
function update() 
{
    uiFlatMarkersIndex              = 0;
    uiSearchPointAddressIndex   = 0;

    fFilterRawPostalArray();
}


/***************************************************************************************\

Function:           fSetAMarkerOnMapValidFlat

Description:       Set a marker on the map of a flat.

Parameters:        address            Given address to place.

Return Value:      None.

Comments:       None.

\***************************************************************************************/
function fSetAMarkerOnMapValidFlat(oLatLng) 
{
    fSetAMarkerOnMap(oLatLng, "ValidFlat", false);
}

/***************************************************************************************\

Function:           fSetAllMarkerOnMapFlatFiltered

Description:       Set all marker on the map of the filtered flat.

Parameters:        map                Map to placed the flat marker.

Return Value:      None.

Comments:       None.

\***************************************************************************************/
function fSetAllMarkerOnMapFlatFiltered(data) 
{
    console.log("PROUT ");
    console.log(data);
    
    for (var i = 0; i < data.length; i++) {
    
        var oLatLng = new google.maps.LatLng(data[i].lat, data[i].long);

        fSetAMarkerOnMapValidFlat(oLatLng);
    }
}


/***************************************************************************************\

Function:           fFilterRawPostalArray

Description:       Filter the raw postal array with maximum walking distance.

Parameters:        None.

Return Value:      None.

Comments:       None.

\***************************************************************************************/
function fFilterRawPostalArray() {
    
    var selectedMode = document.getElementById('TravelMode').value;

    var request = {
                    origin: FlatMarkers[uiFlatMarkersIndex].getPosition(),
                    destination: SearchPointAddress[uiSearchPointAddressIndex].getPosition(),
                    travelMode: google.maps.TravelMode[selectedMode]
    };

    // Route the directions and pass the response to a function to create markers for each step.
    directionsService.route(request,  function (response, status) {

        // console.log("Request = " + request.origin);

        if (status == google.maps.DirectionsStatus.OK) 
        {
            var Duration = 0;
        
            // Compute road duration.
            var legs = response.routes[0].legs;
        
            for(var k = 0; k < legs.length; k++) 
            {
                Duration += legs[k].duration.value;
            }

            // Check direction
            var uiMaximumTimeS = document.getElementById("inputMinuteDelayText").value * 60;
            
            var pinColor = 0;
            
            if (Duration <= uiMaximumTimeS) 
            {
                pinColor    = "f80808";    // Big red
            }
            else
            {
                pinColor    = "f69e9e";    // Low red
            }
            
            var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
                                                new google.maps.Size(21, 34),
                                                new google.maps.Point(0,0),
                                                new google.maps.Point(10, 34));
            
            FlatMarkers[uiFlatMarkersIndex].setIcon(pinImage);
            
            if (document.getElementById("CheckBoxHide").checked == true)
            {
                FlatMarkers[uiFlatMarkersIndex].setMap(null);
            }
            else
            {
                FlatMarkers[uiFlatMarkersIndex].setMap(map);
            }

            uiFlatMarkersIndex++;

            if (uiFlatMarkersIndex < FlatMarkers.length)
            {
                setTimeout(function() { fFilterRawPostalArray(); }, (250));
            }
        }
        else
        {
            if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT)
            {
                console.log("DirectionServiceCallback " + status);
                setTimeout(function() { fFilterRawPostalArray(); }, (600 * 3));
            }
        }
    });
}


/***************************************************************************************\

Function:           addSearchLocation

Description:       Adds a search marker/location in the map.

Parameters:        None.

Return Value:      None.

Comments:       None.

\***************************************************************************************/
function addSearchLocation() 
{
 
    var oLatLng = new google.maps.LatLng(45.506, -73.556);
    
    fSetAMarkerOnMap(oLatLng, "Search", true);
    
    update();
}


//-----------------------------------------------------------------------------------------------------------
// Main
//-----------------------------------------------------------------------------------------------------------
google.maps.event.addDomListener(window, 'load', initialize);