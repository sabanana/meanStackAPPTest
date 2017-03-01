angular.module('meanhotel').controller('LoginController', LoginController);

function LoginController($http, $location, $window, AuthFactory, jwtHelper) {
	var vm = this;

	vm.isLoggedIn = function() {
		if (AuthFactory.isLoggedIn) {
			return true;
		}
		else {
			return false;
		}
	};

	vm.login = function() {
		if (vm.username && vm.password) {
			var user = {
				username : vm.username,
				password : vm.password
			};
		}

		$http.post('/api/users/login', user).then(function(response) {
			// response data format --> {sucesss: true, token: XXX.XXX.XXX}
			if (response.data.success) {
				// if login successfully
				// 1) store the token in session storage
				$window.sessionStorage.token = response.data.token;
				// 2) set loggedIn to true
				AuthFactory.isLoggedIn = true;
				// 3) decode the username from token using jwtHelper and stored in vm.loggedInUser
				var token = $window.sessionStorage.token;
				var decodedToken = jwtHelper.decodeToken(token);
				vm.loggedInUser = decodedToken.username;
			}
		}).catch(function(error) {
			console.log(error);
		});
	};

	vm.logout = function() {
		AuthFactory.isLoggedIn = false;
		delete $window.sessionStorage.token;
		$location.path('/');
	};

	vm.isActiveTab = function(url) {
		var currentPath = $location.path().split('/')[1];
		return (url === currentPath ? 'active' : '');
	};
}