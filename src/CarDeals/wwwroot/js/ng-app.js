"use strict";

(function () {

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
        .then(function (reg) {
            // registration worked
            console.log('Registration succeeded. Scope is ' + reg.scope);
        }).catch(function (error) {
            // registration failed
            console.log('Registration failed with ' + error);
        });
    }

    angular.module("carDeals", ['LocalForageModule']);

    angular.module("carDeals").controller("carsController", function ($http, $scope, $localForage) {

        var apiPath = "http://bstavroulakis.com/pluralsight/courses/progressive-web-apps/service/latest-deals.php";
        var apiUrl = apiPath + "?carId=";
        var vm = this;
        var limit = 3;
        var currentCarId = "";
        var indexLoaded = 0;
        vm.isLoading = true;
        vm.detailsOpen = false;
        vm.cars = [];
        var carKeys = [];

        $localForage.keys().then(function (keys) {
            carKeys = keys.reverse();
        }).finally(fetch);
        
        $scope.openDialog = function(car) {
            var details = $('#details');
            details.find('#brand').text(car.brand);
            details.find('#model').text(car.model);
            details.find('#year').text(car.year);
            details.find('#image').attr("src", car.image);
            vm.detailsOpen = true;
            details.dialog('open');
        }

        $scope.loadMoreCars = function () {
            vm.isLoading = true;
            fetch();
        }

        function fetch() {
            if (carKeys.length == 0 || indexLoaded >= carKeys.length) {
                getMoreCars();
            } else {
                var batch = [];
                for (var i = 0; i < limit; i++) {
                    if (carKeys[i + indexLoaded]) {
                        batch.push(carKeys[i + indexLoaded]);
                    }
                }
                $localForage.getItem(batch).then(function (cars) {
                    cars.forEach(function (car) {
                        loadCar(car);
                    });
                }).finally(finishLoading);
            }
        }

        function getMoreCars() {
            $http.get(apiUrl + currentCarId)
            .then(function (res) {
                res.data.cars.forEach(function (car) {
                    $localForage.setItem(car.key, car.value).then(function () {
                        loadCar(car.value);
                    });
                });
            }, function (err) {
                console.log("Failed to get more data: " + err);
            }).finally(finishLoading);
        }


        function loadCar(car) {
            vm.cars.push(car);
            indexLoaded++;
            currentCarId = car.id;
        }

        function finishLoading() {
            vm.isLoading = false;
        }
    });

    

})();