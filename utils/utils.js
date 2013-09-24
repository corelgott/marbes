var fs       = require('fs');
var jade     = require('jade');
// to get format....
var util     = require('util');

module.exports = {
  getNextName : function(path) {
    var filename = '';
    var i = 0;
    do {
      filename = this.getTempName(i++, path);
    } while(fs.existsSync(filename));
    return filename;
  },  
  
  getTempName : function(index, path) {
    return util.format("%s/tmp%s.jpg", path, ("0000" + index++).slice(-4));
  },
  
  clearDir : function(path) {
      try { var files = fs.readdirSync(path); }
      catch(e) { return; }
      if (files.length > 0)
        for (var i = 0; i < files.length; i++) {
          var filePath = path + '/' + files[i];
          if (fs.statSync(filePath).isFile())
            fs.unlinkSync(filePath);
        }
  },

  loadTemplates : function(path) {
    // open the files within the templates directory
    var files = fs.readdirSync(path);
    var res = new Array()

    // look at every file
    for(var index in files) {
    	var file = files[index];

    	var dotPos    = file.lastIndexOf('.');
    	var filename  = file.substr(0, dotPos);
    	var extension = file.substr(dotPos);

    	if (extension == '.jade') {
    		console.log('Loading template ' + file);
    		res[filename] = jade.renderFile('./templates/' + file);
    	}
    }
    return res;
  }
}
