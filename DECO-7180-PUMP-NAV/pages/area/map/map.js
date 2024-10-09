document.addEventListener('DOMContentLoaded', function() {
    var map = L.map('map').setView([-27.4698, 153.0251], 10); // Adjust as needed

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Function to add markers to the map
    function addMarkers(data) {
        data.forEach(station => {
            const popupContent = `
                <strong>${station.Site_Name}</strong><br/>
                Address: ${station.Sites_Address_Line_1}<br/>
                Suburb: ${station.Site_Suburb}<br/>
                Brand: ${station.Site_Brand || 'N/A'}<br/> <!-- Check if Site_Brand exists -->
                Fuel Type: ${station.Fuel_Type || 'N/A'}<br/>
                Price: $${(station.Price / 100).toFixed(2)} AUD
            `; // Include more details as needed

            L.marker([station.Site_Latitude, station.Site_Longitude])
                .bindPopup(popupContent)
                .addTo(map);
        });
    }


    // Function to fetch gas stations based on selected suburb
    function fetchStations(suburb) {
		var sql = encodeURIComponent(`SELECT * FROM "28ab00ec-00dd-4edf-b272-0543df4dcbe5" WHERE "Site_Suburb" = '${suburb}'`);
		fetch(`https://www.data.qld.gov.au/api/3/action/datastore_search_sql?sql=${sql}`)
			.then(response => response.json())
			.then(json => {
				if (json.result && json.result.records) {
					// Assuming the suburb's data contains latitude and longitude
					const firstRecord = json.result.records[0];
					if (firstRecord && firstRecord.Site_Latitude && firstRecord.Site_Longitude) {
						// Move the map to the new location
						map.setView([firstRecord.Site_Latitude, firstRecord.Site_Longitude], 15); // 15 is the zoom level
					}
	
					map.eachLayer(function(layer) { // Clear existing markers
						if (layer instanceof L.Marker) {
							map.removeLayer(layer);
						}
					});
					addMarkers(json.result.records);
				} else {
					console.error('No records found or error in response:', json);
				}
			})
			.catch(error => console.error('Error loading the data:', error));
	}

    // Function to populate suburbs dropdown
    function populateSuburbs() {
        var sql = encodeURIComponent(`SELECT DISTINCT "Site_Suburb" FROM "28ab00ec-00dd-4edf-b272-0543df4dcbe5"`);
        fetch('https://www.data.qld.gov.au/api/3/action/datastore_search_sql?sql=' + sql)
            .then(response => response.json())
            .then(json => {
                if (json.result && json.result.records) {
                    var suburbSelector = document.getElementById('suburbSelector');
                    json.result.records.forEach(record => {
                        var option = new Option(record.Site_Suburb, record.Site_Suburb);
                        suburbSelector.add(option);
                    });
                } else {
                    console.error('No suburbs found or error in response:', json);
                }
            })
            .catch(error => console.error('Error loading suburbs:', error));
    }

    // Listener for suburb selection
    document.getElementById('suburbSelector').addEventListener('change', function() {
        fetchStations(this.value);
    });

    // Initialize the suburbs dropdown and load initial data
    populateSuburbs();
});
