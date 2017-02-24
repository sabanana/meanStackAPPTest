angular.module('meanhotel').controller('HotelController', HotelController);

function HotelController($route, $routeParams, hotelDataFactory) {
	var vm = this;
	var id = $routeParams.id;
	vm.isSubmitted = false;		// form submitted unsuccessfully

	hotelDataFactory.hotelDisplay(id).then(function(res) {
		vm.hotel = res.data;
		vm.stars = _getStarRating(res.data.stars);
	});

	vm.addReview = function() {
		var postData = {
			name : vm.name,
			rating : vm.rating,
			review : vm.review
		};

		if (vm.reviewForm.$valid) {
			hotelDataFactory.postReview(id, postData).then(function(response) {
				console.log(response.status);
				if (response.status === 201) {
					// reload the page automatically if submit successfully
					$route.reload();
				}
			}).catch(function(error) {
				console.log(error);
			});
		}
		else {
			console.log('invalid form');
			vm.isSubmitted = true;	// submit unsuccessfully
		}
	};
}

function _getStarRating(stars) {
	return new Array(stars);
}