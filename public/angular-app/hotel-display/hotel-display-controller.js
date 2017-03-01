angular.module('meanhotel').controller('HotelController', HotelController);

function HotelController($route, $routeParams, $window, hotelDataFactory, AuthFactory, jwtHelper) {
	var vm = this;
	var id = $routeParams.id;
	vm.isSubmitted = false;		// form submitted unsuccessfully

	hotelDataFactory.hotelDisplay(id).then(function(res) {
		vm.hotel = res.data;
		vm.stars = _getStarRating(res.data.stars);
	});

	vm.isLoggedIn = function() {
		if (AuthFactory.isLoggedIn) {
			return true;
		}
		return false;
	}

	vm.addReview = function() {
		var token = jwtHelper.decodeToken($window.sessionStorage.token);
		var username = token.username;

		var postData = {
			name : username,
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