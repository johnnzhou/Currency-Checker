var actionSetting = require("scripts/actionSettings");
var actionGeneral = require("scripts/actionGeneral");
var data = require("scripts/data.js");


//console.log("view test: " + data.myMap.get("realTime"));


const template = [
  {
  type: "image",
  props: {
    id: "cover",
    
    radius: 3
  },
  layout: function(make, view) {
    //shadowRate(view)
    make.width.equalTo(30)
    make.top.bottom.inset(0)
    make.left.inset(0)
    
  }
},
{
  type: "label",
  props: {
    id: "fromTo",
    //text: "🇺🇸",
    font: $font("Avenir-Black",18),
    //bgcolor: $color("#F5F5F5"),
    autoFontSize: true
  },
  layout: function(make) {
    var preView = $("cover")
    make.left.equalTo(preView.right).offset(10)
    make.height.equalTo(18)
    make.top.inset(8)
    make.right.inset(5)
  }
},
{
  type: "label",
  props: {
    id: "currentRate",
    font: $font("Avenir-Black",14),
    textColor: $color("darkGray")
  },
  layout: function(make) {
    var preView = $("fromTo")
    make.top.equalTo(preView.bottom).offset(5)
    make.left.equalTo(preView.left)
    make.right.inset(5)
  }
},
{
  type: "label",
  props: {
    id: "extreme",
    font: $font("Avenir-Black",14),
    textColor: $color("#5D9CF5")
  },
  layout: function(make) {
    var preView = $("currentRate")
    make.top.equalTo(preView.bottom).offset(5)
    make.left.equalTo(preView.left)
    make.right.inset(5)
  }
},
{
  type: "label",
  props: {
    id: "changeRate",
    font: $font("Avenir-Black",14),
    textColor: $color("#CDC080")
  },
  layout: function(make){
    var preView = $("extreme")
    make.top.equalTo(preView.bottom).offset(5)
    make.left.equalTo(preView.left)
    make.right.inset(5)
  }
}
]



