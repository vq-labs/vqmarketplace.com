var express = require('express');
var cors = require('cors');

var CONFIG = {
  PORT : 3030,  
};

var app = express();

app.use(cors({}));

app.get('/*', (req, res, next) => {
	if (!req.headers.host) {
		 return next(); 
	}

	if (req.headers.host.match(/^www/) !== null ) {
		res.redirect('http://' + req.headers.host.replace(/^www\./, '') + req.url);
	} else {
		next();     
	}
});

app.use(express.static(__dirname + '/public'));

var server = app.listen(CONFIG.PORT, () => {
	var port = server.address().port;
	console.log('VQ-LABS listening at port %s', CONFIG.PORT);
});
