exports.testGetTempName = function(test) {
  test.expect(4);

  var utils = require('../utils/utils.js');
  
  test.equal(utils.getTempName(1,    './temp'), './temp/tmp0001.jpg', 'Pattern did not match');
  test.equal(utils.getTempName(10,   './temp'), './temp/tmp0010.jpg', 'Pattern did not match');
  test.equal(utils.getTempName(100,  './temp'), './temp/tmp0100.jpg', 'Pattern did not match');
  test.equal(utils.getTempName(1000, './temp'), './temp/tmp1000.jpg', 'Pattern did not match');
  
  test.done();
}

exports.testListPattern = function(test) {
  test.expect(1);
  
  var str = '{"device" : "pixma:xxxxxxx_xxxxxxx", "vendor" : "CANON", "model" : "Canon PIXMA MP550"}';
  var obj = JSON.parse(str);
  test.ok(typeof(obj) == "object", "Not an object!");
  test.done();
};
