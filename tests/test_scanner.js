var fs = require('fs');

exports.testConfig = function(test) {
  test.expect(1);
  
  var config = JSON.parse(fs.readFileSync('./configs/valid_config.json', 'utf8'));
  test.ok(config, 'could not load config!');
  test.done();
}

exports.testCreateScanner = function(test) {
  test.expect(2);
  var scanner = require("../modules/scanner.js").scanner('./configs/valid_config.json');
  test.ok(scanner, 'Could not create a scanner!');  
  test.ok(scanner.config, 'The scanner has no config!');
  test.done();
}

var isArray = function(obj) {
  return Object.prototype.toString.call(obj) === Object.prototype.toString.call([]);
}

exports.testIsConfigured = function(test){
    test.expect(2);
    
    var scannerWithoutValidCfg = require("../modules/scanner.js").scanner('./configs/invalid_device_config.json');
    test.ok(!scannerWithoutValidCfg.isConfigured(), "Is Configured thinks it is, but it's not!");   

    var scannerWithValidCfg = require("../modules/scanner.js").scanner('./configs/valid_config.json');
    test.ok(scannerWithValidCfg.isConfigured(), "Is Configured doesn't get it's configured!");   
    
    test.done();  
};

exports.testConfigSave = function(test) {
    test.expect(1);
    
    var scannerWithoutValidCfg = require("../modules/scanner.js").scanner('./configs/invalid_device_config.json');
    scannerWithoutValidCfg.setDeviceId("pixma:foobar");
    scannerWithoutValidCfg.saveConfig('./tmp_config.json');
    
    var scannerWithValidCfg = require("../modules/scanner.js").scanner('./tmp_config.json');
    test.ok(scannerWithValidCfg.config.deviceId, "Config has no device id!");   
    
    test.done();
}

exports.testDeviceList = function(test){
    test.expect(1);
    var scanner = require("../modules/scanner.js").scanner('./configs/valid_config.json');
    scanner.getDevices(function(devs) {
      test.ok(isArray(devs), "Return value was no array!");      
      
      test.done();
    });
};

exports.testParseOptions = function(test) {
  test.expect(3);
  var scanner = require('../modules/scanner.js').scanner('./configs/valid_config.json');
  
  var cfg = scanner.parseOptions({resolution: 75, mode : 'Color'});
  
  test.ok(cfg.deviceId, 'Got no device id!');
  test.ok(typeof(cfg.deviceId) == "string", 'Got no device id!');
  test.equal(cfg.resolution, 75, 'Resoluton not set');
  test.equal(cfg.mode, 'Color', 'Mode not set');
  
  test.done();
}