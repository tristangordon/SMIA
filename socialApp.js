function convertDate (date) {
	var thisDate = new Date(date);
	var properFormat = thisDate.getTime();

	return properFormat/1000;
}

function sortByCreatedTime (socialArray) {
	socialArray.sort(function(a, b) {
    	return parseFloat(b.created) - parseFloat(a.created);
	});

	return socialArray;
}

var socialCards   = [];

function normalizeObjects (data, apiSource) {
	if (apiSource == 'instagram') {
		for (i = 0; i < data.length; i++) {
			var socialCard = {
				postLink: data[i].link,
				sourceUrl: data[i].images.standard_resolution.url,
				socialLogo: 'instagramlogo.png',
				profilePicSource: data[i].user.profile_picture,
				profileLink:'https://www.instagram.com/' + data[i].user.username,
				username: data[i].user.username,
				source: apiSource,
				created: parseInt(data[i].caption.created_time)
			}

			socialCards.push(socialCard);

		}

		return socialCards;
	}

	if (apiSource =='facebook') {
		for (i = 0; i < data.length; i++) {
			var socialCard = {
				postLink: data[i].link,
				sourceUrl: data[i].images[0].source,
				socialLogo: 'facebooklogo.png',
				profilePicSource: 'https://scontent.xx.fbcdn.net/v/t1.0-9/14141888_293590057676370_7565292093134440740_n.png?oh=312a4154d6460dde0d56c3833bc109d0&oe=584006D5',
				profileLink:'https://www.facebook.com/' + data[i].from.id,
				username: data[i].from.name,
				source: apiSource,
				created: convertDate(data[i].created_time)
			}

			socialCards.push(socialCard);

		}

		return socialCards;
	}	

	if (apiSource =='twitter') {
		for (i = 0; i < data.length; i++) {
			var socialCard = {
				postLink: data[i].entities.media[0].url,
				sourceUrl: data[i].entities.media[0].media_url,
				socialLogo: 'twitterlogo.png',
				profilePicSource: data[i].user.profile_image_url,
				profileLink:'https://www.twitter.com/' + data[i].user.id_str,
				username: data[i].user.screen_name,
				source: apiSource,
				created: convertDate(data[i].created_at)
			}

			socialCards.push(socialCard);

		}

		return socialCards;
	}

}

angular.module('socialApp', [])
	.controller('SocialPhotoController', function ($http){
		var social 	  = this,
		endpoint      = '/getInsta',
		endpoint2     = '/getFacebook',
		endpoint3     = '/getTwitter',
		count	  	  = 0;

		$http({
			method: 'GET',
			url: endpoint3
		})
			.then(function(response) {
				var dataThree = response.data.statuses,
				apiSource   = 'twitter';
				
				//take data from object and create uniform object so that our markup
				//works with photos from all api endpoints
				normalizeObjects(dataThree, apiSource);

				//use count variable to signal that request is done
				count += 1;
				return count;

			}, function (response){
				error('broken!' + response);
			}).then(function (){
				// check to see if all requests are finished before sorting
				//and sending data to view
				if (count <= 2) {
					
				}
				if (count >= 2) {
					social.data = sortByCreatedTime(socialCards);
				}
			});

		$http({
			method: 'GET',
			url: endpoint
		})
			.then(function(response) {
				var dataOne = response.data.data,
				apiSource = 'instagram';

				//take data from object and create uniform object so that our markup
				//works with photos from all api endpoints
				normalizeObjects(dataOne, apiSource);

				//use count variable to signal that request is done
				count += 1;
				return count;

			}, function (response){
				error('broken!' + response);
			}).then(function (){
				// check to see if all requests are finished before sorting
				//and sending data to view
				if (count <= 2) {
					
				}
				if (count >= 2) {
					social.data = sortByCreatedTime(socialCards);
				}
			});

		$http({
			method: 'GET',
			url: endpoint2
		})
			.then(function(response) {
				var dataTwo = response.data.data,
				apiSource   = 'facebook';

				//take data from object and create uniform object so that our markup
				//works with photos from all api endpoints
				normalizeObjects(dataTwo, apiSource);

				//use count variable to signal that request is done
				count += 1;
				return count;

			}, function (response){
				error('broken!' + response);
			}).then(function (){
				// check to see if all requests are finished before sorting
				//and sending data to view
				if (count <= 2) {
					
				}
				if (count >= 2) {
					social.data = sortByCreatedTime(socialCards);
				}
			});

		social.twitterOnly = function () {

			$http({
			method: 'GET',
			url: endpoint3
			})
				.then(function(response) {
					var dataThree = response.data.statuses,
					apiSource   = 'twitter';
					
					//take data from object and create uniform object so that our markup
					//works with photos from all api endpoints
					socialCards = [];
					normalizeObjects(dataThree, apiSource);

					//use count variable to signal that request is done
					count += 1;
					return count;

				}, function (response){
					error('broken!' + response);
				}).then(function (){
					// check to see if all requests are finished before sorting
					//and sending data to view
					
					social.data = sortByCreatedTime(socialCards);
					
				});
		}

		social.instagramOnly = function () {

			$http({
				method: 'GET',
				url: endpoint
			})
				.then(function(response) {
					var dataOne = response.data.data,
					apiSource = 'instagram';

					//take data from object and create uniform object so that our markup
					//works with photos from all api endpoints
					socialCards = [];
					normalizeObjects(dataOne, apiSource);

				}, function (response){
					error('broken!' + response);
				}).then(function (){
					// check to see if all requests are finished before sorting
					//and sending data to view
					
					social.data = sortByCreatedTime(socialCards);	
				});
		}

		social.facebookOnly = function () {

			$http({
				method: 'GET',
				url: endpoint2
			})
				.then(function(response) {
					var dataTwo = response.data.data,
					apiSource   = 'facebook';

					//take data from object and create uniform object so that our markup
					//works with photos from all api endpoints
					socialCards = [];
					normalizeObjects(dataTwo, apiSource);

				}, function (response){
					error('broken!' + response);
				}).then(function (){
					// check to see if all requests are finished before sorting
					//and sending data to view
						
					social.data = sortByCreatedTime(socialCards);	
				});
		}
	});
