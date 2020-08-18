"use strict"
const californiaCounties = [{ "name": "Alameda", "censusCode": "001", "population": "" }, { "name": "Alpine", "censusCode": "003", "population": "" }, { "name": "Amador", "censusCode": "005", "population": "" }, { "name": "Butte", "censusCode": "007", "population": "" }, { "name": "Calaveras", "censusCode": "009", "population": "" }, { "name": "Colusa", "censusCode": "011", "population": "" }, { "name": "Contra Costa", "censusCode": "013", "population": "" }, { "name": "Del Norte", "censusCode": "015", "population": "" }, { "name": "El Dorado", "censusCode": "017", "population": "" }, { "name": "Fresno", "censusCode": "019", "population": "" }, { "name": "Glenn", "censusCode": "021", "population": "" }, { "name": "Humboldt", "censusCode": "023", "population": "" }, { "name": "Imperial", "censusCode": "025", "population": "" }, { "name": "Inyo", "censusCode": "027", "population": "" }, { "name": "Kern", "censusCode": "029", "population": "" }, { "name": "Kings", "censusCode": "031", "population": "" }, { "name": "Lake", "censusCode": "033", "population": "" }, { "name": "Lassen", "censusCode": "035", "population": "" }, { "name": "Los Angeles", "censusCode": "037", "population": "" }, { "name": "Madera", "censusCode": "039", "population": "" }, { "name": "Marin", "censusCode": "041", "population": "" }, { "name": "Mariposa", "censusCode": "043", "population": "" }, { "name": "Mendocino", "censusCode": "045", "population": "" }, { "name": "Merced", "censusCode": "047", "population": "" }, { "name": "Modoc", "censusCode": "049", "population": "" }, { "name": "Mono", "censusCode": "051", "population": "" }, { "name": "Monterey", "censusCode": "053", "population": "" }, { "name": "Napa", "censusCode": "055", "population": "" }, { "name": "Nevada", "censusCode": "057", "population": "" }, { "name": "Orange", "censusCode": "059", "population": "" }, { "name": "Placer", "censusCode": "061", "population": "" }, { "name": "Plumas", "censusCode": "063", "population": "" }, { "name": "Riverside", "censusCode": "065", "population": "" }, { "name": "Sacramento", "censusCode": "067", "population": "" }, { "name": "San Benito", "censusCode": "069", "population": "" }, { "name": "San Bernardino", "censusCode": "071", "population": "" }, { "name": "San Diego", "censusCode": "073", "population": "" }, { "name": "San Francisco", "censusCode": "075", "population": "" }, { "name": "San Joaquin", "censusCode": "077", "population": "" }, { "name": "San Luis Obispo", "censusCode": "079", "population": "" }, { "name": "San Mateo", "censusCode": "081", "population": "" }, { "name": "Santa Barbara", "censusCode": "083", "population": "" }, { "name": "Santa Clara", "censusCode": "085", "population": "" }, { "name": "Santa Cruz", "censusCode": "087", "population": "" }, { "name": "Shasta", "censusCode": "089", "population": "" }, { "name": "Sierra", "censusCode": "091", "population": "" }, { "name": "Siskiyou", "censusCode": "093", "population": "" }, { "name": "Solano", "censusCode": "095", "population": "" }, { "name": "Sonoma", "censusCode": "097", "population": "" }, { "name": "Stanislaus", "censusCode": "099", "population": "" }, { "name": "Sutter", "censusCode": "101", "population": "" }, { "name": "Tehama", "censusCode": "103", "population": "" }, { "name": "Trinity", "censusCode": "105", "population": "" }, { "name": "Tulare", "censusCode": "107", "population": "" }, { "name": "Tuolumne", "censusCode": "109", "population": "" }, { "name": "Ventura", "censusCode": "111", "population": "" }, { "name": "Yolo", "censusCode": "113", "population": "" }, { "name": "Yuba", "censusCode": "115", "population": "" }, ]
let statewideData = [];
let timeLapseMap = [];
let wholeData;
let statewidePopulation;
//AJAX QUERIES - county population from US Census, historical Covid data by CA county
//query current and past county data
function getData() {
    let censusSateURL = "https://api.census.gov/data/2019/pep/population?key=45876004e2fbfafe56615f040f2172ee79c77643&get=POP&for=state:06"
    $.when($.ajax({
        url: censusSateURL,
        method: "GET"
    })).then(function(response) {
        statewidePopulation = parseInt(response[1][0]);
    })
    let censusCountyURL = "https://api.census.gov/data/2019/pep/population?key=45876004e2fbfafe56615f040f2172ee79c77643&get=POP&in=state:06&for=county:*";
    $.when($.ajax({
        url: censusCountyURL,
        method: "GET"
    })).then(function(response) {
        locateCountyPopulation(response);
    })
    let csvSource = "https://data.ca.gov/dataset/590188d5-8545-4c93-a9a0-e230f0db7290/resource/926fd08f-cc91-4828-af38-bd45de97f8c3/download/statewide_cases.csv";
    let csvURL = "https://c19d.zzzkitty.com/?source=" + csvSource;
    $.when($.ajax({
        url: csvURL,
        method: "GET"
    })).then(function(response) {
        wholeData = response;
        // setMainMap(response, $("#weekIndex")[0].max);
        console.log("setting timelapseMap");
        setTimeLapseMap(response);
        setStatewideData(response);
        console.log("getting thesecounties");
        getTheseCounties();
        getReady();
        // localStorage.setItem("countyRate", JSON.stringify(californiaCounties));
    })
}
//FUNCTIONS 
//CALCULATION FUNCTIONS
//calculate rate of incidence per 100,000 population
function calculateRate(incidence, population) {
    return (parseInt(incidence) / parseInt(population)) * 100000;
}
//return total of all new cases in the last two weeks
function setLast14(dataset, indexNum, countyName) {
    let total = 0;
    let index = indexNum;
    for (let i = 0; i < 14; i++) {
        if (dataset[index] && dataset[index].county == countyName) {
            if (dataset[index].newcountconfirmed) {
                let additional = parseInt(dataset[index].newcountconfirmed);
                total += parseInt(additional);
            }
        } else {
            total += 0;
        }
        index--;
    }
    return total;
}
//return total of all new cases in the last two weeks
function setLast7(dataset, indexNum, countyName) {
    let total = 0;
    let index = indexNum;
    for (let i = 0; i < 7; i++) {
        if (dataset[index] && dataset[index].county == countyName) {
            if (dataset[index].newcountconfirmed) {
                total += parseInt(dataset[index].newcountconfirmed);
            }
        } else {
            total + 0;
        }
        index--;
    }
    return total;
}
//DISPLAY FUNCTIONS
//pull a given county's info out of timeLapseMap
function findFullCountyDataByName(name) {
    for (var county of timeLapseMap) {
        if (county[0].name === name) return county;
    }
}
//display county info on click
function displayCounty(e) {
    const info = $("#info");
    info.empty();
    info.css("display", "flow-root");
    // const countyName = $(this).attr("id").replace(/_/g, " ");
    const countyName = e;
    const thisCounty = findCounty(countyName);
    if (thisCounty === undefined) {
        info.append($("<p>").text("Please click a county."));
        return;
    }
    const countyHeader = $(`<h5>${thisCounty.name} County</h5>`);
    info.append(countyHeader);
    info.append($("<hr>"));
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
    //adding chart
    const rawChartData = findFullCountyDataByName(countyName);
    var datesArray = [];
    //change infection 14 day array to the right values
    var infection14RateArray = [];
    var pointColors = [];
    var caseCountPerPeriod = [];
    var totalNewCasesArray = [];
    // console.log(rawChartData);
    for (var i = 0; i < rawChartData.length; i++) {
        datesArray.push(rawChartData[i].endDate);
        const infectionRate = rawChartData[i].infectionRate.toFixed(2);
        infection14RateArray.push(infectionRate);
        var color;
        if (infectionRate < 0) color = "white"
        else if (infectionRate < 16) color = "#5AFFB9";
        else if (infectionRate < 51) color = "#F6FF37";
        else if (infectionRate < 101) color = "#FFC537";
        else if (infectionRate < 201) color = "#FF342B";
        else if (infectionRate < 501) color = "#83161C";
        else color = "#4F0000";
        pointColors.push(color);
        totalNewCasesArray.push(rawChartData[i].totalNewCases14);
        caseCountPerPeriod.push(rawChartData[i].recentCases);
    }
    var chart = $("<div id='chart'>");
    chart.append($("<canvas id='chartjs-0' class='chartjs' style='display: block;aria-label='" + `14 day infection rates for ${countyName}` + "' role='img'>"));
    chart.append($("<br>"));
    chart.append($("<canvas id='chartjs-1' class='chartjs' style='display: block;aria-label='" + `14 day new cases for ${countyName}` + "' role='img'>"));
    info.append(chart);
    new Chart(document.getElementById("chartjs-0"), {
        "type": "line",
        "data": {
            "labels": datesArray,
            "datasets": [{
                "label": "14 day infection rate",
                pointHoverRadius: 5,
                pointHitRadius: 5,
                "fill": false,
                "data": infection14RateArray,
                pointBackgroundColor: pointColors,
                pointBorderColor: pointColors,
                "borderColor": "grey",
                "lineTension": 0.5,
                borderWidth: .5
            }]
        },
        "options": {
            responsive: true,
            title: {
                display: true,
                text: `14 day infection rates for ${countyName}`,
                fontSize: 14,
                fontStyle: 'bold',
            },
            legend: {
                display: false
            },
            scales: {
                xAxes: [{
                    type: 'time',
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 11
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: "Rate of infection per 100k"
                    },
                }]
            }
        }
    });
    new Chart(document.getElementById("chartjs-1"), {
        "type": "bar",
        "data": {
            "labels": datesArray,
            "datasets": [{
                "label": "14 day new cases",
                HoverRadius: 5,
                pointHitRadius: 5,
                "data": totalNewCasesArray,
                backgroundColor: pointColors,
                borderColor: "grey",
                borderWidth: .01,
                width: 10
            }]
        },
        "options": {
            responsive: true,
            title: {
                display: true,
                text: `14 day new cases for ${countyName}`,
                fontSize: 14,
                fontStyle: 'bold',
            },
            legend: {
                display: false
            },
            scales: {
                xAxes: [{
                    type: 'time',
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 11
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: "New cases"
                    },
                }]
            }
        }
    });
}
//set the data for variable timeLapseMap from response
function setTimeLapseMap(response) {
    for (let county of californiaCounties) {
        const newArray = [];
        const length = findMostRecent(response, county.name) - findFirst(response, county.name);
        let addToIndex = -6;
        for (let i = 0; i < length / 7; i++) {
            const newObject = {};
            //county name
            newObject.name = county.name;
            //index of first county record
            let recentIndex = parseInt(findMostRecent(response, county.name));
            let currentIndex = recentIndex + addToIndex;
            //beginning and end dates for data stretch
            newObject.endDate = response[currentIndex + 6].date;
            if (response[currentIndex] && response[currentIndex].county == county.name) {
                newObject.startDate = response[currentIndex].date;
            }
            //set newCountConfirmed for 7 day period
            let newCountConfirmed = setLast7(response, currentIndex, county.name);
            newObject.recentCases = newCountConfirmed;
            //set newCountConfirmed for 14 day period
            let newCountConfirmed14 = setLast14(response, currentIndex + 6, county.name);
            //set rate of infection for 14 day period
            let ratePer = calculateRate(newCountConfirmed14, county.population);
            newObject.totalNewCases14 = newCountConfirmed14;
            newObject.infectionRate = ratePer;
            //total fatality rate
            let totalDeaths = parseInt(response[currentIndex + 6].totalcountdeaths);
            let totalCases = parseInt(response[currentIndex + 6].totalcountconfirmed);
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
            addToIndex -= 7;
            newArray.push(newObject);
        }
        timeLapseMap.push(newArray);
        localStorage.setItem("historicRate", JSON.stringify(timeLapseMap));
    }
}

