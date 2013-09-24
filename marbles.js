console.log('Loading libraries');

var express  = require('express');
var jade     = require('jade');
var app      = express();
var fs       = require('fs');
var exec     = require('child_process').exec;
var scanner  = require('./modules/scanner.js').scanner('./config/config.json');
var utils    = require('./utils/utils.js');

console.log('Compiling templates');

// the cache holding the templates
var templates = utils.loadTemplates('./templates/');
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
	resp.end(JSON.stringify({ isConfigured : scanner.isConfigured() }));
});

/*
 * offers access to the system 
 */
app.get('/getConfiguration', function(req, resp){
	resp.setHeader('Content-Type', 'application/json');
	
	scanner.getDevices(function(devs) {
	  var cfgStatus = {
	    status : 'user',
	    devices : devs
	  };
	  
	  // if there is only one device attached
	  if (devs.length == 1) {
	    console.log(devs);   
	    // used it and we are done
	    scanner.setDeviceId(devs[0].deviceId);
	    scanner.saveConfig();
	    console.log('config saved!');
	    cfgStatus.status = 'auto';
	  }
	  
	  resp.end(JSON.stringify(cfgStatus));
	});
});

app.get('/getOptions', function(req, resp) {
  resp.setHeader('Content-Type', 'application/json');
  resp.end(JSON.stringify({
    'modes'             : scanner.config.modes,
    'defaultMode'       : scanner.config.defaultMode,
    'resolutions'       : scanner.config.resolutions,
    'defaultResolution' : scanner.config.defaultResolution
  }, null, 4));
});

app.get('configure', function(req, resp){
  resp.setHeader('Content-Type', 'application/json');
  
  if (req.query.deviceId) {
    scanner.setDevice(req.query.deviceId);
    scanner.saveConfig();
    resp.end(JSON.stringify({status : 'ok'}));
  } else
    resp.end(JSON.stringify({status : 'invalid device id'}));
})

/*
 * method to call to get a preview of the image within the scanner
 */
app.get('/preview', function(req, resp) {
	// we are returning an image
	resp.setHeader('Content-Type', 'image/jpg');
	// start to scan - 75dpi & color
  scanner.scanSync({ resolution: 75, mode : 'Color'}, function(buffer) {
    // write the response
    resp.write(buffer, 'binary');
  }, function() {
    // and we are done
    resp.end();
  });
});


app.get('/scanToPdf', function(req, resp){
  console.log('scanToPdf');
  // flag if we want to scan another page
  var anotherPage = req.query.anotherPage ? req.query.anotherPage : false;
  
  console.log(req.query);
  
  // if so...
  if (anotherPage) {
    // respond with json
    resp.setHeader('Content-Type', 'application/json');
    
    // get the resolution and the mode
    var resolution = req.query.resolution ? req.query.resolution : 300;
    var mode       = req.query.mode       ? req.query.mode       : 'Color';
  
    // gets the temp filename
    var filename = utils.getNextName('./tmp');
    
    // opens a file to write the data to
    var file = fs.open(filename, 'w', function(err, file) {
      // scan synced and wirte the data into the temp folder
      scanner.scanSync({ resolution : resolution, mode : mode}, function(data) {
        // write the response
        var buffer = new Buffer(data, 'binary');
        fs.write(file, buffer, 0, buffer.length, null);
      }, function() {
        // and we are done
        fs.close(file);
        console.log('Written file to ' + filename);
        resp.write(JSON.stringify({status:'proceed'}));
        resp.end();
      });
    });
  } else {
    var command = "convert -format pdf ./tmp/*.jpg ./tmp/out.pdf";
    resp.setHeader('Content-Disposition:', 'attachment; filename="scan.pdf"');
    resp.setHeader('Content-Type', 'application/octet-stream');
    resp.setHeader('Set-Cookie', 'fileDownload=true; path=/scan.pdf');
    count = 0;
    exec(command, {encoding: 'binary', maxBuffer: 1024}).on('close', function() {
      fs.readFile('./tmp/out.pdf', function(err, data) {
        resp.end(new Buffer(data, 'binary'));
        utils.clearDir('./tmp');
      });      
    });
  }
});

app.get('/scan', function(req, resp) {
  var resolution = req.query.resolution ? req.query.resolution : 300;
  var mode       = req.query.mode       ? req.query.mode       : 'Color';
  
  console.log('res:' + resolution);
  console.log('mode:' + mode);
  
	// we are returning an image
  resp.setHeader('Content-Disposition:', 'attachment; filename="scan.jpg"');
  resp.setHeader('Content-Type', 'application/octet-stream');
  resp.setHeader('Set-Cookie', 'fileDownload=true; path=/scan.jpg');

  scanner.scanSync({ resolution : resolution, mode : mode}, function(buffer) {
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
console.log('Listening on port ' + scanner.config.port);
