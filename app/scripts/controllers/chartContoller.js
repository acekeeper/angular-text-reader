'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
 angular.module('sbAdminApp')
 .controller('ChartCtrl', ['$scope', '$timeout', 'Data', function ($scope, $timeout, Data) {
     //receiving values from shared service;
     $scope.message=Data.getMessage();
     $scope.labels=Data.getLabels();
     $scope.counts=Data.getCounts();
     
     $scope.line = {
        labels:  $scope.labels,
        series: [],
        data: [
        $scope.counts, []   
        ],
        onClick: function (points, evt) {
          console.log(points, evt);
      }
  };

  $scope.bar = {
    labels: $scope.labels,
    series: [],

    data: [
    $scope.counts, []  
    ]
    
};

$scope.donut = {
    labels: $scope.labels,
    data: $scope.counts
};

$scope.radar = {
    labels:$scope.labels,

    data:[
    $scope.counts, []
    ]
};

$scope.pie = {
    labels: $scope.labels,
    data: $scope.counts
};

$scope.polar = {
   labels: $scope.labels,
   data: $scope.counts
};

$scope.dynamic = {
   labels: $scope.labels,
   data: $scope.counts,
   type : 'PolarArea',

   toggle : function () 
   {
    this.type = this.type === 'PolarArea' ?
    'Pie' : 'PolarArea';
}
};
}]);