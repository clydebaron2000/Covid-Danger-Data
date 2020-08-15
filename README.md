# The Rona Go/No-Go 

[Covid Evac](https://clydebaron2000.github.io/Project1/)
![alt-text](xxxx.gif)

Table of Contents:

- [Section 1: Introduction](#introduction)
- [Section 2: User Story](#userstory)
- [Section 2: Usage](#usage)
- [Section 3: Acknowledgments](#acknowledgments)
- [Section 4: License](#license)

## Introduction

As California enters it's peak during the annual wildfire season, there is added complexity and pressure to plan ahead given the current state of the Covid-19 outbreak. Families who are forced to evacuate will need an emergency plan. This project seeks to deliver a simple app that leverages data from a variety of APIs to deliver up to date visuals of Covid-19 and wildfire situations in California. It features a clean, user interactive map, indicating Covid-19 hotspots and allows users to make informed decisions on where to evacuate to.


## User Story

As a family with members at risk for Covid-19, we want to know which areas in the state we can safely evacuate to during a wildfire, so we can make informed decisions and evacuate accordingly. 


## APIs

[The Covid Tracking Project](www.covidtracking.com/data/api):
- Used to retrieve Covid-19 data by county and state
- please note that due to unacceptably long wait times to return queries from Covid Tracking Project, this project relies on a CSV to API hosting solution that delivers the same up to date information from a different query address.

[The United States Census Bureau](https://www.census.gov/data/developers.html)
- Used for population data at state and county levels

[Cal Fire](fire.ca.gov):
- Used for location and containment status of wildfires


## Usage ##

The source files for this quiz can be accessed through cloning the GitHub repo. The link above will take you to the deployed project. All APIs used can be accessed by developers applying for free API keys. The Google maps API is only free up to a certain amount of usage, based on a credit they apply monthly to accounts.

This project relies on Covid-19 data from 


## Acknowledgments

* SVG map of California by Wikimedia Commons user [Thadius856](https://commons.wikimedia.org/wiki/User:Thadius856).
 
Resources from [CalFire](https://www.readyforwildfire.org/):
- Prepare for Wildfire Action Plan
- Emergency Supply Kit
- Alerts 

Resources from [California Department of Public Health](https://covid19.ca.gov/):
- Emergency Supply Kit
- Alerts 

Resources from [CDC](https://www.cdc.gov):
- Covid 19 Symptoms
- Covid health information