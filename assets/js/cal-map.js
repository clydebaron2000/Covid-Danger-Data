
let queryData;
let countyData;
let ready = false;
let newData;




//AJAX QUERIES



//query US census 2019 data
let censusURL = "https://api.census.gov/data/2019/pep/population?key=45876004e2fbfafe56615f040f2172ee79c77643&get=POP&in=state:06&for=county:003"

$.ajax({
    url: censusURL,
    method: "GET"
}).then(function(response){
    console.log(response);
})


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




const californiaPopulationData = {
    "Alameda":"1671329",
    "Alpine":"1129",
    "Amador County":"39752",
    "Butte":"219186",
    "Calaveras":"45905",
    "Colusa":"21547",
    "Contra Costa":"1153526",
    "Del Norte":"27812",
    "El Dorado":"192843",
    "Fresno":"999101",
    "Glenn":"28393",
    "Humboldt":"135558",
    "Imperial":"181245",
    "Inyo":"18039",
    "Kern":"900202",
    "Kings":"152940",
    "Lake":"64386",
    "Lassen":"30573",
    "Los Angeles":"10039107",
    "Madera":"157327",
    "Marin":"258826",
    "Mariposa":"17203",
    "Mendocino":"86749",
    "Merced":"277680",
    "Modoc":"8841",
    "Mono":"14444",
    "Monterey":"434061",
    "Napa":"137744",
    "Nevada":"99755",
    "Orange":"3175692",
    "Placer":"398329",
    "Plumas":"18807",
    "Riverside":"2470546",
    "Sacramento":"1552058",
    "San Benito":"62808",
    "San Bernadino":"2180085",
    "San Diego":"3338330",
    "San Francisco":"881549",
    "San Joaquin":"762148",
    "San Luis Obispo":"283111",
    "San Mateo":"766573",
    "Santa Barbara":"446499",
    "Santa Clara":"1927852",
    "Santa Cruz":"273213",
    "Shasta":"180080",
    "Sierra":"3005",
    "Siskiyou":"43539",
    "Solano":"447643",
    "Sonoma":"494336",
    "Stanislaus":"550660",
    "Sutter":"96971",
    "Tehama":"65084",
    "Trinity":"12285",
    "Tulare":"466195",
    "Tuolumne":"54478",
    "Ventura":"846006",
    "Yolo":"220500",
    "Yuba":"78668",
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
        console.log(`total = ${total} + ${parseInt(dataset[index].newcountconfirmed)}`);
        if (dataset[index].newcountconfirmed){
            total += parseInt(dataset[index].newcountconfirmed);
        }
        
        console.log(`New total = ${total}`);
        index--;
        console.log(i);
    }
    return total;
  }