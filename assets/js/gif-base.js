"use strict"
const californiaCounties = [{ "name": "Alameda", "censusCode": "001", "population": "" }, { "name": "Alpine", "censusCode": "003", "population": "" }, { "name": "Amador", "censusCode": "005", "population": "" }, { "name": "Butte", "censusCode": "007", "population": "" }, { "name": "Calaveras", "censusCode": "009", "population": "" }, { "name": "Colusa", "censusCode": "011", "population": "" }, { "name": "Contra Costa", "censusCode": "013", "population": "" }, { "name": "Del Norte", "censusCode": "015", "population": "" }, { "name": "El Dorado", "censusCode": "017", "population": "" }, { "name": "Fresno", "censusCode": "019", "population": "" }, { "name": "Glenn", "censusCode": "021", "population": "" }, { "name": "Humboldt", "censusCode": "023", "population": "" }, { "name": "Imperial", "censusCode": "025", "population": "" }, { "name": "Inyo", "censusCode": "027", "population": "" }, { "name": "Kern", "censusCode": "029", "population": "" }, { "name": "Kings", "censusCode": "031", "population": "" }, { "name": "Lake", "censusCode": "033", "population": "" }, { "name": "Lassen", "censusCode": "035", "population": "" }, { "name": "Los Angeles", "censusCode": "037", "population": "" }, { "name": "Madera", "censusCode": "039", "population": "" }, { "name": "Marin", "censusCode": "041", "population": "" }, { "name": "Mariposa", "censusCode": "043", "population": "" }, { "name": "Mendocino", "censusCode": "045", "population": "" }, { "name": "Merced", "censusCode": "047", "population": "" }, { "name": "Modoc", "censusCode": "049", "population": "" }, { "name": "Mono", "censusCode": "051", "population": "" }, { "name": "Monterey", "censusCode": "053", "population": "" }, { "name": "Napa", "censusCode": "055", "population": "" }, { "name": "Nevada", "censusCode": "057", "population": "" }, { "name": "Orange", "censusCode": "059", "population": "" }, { "name": "Placer", "censusCode": "061", "population": "" }, { "name": "Plumas", "censusCode": "063", "population": "" }, { "name": "Riverside", "censusCode": "065", "population": "" }, { "name": "Sacramento", "censusCode": "067", "population": "" }, { "name": "San Benito", "censusCode": "069", "population": "" }, { "name": "San Bernardino", "censusCode": "071", "population": "" }, { "name": "San Diego", "censusCode": "073", "population": "" }, { "name": "San Francisco", "censusCode": "075", "population": "" }, { "name": "San Joaquin", "censusCode": "077", "population": "" }, { "name": "San Luis Obispo", "censusCode": "079", "population": "" }, { "name": "San Mateo", "censusCode": "081", "population": "" }, { "name": "Santa Barbara", "censusCode": "083", "population": "" }, { "name": "Santa Clara", "censusCode": "085", "population": "" }, { "name": "Santa Cruz", "censusCode": "087", "population": "" }, { "name": "Shasta", "censusCode": "089", "population": "" }, { "name": "Sierra", "censusCode": "091", "population": "" }, { "name": "Siskiyou", "censusCode": "093", "population": "" }, { "name": "Solano", "censusCode": "095", "population": "" }, { "name": "Sonoma", "censusCode": "097", "population": "" }, { "name": "Stanislaus", "censusCode": "099", "population": "" }, { "name": "Sutter", "censusCode": "101", "population": "" }, { "name": "Tehama", "censusCode": "103", "population": "" }, { "name": "Trinity", "censusCode": "105", "population": "" }, { "name": "Tulare", "censusCode": "107", "population": "" }, { "name": "Tuolumne", "censusCode": "109", "population": "" }, { "name": "Ventura", "censusCode": "111", "population": "" }, { "name": "Yolo", "censusCode": "113", "population": "" }, { "name": "Yuba", "censusCode": "115", "population": "" }, ]
let statewideData = [];
let timeLapseMap = [];
let wholeData;
//AJAX QUERIES - county population from US Census, historical Covid data by CA county
//query current and past county data
let censusCountyURL = "https://api.census.gov/data/2019/pep/population?key=45876004e2fbfafe56615f040f2172ee79c77643&get=POP&in=state:06&for=county:*";
$.ajax({
        url: censusCountyURL,
        method: "GET"
    }).then(function(response) {
        locateCountyPopulation(response);
    })
    // let csvCounty = "San Diego"
    // let csvURL = "https://data.ca.gov/api/3/action/datastore_search?resource_id=926fd08f-cc91-4828-af38-bd45de97f8c3&q=" + csvCounty;
