var map;
var FlatMarkers = [];
var iterator = 0;
var marker1;
var directionsService;
var GeocoderService;

var RawPostalAddress = [];
var SearchPointAddress = [];

var uiFlatMarkersIndex                  = 0;
var uiSearchPointAddressIndex       = 0;

var g_uiTimeout = 600;
   
var aAddressInfo = []; 


var SFlatData = 
{
    oMarker:            null,
    bNeedUpdate:    false,
    //aSearchPoint:   []
    eType:              "Unknow"
};

var m_aoFlatData = [];

var rssFeed  = "http://www.google.fr";
//var rssFeed  = 'http://montreal.kijiji.ca/f-SearchAdRss?AdType=2&CatId=214&Keyword=village&Location=1700281';
//var rssFeed  = 'http://www.kijiji.ca/rss-srp-appartement-condo-4-1-2/ville-de-montreal/c214l1700281';
//var rssFeed  = 'http://www.kijiji.ca/rss-srp-2-bedroom-apartments-condos/ville-de-montreal/village/k0c214l1700281?ad=offering';

   
/***************************************************************************************\

Function:       Initialize

Description:    Initialize all services.

Parameters:     None.

Return Value:   None.

Comments:       None.

\***************************************************************************************/
function initialize() {

    //
    // Instantiate a directions service.
    //
   directionsService = new google.maps.DirectionsService();
    
    //
    // Instantiate a geographic decoder service.
    //
    GeocoderService = new google.maps.Geocoder();
    
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
    // Fill tabs
    //
    console.log("fGetRawFlatAddress");
    fGetRawFlatAddress();

    //
    // Set markers
    //
    fSetAllMarkerOnMapFlatFiltered();
}

/***************************************************************************************\

Function:       getXMLHttpRequest

Description:    Get XML http requester

Parameters:     None.

Return Value:    None.

Comments:        None.

\***************************************************************************************/
function getXMLHttpRequest() {
    var xhr = null;
     
    if (window.XMLHttpRequest || window.ActiveXObject) {
        if (window.ActiveXObject) {
            try {
                xhr = new ActiveXObject("Msxml2.XMLHTTP");
            } catch(e) {
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            }
        } else {
            xhr = new XMLHttpRequest(); 
        }
    } else {
        console.log("Votre navigateur ne supporte pas l'objet XMLHTTPRequest...");
        return null;
    }
     
    return xhr;
}

/***************************************************************************************\

Function:              getXMLHttpRequest

Description:        Get XML http requester

Parameters:        None.

Return Value:      None.

Comments:       None.

\***************************************************************************************/
function httpGet(htmlPage) {
    var xhr = getXMLHttpRequest();
     
    if (xhr != null)
    {
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
                console.log("readyState = " + xhr.readyState + " | status = " + xhr.status);
                console.log("responseText = " + xhr.responseText);
                Mycallback(xhr.responseXML);
            }
        };
     
        xhr.open('GET', htmlPage, false); 
        xhr.send(null);
    }
    else
    {
        console.log("httpGet, xhr = " + xhr);
    }
}

