var myMap = new Map();

async function getLatestData(myMap){
    //$ui.loading(true);
   

    var dayString = getDate();
    myMap.set("today",dayString);
    var count = 0;
    var month = new Date().getMonth() + 1;
    if(month < 10){
        month = "0" + month;
    }
    
    // if($file.exists("log.txt")) {
        var read = $file.read("log.txt").string;
        console.log("read: " + read)
        var readArray = read.split("\n")
        console.log("readArray: " + readArray)
        var initialDate = readArray[0]
        console.log("initialDate: " + initialDate)
        if(initialDate !== dayString){
            $file.delete("log.txt");
        } 
        if(!read.includes(dayString)){
            $file.write({
                data: $data({"string": read + "\n" + trimmedData}),
                path: "log.txt"
            });
        }
    // } else {
    //     $file.write({
    //         data: $data({"string":  dayString + "\n" + trimmedData}),
    //         path: "log.txt"
    //     });
    // }
    
    var userChosenDate = new Date().getFullYear() + "-" + month +"-01";
    myMap.set("userChosenDate", userChosenDate);
    console.log(myMap.get("userChosenDate"));

    var resp = await $http.get({url:"https://forex.1forge.com/1.0.3/convert?from=USD&to=CNH&quantity=1&api_key=B05CfqpfYeiNzCB75GcbltJjXSwkp7PL"});
    var data = resp.data.value;
    var trimmedData = data.toFixed(4)
    console.log("the latest data: " + trimmedData);
    
    // myMap.set("realTime", trimmedData);
    //$ui.loading(false);
    getLocalData(trimmedData, myMap);
    
    $ui.toast("Updating ... ");
    // initiate(userChosenDate);
    //console.log("real time data: " + myMap.get("realTime"));
    
}


async function initiateDataBase(dateString){
    console.log("dateString: " + dateString)
    if(dateString == undefined){
        var month = new Date().getMonth() + 1;
        if(month < 10){
            month = "0" + month;
        }
        var date = new Date().getFullYear() + "-" + month +"-01";
        myMap.set("userChosenDate", date);
    } else {
        var date = dateString;
        myMap.set("userChosenDate", date);
    }
    

    // check if the data.txt exist
    if(!$file.exists("data.txt")){
        $file.write({
            data: $data({"string": "data:"}),
            path: "data.txt"
        });
    } else {
        var read = $file.read("data.txt").string;
        
        if(read.length === 0){
            $file.write({
                data: $data({"string": "data:"}),
                path: "data.txt"
            });
        }
    }
    
    // if(typeof(dateString) !== undefined){
        var dataLog = $file.read("data.txt").string;
        dataLog = dataLog.split("\n");
        console.log("dataLog: " + dataLog);
        console.log("userChosenDate: " + date);
        if(dataLog.length < 2){
            var link = "https://openexchangerates.org/api/historical/" + date + ".json?app_id=c4f2db781a184eb6b6a6fc90d238791c"
            var resp = await $http.get(link);
            var data = resp.data.rates.CNY;
            var trimmedData = data.toFixed(4);
            console.log("initla data chosen by user " + data);
            var read = $file.read("data.txt").string;
            console.log("read: " + read);
            $file.write({
                data: $data({"string": read + "\n" + date + " " + trimmedData}),
                path: "data.txt"
            });
        }
    // }

    var read = $file.read("data.txt").string;
    console.log("initial element in the data file: " + read);
    console.log("the file starts with 'data:'? : " + read.includes("data:"));

    if(read.includes("data:")){
        console.log("split the data file into array: " + read.split("\n"));
        console.log("make sure the length is right: " + read.split("\n").length);
        if(read.split("\n").length > 1){
            // first we have to check the historical data
            // check if the data in the database correspond to the latest exchange rate.
            var latestInDataBase = checkDataBase();
            console.log("latestInDataBase: " + latestInDataBase);
            // var latestDataInDataBaseDay = latestInDataBase[3];
            // var latestDataInDataBaseMonth = latestInDataBase[4];
            // var currentDay = latestInDataBase[1];
            // var currentMonth = latestInDataBase[2];
            //console.log(currentDay -1 + " " + currentMonth + " " + latestDataInDataBaseDay + " " + latestDataInDataBaseMonth);
            var diff = latestInDataBase[0];
            console.log("check the diff: " + diff);
            if(diff > 1){
                var currentDay = latestInDataBase[1];
                var currentMonth = latestInDataBase[2];
                var latestDataInDataBaseDay = latestInDataBase[3];
                var latestDataInDataBaseMonth = latestInDataBase[4];
                
                var dayList = createDateArray(new Date(new Date().getFullYear(), currentMonth, currentDay), new Date(new Date().getFullYear(),latestDataInDataBaseMonth, latestDataInDataBaseDay));
                console.log("check the day list: " + dayList);
                for(var i = 0; i < dayList.length; i++){
                    var link = "https://openexchangerates.org/api/historical/" + dayList[i] + ".json?app_id=c4f2db781a184eb6b6a6fc90d238791c"
                    console.log("check the link: " + link);
                    var resp = await $http.get(link);
                    var data = resp.data.rates.CNY;
                    var trimmedData = data.toFixed(4);
                    console.log("check the trimmed data: " + trimmedData);
                    var read = $file.read("data.txt").string;
                    $file.write({
                       data: $data({"string": read + "\n" + dayList[i] + " " + trimmedData}),
                       path: "data.txt"
                   });
                }
                
            } 
        }
        $ui.toast("Loading ... ");
        
    }
}