function generateMainViewObjects(myMap, calc) {
  Checker = {
    type: "view",
    props: {
      id: "Checker",
      info: "Checker",
      hidden: false
    },
    layout: $layout.fill,
    views: [{
        type: "menu",
        props: {
          id: "recent_bar",
          items: ["Recent", "Calculator"],
          tintColor: $color("tint")
        },
        layout: function(make) {
          make.height.equalTo(40)
          make.left.top.right.inset(0)
        },
        events: {
          changed: function(sender) {
            $("recent").hidden = true
            //$("comingsoon").hidden = true
            $("calc").hidden = true
            var idx = sender.index
            if (idx === 0) {
              $("recent").hidden = false
            } else {
              $("calc").hidden = false
            }
          }
        }
      },
      {
        type: "view",
        props: {
          id: "recent_list",
          info: "recent_list"
        },
        layout: function(make) {
          var preView = $("recent_bar")
          make.top.equalTo(preView.bottom)
          make.left.bottom.right.inset(0)
        },
        views: [
          {
            type: "list",
            props: {
              id: "recent",
              rowHeight: 110,
              template: template,
              data: [
                {
                  fromTo: {
                    text: "USD🇺🇸 - CNY🇨🇳"
                  },
                  // to: {
                  //   text:"To: CNY🇨🇳"
                  // },
                  currentRate: {
                    
                    text: "Real-time: "
                    
                  },
                  extreme: {
                    text: "Daily H: " + myMap.get("lMax") +  "         " + "Daily L: "  + myMap.get("lMin")
                  },
                  changeRate: {
                    text: "% Change: " + (myMap.get("percentage") * 100).toFixed(3) + "%"
                  }
                },
                {
                  fromTo: {
                    text: "USD🇺🇸 - JPY🇯🇵"
                  },
                  currentRate: {
                    
                    text: "Real-time: "  + 110.5131
                    
                  },
                  extreme: {
                    text: "Daily H: " + 110.990 + "         " + "Daily L: " + 111.010
                  },
                  changeRate: {
                    text: "% Change: " + "-0.429%"
                  }
                },
                {
                  fromTo: {
                    text: "CAD🇨🇦- CNY🇨🇳"
                  },
                  currentRate: {
                    
                    text: "Real-time: "  + 5.1997
                    
                  },
                  extreme: {
                    text: "Daily H: " + 5.193 + "         " + "Daily L: " + 5.218
                  },
                  changeRate: {
                    text: "% Change: " + "+0.53%"
                  }
                },
                {
                  fromTo: {
                    text: "CNY🇨🇳- JPY🇯🇵"
                  },
                  currentRate: {
                    
                    text: "Real-time: "  + 16.2223
                    
                  },
                  extreme: {
                    text: "Daily H: " + 16.3832 + "         " + "Daily L: " + 15.9474
                  },
                  changeRate: {
                    text: "% Change: " + "+0.15%"
                  }
                },
                {
                  fromTo: {
                    text: "HKD🇭🇰- CNY🇨🇳"
                  },
                  currentRate: {
                    
                    text: "Real-time: "  + 0.8717
                    
                  },
                  extreme: {
                    text: "Daily H: " + 0.8834 + "         " + "Daily L: " + 0.8664
                  },
                  changeRate: {
                    text: "% Change: " + "+0.14%"
                  }
                },
              ]
            },
            layout: $layout.fill,
            events: {
              didSelect: function(sender, indexPath, data) {
                detailView(myMap);
              },
              pulled: function(sender){
                data.getLatestData(myMap, true)
                
              }
            }
          },
          {
            type: "list",
            props: {
              id: "calc",
              info: "calc",
              hidden: true,
              rowHeight: 115,
              bgcolor: $color("#F9F9F9"),
              //data: [],
              //template: template,
              header: {
                type: "view",
                props: {
                  height: 40
                },
                views: [
                  {
                    type: "input",
                    props: {
                      type: $kbType.decimal,
                      text: "1",
                      font: $font("bold", 20),
                      align: $align.center,
                      clearButtonMode: 0,
                    },
                    layout: function(make) {
                      make.left.top.equalTo(10)
                      make.size.equalTo($size(120, 32))
                    },
                    events: {
                      changed: function(sender) {
                        calc(Number(sender.text))
                      }
                    }
                  },
                  {
                    type: "label",
                    props: {
                      text: "USD",
                      font: $font("bold", 20)
                    },
                    layout: function(make) {
                      var input = $("input")
                      make.left.equalTo(input.right).offset(10)
                      make.centerY.equalTo(input)
                    }
                  },
                  {
                    type: "label",
                    props: {
                      id: "result",
                      text: "CNY",
                      font: $font("bold", 20),
                      align: $align.right
                    },
                    layout: function(make) {
                      make.right.inset(10)
                      make.centerY.equalTo($("input"))
                    }
                  }
              ]
              }
            },
            layout: $layout.fill,
            events: {
              didSelect: function(sender, indexPath, data) {
                handleSelected(data)
              },
              didEndScrollingAnimation: function(sender) {
                // For focus() To Top
                $ui.animate({
                  duration: 0.2,
                  animation: function() {
                    sender.contentOffset = $point(0, 0)
                  }
                })
              }
            }
          }
        ]
      }
    ]
  }
  
  
  Settings = {
      type: "list",
      props: {
        id: "Settings",
        info: "Settings",
        hidden: true,
        footer: {
          type: "label",
          props: {
            height: 50
          },
          props: {
            text: "Designed and created by John Zhou \n @ University of Washington",
            lines: 0,
            font: $font("Avenir", 14),
            textColor: $color("#AAAAAA"),
            align: $align.center
          },
          layout: function(make){
            make.left.top.inset(0)
          }
        },
        data: [
          {
            title: "General",
            rows: ["Choose a starting date","Push Settings", "Clean cache"]
          },
          {
            title: "About",
            rows: ["About me","Feedback","FAQ","Contribution", "Version 1.0"]
          }
        ]
      },
      layout: $layout.fill,
      events: {
        didSelect: function(view, indexPath){
        actionSetting.activeSettingMenu(indexPath);
      },
      didEndScrollingAnimation: function(sender) {
        // For focus() To Top
        $ui.animate({
          duration: 0.2,
          animation: function() {
            sender.contentOffset = $point(0, 0)
          }
        })
      }
    }
  }
}