/***************************************************************************************\

Function:              fGetRawFlatAddress

Description:        Get raw address data from Kijiji.

Parameters:        None.

Return Value:      None.

Comments:       None.

\***************************************************************************************/
function fGetRawFlatAddress() {

     // Get data from Kijiji
     
     //var Data = httpGet(rssFeed);
     //console.log("Data " + data);
     
    
    // ([A-Z]{1}[ ]{0,1}[-]{0,1}[0-9]{1}){3}
    // var xhr = getXMLHttpRequest();
    
    // if (xhr == null) {
//         console.log("xhr is null");
//     }
    
    // xhr.async = false;
    // xhr.load(rssFeed);
    
    // var string5 = serializer.serializeToString( xmlDoc ); 
    // console.log( string5 );
    
    if (typeof DOMParser != "undefined")
    {
        var parser = new DOMParser();

        //var xmlDoc = parser.parseFromString(rssFeed, "text/xml");
        //var xmlDoc = parser.parseFromString(rssFeed, "image/svg+xml");
        var xmlDoc = parser.parseFromString(rssFeed, "application/xml");
        console.log("Test 01");
        console.log( xmlDoc );
        
        var serializer = new XMLSerializer();
        var string5 = serializer.serializeToString( xmlDoc ); 
        console.log( string5 );
        
        //var item = xmlDoc.getElementsByTagName("item")[0].childNodes[0];
        
        var item = xmlDoc.getElementsByTagName ("item");
        
        // console.log("Toop0 = " + xmlDoc.documentElement.nodeName);
        // console.log("Toop1 = " + xmlDoc.documentElement.childNodes);
        
        var Test = xmlDoc.documentElement.childNodes;
        // console.log("Toop2 = " + Test.length); 
        
        //var htmldoc = null;
        
        for (var i = 0; i < Test.length; i++) {
            
            if (Test[i].nodeName == "channel") {

                var ChannelNode = Test[i].childNodes;

                for (var j = 0; j < ChannelNode.length; j++) {

                    //console.log("Toop4 = " + ChannelNode[j].nodeName );
                    if (ChannelNode[j].nodeName == "item") {

                        var itemNode = ChannelNode[j].childNodes;
                    
                        //console.log("Toop40 = " + itemNode.length );
                        for (var k = 0; k < itemNode.length; k++) {
                    
                            //console.log("Toop5 = " + itemNode[k].nodeName );
                            if (itemNode[k].nodeName == "link") {
                            
                                //
                                // Get data from link
                                //
                                var link = itemNode[k];
                                
                                var string = serializer.serializeToString( link ); 

                                //var n=str.replace("Microsoft","W3Schools");
                                string=string.replace("<link>","");
                                string=string.replace("</link>","");
                        
                                //fExtractDataFromLink(htmlPage);
                                //fExtractDataFromLink(string);

                            }
                        }
                    }
                }
            }
        }    
    }

    console.log("Test 02");
    
    // Fill tab.
    RawPostalAddress.push("H2J 1A3");   // 1
    RawPostalAddress.push("H2K 2C3");   // 2
    RawPostalAddress.push("H2J 3E2");   // 3
    RawPostalAddress.push("H2K 4G1");   // 4
    RawPostalAddress.push("H2J 4G5");   // 5
    RawPostalAddress.push("H2K 6F9");   // 6
    RawPostalAddress.push("H2J 7G8");   // 7
    RawPostalAddress.push("H2K 8H7");   // 8
    RawPostalAddress.push("H2J 2J5");   // 9
    RawPostalAddress.push("H2K 2J5");   // 10
    RawPostalAddress.push("H2J 1K4");   // 11
    RawPostalAddress.push("H2K 2L3");   // 12
    RawPostalAddress.push("H2J 3M2");   // 13
    RawPostalAddress.push("H2K 4N1");   // 14
    
    //LoadFeed( rssFeed );
    //frssfeedsetup(rssFeed, 5);
}


/***************************************************************************************\

Function:       fExtractDataFromLink

Description:    RSS feed setup

Parameters:     None.

Return Value:   None.

Comments:       None.

\***************************************************************************************/
function fExtractDataFromLink(urlLink) {
    //console.log( "urlLink = " + urlLink );
    
    var parser         = new DOMParser();
    var htmlDoc         = parser.parseFromString(urlLink, "text/xml");
    
    var serializer    = new XMLSerializer();
    var string            = serializer.serializeToString( htmlDoc ); 
    
    var Test             = htmlDoc.documentElement.childNodes;

    //console.log("fExtractDataFromLink length = " + Test.length); 
    
    for (var i = 0; i < Test.length; i++) {
        //console.log("fExtractDataFromLink = " + Test[i].nodeName); 
        //if (Test[i].nodeName == "body") {
            var ChannelNode = Test[i].childNodes;
            
            //console.log("fExtractDataFromLink 1 = " + ChannelNode.length); 
            for (var j = 0; j < ChannelNode.length; j++) {
                console.log(ChannelNode[j].nodeName);
            }
        //}
    }    
        
}

/***************************************************************************************\

Function:       XMLing

Description:    RSS feed setup

Parameters:     None.

Return Value:   None.

Comments:       None.

\***************************************************************************************/
function XMLing(rssfeed) {

    var    response     = UrlFetchApp.fetch(rssfeed);
    var     doc             = null;
    if (response.getContentText) {
        doc = Xml.parse(response.getContentText(), true);
    }
    else if (response.getElements) {
        doc = response;
    }
    else {
        var name = typeof response;
        if (response.constructor) name = response.constructor.name;
        throw new Exception("Incompatible type: " + name);
    }

    var records = doc.getElements("current_value");
    var details = records[0].getText();

  return details;

}

/***************************************************************************************\

Function:       fAddMarker

Description:    Get station address

Parameters:     None.

Return Value:   None.

Comments:       None.

\***************************************************************************************/
function fAddMarker(oFlatData){
    m_aoFlatData.Push(oFlatData);
}