let csvSource = "https://data.ca.gov/dataset/590188d5-8545-4c93-a9a0-e230f0db7290/resource/926fd08f-cc91-4828-af38-bd45de97f8c3/download/statewide_cases.csv";
let csvURL = "https://c19d.zzzkitty.com/?source=" + csvSource;
$.ajax({
        url: csvURL,
        method: "GET"
    }).then(function(response) {
        wholeData = response;
        setTimeLapseMap(response);
        setMainMap(response);
        getReady();
    })
    //FUNCTIONS 
    //CALCULATION FUNCTIONS
    //calculate rate of incidence per 100,000 population
function calculateRate(incidence, population) {
    return (parseInt(incidence) / parseInt(population)) * 100000;
}
//return total of all new cases in the last two weeks
function setLast14(dataset, indexNum) {
    let total = 0;
    let index = indexNum;
    for (let i = 0; i < 14; i++) {
        if (dataset[index].newcountconfirmed) {
            total += parseInt(dataset[index].newcountconfirmed);
        }
        index--;
    }
    return total;
}
//return total of all new cases in the last two weeks
function setLast7(dataset, indexNum) {
    let total = 0;
    let index = indexNum;
    for (let i = 0; i < 7; i++) {
        if (dataset[index].newcountconfirmed) {
            total += parseInt(dataset[index].newcountconfirmed);
        }
        index--;
    }
    return total;
}
//return total of all new cases in the last two weeks
function setNext14(dataset, indexNum) {
    let total = 0;
    let index = indexNum;
    for (let i = 0; i < 14; i++) {
        if (dataset[index]) {
            if (dataset[index].newcountconfirmed) {
                total += parseInt(dataset[index].newcountconfirmed);
            }
        }
        index++;
    }
    return total;
}
//return total of all new cases in the last two weeks
function setNext7(dataset, indexNum) {
    let total = 0;
    let index = indexNum;
    for (let i = 0; i < 7; i++) {
        if (dataset[index]) {
            if (dataset[index].newcountconfirmed) {
                total += parseInt(dataset[index].newcountconfirmed);
            }
        }
        index++;
    }
    return total;
}
//DISPLAY FUNCTIONS
//display county info on click
function displayCounty(e) {
    const info = $("#info");
    info.empty();
    info.css("display", "block");
    const countyName = $(this).attr("id").replace(/_/g, " ");
    const thisCounty = findCounty(countyName);
    const countyHeader = $(`<h5>${thisCounty.name} County</h5>`);
    info.append(countyHeader);
    info.append($("<hr>"))
    const countyRecent = $(`<p><strong>Cases in last 14 days: </strong>${thisCounty.recentCases}</p>`);
    info.append(countyRecent);
    const countyInfectionRate = $(`<p><strong>Infections/100,000: </strong>${thisCounty.infectionRate.toFixed(1)}</p>`);
    info.append(countyInfectionRate);
    const infectionInfo = $("<p class='fine-print'>Infection rate calculated by new cases in past 14 days over total population, times 100,000</p>")
    info.append(infectionInfo);
    const countyFatalityRate = $(`<p><strong>Fatality rate: </strong>${thisCounty.fatalityRate.toFixed(1)}%</p>`);
    info.append(countyFatalityRate);
    const fatalityInfo = $("<p class='fine-print'>Fatality rate calculated by total deaths over total cases, times 100</p>");
    info.append(fatalityInfo);
    // chart.append($("<canvas id='chartjs-0' class='chartjs' style='display: block;float:right'>"));
    // new Chart(document.getElementById("chartjs-0"), {
    //     "type": "line",
    //     "data": {
    //         "labels": xAxisLables,
    //         "datasets": [{
    //             "label": "°" + tempUnits,
    //             "pointStyle": houlyIcons,
    //             pointHoverRadius: 20,
    //             pointHitRadius: 20,
    //             "data": data,
    //             "fill": false,
    //             "borderColor": "rgba(0, 0, 0,0)",
    //             "lineTension": 0.0
    //         }, {
    //             "label": "Condition",
    //             "hidden": true,
    //             "data": tooltipLabels,
    //         }]
    //     },
    //     "options": {
    //         responsive: true,
    //         title: {
    //             display: true,
    //             text: '24-Hour Forecast (GMT' + (parseInt(timezoneOffset) / 60 / 70) + ")",
    //             fontSize: 14,
    //             fontStyle: 'bold',
    //         },
    //         legend: {
    //             display: false
    //         },
    //         scales: {
    //             yAxes: [{
    //                 scaleLabel: {
    //                     display: true,
    //                     labelString: "Temperature (°" + tempUnits + ")"
    //                 },
    //             }]
    //         },
    //         tooltips: {
    //             callbacks: {
    //                 title: function(tooltipItem, data) {
    //                     return tooltipLabels[tooltipItem[0]['index']];
    //                 },
    //                 label: function(tooltipItem, data) {
    //                     return data['datasets'][0]['data'][tooltipItem['index']] + "°" + tempUnits;
    //                 },
    //                 afterLabel: function(tooltipItem, data) {
    //                     var out = "";
    //                     out += houlyIconDescription[tooltipItem['index']] + "\n";
    //                     out += "Wind Speed: " + hourlyWindSpeed[tooltipItem['index']] + distanceUnits;
    //                     return out;
    //                 }
    //             }
    //         }
    //     }
    // });
}

