'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */


//Plain Text Reader Controller
angular.module('sbAdminApp')
.controller('FormCtrl', function ($scope, $state, $http, Data) {
	Data.resetValue();
	$scope.customUrl = "";
	$scope.sendRequest = function () {

          // check if input url is not empty
          if ($scope.customUrl === "") {
          	alert("Paste some valid url");
          	return false;
          }

          // use proxy.php to bypass browser cross-domain security policy
          var proxy = '../../proxy.php';

          // encode string fron url input
          var enc= window.encodeURIComponent($scope.customUrl);
// compose url request
var url=proxy+'?url='+enc;
// send GET request
$http.get(url).
success(function (response) {
              // on success throw response to scope
              $scope.fullResp = response;
               // get only response contents
               $scope.resp = $scope.fullResp.contents;
                 // check if response contents exists
                 if (!$scope.resp) {
                 	alert("No data found. Paste some valid url");
                 }
                 else{
                 	alert("Data received! Press 'Analyze'");
                 }
             }).
error(function (error) {
              // on success throw response to scope
              alert("No data found. Try another url")
          })

}
//expect data from textarea
$scope.textData = ""; 

$scope.showContent = function ($fileContent) {

      	//expect data from textfile (using directive on-read-file)
      	$scope.content = $fileContent; 
      };

      /*MAIN FUNCTION TO ANALYZE INPUT DATA*/
      $scope.calc = function () { 

//check if all fields are empty;
if (!($scope.textData || $scope.content || $scope.resp)) 
{
	alert("Put Some Data First!");

              //prevent go to chart page;
              $state.go('', null, { notify: false }); 
          }

          //RegExp: words at least 2 characters long, ignoring special characters and case insensitive
          var wordRegExp = /\w{2,}(?:'\w{1,2})?/g; 
          var words = {};
          var matches;
          while ((matches = wordRegExp.exec($scope.content || $scope.textData || $scope.resp)) != null) //begin looping to match RegExp words and attach them in array with number of repeating;
          {
          	var word = matches[0].toLowerCase();

//set prop to 1 if word is one-time repeating
if (typeof words[word] == "undefined")
{
	words[word] = 1;
}
else {

              	//icrease prop for every repeated word
              	words[word]++;
              }
          }

          var wordList = [];

          //get rid of one-time repeating words
          for (var word in words) 
          {
          	if (words.hasOwnProperty(word)) {
          		if (words[word] > 1) {
          			wordList.push([word, words[word]]);
          		}
          	}
          }

          wordList.sort(function (a, b) { return b[1] - a[1]; });

//simple arr to print our words
var message = []; 
for (var i = 0; i < wordList.length; i++) {
	message.push(wordList[i][0] + " => " + wordList[i][1]);
}

$scope.restext = message.join("\n");

//check if there are some repeating words
if($scope.restext ===""){
	alert("No repeating words were found! | Use only latin keyboard layout");
	//prevent go to chart page
	$state.go('', null, { notify: false }); 
}


//send our words arr to service
Data.setMessage($scope.restext); 


$scope.labels = [];
$scope.counts = [];
for (var i = 0; i < wordList.length; i++) {

          	//transform two-dimensional arrs to one-dimensional
          	$scope.labels[i] = wordList[i][0]; 
          	$scope.counts[i] = wordList[i][1];
          }

 //send arrs values to shared service
 Data.setLabels($scope.labels);
 Data.setCounts($scope.counts);    

//go to chart page
$state.go('dashboard.chart'); 

};

// reset Data button
$scope.res = function () { 
	delete $scope.content;
	delete $scope.textData;
};


});


//Static service for data sharing between controllers
angular.module('sbAdminApp').service('Data', [function () {

	this.setMessage = function (newObj) {
		this.message = newObj;
	};
	this.getMessage = function () {
		return this.message;
	};

	this.setLabels = function (newObj) {
		for (var i = 0; i < newObj.length; i++)
			this.labels[i] = newObj[i];
	};
	this.getLabels = function () {
		return this.labels;
	};

	this.setCounts = function (newObj) {
		for (var i = 0; i < newObj.length; i++)
			this.counts[i] = newObj[i];
	};
	this.getCounts = function () {
		return this.counts;
	};

    //initialize and reset shared values before another lifecycle
    this.resetValue = function () {
    	this.message = "";
    	this.labels = [];
    	this.counts = [];
    };

}]);

//Directive for text extraction from the file input
angular.module('sbAdminApp')
.directive('onReadFile', function ($parse) {
	return {
        restrict: 'A', //use as attr only
        scope: false, //don't create own scope
        link: function (scope, element, attrs) {
        	var fn = $parse(attrs.onReadFile);

            //using HTML5 FileReader API
            element.on('change', function (onChangeEvent) {
            	var reader = new FileReader(); 

            	reader.onload = function (onLoadEvent) {
            		scope.$apply(function () {
            			fn(scope, { $fileContent: onLoadEvent.target.result });
            		});
            	};
            	//read file content when user chooses it from  the local directory
            	reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);

            });
        }
    };
});
