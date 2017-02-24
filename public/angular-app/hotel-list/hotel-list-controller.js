angular.module('meanhotel').controller('HotelsController', HotelsController);

function HotelsController($http) {
	var vm = this;
	vm.title = "MEAN Hotel App";

	$http.get('/api/hotels').then(function(res) {
		//console.log(res);
		console.log(res.data);
		vm.hotels = res.data;
	});
}