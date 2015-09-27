// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.services', 'ngCordova'])

.config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
])

.config(function($compileProvider){
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})

.controller('MainCtrl', function($scope, $location, Camera, Picture) {

  $scope.getPhoto = function() {
    Camera.getPicture().then(function(imageURI) {
      console.log(imageURI);
      // $scope.lastPhoto = imageURI;
      Picture.setURI(imageURI);
      $location.path('/photo');
    }, function(err) {
      console.err(err);
    }, {
      quality: 50,
      destinationType: 0,
      saveToPhotoAlbum: false
    });
  };


})

.controller('PhotoCtrl', function($scope, $location, Camera, Picture, $cordovaFileTransfer) {
    $scope.lastPhoto = Picture.getURI();
  
  $scope.upStatus = 'loading...';
  $scope.learn = function() {
    $location.path('/details');
  };
  // $scope.upStatus = 'Not uploaded';

      // var urlParam = encodeURIComponent(Picture.getURI());
     var url = "https://api-content.dropbox.com/1/files_put/dropbox/test.jpg?access_token=<INSERT_TO_COIN>";
      
     //File for Upload
     var targetPath = $scope.lastPhoto;
      
     // File name only
     var filename = targetPath.split("/").pop();
      
     // var options = {
     //      // fileKey: "file",
     //      fileName: filename,
     //      httpMethod: "PUT",
     //      headers: {"Content-Type":""}
     //      // chunkedMode: false,
     //      // mimeType: "image/jpg",
     //      // Connection: "close"
     //      // params : {'directory':'upload', 'fileName':filename}
     //  };
     var options = new FileUploadOptions();
      options.fileKey="file";
      options.fileName=filename;
      options.httpMethod="PUT";
           
      $cordovaFileTransfer.upload(url, $scope.lastPhoto, options).then(function (result) {
          // console.log("SUCCESS: " + JSON.stringify(result.response));
          console.log('Ready to give advice');
        $scope.upStatus = 'Upload success!';
        // $scope.upStatus =  JSON.stringify(result.response);
      }, function (err) {
        $scope.upStatus = "ERROR: "+ JSON.stringify(err);
          console.log("ERROR: " + JSON.stringify(err));
      }, function (progress) {
        
          // PROGRESS HANDLING GOES HERE
      });

})

.controller('DetailsCtrl', function($scope, $http, $q, Camera, Picture) {
  $scope.lastPhoto = Picture.getURI();
  $scope.learnResult = "loading...";


 // $scope.$on("$ionicView.loaded", function() {

     clarifai = new Clarifai(
        {
            'accessToken': '10s2FxlSy1jIyAImSwM6yBK7VVQGBA'
        }
    );

   $q.all([clarifai.predict('http://fullsafety.cl/components/com_virtuemart/shop_image/product/PARKA_PLUMA_GOOS_4bf567f6922e7.jpg', 'water'),
        clarifai.predict('http://fullsafety.cl/components/com_virtuemart/shop_image/product/PARKA_PLUMA_GOOS_4bf567f6922e7.jpg', 'juice'),
        clarifai.predict('http://fullsafety.cl/components/com_virtuemart/shop_image/product/PARKA_PLUMA_GOOS_4bf567f6922e7.jpg', 'daunen'),
        clarifai.predict('http://fullsafety.cl/components/com_virtuemart/shop_image/product/PARKA_PLUMA_GOOS_4bf567f6922e7.jpg', 'parka')
]).then(function(values){
  // console.log(values);
    values.sort(function (a, b){
         return a.order < b.order ? 0 : 1;
    });  
    $scope.learnResult = values[0].tag;
    $scope.amazonLink = "http://www.amazon.com/mn/search/?encoding=UTF8?&tag=inline3-20&linkCode=ur2&camp=1789&field-keywords="+$scope.learnResult;
    $scope.googleLink = "https://www.google.de/search?output=search&tbm=shop&q="+$scope.learnResult;
    $scope.ebayLink = "http://www.ebay.com/sch/?_nkw="+$scope.learnResult;
    
  //   var url = 'http://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsByKeywords&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=Muhammad-10a1-40ff-a14e-c4ba9458203e&GLOBAL-ID=EBAY-US&RESPONSE-DATA-FORMAT=JSON&keywords='+$scope.learnResult+'&paginationInput.entriesPerPage=3';
  //   $http.get(url).
  // then(function(response) {
  //   console.log(response);
  // }, function(response) {
  //   // called asynchronously if an error occurs
  //   // or server returns response with an error status.
  // });
    // $scope.selectedPizza = values[1];//or values[1][0], It depends on data format;
}, function(error){
    //error processing;
});

  // clarifai.predict('http://fullsafety.cl/components/com_virtuemart/shop_image/product/PARKA_PLUMA_GOOS_4bf567f6922e7.jpg', 'water').then(
  // function(obj){
  //   // the results of your predict call
  //    $scope.test(obj.tag);
  //    console.log(obj);
  // },
  // function(e){
  //   // an error occurred
  // });

  // $scope.test = function (param){
  //   console.log(":tets");
  //   $scope.learnResult = param;
  // }
// });

//   function promiseResolved(obj){
//     Picture.setTag(obj.tag);
// }

// function promiseRejected(obj){
//     console.log('promiseRejected', obj);
// }

//     clarifai.predict('http://fullsafety.cl/components/com_virtuemart/shop_image/product/PARKA_PLUMA_GOOS_4bf567f6922e7.jpg', "water", function (obj){
    
//     console.log(obj.tag);
// }).then(
//       promiseResolved,
//       promiseRejected 
//   );

})


.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('main', {
    url: '/',
    templateUrl: 'templates/main.html',
    controller: 'MainCtrl'
  })

  .state('photo', {
      url: '/photo',
          templateUrl: 'templates/photo.html',
          controller: 'PhotoCtrl'
    })

  .state('details', {
      url: '/details',
          templateUrl: 'templates/details.html',
          controller: 'DetailsCtrl'
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/');

});

