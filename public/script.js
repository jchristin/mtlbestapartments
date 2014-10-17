var map;

var directionsService;

var FlatMarkers = [];
var SearchPointAddress = [];

var uiFlatMarkersIndex                  = 0;
var uiSearchPointAddressIndex       = 0;

// http://localhost:5000/?city=montreal&pricemin=600&travelmode=walking&timemax=30&lat=45.525&long=-73.55

var infowindow;

var uiInputPriceMin = 0;
var uiInputPriceMax = 0;

/***************************************************************************************\

Function:       Initialize

Description:    Initialize all services.

Parameters:     None.

Return Value:   None.

Comments:       None.

\***************************************************************************************/
function initialize() 
{
    //
    // Instantiate a directions service.
    //
   directionsService = new google.maps.DirectionsService();

    var args = document.location.search.substring(1).split('&');

    argsParsed = {};

    for (i=0; i < args.length; i++)
    {
        arg = unescape(args[i]);

        if (arg.indexOf('=') == -1)
        {
            argsParsed[arg.trim()] = true;
        }
        else
        {
            kvp = arg.split('=');
            argsParsed[kvp[0].trim()] = kvp[1].trim();
        }
    }

    var oCityCoord;
    var uiZoom;
    
    if (argsParsed.city == "montreal")
    {
        oCityCoord = new google.maps.LatLng(45.506, -73.556);
        uiZoom = 12;
    }
    else
    {
        // default
        oCityCoord = new google.maps.LatLng(45.506, -73.556);
        uiZoom = 12;
    }
    

    //
    // Create a map and center it on the city.
    //
    var mapOptions = {
        zoom: uiZoom,
        center: oCityCoord,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    
    //
    // Load map
    //
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    //
    // Set markers
    //
    infowindow = new google.maps.InfoWindow();

    var data;
    var oFlatPrice = {Min: 99999999, Max: 0};
    
    uiInputPriceMin = oFlatPrice.Min;
    uiInputPriceMax = oFlatPrice.Max;

    $(document).ready(function() {
        $.get("api/flats",function(data,status){
        
            for (var i = 0; i < data.length; i++) 
            {
                var oMarker = {
                                            IsPriceValid: true, 
                                            IsDistanceValid: true,
                                            Price: data[i].price,
                                            marker: new google.maps.Marker(),
                                            pinColorValid: data[i].colorvalid,
                                            pinColorNotValid: data[i].colornotvalid,
                                         };

                FlatMarkers.push(oMarker);
            }

            fSetAllMarkerOnMapFlatFiltered(data, oFlatPrice);

            if (argsParsed.pricemin == undefined)
            {
                document.getElementById("inputMinimumText").value = oFlatPrice.Min;
            }
            else
            {
                document.getElementById("inputMinimumText").value = argsParsed.pricemin;
                oFlatPrice.Min = argsParsed.pricemin;
            }

            if (argsParsed.pricemax == undefined)
            {
                document.getElementById("inputMaximumText").value = oFlatPrice.Max;
            }
            else
            {
                document.getElementById("inputMaximumText").value = argsParsed.pricemax;
                oFlatPrice.Max = argsParsed.pricemax;
            }
            
            uiInputPriceMin = oFlatPrice.Min;
            uiInputPriceMax = oFlatPrice.Max;

            for (var uiFlatIndex = 0; uiFlatIndex < FlatMarkers.length; uiFlatIndex++) 
            {
                fFilterByPrice(FlatMarkers[uiFlatIndex]);
                fUpdateDisplay(FlatMarkers[uiFlatIndex]);
            }
            
            if (argsParsed.timemax != undefined)
            {
                document.getElementById("inputMinuteDelayText").value = argsParsed.timemax;
            }
            
            if (argsParsed.travelmode != undefined)
            {
                if (argsParsed.travelmode == "driving")
                {
                    document.getElementById('TravelMode').value = "DRIVING";
                }
                else if (argsParsed.travelmode == "walking")
                {
                    document.getElementById('TravelMode').value = "WALKING";
                }
                else if (argsParsed.travelmode == "bicycling")
                {
                    document.getElementById('TravelMode').value = "BICYCLING";
                }
                else if (argsParsed.travelmode == "transit")
                {
                    document.getElementById('TravelMode').value = "TRANSIT";
                }
            }
            
            if ((argsParsed.long != undefined) && (argsParsed.lat != undefined))
            {
                var oCustLatLng = new google.maps.LatLng(argsParsed.lat, argsParsed.long);
                
                var oMarkerSearchPoint =   {
                                            marker: new google.maps.Marker()
                };

                var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + "B8B8B8",
                                        new google.maps.Size(21, 34),
                                        new google.maps.Point(0,0),
                                        new google.maps.Point(10, 34));
               
                oMarkerSearchPoint.marker.setIcon(pinImage);
    
                SearchPointAddress.push(oMarkerSearchPoint);
                
                fBuildMarker(oCustLatLng, oMarkerSearchPoint.marker, null, null, "Search", true);

                update();
            }

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
function fBuildMarker(oLatLng, oMarker, url, image, eType, isDragable) 
{
    if (isDragable)
    {
        google.maps.event.addListener(oMarker, 'dragend', update);
                    
        oMarker.setDraggable (isDragable);
        oMarker.setTitle('Drag me !! ');
            
    }

    oMarker.setAnimation(google.maps.Animation.DROP);
    oMarker.setPosition(oLatLng);
    oMarker.setMap(map);
        
    if (isDragable == false)
    {
        if (url != null)
        {
            google.maps.event.addListener(oMarker, 'click', function() 
            {
                infowindow.setContent(
                    '<div style="width:300px; height:325px">'                                                      +
                        '<div align="center">'                                                                                +
                            '<img src="' + image + '" width="225" height="300" ALIGN="middle" />'   +
                        '</div>'                                                                                                    +
                        '<div align="center">'                                                                                +
                            '<a href="' + url + '">' + ''+ url + '</a> '                                                +
                        '</div>'                                                                                                    +
                    '</div>');
                infowindow.open(map, this);
            });
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

    fFilterByDistance();
}


function fUpdateDisplayAll() 
{
    for (var uiFlatIndex = 0; uiFlatIndex < FlatMarkers.length; uiFlatIndex++) 
    {
        fUpdateDisplay(FlatMarkers[uiFlatIndex]);
    }
}
    
/***************************************************************************************\

Function:           fUpdateDisplay

Description:       Update

Parameters:        oFlatMarker.

Return Value:      None.

Comments:       None.

\***************************************************************************************/
function fUpdateDisplay(oFlatMarker) 
{
    // Update color.
    var pinColor = 0;

    if ((oFlatMarker.IsDistanceValid == true) && (oFlatMarker.IsPriceValid == true))
    {
        pinColor    = oFlatMarker.pinColorValid;
    }
    else
    {
        pinColor    = oFlatMarker.pinColorNotValid;
    }

    var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
                                            new google.maps.Size(21, 34),
                                            new google.maps.Point(0,0),
                                            new google.maps.Point(10, 34));
            
    oFlatMarker.marker.setIcon(pinImage);
        
    if (document.getElementById("CheckBoxHide").checked == true)
    {
        if ((oFlatMarker.IsDistanceValid == true) && (oFlatMarker.IsPriceValid == true))
        {
            oFlatMarker.marker.setMap(map);
        }
        else
        {
            oFlatMarker.marker.setMap(null);
        }
    }
    else
    {
        oFlatMarker.marker.setMap(map);
    }
}


/***************************************************************************************\

Function:           fSetAMarkerOnMapValidFlat

Description:       Set a marker on the map of a flat.

Parameters:        address            Given address to place.

Return Value:      None.

Comments:       None.

\***************************************************************************************/
function fSetAMarkerOnMapValidFlat(oLatLng, i, url, image) 
{
    fBuildMarker(oLatLng, FlatMarkers[i].marker, url, image, "ValidFlat", false);
}

/***************************************************************************************\

Function:           fSetAllMarkerOnMapFlatFiltered

Description:       Set all marker on the map of the filtered flat.

Parameters:        map                Map to placed the flat marker.

Return Value:      None.

Comments:       None.

\***************************************************************************************/
function fSetAllMarkerOnMapFlatFiltered(data, oFlatPrice) 
{
    for (var i = 0; i < data.length; i++) 
    {
        if (data[i].price < oFlatPrice.Min)
        {
            oFlatPrice.Min = data[i].price;
        }
        
        if (data[i].price > oFlatPrice.Max)
        {
            oFlatPrice.Max = data[i].price;
        }

        var oLatLng = new google.maps.LatLng(data[i].lat, data[i].long);

        fSetAMarkerOnMapValidFlat(oLatLng, i, data[i].url, data[i].image, data.Price);
    }
}


/***************************************************************************************\

Function:           fFilterByDistance

Description:       Filter the raw postal array with maximum walking distance.

Parameters:        None.

Return Value:      None.

Comments:       None.

\***************************************************************************************/
function fFilterByDistance() {
    
    var selectedMode = document.getElementById('TravelMode').value;

    var request = {
                    origin: FlatMarkers[uiFlatMarkersIndex].marker.getPosition(),
                    destination: SearchPointAddress[uiSearchPointAddressIndex].marker.getPosition(),
                    travelMode: google.maps.TravelMode[selectedMode]
    };

    // Route the directions and pass the response to a function to create markers for each step.
    directionsService.route(request,  function (response, status) 
    {

        if (status == google.maps.DirectionsStatus.OK) 
        {
            // Find the equivalent flat
            
            // Compute road duration.
            var Duration = 0;
            
            var legs = response.routes[0].legs;
        
            for(var k = 0; k < legs.length; k++) 
            {
                Duration += legs[k].duration.value;
            }

            // Check direction
            var uiMaximumTimeS = document.getElementById("inputMinuteDelayText").value * 60;

            if (Duration <= uiMaximumTimeS) 
            {
                FlatMarkers[uiFlatMarkersIndex].IsDistanceValid = true;
            }
            else
            {
                FlatMarkers[uiFlatMarkersIndex].IsDistanceValid = false;
            }

            fFilterByPrice(FlatMarkers[uiFlatMarkersIndex]);
            fUpdateDisplay(FlatMarkers[uiFlatMarkersIndex]);

            uiFlatMarkersIndex++;

            if (uiFlatMarkersIndex < FlatMarkers.length)
            {
                setTimeout(function() { fFilterByDistance(); }, (350));
            }
        }
        else
        {
            if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT)
            {
                console.log("DirectionServiceCallback " + status);
                setTimeout(function() { fFilterByDistance(); }, (600 * 3));
            }
        }
    });
}


/***************************************************************************************\

Function:           fFilterByPrice

Description:       Adds a search marker/location in the map.

Parameters:        None.

Return Value:      None.

Comments:       None.

\***************************************************************************************/
function fFilterByPrice(oFlatMarker)
{
    if (oFlatMarker.Price < uiInputPriceMin) 
    {
        oFlatMarker.IsPriceValid = false;
    }
    else if (oFlatMarker.Price > uiInputPriceMax) 
    {
        oFlatMarker.IsPriceValid = false;
    }
    else
    {
        oFlatMarker.IsPriceValid = true;
    }
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

    var oMarkerSearchPoint =   {
                                marker: new google.maps.Marker()
                            };

    var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + "B8B8B8",
                                        new google.maps.Size(21, 34),
                                        new google.maps.Point(0,0),
                                        new google.maps.Point(10, 34));
               
    oMarkerSearchPoint.marker.setIcon(pinImage);

    SearchPointAddress.push(oMarkerSearchPoint);
                
    fBuildMarker(oLatLng, oMarkerSearchPoint.marker, null, null, "Search", true);

    update();
}


/***************************************************************************************\

Function:           fMinPriceChanged

Description:       Adds a search marker/location in the map.

Parameters:        None.

Return Value:      None.

Comments:       None.

\***************************************************************************************/
function fMinPriceChanged() 
{
    uiInputPriceMin = document.getElementById("inputMinimumText").value;

    for (var uiFlatIndex = 0; uiFlatIndex < FlatMarkers.length; uiFlatIndex++) 
    {
        fFilterByPrice(FlatMarkers[uiFlatIndex]);
        fUpdateDisplay(FlatMarkers[uiFlatIndex]);
    }
}


/***************************************************************************************\

Function:           fMaxPriceChanged

Description:       Adds a search marker/location in the map.

Parameters:        None.

Return Value:      None.

Comments:       None.

\***************************************************************************************/
function fMaxPriceChanged() 
{
    InputPriceMax = document.getElementById("inputMaximumText").value;

    for (var uiFlatIndex = 0; uiFlatIndex < FlatMarkers.length; uiFlatIndex++) 
    {
        fFilterByPrice(FlatMarkers[uiFlatIndex]);
        fUpdateDisplay(FlatMarkers[uiFlatIndex]);
    }
}


//-----------------------------------------------------------------------------------------------------------
// Main
//-----------------------------------------------------------------------------------------------------------
google.maps.event.addDomListener(window, 'load', initialize);