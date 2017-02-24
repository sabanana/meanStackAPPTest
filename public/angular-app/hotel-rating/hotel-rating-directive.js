angular.module('meanhotel').component('hotelRating', {
	bindings : {
		stars : '='		// '=' means access the attribute by values
	},
	template : '<span ng-repeat="star in vm.stars track by $index" class="glyphicon glyphicon-star">{{ star }}</span>',
	controller : 'HotelController',
	controllerAs : 'vm'
});