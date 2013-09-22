console.log('Loading libraries');

var express  = require('express');
var jade     = require('jade');
var app      = express();
var fs       = require('fs');
var scanner  = require('./modules/scanner.js');

var config = JSON.parse(fs.readFileSync('./config.json'));

if (!config)
  return;

if (!config.port) {
	console.log('No port in the configuration provided');
	return;
}

console.log('Compiling templates');

// the cache holding the templates
var templates = {};

// open the files within the templates directory
var files = fs.readdirSync('./templates/');

// look at every file
for(var index in files) {
	var file = files[index];

	var dotPos    = file.lastIndexOf('.');
	var filename  = file.substr(0, dotPos);
	var extension = file.substr(dotPos);

	if (extension == '.jade') {
		console.log('Loading template ' + file);
		templates[filename] = jade.renderFile('./templates/');
	}
}

console.log('Loaded templates');
console.log(Object.keys(templates));

/*
 * returns the index
 */
app.get('/', function(req, resp) {
	resp.send(templates['index']);
});

app.get('/isConfigured', function(req, resp) {
	resp.setHeader('Content-Type', 'application/json');
	resp.end(JSON.stringify({ isConfigured : typeof(config.deviceId) == "object" }))
});

ap.get('/configure', function(req, resp){
	resp.setHeader('Content-Type', 'application/json');
	resp.end(JSON.stringify({ devices : scanner.getDevices() });
});

app.get('saveConfig', function(req, resp){
  config.deviceId = req.query.deviceId;
  fs.writeFileSync('./config.js', JSON.stringify(config));
  
  resp.setHeader('Content-Type', 'application/json');
	resp.end(JSON.stringify({ status : 'ok'))
})

/*
 * method to call to get a preview of the image within the scanner
 */
app.get('/preview', function(req, resp) {
	// we are returning an image
	resp.setHeader('Content-Type', 'image/jpg');
	// start to scan - 75dpi & color
  scanner.scanSync(scanner.options(config, 75, 'Color'), function(buffer) {
    // write the response
    resp.write(buffer, 'binary');
  }, function() {
    // and we are done
    resp.end();
  });
});

app.get('/scan', function(req, resp) {
  var resolution = req.query.resolution ? req.query.resolution : 300;
  var mode       = req.query.mode       ? req.query.mode       : 'Color';
  
  console.log('res:' + resolution);
  console.log('mode:' + mode);
  
	// we are returning an image
  resp.setHeader('Content-Disposition:', 'attachment; filename="scan.jpg"');
  resp.setHeader('Content-Type', 'application/octet-stream');
  resp.setHeader('Set-Cookie', 'fileDownload=true; path=/');

  scanner.scanSync(scanner.options(config, resolution, mode), function(buffer) {
    // write the response
    resp.write(buffer, 'binary');
  }, function() {
    // and we are done
    console.log('done...');
    resp.end();
  });  
});

// serve static files
app.use("/", express.static(__dirname + '/files'));
app.listen(8080);
console.log('Listening on port ' + config.port);
