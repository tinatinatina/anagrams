var AppController = angular.module('AppController', ['ui.bootstrap', 'Countdown']);
 
AppController.controller('homeCTRL', ['$scope', '$http', '$document', '$timeout', function ($scope, $http, $document, $timeout) {
  $scope.word = "";
  $scope.scrambledWord = [];
  $scope.wordInProgress = [];
  $scope.points = 0;
  $scope.correctAnswer = false;
  $scope.wrong = false;
  $scope.highScore = 0;
  $scope.showModal = false;
  $scope.paused = false;

  $scope.date = new Date(Date.now() + 60000).toString();

  var scrambleWord = function(word) {
    for (var i = word.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = word[i];
      word[i] = word[j];
      word[j] = temp;
    }
    return word;
  };

  var getWord = function() {
    $scope.paused = false;
    $http.get("http://api.wordnik.com:80/v4/words.json/randomWord?&minCorpusCount=0&maxCorpusCount=0&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=7&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5")
      .success(function (response) {
        $scope.scrambledWord = [];
        $scope.wordInProgress = [];
        $scope.correctAnswer = false;
        $scope.word = response.word.toLowerCase();
        $scope.scrambledWord = scrambleWord($scope.word.split(''));
        $scope.details = response;
      });
  };

  $scope.shuffle = function(word) {
    $scope.scrambledWord = scrambleWord(word);
  };

  $scope.pass = function() {
    $scope.points --;
    getWord();
  };

  var checkWord = function() {
    var wordToCheck = $scope.wordInProgress.join('').toUpperCase();

    var getPoint = function() {
      $scope.points ++;
      $scope.correctAnswer = true;
      $scope.highScore = $scope.points > $scope.highScore ? $scope.points : $scope.highScore; 
      setTimeout(function() {
        getWord();
      }, 400);
      return;
    }
    if(wordToCheck === $scope.word){
      getPoint();
    }
    else{
      $http.get("http://api.wordnik.com:80/v4/words.json/search/"+wordToCheck+"?caseSensitive=false&minCorpusCount=5&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=1&maxLength=-1&skip=0&limit=10&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5")
      .success(function (response) {
        if(response.totalResults > 0){
          getPoint();
        }
        else{
          $scope.wrong = true;
          setTimeout(function() {
            $scope.wrong = false;
            $scope.scrambledWord = scrambleWord($scope.wordInProgress);
            $scope.wordInProgress = [];
            $scope.$digest();
          }, 400);
        }
      });
    }
  }

  $scope.playAgain = function() {
    $scope.date = new Date(Date.now() + .1 *60000).toString();
    $scope.showModal = false;
    $scope.points = 0;
    getWord();
  };

  getWord();

  $document.bind("keydown", function (event) {
    var code = (event.keyCode ? event.keyCode : event.which);
    var letter = String.fromCharCode(code).toLowerCase();
    var index = $scope.scrambledWord.indexOf(letter);

    if(index !== -1){
      $scope.wordInProgress.push($scope.scrambledWord.splice(index, 1)[0]);
      $scope.$digest();
      if($scope.wordInProgress.length === $scope.word.length){
        checkWord();
      }
    }
    
    if(code === 8){
      if($scope.wordInProgress.length > 0){
        $scope.scrambledWord.push($scope.wordInProgress.pop());
        $scope.$digest();
      }
      event.preventDefault();
    }
  });

}]);