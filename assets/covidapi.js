var queryURL = "https://data.ca.gov/api/3/action/datastore_search?resource_id=926fd08f-cc91-4828-af38-bd45de97f8c3&q=Santa Clara"
$.ajax({
    url: queryURL,
    method: "GET"
        // data: data,
        // dataType: 'jsonp',
        // success: function(data) {
        //     alert('Total results found: ' + data.result.total)
        // }
}).then(function(response) {
    var numbResults = response.result.records.length;
    var totAvailResults = response.result.total;
    var nextResultSet = response.result._links.next;
    console.log(response);
    console.log(numbResults);
    console.log(totAvailResults);
    console.log(nextResultSet);
    if (nextResultSet) {
        $.ajax({
            url: "https://data.ca.gov" + nextResultSet,
            method: "GET"
        }).then(function(response) {
            var newResults = response.result.records.length;
            console.log(newResults);
        })
    }
});