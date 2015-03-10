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
	database.collection("active").find().limit(2000).toArray(function(err, docs) {
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

server.get("/api/neighbors", function(req, res) {
	if (typeof req.query.city !== "undefined") {

		var VilleMarieData = [{
			lat: 45.539923647387646,
			lng: -73.55929375267027
		}, {
			lat: 45.539006857906365,
			lng: -73.54980946159361
		}, {
			lat: 45.53856348713885,
			lng: -73.54818940734862
		}, {
			lat: 45.53734607823939,
			lng: -73.54661226844786
		}, {
			lat: 45.531739645255534,
			lng: -73.54321122741698
		}, {
			lat: 45.531401437723744,
			lng: -73.53987455940245
		}, {
			lat: 45.526591154899165,
			lng: -73.54193449592589
		}, {
			lat: 45.51197739827465,
			lng: -73.54493857002257
		}, {
			lat: 45.50590225110589,
			lng: -73.54163408851622
		}, {
			lat: 45.48989922106463,
			lng: -73.5402607975006
		}, {
			lat: 45.48998947646653,
			lng: -73.54875803565977
		}, {
			lat: 45.490884501373586,
			lng: -73.55172992324827
		}, {
			lat: 45.492087873789465,
			lng: -73.55301738357542
		}, {
			lat: 45.49293021918218,
			lng: -73.55357528305052
		}, {
			lat: 45.495517344114695,
			lng: -73.55494857406615
		}, {
			lat: 45.49825475387017,
			lng: -73.56142879104613
		}, {
			lat: 45.49220820961692,
			lng: -73.56537700271605
		}, {
			lat: 45.49428396216884,
			lng: -73.57001185989378
		}, {
			lat: 45.48546900732109,
			lng: -73.58061194992064
		}, {
			lat: 45.486371625820155,
			lng: -73.58121276473997
		}, {
			lat: 45.488116647241604,
			lng: -73.5831439552307
		}, {
			lat: 45.489289993318685,
			lng: -73.58443141555784
		}, {
			lat: 45.49133576904261,
			lng: -73.58782172775267
		}, {
			lat: 45.490703993293586,
			lng: -73.58850837326048
		}, {
			lat: 45.492268377434215,
			lng: -73.59297156906126
		}, {
			lat: 45.491756948938225,
			lng: -73.59340072250365
		}, {
			lat: 45.491787033095946,
			lng: -73.59417319869993
		}, {
			lat: 45.49229846131879,
			lng: -73.59694123840336
		}, {
			lat: 45.49305055320985,
			lng: -73.59797120666508
		}, {
			lat: 45.49395305022162,
			lng: -73.59917283630375
		}, {
			lat: 45.49413354788843,
			lng: -73.60063195800785
		}, {
			lat: 45.49443437604756,
			lng: -73.60200524902348
		}, {
			lat: 45.495216521740666,
			lng: -73.60256314849858
		}, {
			lat: 45.49488561527318,
			lng: -73.60355020141606
		}, {
			lat: 45.49494578023009,
			lng: -73.60535264587406
		}, {
			lat: 45.498645801543574,
			lng: -73.60149026489262
		}, {
			lat: 45.50123266389754,
			lng: -73.59835744476322
		}, {
			lat: 45.50324792778508,
			lng: -73.59415174102787
		}, {
			lat: 45.50390964049362,
			lng: -73.59363675689701
		}, {
			lat: 45.504811963470964,
			lng: -73.59355092620854
		}, {
			lat: 45.50592480855805,
			lng: -73.59316468811039
		}, {
			lat: 45.50754892136437,
			lng: -73.59161973571781
		}, {
			lat: 45.50866171234519,
			lng: -73.59106183624272
		}, {
			lat: 45.50947373512277,
			lng: -73.59119058227543
		}, {
			lat: 45.51028574618561,
			lng: -73.59264970397953
		}, {
			lat: 45.51085715435563,
			lng: -73.59393716430668
		}, {
			lat: 45.511187966960456,
			lng: -73.59535337066654
		}, {
			lat: 45.51151877762088,
			lng: -73.59634042358402
		}, {
			lat: 45.512030026635166,
			lng: -73.59668374633793
		}, {
			lat: 45.51251119793566,
			lng: -73.59634042358402
		}, {
			lat: 45.51302243793496,
			lng: -73.59505296325688
		}, {
			lat: 45.51338331043248,
			lng: -73.59342218017582
		}, {
			lat: 45.51302243793496,
			lng: -73.58990312194828
		}, {
			lat: 45.513052510731484,
			lng: -73.58934522247318
		}, {
			lat: 45.51335323781274,
			lng: -73.58908773040775
		}, {
			lat: 45.51368403574611,
			lng: -73.58921647644047
		}, {
			lat: 45.514826777282444,
			lng: -73.59071851348881
		}, {
			lat: 45.51630027816925,
			lng: -73.58986020660404
		}, {
			lat: 45.51726254363665,
			lng: -73.58762860870365
		}, {
			lat: 45.51236083234618,
			lng: -73.57741475677494
		}, {
			lat: 45.51094737616796,
			lng: -73.57874513244633
		}, {
			lat: 45.509533884492136,
			lng: -73.57926011657719
		}, {
			lat: 45.50818050813427,
			lng: -73.58011842346195
		}, {
			lat: 45.50499242633092,
			lng: -73.5735523757935
		}, {
			lat: 45.50818050813427,
			lng: -73.57119203186039
		}, {
			lat: 45.521321919934046,
			lng: -73.56552720642094
		}, {
			lat: 45.52252464185318,
			lng: -73.56557012176518
		}, {
			lat: 45.53593324968399,
			lng: -73.56149316406254
		}];

		var PlateauData = [{
			lat: 45.539923647387646,
			lng: -73.55929375267027
		}, {
			lat: 45.53593324968399,
			lng: -73.56149316406254
		}, {
			lat: 45.52252464185318,
			lng: -73.56557012176518
		}, {
			lat: 45.521321919934046,
			lng: -73.56552720642094
		}, {
			lat: 45.50818050813427,
			lng: -73.57119203186039
		}, {
			lat: 45.50499242633092,
			lng: -73.5735523757935
		}, {
			lat: 45.50818050813427,
			lng: -73.58011842346195
		}, {
			lat: 45.509533884492136,
			lng: -73.57926011657719
		}, {
			lat: 45.51094737616796,
			lng: -73.57874513244633
		}, {
			lat: 45.51236083234618,
			lng: -73.57741475677494
		}, {
			lat: 45.51726254363665,
			lng: -73.58762860870365
		}, {
			lat: 45.51680396605203,
			lng: -73.59104068766175
		}, {
			lat: 45.51684907220966,
			lng: -73.59159858713684
		}, {
			lat: 45.51829245016317,
			lng: -73.59496744165955
		}, {
			lat: 45.51803685468157,
			lng: -73.59522493372498
		}, {
			lat: 45.51862321906299,
			lng: -73.59661968241272
		}, {
			lat: 45.518713428425464,
			lng: -73.5965982247406
		}, {
			lat: 45.518803637643316,
			lng: -73.59685571680603
		}, {
			lat: 45.52568918107159,
			lng: -73.61243398676453
		}, {
			lat: 45.527883958830486,
			lng: -73.60844285975037
		}, {
			lat: 45.52815454193964,
			lng: -73.60745580683289
		}, {
			lat: 45.52836499456913,
			lng: -73.6061254311615
		}, {
			lat: 45.52836499456913,
			lng: -73.60252054224549
		}, {
			lat: 45.52863557536431,
			lng: -73.59994562159119
		}, {
			lat: 45.529357117787995,
			lng: -73.5977140236908
		}, {
			lat: 45.530228969200635,
			lng: -73.59591157923279
		}, {
			lat: 45.53122105954162,
			lng: -73.59453828821717
		}, {
			lat: 45.53858603149927,
			lng: -73.58621271143494
		}, {
			lat: 45.53960803302374,
			lng: -73.58466775904236
		}, {
			lat: 45.54038955106726,
			lng: -73.58316572199402
		}, {
			lat: 45.54096065353714,
			lng: -73.58162076960144
		}, {
			lat: 45.54150169263127,
			lng: -73.57878835688172
		}, {
			lat: 45.54153175020605,
			lng: -73.57548387537537
		}, {
			lat: 45.54132134684506,
			lng: -73.5731664467865
		}];

		var stations = [{
			'key': 'Ville-Marie',
			'data': VilleMarieData,
		}, {
			'key': 'Le Plateau-Mont-Royal',
			'data': PlateauData,
		}];

		res.json(stations);

	} else {
		res.json({
			"status": "error",
			"data": null,
			/* or optional error payload */
			"message": "Wrong parameters to neighbors"
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