function setMainMap(response) {
    let newObject = { period: 7, date: "current", totalNewCases14: 0, totalNewCases7: 0, totalCountDeaths: 0, totalCasesConfirmed: 0 }
    for (let county of californiaCounties) {
        let recentIndex = findMostRecent(response, county.name)
        let totalNewCases = setLast14(response, recentIndex, county.name);
        county.recentCases = totalNewCases;
        newObject.totalNewCases14 += totalNewCases;
        let totalNewCases7Day = setLast7(response, recentIndex, county.name);
        newObject.totalNewCases7 += totalNewCases7Day;
        let ratePer14 = calculateRate(totalNewCases, county.population);
        county.infectionRate = ratePer14;
        const totalCountDeaths = parseInt(response[recentIndex].totalcountdeaths);
        const totalCasesConfirmed = parseInt(response[recentIndex].totalcountconfirmed);
        let fatalityRate = totalCountDeaths / totalCasesConfirmed * 100;
        county.fatalityRate = fatalityRate;
        newObject.totalCountDeaths += totalCountDeaths;
        newObject.totalCasesConfirmed += totalCasesConfirmed;
        county.color = findRateGroup(ratePer14, county.name);
        findRateGroup(ratePer14, county.name);
    }
    newObject.fatalityRate = (newObject.totalCountDeaths / newObject.totalCasesConfirmed * 100).toFixed(2);
    if (!statewideData[0]) {
        statewideData.push(newObject);
    }
}

