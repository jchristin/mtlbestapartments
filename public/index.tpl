<html lang=<%= lang %>>

<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">

	<title>MTL Best Apartments</title>

	<link rel="stylesheet" href="/bundle.css">
	<link rel="icon" href="/favicon.ico?v=2" />

	<script src="https://maps.googleapis.com/maps/api/js?key=<%= googleMapApiKey %>&libraries=geometry"></script>

	<script>
		(function(i, s, o, g, r, a, m) {
			i['GoogleAnalyticsObject'] = r;
			i[r] = i[r] || function() {
				(i[r].q = i[r].q || []).push(arguments)
			}, i[r].l = 1 * new Date();
			a = s.createElement(o),
				m = s.getElementsByTagName(o)[0];
			a.async = 1;
			a.src = g;
			m.parentNode.insertBefore(a, m)
		})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

		ga('create', 'UA-38852421-4', 'auto');
		ga('send', 'pageview');
	</script>
</head>

<body>
	<div id="container"></div>
	<script src="/bundle.js"></script>
</body>

</html>
