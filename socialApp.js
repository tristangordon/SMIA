angular.module('socialApp', [])
	.controller('SocialPhotoController', function ($http){
	var social 			  = this;
		social.endpoint    = '/getSocial';

		$http({
			method: 'GET',
			url: social.endpoint
		})
			.then(function(response) {
				social.data = response.data.data;
			}, function (response){
				error('broken!');
			});
	});