function setTimeLapseMap(response) {
    let howManyCounties = 0;
    for (let county of californiaCounties) {
        const newArray = [];
        const length = findMostRecent(response, county.name) - findFirst(response, county.name);
        let addToIndex = 0;
        for (let i = 0; i < length / 7; i++) {
            const newObject = {};
            //county name
            newObject.name = county.name;
            //index of first county record
            let recentIndex = findFirst(response, county.name)
            newObject.firstIndex = recentIndex;
            //beginning and end dates for data stretch
            newObject.startDate = response[recentIndex + addToIndex].date;
            if (response[recentIndex + addToIndex + 6]) {
                newObject.endDate = response[recentIndex + addToIndex + 6].date;
            }
            //set newCountConfirmed for 7 day period
            let newCountConfirmed = setNext7(response, recentIndex + addToIndex);
            newObject.recentCases = newCountConfirmed;
            //set totalCountConfirmed for 7 day period
            let totalCountConfirmed = locateLastTotalInPeriod(response, recentIndex + addToIndex);
            //set rate of infection for 14 day period
            let ratePer = calculateRate(setNext14(response, recentIndex + addToIndex), county.population);
            newObject.infectionRate = ratePer.toFixed(2);
            //total fatality rate
            let totalDeaths = parseInt(response[recentIndex + addToIndex].totalcountdeaths);
            let totalCases = parseInt(response[recentIndex + addToIndex].totalcountconfirmed);
            let fatalityRate = totalDeaths / totalCases * 100;
            if (isNaN(fatalityRate)) {
                fatalityRate = 0;
            }
            newObject.fatalityRate = fatalityRate;
            newObject.totalCountConfirmed = totalCases;
            newObject.totalDeaths = totalDeaths;
            //set color corresponding to rate of infection
            newObject.color = findRateGroup(ratePer, county.name);
            //move on to next chunk of data
            addToIndex += 7;
            newArray.push(newObject);
        }
        timeLapseMap.push(newArray);
    }
}

function setMainMap(response) {
    let newArray = [{ period: 7, date: "current", totalNewCases: 0, totalCountDeaths: 0, totalCasesConfirmed: 0 }, { period: 14, date: "current", totalNewCases: 0, totalCountDeaths: 0, totalCasesConfirmed: 0 }];
    for (let county of californiaCounties) {
        let recentIndex = findMostRecent(response, county.name)
        let totalNewCases = setLast14(response, recentIndex);
        county.recentCases = totalNewCases;
        newArray[1].totalNewCases += totalNewCases;
        let totalNewCases7Day = setLast7(response, recentIndex);
        newArray[0].totalNewCases += totalNewCases7Day;
        let ratePer14 = calculateRate(totalNewCases, county.population);
        county.infectionRate = ratePer14;
        const totalCountDeaths = parseInt(response[recentIndex].totalcountdeaths);
        const totalCasesConfirmed = parseInt(response[recentIndex].totalcountconfirmed);
        let fatalityRate = totalCountDeaths / totalCasesConfirmed * 100;
        county.fatalityRate = fatalityRate;
        newArray[0].totalCountDeaths += totalCountDeaths;
        newArray[1].totalCountDeaths += totalCountDeaths;
        newArray[0].totalCasesConfirmed += totalCasesConfirmed;
        newArray[1].totalCasesConfirmed += totalCasesConfirmed;
        findRateGroup(ratePer14, county.name);
    }
    newArray[0].fatalityRate = (newArray[0].totalCountDeaths / newArray[0].totalCasesConfirmed * 100).toFixed(2);
    newArray[1].fatalityRate = (newArray[1].totalCountDeaths / newArray[1].totalCasesConfirmed * 100).toFixed(2);
    statewideData.push(newArray);
}