function historicalMap(index, max) {
    max -= 1;
    if (index > max) { //-2 because the last section of timeLapseMap may not contain a full 14 days, so it's prefereable to use MainMap, which relies on the most recent 14 days data
        // setMainMap(wholeData);
        return;
    }
    for (let k = 0; k < timeLapseMap.length; k++) {
        const inverseIndex = max - parseInt(index);
        // findRateGroup(timeLapseMap[k][inverseIndex].infectionRate, timeLapseMap[k][inverseIndex].name);
    }
}

function setStatewideData(response) {
    //set potential length of data per county
    const dataLength = findMostRecent(response, "San Diego") - findFirst(response, "San Diego");
    let addToIndex = 6;
    let currentIndex = 0;
    for (let i = 0; i < Math.floor(dataLength / 7); i++) {
        //set new object for 7 day period
        const newObject = { "totalNewCases7": 0, "totalNewCases14": 0, "totalCasesConfirmed": 0, "totalCountDeaths": 0 };
        let totalCountDeaths;
        let totalCountConfirmed;
        for (let county of californiaCounties) {
            //index of first county record
            let recentIndex = parseInt(findFirst(response, county.name));
            currentIndex = recentIndex + addToIndex;
            if (currentIndex > response.length) {
                break;
            }
            //beginning and end dates for data stretch
            newObject.endDate = response[currentIndex].date;
            if (response[currentIndex - 6] && response[currentIndex - 6].county == county.name) {
                newObject.startDate = response[currentIndex - 6].date;
            }
            //set newCountConfirmed for 7 day period
            let newCountConfirmed7 = parseInt(setLast7(response, currentIndex, county.name));
            let newCountConfirmed14 = parseInt(setLast14(response, currentIndex, county.name));
            newObject.totalNewCases7 += newCountConfirmed7;
            newObject.totalNewCases14 += newCountConfirmed14;
            //set totalCountConfirmed for 7 day period
            totalCountConfirmed = parseInt(response[recentIndex + addToIndex].totalcountconfirmed);
            newObject.totalCasesConfirmed += totalCountConfirmed;
            //set totalCountDeaths for 7 day period
            totalCountDeaths = parseInt(response[recentIndex + addToIndex].totalcountdeaths);
            newObject.totalCountDeaths += totalCountDeaths;
        }
        let fatalityRate = totalCountDeaths / totalCountConfirmed * 100;
        if (isNaN(fatalityRate)) {
            fatalityRate = 0;
        }
        //set color corresponding to rate of infection
        // newObject.color = findRateGroup(ratePer, county.name);
        //move on to next chunk of data
        //infectionRate
        newObject.infectionRate = calculateRate(newObject.totalNewCases14, statewidePopulation).toFixed(2);
        addToIndex += 7;
        statewideData.push(newObject);
    }
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
    if (number <= 15) {
        rate = "r15";
    } else if (number <= 50) {
        rate = "r50";
    } else if (number <= 100) {
        rate = "r100";
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
//remove loading gif when ajax query is returned
function getReady() {
    console.log("getting ready");
    $(document).ready(function() {
        $(".dropdown-trigger").dropdown({
            belowOrigin: true
        });
        $('.collapsible').collapsible();
        var elems = document.querySelectorAll("input[type=range]");
        M.Range.init(elems);
    });
    var countyAutofill = {};
    for (var county of californiaCounties) {
        const text = county.name;
        countyAutofill[text] = 0;
    }
    //getting min width
    var weeksMeasured = timeLapseMap[0].length;
    for (var state of timeLapseMap) {
        weeksMeasured = Math.min(weeksMeasured, state.length);
    }
    $("#weekIndex")[0].max = weeksMeasured;
    $("#weekIndex").val(weeksMeasured);
    $('input.autocomplete').autocomplete({
        data: countyAutofill,
    });
    $("#topbarsearch").on("input click paste change ", function(event) {
        event.preventDefault();
        const input = $("#userCity").val();
        if (countyAutofill[input] === 0) displayCounty(input);
        return false;
    });
    var interval;
    $("#play").on("click", function(event) {
        event.preventDefault();
        $("#pause").attr("style", "display:inline");
        $("#play").attr("style", "display:none");
        var range = $("#weekIndex");
        var i = range.val();
        if (i >= range[0].max) {
            i = 0;
        }
        const timeInterval = 2500;
        interval = setInterval(function() {
            if (i >= range[0].max) {
                clearInterval(interval);
                clearTimeout(interval);
                $("#pause").attr("style", "display:none");
                $("#play").attr("style", "display:inline");
                //display all
            }
            // displaying indivdual
            range.val(i);
            range.trigger("input");
            i++
        }, timeInterval);
    });
    $("#pause").on("click", function(event) {
        event.preventDefault();
        clearInterval(interval);
        clearTimeout(interval);
        $("#pause").attr("style", "display:none");
        $("#play").attr("style", "display:inline");
    });
    $("#weekIndex").on("input", function() {
        const value = $(this).val();
        console.log("range value:" + value);
        let dataIndex = timeLapseMap[0].length - value - 2; // -2 because the some counties didn't report until two weeks after data collection started
        // historicalMap(value, $(this)[0].max);
        setMainMap(wholeData);
        // console.log("data index: " + dataIndex);
        drawMap(dataIndex)
    });
    $("#weekIndex").trigger("input");
}