/***************************************************************************************\

Function:           fSetAMarkerOnMap

Description:        Set a marker on the map.

Parameters:         address            Given address to place.

Return Value:       None.

Comments:           None.

\***************************************************************************************/
function fSetAMarkerOnMap(address, eType, isDragable) {

    // Decode postal code to longitude/latitude direction
    GeocoderService.geocode( { 'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
        
            var IsValidType = false;

            switch (eType) {
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
                var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
                                        new google.maps.Size(21, 34),
                                        new google.maps.Point(0,0),
                                        new google.maps.Point(10, 34));
                /*var pinShadow = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_shadow",
                                        new google.maps.Size(40, 37),
                                        new google.maps.Point(0, 0),
                                        new google.maps.Point(12, 35));*/
            
                if (isDragable)
                {
                    marker1 = new google.maps.Marker({
                                                map: map,
                                                //animation: google.maps.Animation.DROP,
                                                //position: results[0].geometry.location, 
                                                //icon: pinImage,
                                                //shadow: pinShadow,
                                                //title:"Drag me!"
                    });
                    
                    google.maps.event.addListener(marker1, 'dragend', update);
                    
                    marker1.setDraggable (isDragable);
                    marker1.setTitle('Drag me !! ');
                    marker1.setIcon(pinImage);
                    marker1.setAnimation(google.maps.Animation.DROP);
                    marker1.setPosition(results[0].geometry.location);
                    marker1.setZIndex(2);
                }
                else
                {
                    var marker = new google.maps.Marker({
                                                    map: map,
                                                    animation: google.maps.Animation.DROP,
                                                    position: results[0].geometry.location, 
                                                    icon: pinImage,
                                                    //shadow: pinShadow
                    });
                    
                    //var oFlatData = new FlatData(marker, false, 0, "Unknow");
                    //FlatMarkers.push(oFlatData);
                    FlatMarkers.push(marker);
                }

                marker.push;
                //marker.setMap(map);
                
            }
        }
        else 
        {
            console.log("fSetAMarkerOnMap" + status);
            console.log("Geocode was not successful for the following reason: " + status);
            //if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT)
            //{
            //    setTimeout(function() { fSetAMarkerOnMap(address, eType, isDragable); }, (g_uiTimeout * 3));
            //}
        }
    });
}

function update() {

    SearchPointAddress[0] = marker1.getPosition();
  
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
function fSetAMarkerOnMapValidFlat(address) {
    fSetAMarkerOnMap(address, "ValidFlat", false);
}

/***************************************************************************************\

Function:           fSetAllMarkerOnMapFlatFiltered

Description:       Set all marker on the map of the filtered flat.

Parameters:        map                Map to placed the flat marker.

Return Value:      None.

Comments:       None.

\***************************************************************************************/
function fSetAllMarkerOnMapFlatFiltered() {
    iterator = 0;
    
    for (var i = 0; i < RawPostalAddress.length; i++) {
        setTimeout(function() {
            fSetAllMarkerOnMapFlatFilteredIt();
        }, i * 250);
    }
    
    /*for (var i = 0; i < RawPostalAddress.length; i++) {
        fSetAMarkerOnMapValidFlat(RawPostalAddress[i]);
    }*/
}


/***************************************************************************************\

Function:           fSetAllMarkerOnMapFlatFilteredIt

Description:       Set all marker on the map of stations.

Parameters:        map                Map to placed the flat marker.

Return Value:      None.

Comments:       None.

\***************************************************************************************/
function fSetAllMarkerOnMapFlatFilteredIt() {

    //console.log("Flat#" + iterator);

    fSetAMarkerOnMapValidFlat(RawPostalAddress[iterator]);
    
    iterator++;
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
                    destination: SearchPointAddress[uiSearchPointAddressIndex],
                    travelMode: google.maps.TravelMode[selectedMode]
    };

    // Route the directions and pass the response to a function to create markers for each step.
    directionsService.route(request,  function (response, status) {

        console.log("Request = " + request.origin);

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
            
            if (Duration <= uiMaximumTimeS) 
            {
                
                FlatMarkers[uiFlatMarkersIndex].setMap(map);
            }
            else
            {
                if (document.getElementById("CheckBoxHide").checked == true)
                {
                    FlatMarkers[uiFlatMarkersIndex].setMap(null);
                }
                else
                {
                    var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + "f69e9e",
                                                new google.maps.Size(21, 34),
                                                new google.maps.Point(0,0),
                                                new google.maps.Point(10, 34));

                    FlatMarkers[uiFlatMarkersIndex].setIcon(pinImage);

                    FlatMarkers[uiFlatMarkersIndex].setMap(map);
                }
            }
            
            uiFlatMarkersIndex++;

            if (uiFlatMarkersIndex < FlatMarkers.length)
            {
                //fFilterRawPostalArray();
                setTimeout(function() { fFilterRawPostalArray(); }, (250));
            }
        }
        else
        {
            if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT)
            {
                console.log("DirectionServiceCallback " + status);
                setTimeout(function() { fFilterRawPostalArray(); }, (g_uiTimeout * 3));
            }
        }
    });
}
 
 /***************************************************************************************\

Function:           DirectionServiceCallback

Description:       TODO

Parameters:        None.

Return Value:      None.

Comments:       None.

\***************************************************************************************/

 
 
 function addSearchLocation() {
    fSetAMarkerOnMap("Parc La Fontaine", "Search", true);
    
    update();
}


function FlatData(marker, bNeedUpdate, aValidLocation, type) {
    this.marker                 = marker;
    this.bNeedUpdate        = bNeedUpdate;
    this.aValidLocation     = aValidLocation;
    this.type                   = type;
    
    //IsNeedUpdate : function (){return this.bNeedUpdate}
}
 
//-----------------------------------------------------------------------------------------------------------
// Main
//-----------------------------------------------------------------------------------------------------------
google.maps.event.addDomListener(window, 'load', initialize);