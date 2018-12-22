var view = require("scripts/view.js");
var data = require("scripts/data.js");

function main() {   
    view.generateMainViewObjects(data.myMap, data.calc);  
    view.mainView();
    
    $delay(0, function() {
      data.getLatestData(data.myMap, true);  
      data.initiateDataBase();
    });
  

    $thread.background({
      delay: 0,
      handler: function() {
        data.getGlobalData(data.myMap)
      }
    });

    if($device.networkType === 0){
      $ui.alert({
        title: "You are offline. Please check your internet connection",
        message: ""
    });
    }
}
  
  module.exports = {
    main: main
  }