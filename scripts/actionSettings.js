var data = require("scripts/data.js");
var myMap = data.myMap;

function activeSettingMenu(indexPath, myMap){
    var row = indexPath.row;
    var section = indexPath.section;
    if(section === 0){
        if(row === 0){
            // currently, the date pick is still problematic
            // as I cannot get the chosen date from user
            // and the props cannot be modified for some reason.
            // I have to set the max date to be the current date
            // only allow user to roll back

            $ui.push({
                props: {
                    title: "Choose a starting date",
                    max: new Date(new Date().getFullYear, new Date().getMonth + 1, new Date().getDate),
                    interval: "10"  
                },
                views: [{
                    type: "date-picker",
                    layout: function(make) {
                      make.left.top.right.equalTo(0)
                    },
                    events: {
                        changed: function(sender){
                            //$("date-label").text = sender.date
                            var year;
                            var month;
                            var date;
                            year = sender.date.getFullYear();
                            if(sender.date.getMonth() < 9){
                                month = "0" + (sender.date.getMonth() + 1);
                            } else {
                                month = sender.date.getMonth() + 1;
                            }

                            if(sender.date.getDate() < 10){
                                date = "0" + sender.date.getDate();
                            } else{
                                date = sender.date.getDate();
                            }
                            var dateString = year + "-" + month + "-" + date;
                            $ui.alert({
                                title: "Do you want to start with " + dateString,
                                actions: [
                                    {
                                      title: "OK",
                                      handler: function() {
                                          // save the log to settings file
                                        myMap.set("userChosenData", dateString)
                                        //$cache.set("dateString", dateString);
                                        console.log($file.exists("data.txt"));
                                        if($file.exists("data.txt")){
                                            $file.delete("data.txt");
                                        }
                                        console.log($file.exists("data.txt"));
                                        data.initiate(dateString);
                                        $ui.toast("Setting up database ... ",2);                                       
                                      }
                                    },
                                    {
                                      title: "Cancel",
                                      handler: function() {
                                        
                                      }
                                    }
                                  ]
                            });
                            console.log(year + "-" + month + "-" + date);

                            // this date will be using to start the database
                        }
                    }
                  },
                  
                ]
            });
        } else if (row === 2){
            $ui.alert({
                title: "Cleaning cache",
                message: "This operation could not be undone",
                fontSize: $font(12),
                actions: [
                    {
                      title: "OK",
                      handler: function() {
                        $ui.toast("Cleaning ...", 1.5);

                        $file.delete("data.txt")
                                          
                      }
                    },
                    {
                      title: "Cancel",
                      handler: function() {
                        
                      }
                    }
                  ]
            });
        } else if (row === 1){
        }
    } else {
        if(row === 0){
            $ui.push({
                props: {
                    title: "About me"
                },
                views: [{
                    type: "label",
                    props: {
                        text: "I'm John from University of Washington",
                        textColor: $color("black"),
                        autoFontSize: true,
                        align: $align.center
                    },
                    layout: function(make, view) {
                        make.center.equalTo(0)
                    },
                }]
            });
        } else if (row == 1){
            //$system.mailto("zhouz46@uw.edu")
            $app.openURL("mailto:zhouz46@uw.edu")
        } else if (row === 3) {
            $ui.push({
                props: {
                    title: "Contribution"
                },
                views: [{
                    type: "label",
                    props: {
                      font: $font("Avenir-Medium", 18),
                      text: "Thank you those people who helped me test the app and gave me instructive suggestions!\n\n Special Thanks: \n Yuxin Han \n@就叫Dexter吧 \n @丽水\nIvy Wu\n @蜗牛",
                      lines: 0,
                      align: $align.center
                    },
                    layout: function(make, view) {
                      make.top.equalTo(-350)
                      make.left.equalTo(45)
                      make.height.equalTo(1000)
                      make.width.equalTo(280)
                    }
                  }]
            });
        } else if (row === 2){
            $ui.action("Thank you for using Currency Checker, \n a light-weighted script that helps you keep track of the currency exchange rates you care about.\n In the current version, we only support the exchange between USD and CNY, as keeping track of the real-time exchange rate requires high memory usage. But in the future updates, we may bring other currencies to you. \n Also plotting the line graph of fluctuation of exchange rate in this version is very unstable. As a result, I temporarily deactivate this feature. I will bring this crucial feature back in the upcoming update. \n \n Known Issues: \n - In this version, you will see “undefined” or “NaN” from time to time. This is because the app is still initiating its database. You can relaunch the app or click the “run” button on the right corner of JSBox environment and reenter the app.\n - The push of notification on Currency Checker requires the app to run in the background, which may cause higher battery consumption. If you want to save battery life or don’t want to receive any notifications, you can choose to turn off the notification in the Settings page. ")
        }
    }
    //console.log(section + " " + row);
}

// var userLog = new Array();
// function write(userLog, data){
//     userLog.push(data)
//     return userLog
// }
// var log = write(userLog, "111");
// console.log(log)

module.exports = {
    activeSettingMenu: activeSettingMenu
}