
const californiaPopulationData = {
    "Alameda":"",
    "Alpine":"",
    "Amador":"",
    "Butte":"",
    "Calaveras":"",
    "Colusa":"",
    "Contra Costa":"",
    "Del Norte":"",
    "El Dorado":"",
    "Fresno":"",
    "Glenn":"",
    "Humboldt":"",
    "Imperial":"",
    "Inyo":"",
    "Kern":"",
    "Kings":"",
    "Lake":"",
    "Lassen":"",
    "Los Angeles":"",
    "Madera":"",
    "Marin":"",
    "Mariposa":"",
    "Mendocino":"",
    "Merced":"",
    "Modoc":"",
    "Mono":"",
    "Monterey":"",
    "Napa":"",
    "Nevada":"",
    "Orange":"",
    "Placer":"",
    "Plumas":"",
    "Riverside":"",
    "Sacramento":"",
    "San Benito":"",
    "San Bernardino":"",
    "San Diego":"",
    "San Francisco":"",
    "San Joaquin":"",
    "San Luis Obispo":"",
    "San Mateo":"",
    "Santa Barbara":"",
    "Santa Clara":"",
    "Santa Cruz":"",
    "Shasta":"",
    "Sierra":"",
    "Siskiyou":"",
    "Solano":"",
    "Sonoma":"",
    "Stanislaus":"",
    "Sutter":"",
    "Tehama":"",
    "Trinity":"",
    "Tulare":"",
    "Tuolumne":"",
    "Ventura":"",
    "Yolo":"",
    "Yuba":"",
}

const californiaCountyIDs = {
    "Alameda":"001",
    "Alpine":"003",
    "Amador":"005",
    "Butte":"007",
    "Calaveras":"009",
    "Colusa":"011",
    "Contra Costa":"013",
    "Del Norte":"015",
    "El Dorado":"017",
    "Fresno":"019",
    "Glenn":"021",
    "Humboldt":"023",
    "Imperial":"025",
    "Inyo":"027",
    "Kern":"029",
    "Kings":"031",
    "Lake":"033",
    "Lassen":"035",
    "Los Angeles":"037",
    "Madera":"039",
    "Marin":"041",
    "Mariposa":"043",
    "Mendocino":"045",
    "Merced":"047",
    "Modoc":"049",
    "Mono":"051",
    "Monterey":"053",
    "Napa":"055",
    "Nevada":"057",
    "Orange":"059",
    "Placer":"061",
    "Plumas":"063",
    "Riverside":"065",
    "Sacramento":"067",
    "San Benito":"069",
    "San Bernardino":"071",
    "San Diego":"073",
    "San Francisco":"075",
    "San Joaquin":"077",
    "San Luis Obispo":"079",
    "San Mateo":"081",
    "Santa Barbara":"083",
    "Santa Clara":"085",
    "Santa Cruz":"087",
    "Shasta":"089",
    "Sierra":"091",
    "Siskiyou":"093",
    "Solano":"095",
    "Sonoma":"097",
    "Stanislaus":"099",
    "Sutter":"101",
    "Tehama":"103",
    "Trinity":"105",
    "Tulare":"107",
    "Tuolumne":"109",
    "Ventura":"111",
    "Yolo":"113",
    "Yuba":"115",
}

const CaliforniaStatewideCountiesID = "999";

let wholeData;
let countyCensus;
        




        //query current and past county data
let censusCountyURL = "https://api.census.gov/data/2019/pep/population?key=45876004e2fbfafe56615f040f2172ee79c77643&get=POP&in=state:06&for=county:*";

$.ajax({
    url: censusCountyURL,
    method: "GET"
}).then(function(response){
    locateCountyPopulation(response);
})






    // let csvCounty = "San Diego"
    // let csvURL = "https://data.ca.gov/api/3/action/datastore_search?resource_id=926fd08f-cc91-4828-af38-bd45de97f8c3&q=" + csvCounty;

    let csvSource = "https://data.ca.gov/dataset/590188d5-8545-4c93-a9a0-e230f0db7290/resource/926fd08f-cc91-4828-af38-bd45de97f8c3/download/statewide_cases.csv";
    let csvURL = "https://c19d.zzzkitty.com/?source=" + csvSource;

    $.ajax({
        url: csvURL,
        method: "GET"
    }).then(function(response){
        getReady();
        wholeData = response;

        for (let key in californiaPopulationData) {
            console.log(key);
            let recentIndex = findMostRecent(response, key);
            console.log(`Recent Index: ${recentIndex}`);

            let totalNewCases = setLast14(response, recentIndex);
            console.log(`14 day cases: ${totalNewCases}`);

            let ratePer = calculateRate(totalNewCases, californiaPopulationData[key]);
            console.log(`Rate per 100,000: ${ratePer.toFixed(0)}`);

            let newClass = findRateGroup(ratePer);
            $(`#${key.replace(/\s/g, "_")}`).addClass(newClass);
        }
        
        

        // const twoWeekTotal = setLast14(response);
        // console.log(`twoWeekTotal = ${twoWeekTotal}`);
        // const ratePer100000 = calculateRate(twoWeekTotal, californiaPopulationData["San Diego"]);
        // console.log(`Rate per 100,000 = ${ratePer100000}`);

        // const rate = $(`<p>Current infection rate per 100,000: ${ratePer100000}</p>`);
        // info.append(rate);
    })







      //remove loading gif when ajax query is returned
  function getReady() {
    ready = true;
    $("#loading").css("display", "none");

    $("path").addClass("hover");
    $("polyline").addClass("hover");
    $("polygon").addClass("hover");
    
  }

  
function calculateRate(incidence, population) {
    return (parseInt(incidence)/parseInt(population))*100000;
}

function findMostRecent(dataset, countyName){
    let index = -1;
    let turns = 0;

    while (index < 0 && turns < 4) {
        for (let i=0; i<dataset.length; i++){
            if (dataset[i].date === moment().subtract(turns, "days").format("YYYY-MM-DD") && dataset[i].county === countyName) {
                console.log(moment().subtract(turns, "days").format("YYYY-MM-DD"));
                index = i;
                return index;
            }
        }
        turns++;
        console.log("");
    }
  }

  function setLast14(dataset, indexNum){
    let total = 0;
    let index = indexNum;
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

  //find class for heat map color
  function findRateGroup(number) {
    if (number <= 1) {
        return "r1";
    } else if (number <= 5) {
        return "r5";
    } else if (number <= 15) {
        return "r15";
    } else if (number <= 30) {
        return "r30";
    } else if (number <= 50) {
        return "r50";
    } else if (number <= 100) {
        return "r100";
    } else if (number <= 150) {
        return "r150";
    } else if (number <= 200) {
        return "r200";
    } else if (number > 200) {
        return "r500"
    } else {
        return false;
    }
  }


  //get county code from californiaCountyIDs, and find the matching population data from Census API response
  function locateCountyPopulation(dataset) {
      for (let countyName in californiaPopulationData){
          console.log(countyName);
          for (array of dataset) {
              if (californiaCountyIDs[countyName] === array[2]) {
                californiaPopulationData[countyName] = array[0];
              }
          }
      }
  }