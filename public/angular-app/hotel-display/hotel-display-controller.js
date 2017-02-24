angular.module('meanhotel').controller('HotelController', HotelController);

function HotelController($routeParams, hotelDataFactory) {
	var vm = this;
	var id = $routeParams.id;

	hotelDataFactory.hotelDisplay(id).then(function(res) {
		vm.hotel = res;
		vm.stars = _getStarRating(res.stars);
	});
}

function _getStarRating(stars) {
	return new Array(stars);
}