function detailView(myMap) {
  $ui.push({
    props: {
      title: "USD🇺🇸 - CNY🇨🇳"
    },
    views: [
      {
        // In order to generate rowHeight
        type: "text",
        props: {
          hidden: true,
          id: "detail information",
          font: $font(12),
          insets: $insets(5, 10, 5, 10)
        },
        layout: function(make, view) {
          make.top.bottom.inset(0)
          make.left.right.inset(10)
        },
      },
      {
        type: "list",
        props: {
          id: "detail",
          bgcolor: $color("#F0F5F6"),
          bounces: false,
          showsVerticalIndicator: false,
          separatorHidden: true,
          data: generateDetailViewData(myMap),
          footer: {
            type: "label",
            props: {
              height: 60,
              text: "The statistics are from European Central Bank \n Please check the actual selling rate with your bank.",
              lines: 0,
              textColor: $color("#AAAAAA"),
              align: $align.center,
              font: $font("Avenir", 12)
            }
          },
          header: {
            type: "view",
            props: {
              // Cover Image
              height: 220
            },
            views: [
              {
                type: "view",
                props: {
                  alpha: 0.8,
                  clipsToBounds: false,
                  bgcolor: $color("white")
                },
                layout: function(make, view) {
                  // Set Rate
                  rate(parseFloat(myMap.get("realTime")))
                  shadowRate(view)
                  make.left.offset(40)
                  make.width.height.equalTo(180)
                  make.top.inset(20)
                },
                views: [{
                    // Average Rate
                    type: "label",
                    props: {
                      id: "rate",
                      font: $font(68),
                      autoFontSize: true,
                      align: $align.center,
                      textColor: $color("black")
                    },
                    layout: function(make, view) {
                      // var preView = view.prev
                      // make.left.equalTo(preView.right).offset(20)
                      make.centerX.equalTo(0)
                      make.width.height.equalTo(140)
                      make.top.inset(0)
                      
                    }
                  },
                  {
                    type: "label",
                    props: {
                      text: " Real-time: ",
                      font: $font("Avenir-Black",12),
                      color: $color("lightGray")
                    },
                    layout: function(make, view) {
                      
                      shadowView(view)
                      make.centerX.equalTo(view.super).offset(0)
                      make.width.equalTo(160)
                      make.top.inset(-150)
                      make.bottom.inset(0)
                    }
                  },
                ]
              },
              {
                // local stat label
                type: "label",
                props: {
                  text: "Daily:",
                  font: $font(12),
                  color: $color("darkGray")
                },
                layout: function(make, view){
                  // Set Rate
                  //rate(6.1)
                  // Set Shadow
                  //shadowRate(view)

                  var preView = view.prev
                  make.top.equalTo(view.super).offset(300)
                  make.width.equalTo(300)
                  make.height.equalTo(20)
                  make.left.offset(60)
                  make.top.inset(-10)
                  make.bottom.inset(-120)
                }
              },
              {
                // local stat
                type: "label",
                props: {
                  text: "L: " + "              H: ",
                  font: $font(12),
                  color: $color("#37A59A")
                },
                layout: function(make, view){
                  // Set Rate
                  //rate(6.1)
                  // Set Shadow
                  //shadowRate(view)

                  var preView = view.prev
                  make.top.equalTo(view.super).offset(300)
                  make.width.equalTo(300)
                  make.height.equalTo(20)
                  make.left.offset(60)
                  make.top.inset(20)
                  make.bottom.inset(-120)
                }
              },
              //rating 
              {
                type: "view",
                props: {
                  alpha: 0.8,
                  clipsToBounds: false,
                  bgcolor: $color("white")
                },
                layout: function(make, view) {
                  // Set Rate
                  rateThreeDigit(parseFloat(myMap.get("percentage")) * 100)
                  // Set Shadow
                  shadowRate(view)

                  var preView = view.prev
                  make.left.equalTo(preView.right).offset(-120)
                  make.width.height.equalTo(100)
                  make.top.inset(30)
                },
                views: [{
                    // Average Rate
                    type: "label",
                    props: {
                      id: "rate",
                      font: $font(45),
                      autoFontSize: true,
                      align: $align.center,
                      textColor: $color("black")
                    },
                    layout: function(make, view) {
                      // var preView = view.prev
                      //make.left.equalTo(preView.right).offset(20)
                      //make.right.equalTo(view.super)
                      make.left.offset(23)
                      make.width.height.equalTo(50)
                      //make.right.insect(20)
                      make.top.inset(10)
                      
                    }
                  },
                  {
                    // trend
                    type: "label",
                    props: {
                      font: $font("bold", 16),
                      autoFontSize: true,
                      align: $align.center,
                      textColor: $color("#FF3069"),
                      text: myMap.get("trend") ? "↑" : "↓"
                    },
                    layout: function(make, view) {
                      var preView = view.prev
                      make.centerX.equalTo(view.super)
                      make.top.equalTo(preView.bottom).offset(10)
                    }
                  },
                  {
                    // percent
                    type: "label",
                    props: {
                      font: $font("bold", 18),
                      autoFontSize: true,
                      align: $align.center,
                      textColor: $color("black"),
                      text: "%"
                    },
                    layout: function(make, view){
                      make.right.equalTo(view.super)
                      make.width.height.equalTo(30)
                      make.top.inset(20)
                    }
                  }
                ]
              },
              {
                // Share
                type: "button",
                props: {
                  bgcolor: $color("white"),
                  clipsToBounds: false
                },
                layout: function(make, view) {
                  // Set Shadow
                  shadowButton(view)

                  var preView = view.prev
                  make.centerX.equalTo(preView)
                  make.top.equalTo(preView.bottom).offset(40)
                  make.size.equalTo($size(100, 30))
                },
                views: [{
                    type: "image",
                    props: {
                      icon: $icon("022", $color("darkGray"), $size(72, 72)),
                      bgcolor: $color("white")
                    },
                    layout: function(make, view) {
                      make.centerY.equalTo(view.super)
                      make.width.height.equalTo(20)
                      make.left.inset(10)
                    }
                  },
                  {
                    type: "label",
                    props: {
                      text: "Share",
                      font: $font("bold", 14),
                      autoFontSize: true,
                      align: true,
                      textColor: $color("darkGray")
                    },
                    layout: function(make, view) {
                      var preView = view.prev
                      make.centerY.equalTo(view.super)
                      make.left.equalTo(preView.right).offset(10)
                      make.right.inset(10)
                    }
                  }
                ],
                events: {
                  tapped: function(sender) {
                    actionShare()
                  }
                }
              }
            ]
          }
        },
        layout: $layout.fill,
        events: {
          rowHeight: function(sender, indexPath) {
            if (indexPath.section == 0) {
              return 95 + $("detail information").contentSize.height
            } else {
              return 230
            }
          },
          didEndScrollingAnimation: function(sender) {
            // For focus() To Top
            $ui.animate({
              duration: 0.2,
              animation: function() {
                sender.contentOffset = $point(0, 0)
              }
            })
          }
        }
      }
    ]
  })
}

