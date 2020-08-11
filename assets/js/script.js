let queryData;
let ready = false;
var previousSelected;
//query ncov-19.us api
$.ajax({
        url: "https://covid19-us-api.herokuapp.com/county",
        method: "GET"
    }).then(function(response) {
        queryData = response;
        console.log(queryData);
        getReady();
    })
    //display function for ajax query of Covid data
function displayCounty(e) {
    //locate info
    const countyName = $(this).attr("id").replace(/_/g, " ").replace("1", "");
    if ($(this) !== previousSelected && previousSelected !== undefined) {
        console.log("diff");
        previousSelected.tooltip("disable");
    }
    previousSelected = $(this);
    console.log(countyName);
    const countyData = findCounty(countyName);
    console.log(countyData);
    $(this).attr("title", countyName);
    $(this).attr("data-toggle", "tooltip");
    $(this).tooltip("enable");
    $(this).tooltip("show");
    //display info
    const info = $("#info");
    info.empty();
    info.css("display", "block");
    const name = $(`<h5>${countyData.county_name} County</h5>`);
    info.append(name);
    info.append($("<hr>"));
    const confirmed = $(`<p>Confirmed cases: ${countyData.confirmed}</p>`);
    info.append(confirmed);
    const fatality = $(`<p>Fatality rate: ${countyData.fatality_rate}</p>`);
    info.append(fatality);
}
//search queryData.message for a particular county
function findCounty(needle) {
    for (let item of queryData.message) {
        if (item.county_name === needle) {
            return item
        }
    }
};
//remove loading gif when ajax query is returned
function getReady() {
    ready = true;
    $("#loading").css("display", "none");
    $("path").on("click", displayCounty);
    $("polyline").on("click", displayCounty);
    $("polygon").on("click", displayCounty);
    $("path").addClass("hover");
    $("polyline").addClass("hover");
    $("polygon").addClass("hover");
}