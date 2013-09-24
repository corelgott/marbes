var app = angular.module('app',[]);

app.controller('main', ['$scope', '$http', function($scope, $http) {
    // the init wrapped up
    $scope.init = function() {
      // create the litte busy-indicator
      $('#indicator').activity({color : '#ffffff'});

      // we are not scanning right now
      $scope.scanning    = false;
      // flag if all necessary data has been loaded or not
      $scope.ready       = false;
      
      // get the available options from the scanner
      $http({method: 'GET', url: './getOptions'}).success(function(options) {
        console.log('got response!');
        console.log(options);
      
        $scope.resolutions = options.resolutions;
        $scope.resolution  = options.defaultResolution;

        $scope.modes       = options.modes;
        $scope.mode        = options.defaultMode;
      });
      
      $http({method:'GET', url : './isConfigured'}).success(function(status) {
        if (status.isConfigured) {
          $scope.ready = true;
        } else
          $http({method:'GET', url : './getConfiguration'}).success(function(config) {
            if (config.status == 'auto') {
              $scope.ready = true;
            } else {
              console.log(config.devs);
              //show the user some option to choose from the devs
            }
          });
      });
    };
    // call init
    $scope.init();
    
    $scope.scan = function() {
      // new img
      $scope.scanning = true;
      
      $.fileDownload('./scan?resolution=' + $scope.resolution + 
                                  '&mode=' + $scope.mode + 
                                  '&date=' + new Date().getTime()
      ).done(function() {
        $scope.$apply(function() {
          $scope.scanning = false;
        });
      }).fail(function(){
        console.log('That failed!');
      });
    };
    
    $scope.showIndicator = function() {
        $scope.$apply(function() {
          $scope.scanning = true;
        });
    }
    
    $scope.preview = function() {
      // new img
      $scope.scanning = true;
      $('#image').attr('src', '');
      
      $('#image').one('load', function() {
        $scope.$apply(function() {
          $scope.scanning = false;
        });
      });
      // start scan
      $('#image').attr('src', './preview?date=' + new Date().getTime());
    }
    
    $scope.scanToPdf = function() {
      $scope.scanning = true;
      var _inner = function() {
        $http( { method :'GET', 
                 url    : './scanToPdf', 
                 params : { anotherPage : true,
                            resolution  : $scope.resolution, 
                            mode        : $scope.mode }
               }).success(function(resp) {
          if (resp.status == 'proceed') {
            if (confirm('Do you want to scan another page?'))
              _inner();
            else {
              $.fileDownload('./scanToPdf?another=false');
              $scope.scanning = false;
            }
          }
        });
      };
      _inner();
    }
    
}]);