function generateDetailViewData(myMap) {
  var d = [{
      title: "Historical Data",
      rows: [{
        type: "view",
        props: {
          bgcolor: $color("white")
        },
        layout: function(make, view) {
          make.top.bottom.inset(0)
          make.left.right.inset(10)
          // shadowView(view)
          shadowView(view)
        },
        views: [
          {
            // Title
            type: "label",
            props: {
              font: $font("Avenir-Black", 18),
              text: myMap.get("userChosenDate") + " -- " + myMap.get("today")
            },
            layout: function(make) {
              make.height.equalTo(18)
              make.top.inset(10)
              make.left.right.inset(15)
            }
          },
          {
            // Original Title
            type: "label",
            props: {
              font: $font("bold", 13),
              autoFontSize: true,
              text: " "
            },
            layout: function(make, view) {
              var preView = view.prev
              make.top.equalTo(preView.bottom)
              make.left.right.inset(15)
            }
          },
          {
            // Director
            type: "label",
            props: {
              font: $font("Avenir-Black",18),
              //bgcolor: $color("#F5F5F5"),
              textColor: $color("#5D9CF5"),
              text: " Max: "+   "            "  +"Min: "
            },
            layout: function(make, view) {
              var preView = view.prev
              make.centerX.equalTo(view.prev)
              make.top.equalTo(preView.bottom).offset(5)
              make.left.right.inset(15)
            }
          },
          {
            
            type: "label",
            props: {
              font: $font("Avenir-Black",18),
              lines: 0,
              textColor: $color("#CDC080"),
              text: " Average: " + myMap.get("avg"),
              align: $align.justified
            },
            layout: function(make, view) {
              var preView = view.prev
              make.top.equalTo(preView.bottom).offset(5)
              make.left.right.inset(15)
            }
          }
        ]
      }]
    },
    {
      // draw lines and graphs
      title: "GRAPH",
      rows: [{
        type: "view",
        props: {
          bgcolor: $color("white")
        },
        layout: function(make, view) {
          make.top.bottom.inset(0)
          make.left.right.inset(10)
          shadowView(view)
        },
        views: [{
          type: "image",
          props: {
            src: "data.PNG",
            size: 50
            
          },
          layout: function(make, view) {
            make.centerX.equalTo(view.super)
            make.left.offset(15)
            make.right.offset(15)
            shadowView(view)
          }
        }]
      }]
    }
  ]
  return d
}




