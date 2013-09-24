var exec = require('child_process').exec;
var fs   = require('fs'); 

module.exports = {
  scanner : function(configPath) {
    var loadConfig = function() {
      var config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

      if (!config)
        return;

      if (!config.port) {
      	console.log('No port in the configuration provided');
      	return;
      }
      return config;
    };
    
    var scanner = {
        config : null,
        /*
         * sets the scanner device id to use for scan operations
         */
        setDeviceId : function(deviceId) {
          if (!deviceId || typeof(deviceId) != 'string')
            throw new Error('No or invalid deviceId: ' + deviceId);
          
          this.config.deviceId = deviceId;
        },
      
        saveConfig : function(path) {
          var cfgPath = path ? path : configPath;
          fs.writeFileSync(cfgPath, JSON.stringify(this.config, null, 4), 'utf8');
        },
    
        /*
         * gets a list of attached devives
         */
        getDevices : function(callback) {
          var command = 'scanimage -f \'{"deviceId" : "%d", "vendor" : "%v", "model" : "%m"}%n\'';
      
          exec(command, {encoding: 'binary', maxBuffer: 5000*1024}, function(error, stdout) {
            var res = new Array();
            // thi is properbly goona fail with multiple scanners attached
            res.push(JSON.parse(stdout));
            callback(res);
          });
        },
        
        /*
         * helper method to parse the provided options
         */
        parseOptions : function(obj) {
          if (!obj.resolution) 
            obj.resolution = this.config.defaultResolution;

        	if (!obj.mode)
        	  obj.mode = this.config.defaultMode;

          obj.deviceId = this.config.deviceId;
          return obj;
        },
        
        isConfigured : function() {
          return typeof(this.config.deviceId) == "string";
        },
        
        scanWithProgress : function(options, callback, done) {
          var params = this.parseOptions(options);
        
          var command = 'scanimage\ --device\ ' + params.deviceId + '\ ' +
        		            '--resolution\ ' + params.resolution + '\ ' +
        		            '--mode\ ' + params.mode + '\  ';

          var buffer = new Buffer('', 'binary');
          console.log(command);
        	// start to scan the image    
        	exec(command, {encoding: 'binary', maxBuffer: 50000*1024}, function(error, stdout) {
             		callback(stdout);
          	}).on('close', function() {
                done();
        	});
        },
      
        scanSync : function(options, callback, done) {
          var params = this.parseOptions(options, this.config);
        
        	var command = 'scanimage\ --device\ ' + params.deviceId + '\ ' +
        		            '--resolution\ ' + params.resolution + '\ ' +
        		            '--mode\ ' + params.mode + '\ |\ pnmtojpeg';

          var buffer = new Buffer('', 'binary');
          console.log(command);
        	// start to scan the image    
        	exec(command, {encoding: 'binary', maxBuffer: 50000*1024}, function(error, stdout) {
             		callback(stdout);
          	}).on('close', function() {
                done();
        	});
        }
      }
      scanner.config = loadConfig();
      return scanner;
  }
};