function runTimeLapse(response) {
    let data = response;
    let i = 0;
    const timeLapse = setInterval(function(data) {
        for (let k = 0; k < timeLapseMap.length; k++) {
            findRateGroup(timeLapseMap[k][i].infectionRate, timeLapseMap[k][i].name);
        }
        i++;
        if (i >= timeLapseMap[0].length - 2) { //-2 because the last section of timeLapseMap may not contain a full 14 days, so it's prefereable to use MainMap, which relies on the most recent 14 days data
            clearInterval(timeLapse)
            setMainMap(wholeData);
        }
    }, 2000)
}
//LOCATION FUNCTIONS
//find index of most recent data from covid county data query
function findMostRecent(dataset, countyName) {
    return dataset.map(el => el.county).lastIndexOf(countyName);
}
//find index of earliest data from covid county data query
function findFirst(dataset, countyName) {
    return dataset.map(el => el.county).indexOf(countyName);
}
//search queryData.message for a particular county
function findCounty(needle) {
    for (let item of californiaCounties) {
        if (item.name === needle) {
            return item
        }
    }
};
//find class for heat map color
function findRateGroup(number, countyName) {
    let rate;
    if (number <= 1) {
        rate = "r1";
    } else if (number <= 5) {
        rate = "r5";
    } else if (number <= 15) {
        rate = "r15";
    } else if (number <= 30) {
        rate = "r30";
    } else if (number <= 50) {
        rate = "r50";
    } else if (number <= 100) {
        rate = "r100";
    } else if (number <= 150) {
        rate = "r150";
    } else if (number <= 200) {
        rate = "r200";
    } else if (number <= 500) {
        rate = "r500";
    } else {
        rate = "rMore";
    }
    $(`#${countyName.replace(/\s/g, "_")}`).removeClass();
    $(`#${countyName.replace(/\s/g, "_")}`).addClass("hover");
    $(`#${countyName.replace(/\s/g, "_")}`).addClass(rate);
    return rate;
}
//get county code from californiaCountyIDs, and find the matching population data from Census API response
function locateCountyPopulation(dataset) {
    for (let county of californiaCounties) {
        for (let array of dataset) {
            if (county.censusCode === array[2]) {
                county.population = array[0];
            }
        }
    }
}

function locateLastTotalInPeriod(dataset, indexNum) {
    let total = 0;
    for (let i = 0; i < 7; i++) {
        if (dataset[indexNum + i]) {
            return dataset[indexNum + i].totalcountconfirmed;
        }
    }
}
//remove loading gif when ajax query is returned
function getReady() {
    $("#loading").css("display", "none");
    $("path").on("click", displayCounty);
    $("polyline").on("click", displayCounty);
    $("polygon").on("click", displayCounty);
    $("path").addClass("hover");
    $("polyline").addClass("hover");
    $("polygon").addClass("hover");
    //-------------
    // clyde's new code
    var countyAutofill = {};
    for (var county of californiaCounties) {
        const text = county.name;
        countyAutofill[text] = null;
    }
    $("#weekIndex")[0].max = timeLapseMap.length;
    $("#weekIndex").val(timeLapseMap.length);
    $('input.autocomplete').autocomplete({
        data: countyAutofill,
    });
    $("#userCity").on("input click paste change ", function(event) {
        event.preventDefault();
        const input = $(this).val();
        $("#" + input).trigger("click");
    });
    var interval;
    $("#play").on("click", function(event) {
        event.preventDefault();
        console.log($(this));
        $("#pause").attr("style", "display:inline");
        $("#play").attr("style", "display:none");
        var range = $("#weekIndex");
        console.log("playyy");
        var i = range.val();
        if (i >= range[0].max) {
            i = 0;
        }
        const timeInterval = 50;
        interval = setInterval(function() {
            range.val(i++);
            // displaying indivdual
            if (i > range[0].max) {
                clearInterval(interval);
                clearTimeout(interval);
                $("#pause").attr("style", "display:none");
                $("#play").attr("style", "display:inline");
                //display all
            }
        }, timeInterval);
    });
    $("#pause").on("click", function(event) {
        event.preventDefault();
        clearInterval(interval);
        clearTimeout(interval);
        $("#pause").attr("style", "display:none");
        $("#play").attr("style", "display:inline");
    });
}