// main view
function mainView() {
  $ui.render({
    props: {
      title: "Currency Checker"
    },
    views: [{
        type: "matrix",
        props: {
          id: "menu",
          itemHeight: 50,
          columns: 3,
          spacing: 0,
          scrollEnabled: false,
          selectable: false,
          
          //bgcolor: $rgb(247, 247, 247),
          template: {
            views: [{
                // Button Image
                type: "image",
                props: {
                  id: "menu_image",
                  bgcolor: $color("white")
                },
                layout: function(make, view) {
                  make.centerX.equalTo(view.super)
                  make.width.height.equalTo(25)
                  make.top.inset(5)
                },
              },
              {
                type: "label",
                props: {
                  id: "menu_label",
                  hidden: $app.env != $env.app,
                  font: $font("PingFangTC-Semibold", 10),
                  textColor: $color("lightGray")
                },
                layout: function(make, view) {
                  var preView = view.prev
                  make.centerX.equalTo(preView)
                  make.top.equalTo(preView.bottom).offset(3)
                }
              }
            ]
          },
          data: [{
              menu_image: {
                icon: $icon("144", $color("darkGray"), $size(72, 72)),
                tintColor: $color("darkGray")
              },
              menu_label: {
                text: "Checker",
                //textColor: $color("")
              }
            },
            {
              menu_image: {
                icon: $icon("002", $color("clear"), $size(72, 72)),
                tintColor: $color("lightGray")
              },
              menu_label: {
                text: $l10n("Settings")
              }
            }
          ]
        },
        layout: function(make, view) {
          var sup = view.super

          if ($app.env != $env.app) {
            make.height.equalTo(40)
          } else {
            make.height.equalTo(50)
          }
          
          if ($device.isIphoneX) {
            make.bottom.equalTo(sup.safeAreaBottom)
          } else {
            make.bottom.equalTo(0)
          }
          //make.centerX.equalTo(30)
          make.left.right.offset(60)
          
        },
        events: {
          didSelect: function(sender, indexPath) {
            //console.log(indexPath.section + " " + indexPath.row);
            actionGeneral.activeMenu(indexPath.row);
            
          },
        }
      },
      {
        type: "canvas",
        layout: function(make, view) {
          var preView = view.prev
          make.top.equalTo(preView.top)
          make.height.equalTo(1)
          make.left.right.inset(0)
        },
        events: {
          draw: function(view, ctx) {
            var width = view.frame.width
            var scale = $device.info.screen.scale
            ctx.strokeColor = $color("gray")
            // $rgb(211, 211, 211)
            ctx.setLineWidth(1 / scale)
            ctx.moveToPoint(0, 0)
            ctx.addLineToPoint(width, 0)
            ctx.strokePath()
          } 
        }
      },
      {
        type: "view",
        props: {
          id: "content"
        },
        layout: function(make) {
          var preView = $("menu")
          make.bottom.equalTo(preView.top)
          make.left.top.right.inset(0)
        },
        views: [Checker,Settings]
      }
    ]
  })
}

