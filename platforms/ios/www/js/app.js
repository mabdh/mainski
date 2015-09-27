// Ionic Starter App
 
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic', 'starter.services','ngCordova'])
 

.config(function($compileProvider){
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
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
      quality: 75,
      destination: 0,
      targetWidth: 320,
      targetHeight: 320,
      saveToPhotoAlbum: false
    });
  };


})
 

 .controller('PhotoCtrl', function($scope, Camera, Picture,$cordovaFileTransfer) {
  $scope.lastPhoto = Picture.getURI();

      var data = "This is a file upload test ";

      $scope.upStatus = 'Not uploaded';

      // var urlParam = encodeURIComponent(Picture.getURI());
     var url = "https://api-content.dropbox.com/1/files_put/dropbox/test.jpg?access_token=EM2qAlZjJ4QAAAAAAAADmp4TjPQqctwqNo9jzuC8Nhe8otxtK-bQDxHk7c-AvG8Z";
      
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
          console.log("SUCCESS: " + JSON.stringify(result.response));
          console.log('file uploaded successfully');
        $scope.upStatus = data.path + status;
        $scope.upStatus =  JSON.stringify(result.response);
      }, function (err) {
        $scope.upStatus = "ERROR: "+ JSON.stringify(err);
          console.log("ERROR: " + JSON.stringify(err));
      }, function (progress) {
        
          // PROGRESS HANDLING GOES HERE
      });
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

  .state('lists', {
      url: '/photo',
          templateUrl: 'templates/photo.html',
          controller: 'PhotoCtrl'
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/');

});