//getCurrentData(dayString);


async function initiateData() {
    var userChosenDate = getCachedData();
    var link = "https://openexchangerates.org/api/historical/" + userChosenDate + ".json?app_id=c4f2db781a184eb6b6a6fc90d238791c"
    var resp = await $http.get(link);
    var data = resp.data.rates.CNY;
    var trimmedData = data.toFixed(4);
    console.log("initial data chosen by user " + data);
    var read = $file.read("data.txt").string;
    $file.write({
        data: $data({"string": read + "\n" + userChosenDate + " " + trimmedData}),
        path: "data.txt"
    });
    
}


async function checkHistoricalData(){
    if(!$file.exists("data.txt")){
        var create = $file.write({
            data: $data({"string": "data:"}),
            path: "data.txt"
        });
    }
    var data = checkDataBase();
    //console.log(data);
    var diff = data[0];

    if(diff === 0){
        $ui.alert("all the data are up-to-date");
    } else {
        getHistoricalData(data);
    }

}

async function getHistoricalData(data){
    var currentDay = data[1];
    var currentMonth = data[2];
    var latestDataInDataBaseDay = data[3];
    var latestDataInDataBaseMonth = data[4];
    
    var dayList = createDateArray(new Date(new Date().getFullYear(), currentMonth, currentDay), new Date(new Date().getFullYear(),latestDataInDataBaseMonth, latestDataInDataBaseDay));
    console.log(dayList);
    for(var i = 0; i < dayList.length; i++){
        var link = "https://openexchangerates.org/api/historical/" + dayList[i] + ".json?app_id=c4f2db781a184eb6b6a6fc90d238791c"
        var resp = await $http.get(link);
        var data = resp.data.rates.CNY;
        var trimmedData = data.toFixed(4);
        console.log(data);
        var read = $file.read("data.txt").string;
        var write = $file.write({
           data: $data({"string": read + "\n" + dayList[i] + " " + trimmedData}),
           path: "data.txt"
       });
    }
}
//getHistoricalData();

// check the missing data in the database
// return the difference between current date and the latest data in the database
// return the trimmed day and month 
function checkDataBase(){
    
    if($file.exists("data.txt")){
        var database = $file.read("data.txt").string.split("\n");
        console.log("database: " + database)
        var length = database.length;
        console.log("length: " + length);

        if(length >= 2){
            var latestDateInDataBase = database[database.length - 1];
            console.log("latestDateInDataBase: " + latestDateInDataBase);
            // console.log(length);
            //console.log(database);
            var currentDate = getDate();
        
            // if the currentDate we get equals the latest data in the database, we do nothing
            // else we have to calculate the difference in days and grab the missing data and add them to the database
        
            // we have to check if the day or month starts with 0,
            // if so, we have to slice it away, then compare
            // otherwise, we compare directly
        
            var currentDay = currentDate.split("-")[2];
            var currentMonth = currentDate.split("-")[1];
            var currentDayTrim = trimDay(currentDay);
            var currentMonthTrim = trimMonth(currentMonth);
            //var current = new Date(2018, currentMonth - 1, currentDay);
            //console.log(currentDate);
        
            
            var latestDataInDataBaseDay = latestDateInDataBase.split("-")[2].split(" ")[0];
            console.log("latestDataInDataBaseDay: " + latestDataInDataBaseDay);
            var latestDataInDataBaseMonth = latestDateInDataBase.split("-")[1];
            console.log("latestDataInDataBaseMonth: " + latestDataInDataBaseMonth);
        
            //console.log(currentDay, currentMonth, latestDataInDataBaseDay, latestDataInDataBaseMonth);
            var latestDataInDataBaseDayTrim = trimDay(latestDataInDataBaseDay);
            var latestDataInDataBaseMonthTrim = trimMonth(latestDataInDataBaseMonth);
            //console.log(latestDataInDataBaseMonthTrim - 1, latestDataInDataBaseDayTrim, currentMonthTrim - 1, currentDayTrim);
            var diff = timeDifference(new Date(2018, latestDataInDataBaseMonthTrim - 1, latestDataInDataBaseDayTrim), new Date(2018, currentMonthTrim - 1, currentDayTrim));
            //console.log(diff);
            return new Array(diff, currentDayTrim, currentMonthTrim, latestDataInDataBaseDayTrim, latestDataInDataBaseMonthTrim);
        }
    } else {
        $file.write({
            data: $data({"string": "data"}),
            path: "data.txt"
        });
        $ui.alert("file doesn't exist!");
    }
}
//checkDataBase();

