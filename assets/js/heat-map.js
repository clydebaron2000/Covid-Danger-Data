"use strict"

const californiaCounties = [
    { "name": "Alameda", "censusCode": "001", "population": "" },
    { "name": "Alpine", "censusCode": "003", "population": "" },
    { "name": "Amador", "censusCode": "005", "population": "" },
    { "name": "Butte", "censusCode": "007", "population": "" },
    { "name": "Calaveras", "censusCode": "009", "population": "" },
    { "name": "Colusa", "censusCode": "011", "population": "" },
    { "name": "Contra Costa", "censusCode": "013", "population": "" },
    { "name": "Del Norte", "censusCode": "015", "population": "" },
    { "name": "El Dorado", "censusCode": "017", "population": "" },
    { "name": "Fresno", "censusCode": "019", "population": "" },
    { "name": "Glenn", "censusCode": "021", "population": "" },
    { "name": "Humboldt", "censusCode": "023", "population": "" },
    { "name": "Imperial", "censusCode": "025", "population": "" },
    { "name": "Inyo", "censusCode": "027", "population": "" },
    { "name": "Kern", "censusCode": "029", "population": "" },
    { "name": "Kings", "censusCode": "031", "population": "" },
    { "name": "Lake", "censusCode": "033", "population": "" },
    { "name": "Lassen", "censusCode": "035", "population": "" },
    { "name": "Los Angeles", "censusCode": "037", "population": "" },
    { "name": "Madera", "censusCode": "039", "population": "" },
    { "name": "Marin", "censusCode": "041", "population": "" },
    { "name": "Mariposa", "censusCode": "043", "population": "" },
    { "name": "Mendocino", "censusCode": "045", "population": "" },
    { "name": "Merced", "censusCode": "047", "population": "" },
    { "name": "Modoc", "censusCode": "049", "population": "" },
    { "name": "Mono", "censusCode": "051", "population": "" },
    { "name": "Monterey", "censusCode": "053", "population": "" },
    { "name": "Napa", "censusCode": "055", "population": "" },
    { "name": "Nevada", "censusCode": "057", "population": "" },
    { "name": "Orange", "censusCode": "059", "population": "" },
    { "name": "Placer", "censusCode": "061", "population": "" },
    { "name": "Plumas", "censusCode": "063", "population": "" },
    { "name": "Riverside", "censusCode": "065", "population": "" },
    { "name": "Sacramento", "censusCode": "067", "population": "" },
    { "name": "San Benito", "censusCode": "069", "population": "" },
    { "name": "San Bernardino", "censusCode": "071", "population": "" },
    { "name": "San Diego", "censusCode": "073", "population": "" },
    { "name": "San Francisco", "censusCode": "075", "population": "" },
    { "name": "San Joaquin", "censusCode": "077", "population": "" },
    { "name": "San Luis Obispo", "censusCode": "079", "population": "" },
    { "name": "San Mateo", "censusCode": "081", "population": "" },
    { "name": "Santa Barbara", "censusCode": "083", "population": "" },
    { "name": "Santa Clara", "censusCode": "085", "population": "" },
    { "name": "Santa Cruz", "censusCode": "087", "population": "" },
    { "name": "Shasta", "censusCode": "089", "population": "" },
    { "name": "Sierra", "censusCode": "091", "population": "" },
    { "name": "Siskiyou", "censusCode": "093", "population": "" },
    { "name": "Solano", "censusCode": "095", "population": "" },
    { "name": "Sonoma", "censusCode": "097", "population": "" },
    { "name": "Stanislaus", "censusCode": "099", "population": "" },
    { "name": "Sutter", "censusCode": "101", "population": "" },
    { "name": "Tehama", "censusCode": "103", "population": "" },
    { "name": "Trinity", "censusCode": "105", "population": "" },
    { "name": "Tulare", "censusCode": "107", "population": "" },
    { "name": "Tuolumne", "censusCode": "109", "population": "" },
    { "name": "Ventura", "censusCode": "111", "population": "" },
    { "name": "Yolo", "censusCode": "113", "population": "" },
    { "name": "Yuba", "censusCode": "115", "population": "" },
]

const CaliforniaStatewideCountiesID = "999";




//AJAX QUERIES - county population from US Census, historical Covid data by CA county

//query current and past county data
let censusCountyURL = "https://api.census.gov/data/2019/pep/population?key=45876004e2fbfafe56615f040f2172ee79c77643&get=POP&in=state:06&for=county:*";

$.ajax({
    url: censusCountyURL,
    method: "GET"
}).then(function (response) {
    locateCountyPopulation(response);
})



// let csvCounty = "San Diego"
// let csvURL = "https://data.ca.gov/api/3/action/datastore_search?resource_id=926fd08f-cc91-4828-af38-bd45de97f8c3&q=" + csvCounty;

let csvSource = "https://data.ca.gov/dataset/590188d5-8545-4c93-a9a0-e230f0db7290/resource/926fd08f-cc91-4828-af38-bd45de97f8c3/download/statewide_cases.csv";
let csvURL = "https://c19d.zzzkitty.com/?source=" + csvSource;

$.ajax({
    url: csvURL,
    method: "GET"
}).then(function (response) {
    getReady();

    for (let county of californiaCounties) {
        console.log(county.name);
        let recentIndex = findMostRecent(response, county.name)
        console.log(`Recent Index: ${recentIndex}`);

        let totalNewCases = setLast14(response, recentIndex);
        console.log(`14 day cases: ${totalNewCases}`);

        let ratePer = calculateRate(totalNewCases, county.population);
        console.log(`Rate per 100,000: ${ratePer.toFixed(0)}`);

        let newClass = findRateGroup(ratePer);
        $(`#${county.name.replace(/\s/g, "_")}`).addClass(newClass);
    }
})







//remove loading gif when ajax query is returned
function getReady() {
    $("#loading").css("display", "none");

    $("path").addClass("hover");
    $("polyline").addClass("hover");
    $("polygon").addClass("hover");
}



//calculate rate of incidence per 100,000 population
function calculateRate(incidence, population) {
    return (parseInt(incidence) / parseInt(population)) * 100000;
}


//find index of most recent data from covid county data query
function findMostRecent(dataset, countyName) {
    let index = -1;
    let turns = 0;

    while (index < 0 && turns < 4) {
        for (let i = 0; i < dataset.length; i++) {
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

//return total of all new cases in the last two weeks
function setLast14(dataset, indexNum) {
    let total = 0;
    let index = indexNum;
    for (let i = 0; i < 14; i++) {
        // console.log(`total = ${total} + ${parseInt(dataset[index].newcountconfirmed)}`);
        if (dataset[index].newcountconfirmed) {
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
    for (let county of californiaCounties) {
        console.log(county.name);
        for (let array of dataset) {
            if (county.censusCode === array[2]) {
                county.population = array[0];
            }
        }
    }
}