angular.module('meanhotel').directive('mhNavigation', mhNavigation);

function mhNavigation() {
	return {
		restrict: 'E',	// can be used as element <mh-navigation>
		templateUrl : 'angular-app/navigation-directive/navigation-directive.html'
	};
}