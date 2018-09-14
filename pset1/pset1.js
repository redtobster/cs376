	async function getGallery(){
		// await response of fetch call
		let response = await fetch('https://api.harvardartmuseums.org/gallery?apikey=195d8810-b209-11e8-b902-312181a04b6e&size=100')
		// only proceed when promise is resolved
		let data = await response.json();
		let output = '<h2>Gallery Names</h2>';
		// accessing the records array that contains multiple objects in which we want to retrieve info from
		let galleryArray = data['records'];
		galleryArray.forEach(function(gallery){
			output += `
			<div>
			<button id=${gallery.id} onclick="getObject(${gallery.id})">${gallery.name}</button>
			</div>
			`;
		});
		document.getElementById('output').innerHTML = output;
	}
	// load function getGallery when user gets to the page
	window.onload = getGallery;

	async function getObject(id) {
		// await response of fetch call
		let response = await fetch('https://api.harvardartmuseums.org/object?apikey=195d8810-b209-11e8-b902-312181a04b6e&gallery=' + id + '&page=1');
		// only proceed when promise is resolved
		let data = await response.json();
		// accessing the information about the number of pages in the JSON
		let pageCount = data['info']['pages'];
		// accessing the information about the records in data
		let objectArray = data['records'];
		// checking if the number of objects is larger than 100 so that fetch can be called more than once
		if (pageCount > 1){
			let i = 1;
			while (i < pageCount){
				// making another fetch call(s) to get the other pages
				let response = await fetch('https://api.harvardartmuseums.org/object?apikey=195d8810-b209-11e8-b902-312181a04b6e&gallery=' + id + '&page=' + (i+1));
				// proceed when promise is resolved
				let data = await response.json();
				// appending more information to objectArray
				objectArray = objectArray.concat(data['records']);
				i = i + 1;
			}
		};
		// variable storing an empty string
		let obj = '<h2>List of Objects</h2>';

		for (let i = 0; i < objectArray.length; i++){
			obj +=
			`<div id=${objectArray[i].objectid}>
			<button id=${objectArray[i].objectid} onclick="getObjectInfo(${objectArray[i].objectid}, ${id})">${objectArray[i].title}</button>
			</div>
			`
		};
		document.getElementById('outputObj').innerHTML = obj;
	}
	
		async function getObjectInfo(objectId, galleryId){
			// await response of fetch call
			let response = await fetch('https://api.harvardartmuseums.org/object?apikey=195d8810-b209-11e8-b902-312181a04b6e&gallery=' + galleryId + '&page=1');
			// only proceed when promise is resolved
			let data = await response.json();
			// accessing the information about the number of pages in the object
			let pageCount = data['info']['pages'];
			let objectArray = data['records'];
			if (pageCount > 1){
				// loop 1 is setup to search for the page that contains the object
				loop1:
				for (i=0; i<pageCount;i++){
					// loop 2 is setup to search for the matching object
					loop2:
					for (j = 0; j < objectArray.length; j++){
						if (objectArray[j].objectid === objectId){
							let objectInfo = document.getElementById(objectId);
							objectInfo.innerHTML = 
							`
							<div id="${objectId}">
							<h4>${objectArray[j].title}</h4>
							<p>${JSON.stringify(objectArray[j])}</p>
							<h5> Scroll down to see images!</h5>
							</div>
							`;
							if (objectArray[j].images.length > 0) {
								displayImages(objectArray[j].images, objectId);
							};
							break loop1;
						};
					let response = await fetch('https://api.harvardartmuseums.org/object?apikey=195d8810-b209-11e8-b902-312181a04b6e&gallery=' + galleryId + '&page=' + (i+1));
					let data = await response.json();
					// replacing objectArray with a new information
					objectArray = data['records'];
					};
				};
			};		
		};

		function displayImages(imageArray, objectId){
			let images = '<h3>Images here!</h3>';
			imageArray.forEach(function(imageURL){
				console.log(imageURL.baseimageurl)
				images += `
				<img src="${imageURL.iiifbaseuri}/full/full/0/default.png"/>
				`;});
			document.getElementById("images").innerHTML = images;
		}

	// A good code chunk below is copy pasted from the website https://code.lengstorf.com/get-form-values-as-json/

	const formToJSON = elements => [].reduce.call(elements, (data, element) => {
	  
	  data[element.name] = element.value;
	  return data;

	}, {});


	async function objectSearch(searchParam, searchData){
			// await response of fetch call
			let response = await fetch('https://api.harvardartmuseums.org/object?apikey=195d8810-b209-11e8-b902-312181a04b6e&' + searchParam + '=' + searchData[searchParam] + '&page=1');
			// only proceed when promise is resolved
			let data = await response.json();
			let pageCount = data['info']['pages'];
			let objectArray = data['records'];
			// Alerting the user if the object is not found
			if (data['info']['totalrecords']==0){
				alert('The object you are looking for is not available!')
			};
			if (pageCount > 1){
				// loop 1 is setup to search for the page that contains the object
				for (i=1; i<pageCount;i++){
					let response = await fetch('https://api.harvardartmuseums.org/object?apikey=195d8810-b209-11e8-b902-312181a04b6e&'+ searchParam + '=' + searchData[searchParam] + '&page=' + (i+1));
					let data = await response.json();
					objectArray = objectArray.concat(data['records']);
				};
			};	
			// the output of the information of the object goes here
			let output = new String()
			objectArray.forEach(function(array){
				output += `
				<div>
				<p>${array.title}</p>
				</div>
				`;
			});
			document.getElementById(searchParam).innerHTML = output;
			console.log(objectArray)
		};

	async function exhibitionSearch(searchParam1, searchParam2, searchData){
			// await response of fetch call
			console.log(searchParam1);
			console.log(searchData[searchParam1]);
			console.log(searchParam2);
			console.log(searchData[searchParam2]);
			let response = await fetch('https://api.harvardartmuseums.org/exhibition?apikey=195d8810-b209-11e8-b902-312181a04b6e&' + searchParam1 + '=' + searchData[searchParam1] + '&'+ searchParam2 + '=' + searchData[searchParam2] + '&page=1');
			// only proceed when promise is resolved
			let data = await response.json();
			let pageCount = data['info']['pages'];
			let objectArray = data['records'];
			// Alerting the user if the object is not found
			if (data['info']['totalrecords']==0){
				alert('The exhibition you are looking for is not available!')
			};
			if (pageCount > 1){
			// 	// loop 1 is setup to search for the page that contains the object
				for (i=1; i<pageCount;i++){
					let response = await fetch('https://api.harvardartmuseums.org/exhibition?apikey=195d8810-b209-11e8-b902-312181a04b6e&' + searchParam1 + '=' + searchData[searchParam1] + '&'+ searchParam2 + '=' + searchData[searchParam2] + '&page=' + (i+1));
					let data = await response.json();
					objectArray = objectArray.concat(data['records']);
				};
			};	
			// // the output of the information of the object goes here
			let output = new String()
			objectArray.forEach(function(array){
				output += `
				<div>
				<p>${array.title}</p>
				</div>
				`;
			});
			document.getElementById(searchParam1).innerHTML = output;
			console.log(objectArray)
		};

		async function personIDSearch(searchParam, searchData){
			// await response of fetch call
			console.log(searchParam)
			console.log(searchData[searchParam])
			let response = await fetch('https://api.harvardartmuseums.org/person?apikey=195d8810-b209-11e8-b902-312181a04b6e&' + searchParam + '=culture:' + searchData[searchParam] + '&page=1');
			// only proceed when promise is resolved
			let data = await response.json();
			let pageCount = data['info']['pages'];
			let objectArray = data['records'];
			// Alerting the user if the object is not found
			if (data['info']['totalrecords']==0){
				alert('The person ID you are looking for is not available!')
			};
			if (pageCount > 1){
				// loop 1 is setup to search for the page that contains the object
				for (i=1; i<pageCount;i++){
					let response = await fetch('https://api.harvardartmuseums.org/person?apikey=195d8810-b209-11e8-b902-312181a04b6e&'+ searchParam + '=culture:' + searchData[searchParam] + '&page=' + (i+1));
					let data = await response.json();
					objectArray = objectArray.concat(data['records']);
				};
			};	
			// the output of the information of the object goes here
			let output = new String()
			objectArray.forEach(function(array){
				output += `
				<div>
				<p>${array.personid}</p>
				</div>
				`;
			});
			document.getElementById(searchParam).innerHTML = output;
			console.log(objectArray)
		};

		async function publicationSearch(searchParam, searchData){
			// await response of fetch call
			console.log(searchParam)
			console.log(searchData[searchParam])
			let response = await fetch('https://api.harvardartmuseums.org/publication?apikey=195d8810-b209-11e8-b902-312181a04b6e&' + searchParam + '=publicationyear:' + searchData[searchParam] + '&page=1');
			// only proceed when promise is resolved
			let data = await response.json();
			let pageCount = data['info']['pages'];
			let objectArray = data['records'];
			// Alerting the user if the object is not found
			if (data['info']['totalrecords']==0){
				alert('The publication you are looking for is not available!')
			};
			if (pageCount > 1){
				// loop 1 is setup to search for the page that contains the object
				for (i=1; i<pageCount;i++){
					let response = await fetch('https://api.harvardartmuseums.org/publication?apikey=195d8810-b209-11e8-b902-312181a04b6e&'+ searchParam + '=publicationyear:' + searchData[searchParam] + '&page=' + (i+1));
					let data = await response.json();
					objectArray = objectArray.concat(data['records']);
				};
			};	
			// the output of the information of the object goes here
			let output = new String()
			objectArray.forEach(function(array){
				output += `
				<div>
				<p>${array.title}</p>
				</div>
				`;
			});
			document.getElementById('publication').innerHTML = output;
			console.log(objectArray)
		};


	/*
	 * This is where things actually get started. We find the form element using
	 * its class name, then attach the `handleFormSubmit()` function to the 
	 * `submit` event.
	 */
	const form = document.getElementsByClassName('info')[0];
	form.addEventListener('submit', function(){
		event.preventDefault();
		const data = formToJSON(form.elements);
		objectSearch(Object.keys(data)[0], data);
	});


	const formYear = document.getElementsByClassName('infoYear')[0];
	formYear.addEventListener('submit', function(){
		event.preventDefault();
		const data = formToJSON(formYear.elements);
		objectSearch(Object.keys(data)[0], data);
	});

	const formPerson = document.getElementsByClassName('infoPerson')[0];
	formPerson.addEventListener('submit', function(){
		event.preventDefault();
		const data = formToJSON(formPerson.elements);
		objectSearch(Object.keys(data)[0], data);
	});

	const formPlace = document.getElementsByClassName('infoPlace')[0];
	formPlace.addEventListener('submit', function(){
		event.preventDefault();
		const data = formToJSON(formPlace.elements);
		objectSearch(Object.keys(data)[0], data);
	});

	const formWork = document.getElementsByClassName('infoWork')[0];
	formWork.addEventListener('submit', function(){
		event.preventDefault();
		const data = formToJSON(formWork.elements);
		objectSearch(Object.keys(data)[0], data);
	});

	const formDate = document.getElementsByClassName('infoDate')[0];
	formDate.addEventListener('submit', function(){
		event.preventDefault();
		const data = formToJSON(formDate.elements);
		exhibitionSearch(Object.keys(data)[0], Object.keys(data)[1], data);
	});

	const formPersCult = document.getElementsByClassName('infoPersCult')[0];
	formPersCult.addEventListener('submit', function(){
		event.preventDefault();
		const data = formToJSON(formPersCult.elements);
		personIDSearch(Object.keys(data)[0], data);
	});

	const formPublish = document.getElementsByClassName('infoPublish')[0];
	formPublish.addEventListener('submit', function(){
		event.preventDefault();
		const data = formToJSON(formPublish.elements);
		publicationSearch(Object.keys(data)[0], data);
	});
