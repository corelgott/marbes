var exec     = require('child_process').exec;

module.exports =  {
    options : function(config, resolution, mode) {
        if (!resolution) 
          resolution = 75;

      	if (!mode)
      	  mode = 'Color';
      
        return {
            deviceId   : config.deviceId,
            resolution : resolution,
            mode       : mode
        }
    },
    
    getDevices : function(callback) {
      exec(command, {encoding: 'binary', maxBuffer: 5000*1024}, function(error, stdout) {
        console.log(stdout)
        callback(stdout);
      });
    }
    
    scanWithProgress : function() {
      var command = 'scanimage\ --device\ ' + options.deviceId + '\ ' +
    		            '--resolution\ ' + options.resolution + '\ ' +
    		            '--mode\ ' + options.mode + '\  ';

      var buffer = new Buffer('', 'binary');
      console.log(command);
    	// start to scan the image    
    	exec(command, {encoding: 'binary', maxBuffer: 50000*1024}, function(error, stdout) {
         		callback(stdout);
      	}).on('close', function() {
            done();
    	});
    },
    
    scanSync : function(options, callback, done){
    	var command = 'scanimage\ --device\ ' + options.deviceId + '\ ' +
    		            '--resolution\ ' + options.resolution + '\ ' +
    		            '--mode\ ' + options.mode + '\ |\ pnmtojpeg';

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