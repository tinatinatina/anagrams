
angular.module('Countdown', [])
  .directive('timer', ['$interval', function ($interval) {
    return {
      restrict: 'EA',
      scope: {
        date: '@',
        showModal: '=',
        paused: '='
      },
      link: function (scope, element) {
        var future = new Date(scope.date);
        $interval(function () {
          var diff = Math.floor((future.getTime() - new Date().getTime()) / 1000);
          if(diff <= 0){
            scope.showModal = true;
            diff = "";
            scope.paused = true;
          }
          return element.text(diff);
        }, 1000);
        scope.$watch("date", function(date){
          future = new Date(date);
        });
      }
    };
  }]);
