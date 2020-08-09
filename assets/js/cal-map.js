
let queryData;
let countyData;
let ready = false;
let newData;




//AJAX QUERIES


//query ncov-19.us api
$.ajax({
    url: "https://covid19-us-api.herokuapp.com/county",
    method: "GET"
}).then(function(response){
    queryData = response;
    console.log(queryData);
    getReady();
})






//QUERY RESPONSE FUNCTIONS

//display function for ajax query of Covid data
function displayCounty(e) {

    //locate info
    const countyName = $(this).attr("id").replace(/_/g, " ").replace("1", "");
    console.log(countyName);
    countyData = findCounty(countyName);
    console.log(countyData);

        




        //query current and past county data

    // let csvCounty = "San Diego"
    // let csvURL = "https://data.ca.gov/api/3/action/datastore_search?resource_id=926fd08f-cc91-4828-af38-bd45de97f8c3&q=" + csvCounty;

    let csvSource = "https://data.ca.gov/dataset/590188d5-8545-4c93-a9a0-e230f0db7290/resource/926fd08f-cc91-4828-af38-bd45de97f8c3/download/statewide_cases.csv";
    let csvCounty = "&county=" + countyName;
    let csvURL = "https://c19d.zzzkitty.com/?source=" + csvSource + csvCounty;

    $.ajax({
        url: csvURL,
        method: "GET"
    }).then(function(response){
        console.log(response);
        const twoWeekTotal = setLast14(response);
        console.log(`twoWeekTotal = ${twoWeekTotal}`);
        const ratePer100000 = calculateRate(twoWeekTotal, californiaPopulationData["San Diego"]);
        console.log(`Rate per 100,000 = ${ratePer100000}`);

        const rate = $(`<p>Current infection rate per 100,000: ${ratePer100000}</p>`);
        info.append(rate);
    })




    
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



//STANDALONE FUNCTIONS

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

  
  function calculateRate(incidence, population) {
      return (parseInt(incidence)/parseInt(population))*100000;
  }

  function findMostRecent(dataset, date){
      const timestamp = date.format("YYYY-MM-DD");
      let index = -1;
    for (let i=0; i<dataset.length; i++){
        console.log(dataset[i].date);
        console.log(timestamp);
        if (dataset[i].date === timestamp) {
            console.log("found it!");
            console.log(dataset[i]);
            newData = dataset[i];
            index = i;
            return newData;

        }
    }
    if (index === -1) {
        findMostRecent(dataset, date.add(-1, "days"));
    }
  }

  function setLast14(dataset){
    let total = 0;
    let index = dataset.length - 1;
    for (let i = 0; i<14; i++) {
        // console.log(`total = ${total} + ${parseInt(dataset[index].newcountconfirmed)}`);
        if (dataset[index].newcountconfirmed){
            total += parseInt(dataset[index].newcountconfirmed);
        }
        
        // console.log(`New total = ${total}`);
        index--;
        // console.log(i);
    }
    return total;
  }