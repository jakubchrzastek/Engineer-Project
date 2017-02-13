'use strict';

(function() {
    angular.module('myApp')
        .controller('dashboardController', dashboardController);

    dashboardController.$inject = ['$scope', 'dashboardService', 'API'];

    function dashboardController($scope, dashboardService, API) {

        dashboardService.getCategory()
            .then(function(response) {
                $scope.category = response;
                $scope.data = [];
                $scope.nazwa_kategoria = [];
                for (var i = 0; i < response.length; i++) {
                    $scope.data.push($scope.category[i].ilosc);
                }
                for (var i = 0; i < response.length; i++) {
                    $scope.nazwa_kategoria.push($scope.category[i].nazwa_kategoria);
                }
                var width = 500,
                    height = 300,
                    radius = Math.min(width, height) / 2 - 20;

                var color = d3.scale.ordinal()
                    .range(["#3366cc", "#dc3912", "#ff9900", "#109618"]);
                var pie = d3.layout.pie()
                    .padAngle(.05)
                    .value(function(d) {
                        return d;
                    });

                var arc = d3.svg.arc()
                    .innerRadius(60)
                    .outerRadius(radius);

                var svg = d3.selectAll("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .append("g")
                    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

                var category = svg.selectAll(".category")
                    .data(pie($scope.data))
                    .enter().append("g")
                    .attr('class', 'category');

                var path = category.append("path")
                    .attr("fill", function(d, i) {
                        return color(i);
                    })
                    .attr("d", arc)

                var text = category.append("text")
                    .attr("transform", function(d) {
                        return "translate(" + arc.centroid(d) + ")";
                    })
                    .attr("text-anchor", "middle")
                    .text(function(d, i) {
                        return $scope.nazwa_kategoria[i] + ": " + $scope.data[i];
                    });

            });


        dashboardService.getCustomers()
            .then(function(response) {
                $scope.customers = response;
            });

        dashboardService.getProducts()
            .then(function(response) {
                $scope.products = response;
            });

        dashboardService.getOrders()
            .then(function(response) {
                $scope.orders = response;
            });

        dashboardService.getGain()
            .then(function(response) {
                $scope.gain = response;
            });

    }
})();