var app = angular.module('app',[]);

app.controller('main', ['$scope', function($scope) {
    $('#indicator').activity({color : '#ffffff'});
  
    $scope.resolutions = [75, 150, 300, 600];
    $scope.resolution  = $scope.resolutions[0];
    
    $scope.modes       = ['Color', 'Gray', 'Black'];
    $scope.mode        = $scope.modes[0];
    
    $scope.scanning    = false;
    
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
}]);