function actionShare() {
  $delay(0.1, function() {
    // $quicklook.open({
    //   list:[$("detail").snapshot.png]
    // }),
    $share.sheet([$("detail").snapshot.png])
  })
}


function shadowView(view, alpha = 0.5) {
  var layer = view.runtimeValue().invoke("layer")

  layer.invoke("setCornerRadius", 10)
  layer.invoke("setShadowOffset", $size(0, 0))
  layer.invoke("setShadowColor", $color("#F0F5F6").runtimeValue().invoke("CGColor"))
  layer.invoke("setShadowOpacity", alpha)
  layer.invoke("setShadowRadius", 15)
}

function rate(number) {
  var rate = number.toFixed(3).toString()
  var string = $objc("NSMutableAttributedString").invoke("alloc.initWithString", rate)
  string.invoke("addAttribute:value:range:", "NSFont", $font("AvenirNext-Bold", 20), $range(1, 4))
  string.invoke("addAttribute:value:range:", "NSBaselineOffset", 10, $range(1, 4))
  $("rate").runtimeValue().invoke("setAttributedText", string)
}

function rateThreeDigit(number) {
  var rate = number.toFixed(3).toString()
  var string = $objc("NSMutableAttributedString").invoke("alloc.initWithString", rate)
  string.invoke("addAttribute:value:range:", "NSFont", $font("AvenirNext-Bold", 20), $range(1, 4))
  string.invoke("addAttribute:value:range:", "NSBaselineOffset", 10, $range(1, 4))
  $("rate").runtimeValue().invoke("setAttributedText", string)
}

function shadowRate(view) {
  var layer = view.runtimeValue().invoke("layer")

  layer.invoke("setCornerRadius", 6)
  layer.invoke("setShadowOffset", $size(5, 5))
  layer.invoke("setShadowColor", $color("lightGray").runtimeValue().invoke("CGColor"))
  layer.invoke("setShadowOpacity", 0.5)
  layer.invoke("setShadowRadius", 15)
}

function shadowButton(view) {
  var layer = view.runtimeValue().invoke("layer")

  layer.invoke("setShadowOffset", $size(2, 2))
  layer.invoke("setShadowColor", $color("lightGray").runtimeValue().invoke("CGColor"))
  layer.invoke("setShadowOpacity", 0.2)
  layer.invoke("setShadowRadius", 3)
}

function shadowImage(view) {
  var layer = view.runtimeValue().invoke("layer")

  var subLayer = $objc("CALayer").invoke("layer")
  subLayer.invoke("setFrame", $rect(5, 5, 180, 270))
  subLayer.invoke("setBackgroundColor", $color("white").runtimeValue().invoke("CGColor"))
  subLayer.invoke("setMasksToBounds", false)
  subLayer.invoke("setShadowOffset", $size(10, 10))
  subLayer.invoke("setShadowColor", $color("gray").runtimeValue().invoke("CGColor"))
  subLayer.invoke("setShadowOpacity", 0.5)
  subLayer.invoke("setShadowRadius", 15)
  layer.invoke("addSublayer", subLayer)
}

module.exports = {
  mainView: mainView,
  generateMainViewObjects: generateMainViewObjects
}