function trend(){
    var change = $cache.get("percentChange");
    myMap.set("change", change)
    return (change > 0)

}

// return date in string
function getDate(){
    var date = new Date();
    var month = date.getMonth() + 1;;
    var day = date.getDate();
    var year = date.getFullYear();
    if(month < 10){
        month = "0" + month;
    }

    if(day < 10){
        day = "0" + day;
    }

    return year + "-" + month + "-" + day;
}

// trim the string day if it starts with "0"
function trimDay(currentDay){
    if(currentDay.startsWith("0")){
        currentDay = currentDay.substr(1);
    }
    return currentDay;
}

// trim the string month if it starts with "0"
function trimMonth(currentMonth){
    if(currentMonth.startsWith("0")){
        currentMonth = currentMonth.substr(1);
    }
    return currentMonth;
}
//console.log(trimMonth("08"));


// calculate the time difference
function timeDifference(day1, day2){
    // get day1 and day2 in ms
    var day1MS = day1.getTime();
    var day2MS = day2.getTime();

    var differenceInMS = day2MS - day1MS;

    return Math.round(differenceInMS / (1000 * 60 * 60 * 24));
}

// find the duplicates in the database
function hasDuplicates(data){
    var read = $file.read("data.txt").string;
    return read.includes(data);
}

// create an array of Date() between current date and the original date in the data.txt
function createDateArray(current, original){
    var dateArray = new Array();

    // get the current date and original date in millisecond.
    var currentMS = current.getTime();
    var originalMS = original.getTime();


    while((originalMS + 1000 * 60 * 60 * 24) !== currentMS ){
        originalMS += 1000 * 60 * 60 * 24;
        var changed = new Date(originalMS);
        var changedMonth = changed.getMonth();
        var changedDay = changed.getDate();
        if(changedMonth < 10){
            changedMonth = "0" + changedMonth;
        }
    
        if(changedDay < 10){
            changedDay = "0" + changedDay;
        }

        var newDate = changed.getFullYear()+ "-" + changedMonth + "-" + changedDay;
        dateArray.push(newDate);
    }
    return dateArray;
    
}




function getLocalData(trimmedData, myMap){
    myMap.set("realTime", trimmedData);
    console.log("real time (test): " + myMap.get("realTime"));
    
    var realtime = myMap.get("realTime")
    //console.log(" prev: " + myMap.get("prev"))
    var percentage = (realtime - myMap.get("prev")) / myMap.get("prev");
    myMap.set("percentage", percentage);
    myMap.set("prev", realtime);
    //console.log("prev + percentChange"+ $cache.get("prev") + " " + $cache.get("percentChange"))
    var realtime = myMap.get("realTime");
    if(realtime > myMap.get("lMax")){
        myMap.set("lMax", realtime)
    } else if (realtime < myMap.get("lMin")){
        myMap.set("lMin", realtime)   
    }
    
    console.log("lMax: " + myMap.get("lMax") + " lMin: " + myMap.get("lMin") + " prev: " + myMap.get("prev") +  " percentage: " + myMap.get("percentage").toFixed(3))
}



function getGlobalData(myMap){
    var max = 0;
    var min = 100;
    var total = 0;
    var readFile = $file.read("data.txt").string;
    readFile = readFile.split("\n");
    var stats = new Array();
    //var date = new Array();
    for(var i = 1; i < readFile.length; i++){
        stats.push(readFile[i].split(" ")[1]);

        //date.push(readFile[i].split(" ")[0])
        //console.log();
    }

    for(var element of stats){
        total += parseFloat(element);
    }

    myMap.set("total", total);
    console.log("total: " + total)
    for(var stat of stats){
        if(stat > max){
            max = stat; 
        }
    }
    myMap.set("gMax", max);


    for(var stat of stats){
        if(stat < min){
            min = stat;
            
        }
    }
    myMap.set("gMin", min);

    myMap.set("avg", (myMap.get("total") / (readFile.length - 1)).toFixed(3))
    console.log("gMax: " + myMap.get("gMax") + " gMin: " + myMap.get("gMin") + " avg: " + myMap.get("avg") + " total: " + total)
}
//console.log("real time: " + myMap.get("realTime"))

function getTrend(myMap){
    var percent = myMap.get("percentage");
    myMap.set("trend", percent >= 0)
}

module.exports = {
    getLatestData: getLatestData,
    initiateDataBase: initiateDataBase,
    getHistoricalData: getHistoricalData,
    getGlobalData: getGlobalData,
    getLocalData: getLocalData,
    getTrend: getTrend,
    myMap: myMap
}