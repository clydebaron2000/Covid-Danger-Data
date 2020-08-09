
const californiaPopulationData = {
    "Alameda":"1671329",
    "Alpine":"1129",
    "Amador":"39752",
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
    "San Bernardino":"2180085",
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

let wholeData;
        




        //query current and past county data

    // let csvCounty = "San Diego"
    // let csvURL = "https://data.ca.gov/api/3/action/datastore_search?resource_id=926fd08f-cc91-4828-af38-bd45de97f8c3&q=" + csvCounty;

    let csvSource = "https://data.ca.gov/dataset/590188d5-8545-4c93-a9a0-e230f0db7290/resource/926fd08f-cc91-4828-af38-bd45de97f8c3/download/statewide_cases.csv";
    let csvURL = "https://c19d.zzzkitty.com/?source=" + csvSource;

    $.ajax({
        url: csvURL,
        method: "GET"
    }).then(function(response){
        getReady();
        console.log(response);
        wholeData = response;

        for (let key in californiaPopulationData) {
            let recentIndex = findMostRecent(response, moment().add(-1, "days"), key);
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

  function findMostRecent(dataset, date, countyName){
      const timestamp = date.format("YYYY-MM-DD");
      let index = -1;
    for (let i=0; i<dataset.length; i++){
        if (dataset[i].date === timestamp && dataset[i].county === countyName) {
            console.log("found it!");
            console.log(dataset[i]);
            newData = dataset[i];
            console.log(timestamp);
            index = i;
            return index;

        }
    }
    if (index === -1) {
        for (let i=0; i<dataset.length; i++){
            if (dataset[i].date === moment(date).add(-1, "days") && dataset[i].county === countyName) {
                console.log("found it!");
                console.log(dataset[i]);
                newData = dataset[i];
                console.log(timestamp);
                index = i;
                return index;
    
            }
        }
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