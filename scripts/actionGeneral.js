var _action = require("scripts/actionSetting");

function activeMenu(index) {
    const trans = ["Checker", "Settings"]
    var dstViewId = trans[index]
  
    var viewId = $("content").views.filter(function(x) {
      return x.hidden == false
    })[0].info;

    console.log("viewId " + viewId + " " + "dstViewId " + dstViewId);

    // this segment of codes is credited to Ryann, the creator of Mtime Movie in JSBox
    // I don't quite understand the logic behind the code,
    // I spent two days working on jumping between two pages
    // and finally pinpoint to this segment of code that does the job
    // I tried to print out the viewId and dstViewId and tried to figure out why it works
    // the viewId is the page that user is not looking at
    // the dstViewId is the page that user is looking at.
    if (dstViewId == viewId) {
      var subViewId = $(viewId + "_list").views.filter(function(x) {
        return x.hidden == false
      })[0]
      if (subViewId.info == "search") {
        $(dstViewId + "_keyword").focus()
      } else {
        if (subViewId.data.length === 0) return
        subViewId.scrollTo({
          indexPath: $indexPath(0, 0)
        })
      }
    } else {
      var color = $color("darkGray")
      for (var i = 0; i < 2; i++) {
        $("menu").cell($indexPath(0, i)).views[0].views[0].tintColor = index == i ? color : $color("lightGray")
        $("menu").cell($indexPath(0, i)).views[0].views[1].textColor = index == i ? color : $color("lightGray")
      }
      $(viewId).hidden = true
      $(dstViewId).hidden = false
    }
  }

function activeSegment(index) {
    const trans = ["Checker", "Settings"]
    var dstViewId = trans[index]
    if (dstViewId == "Settings") {
      return
    }
  
    var viewId = $("content").views.filter(function(x) {
      return x.hidden == false
    })[0].info
  
    if (dstViewId == viewId) {
      $device.taptic(0)
      var subViewId = $(viewId + "_list").views.filter(function(x) {
        return x.hidden == false
      })[0]
      subViewId.hidden = true
      if (typeof(subViewId.next) != "undefined") {
        $(viewId + "_bar").index += 1
        subViewId.next.hidden = false
      } else {
        $(viewId + "_bar").index = 0
        subViewId.super.views[0].hidden = false
      }
    }
  }

module.exports = {
    activeMenu: activeMenu,
    activeSegment: activeSegment
}
