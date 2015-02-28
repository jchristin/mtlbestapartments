"use strict";

var path = require("path"),
	request = require("request"),
	express = require("express"),
	bodyParser = require("body-parser"),
	favicon = require("serve-favicon"),
	server = express(),
	cacheMaxAge = process.env.NODE_ENV === "development" ? 0 : 3600000,
	port = process.env.PORT || 5000,
	mongoClient = require("mongodb").MongoClient,
	database;

server.use(express.query());

server.use(bodyParser.json());

server.use(favicon(path.join(__dirname, "public/img/favicon.ico"), {
	maxAge: cacheMaxAge
}));

server.use(express.static(path.join(__dirname, "public"), {
	maxAge: cacheMaxAge
}));

server.get("/api/flats", function(req, res) {
	database.collection("active").find().limit(1000).toArray(function(err, docs) {
		if (err) {
			console.log(err);
		} else {
			res.json(docs);
		}
	});
});

server.get("/api/stations", function(req, res) {
	if (typeof req.query.city !== "undefined") {

		var greenstations = [{
			name: 'Honore-Beaugrand',
			lat: 45.596820617974785,
			lng: -73.5345600738525
		}, {
			name: 'Radisson',
			lat: 45.589253053146976,
			lng: -73.53953825378414
		}, {
			name: 'Langelier',
			lat: 45.58294596963149,
			lng: -73.54271398925778
		}, {
			name: 'Cadillac',
			lat: 45.57699864183858,
			lng: -73.54631887817379
		}, {
			name: 'Assomption',
			lat: 45.569218105514956,
			lng: -73.54679094696041
		}, {
			name: 'Viau',
			lat: 45.56083554958653,
			lng: -73.5472201004028
		}, {
			name: 'Pie-IX',
			lat: 45.553864156307704,
			lng: -73.55181204223629
		}, {
			name: 'Joliette',
			lat: 45.5469219528189,
			lng: -73.55151163482662
		}, {
			name: 'Prefontaine',
			lat: 45.541541906777844,
			lng: -73.55438696289059
		}, {
			name: 'Frontenac',
			lat: 45.53303497343655,
			lng: -73.55232702636715
		}, {
			name: 'Papineau',
			lat: 45.523654813322345,
			lng: -73.55198370361325
		}, {
			name: 'Beaudry',
			lat: 45.51890400737704,
			lng: -73.55584608459469
		}, {
			name: 'Berri-UQAM',
			lat: 45.514784312941366,
			lng: -73.55964409255978
		}, {
			name: 'Saint-Laurent',
			lat: 45.51076957602482,
			lng: -73.56489049339291
		}, {
			name: 'Place-des-Arts',
			lat: 45.50819818957505,
			lng: -73.56811987304684
		}, {
			name: 'McGill',
			lat: 45.504115308363176,
			lng: -73.57133852386471
		}, {
			name: 'Peel',
			lat: 45.5008818774089,
			lng: -73.5749755992889
		}, {
			name: 'Guy-Concordia',
			lat: 45.49565535799475,
			lng: -73.5790632858276
		}, {
			name: 'Atwater',
			lat: 45.489322723427506,
			lng: -73.58419166946408
		}, {
			name: 'Lionel-Groulx',
			lat: 45.482853976823634,
			lng: -73.57959972763058
		}, {
			name: 'Charlevoix',
			lat: 45.478295320871375,
			lng: -73.56932150268551
		}, {
			name: 'LaSalle',
			lat: 45.470711789011915,
			lng: -73.56610285186764
		}, {
			name: 'De l Eglise',
			lat: 45.461832945233205,
			lng: -73.5671757354736
		}, {
			name: 'Verdun',
			lat: 45.45922169711331,
			lng: -73.57183205032345
		}, {
			name: 'Joliecoeur',
			lat: 45.456753316812566,
			lng: -73.58213173294064
		}, {
			name: 'Monk',
			lat: 45.45098832490751,
			lng: -73.59335409545895
		}, {
			name: 'Angrignon',
			lat: 45.44629160349349,
			lng: -73.60373960876461
		}, ];

		var redstations = [{
			name: 'Montmorency',
			lat: 45.55833406076062,
			lng: -73.72179972076412
		}, {
			name: 'De la Concorde',
			lat: 45.56048249334908,
			lng: -73.70961176300045
		}, {
			name: 'Cartier',
			lat: 45.56042239844941,
			lng: -73.68171678924557
		}, {
			name: 'Henri-Bourassa',
			lat: 45.55612544652778,
			lng: -73.66746889495846
		}, {
			name: 'Sauve',
			lat: 45.55068617606493,
			lng: -73.65648256683346
		}, {
			name: 'Cremazie',
			lat: 45.54593765326945,
			lng: -73.63875852966305
		}, {
			name: 'Jarry',
			lat: 45.54326267582994,
			lng: -73.62854467773434
		}, {
			name: 'Jean-Talon',
			lat: 45.53866382161874,
			lng: -73.61386763000485
		}, {
			name: 'Beaubien',
			lat: 45.53555261870405,
			lng: -73.6045120849609
		}, {
			name: 'Rosemont',
			lat: 45.531238733743585,
			lng: -73.59786020660397
		}, {
			name: 'Laurier',
			lat: 45.527022230263356,
			lng: -73.5862301483154
		}, {
			name: 'Mont-Royal',
			lat: 45.52455681976834,
			lng: -73.58176695251461
		}, {
			name: 'Sherbrooke',
			lat: 45.51834019839836,
			lng: -73.5682378902435
		}, {
			name: 'Berri-UQAM',
			lat: 45.514784312941366,
			lng: -73.55964409255978
		}, {
			name: 'Champ-de-Mars',
			lat: 45.51020568554362,
			lng: -73.55635033988949
		}, {
			name: 'Place-d Armes',
			lat: 45.50612294994321,
			lng: -73.55969773674008
		}, {
			name: 'Square-Victoria-OACI',
			lat: 45.50156617712573,
			lng: -73.56364594841
		}, {
			name: 'Bonaventure',
			lat: 45.498046832837176,
			lng: -73.56690751457211
		}, {
			name: 'Lucien-L Allier',
			lat: 45.49493338336677,
			lng: -73.57108103179928
		}, {
			name: 'Georges-Vanier',
			lat: 45.488954175263196,
			lng: -73.57642399215695
		}, {
			name: 'Lionel-Groulx',
			lat: 45.482853976823634,
			lng: -73.57959972763058
		}, {
			name: 'Place-Saint-Henri',
			lat: 45.477227067621925,
			lng: -73.58661638641354
		}, {
			name: 'Vendome',
			lat: 45.47394695221721,
			lng: -73.60399710083004
		}, {
			name: 'Villa-Maria',
			lat: 45.479483916880646,
			lng: -73.61991869354244
		}, {
			name: 'Snowdon',
			lat: 45.48541147705724,
			lng: -73.627943862915
		}, {
			name: 'Cote-Sainte-Catherine',
			lat: 45.49242144118413,
			lng: -73.63279329681393
		}, {
			name: 'Plamondon',
			lat: 45.49434677216598,
			lng: -73.63787876510617
		}, {
			name: 'Namur',
			lat: 45.49496346582773,
			lng: -73.65311371231076
		}, {
			name: 'De la Savane',
			lat: 45.500302848075435,
			lng: -73.66180406951901
		}, {
			name: 'Du College',
			lat: 45.509461341457985,
			lng: -73.67478596115109
		}, {
			name: 'Cote-Vertu',
			lat: 45.51421294464261,
			lng: -73.68306862258908
		}, ];

		var yellowstations = [{
			name: 'Berri-UQAM',
			lat: 45.514784312941366,
			lng: -73.55964409255978
		}, {
			name: 'Jean-Drapeau',
			lat: 45.512318366144434,
			lng: -73.53337990188595
		}, {
			name: 'Longueuil-Universite de Sherbrooke',
			lat: 45.525233315111876,
			lng: -73.52194296264645
		}, ];

		var bluestations = [{
			name: 'Saint-Michel',
			lat: 45.5597989100727,
			lng: -73.60007034683224
		}, {
			name: 'D Iberville',
			lat: 45.55375897780392,
			lng: -73.60210882568356
		}, {
			name: 'Fabre',
			lat: 45.54791374867238,
			lng: -73.60736595535275
		}, {
			name: 'Jean-Talon',
			lat: 45.53866382161874,
			lng: -73.61386763000485
		}, {
			name: 'De Castelnau',
			lat: 45.53522946457198,
			lng: -73.6198757781982
		}, {
			name: 'Parc',
			lat: 45.53023912781412,
			lng: -73.6239098205566
		}, {
			name: 'Acadie',
			lat: 45.52347441029772,
			lng: -73.62373815917965
		}, {
			name: 'Outremont',
			lat: 45.520106780983326,
			lng: -73.61511217498776
		}, {
			name: 'Edouard-Montpetit',
			lat: 45.5100929067695,
			lng: -73.61260162734982
		}, {
			name: 'Universite-de-Montreal',
			lat: 45.503416000662966,
			lng: -73.61779438400265
		}, {
			name: 'Cote-des-Neiges',
			lat: 45.496287078201334,
			lng: -73.62253652954098
		}, {
			name: 'Snowdon',
			lat: 45.48541147705724,
			lng: -73.627943862915
		}, ];

		var stations = [{
			'key': 'green',
			'color': '#00CC00',
			'data': greenstations,
		}, {
			'key': 'red',
			'color': '#D62D20',
			'data': redstations,
		}, {
			'key': 'yellow',
			'color': '#f4ea03',
			'data': yellowstations,
		}, {
			'key': 'blue',
			'color': '#0099CC',
			'data': bluestations,
		}];

		res.json(stations);

	} else {
		res.json({
			"status": "error",
			"data": null,
			/* or optional error payload */
			"message": "Wrong parameters to station"
		});
	}
});

server.get("/api/polygon", function(req, res) {
	request.get(process.env.FLAT_CARTO_URL + "api/polygon?" +
		"lat=" + req.query.lat + "&" +
		"long=" + req.query.long + "&" +
		"timeinmin=" + req.query.timeinmin + "&" +
		"traveltype=" + req.query.traveltype).pipe(res);
});

mongoClient.connect(process.env.MONGODB_URL, function(err, db) {
	if (err) {
		console.log(err);
	} else {
		console.log("Connected to the database");
		database = db;

		// Start server
		server.listen(port);
		console.log("Listening on " + port);
	}
});
