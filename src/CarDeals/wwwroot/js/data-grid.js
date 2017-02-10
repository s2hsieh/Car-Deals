"use strict";

(function () {

    angular.module("carDeals", []);

    var apiUrl = "http://bstavroulakis.com/pluralsight/courses/progressive-web-apps/service/latest-deals.php";

    angular.module("carDeals").controller("carsController", function ($http, $scope) {

        var vm = this;
        vm.isLoading = true;
        vm.cars = [];
        $http.get(apiUrl)
        .then(function (res) {
            angular.copy(res.data.cars, vm.cars);
        }, function (err) {
            alert(err);
        }).finally(function () {
            vm.isLoading = false;
        });

        $scope.openDialog = function(car) {
            var details = $('#details');
            details.find('#brand').text(car.value.brand);
            details.find('#model').text(car.value.model);
            details.find('#year').text(car.value.year);
            details.find('#image').attr("src", car.value.image);
            details.dialog('open');
        }
    });

    

})();