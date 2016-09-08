function convertDate (date) {
	var thisDate = new Date(date);
	var properFormat = thisDate.getTime();

	return properFormat/1000;
}

function sortByCreatedTime (socialArray) {
	socialArray.sort(function(a, b) {
    	return parseFloat(b.created) - parseFloat(a.created);
	});

	console.log(socialArray);
	return socialArray;
}

angular.module('socialApp', [])
	.controller('SocialPhotoController', function ($http){
		var social 	  = this,
		socialCards   = [],
		endpoint      = '/getInsta',
		endpoint2     = '/getFacebook';
		count	  	  = 0;

		$http({
			method: 'GET',
			url: endpoint
		})
			.then(function(response) {
				var data = response.data.data;

				//take data from object and normalize so that it works with all
				//sources
				for (i = 0; i < data.length; i++) {
					var socialCard = {
						postLink: data[i].link,
						sourceUrl: data[i].images.standard_resolution.url,
						socialLogo: 'instagramlogo.png',
						profilePicSource: data[i].user.profile_picture,
						profileLink:'https://www.instagram.com/' + data[i].user.username,
						username: data[i].user.username,
						source: 'instagram',
						created: parseInt(data[i].caption.created_time)
					}

					socialCards.push(socialCard);

				}
				//use count variable to signal that request is done
				count += 1;
				return count;

			}, function (response){
				error('broken!' + response);
			}).then(function (){
				// check to see if all requests are finished before sorting
				//and sending data to view
				if (count == 1) {
					
				}
				else {
					social.data = sortByCreatedTime(socialCards);
				}
			});

		$http({
			method: 'GET',
			url: endpoint2
		})
			.then(function(response) {
				dataTwo = response.data.data;

				console.log(dataTwo);

				//take data from object and create uniform object so that our markup
				//works with all photos, not just instagram
				for (i = 0; i < dataTwo.length; i++) {
					var socialCard = {
						postLink: dataTwo[i].link,
						sourceUrl: dataTwo[i].images[0].source,
						socialLogo: 'facebooklogo.png',
						profilePicSource: dataTwo[i].images[0].source,
						profileLink:'https://www.facebook.com/' + dataTwo[i].from.id,
						username: dataTwo[i].from.name,
						source: 'facebook',
						created: convertDate(dataTwo[i].created_time)
					}

					socialCards.push(socialCard);

				}
				//use count variable to signal that request is done
				count += 1;
				return count;

			}, function (response){
				error('broken!' + response);
			}).then(function (){
				// check to see if all requests are finished before sorting
				//and sending data to view
				if (count == 1) {
					
				}
				else {
					social.data = sortByCreatedTime(socialCards);
				}
			});


	

		

	});
