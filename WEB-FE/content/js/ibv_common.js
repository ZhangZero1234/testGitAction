// ==============================
// Usage:
//
// Adding the to ibv namespace
// Declare the setup object for use
// ibv_common.call(ibv, setup);
//
// External referencing example:
// ibv.processRemoteDataAndTemplate();
//
// ===============================
try {
  window.$ = require("../../../TDD/node_modules/jQuery");
  window.Mustache = require("../../../TDD/node_modules/mustache");
} catch (err) {}
var ibv_common = function (setup) {
  var self = this;
  self.setup = setup;

  // ---------------------------------------------------------------
  // Process a server JSON data file into a server Mustache template
  // - get json and template, process when both are available
  //
  self.processRemoteDataAndTemplate = function (
    targetID,
    templateFile,
    dataFile,
    callback,
    append
  ) {
    var template, data;
    var gotTemplate, gotData;

    gotTemplate = gotData = false;

    $.get(templateFile, null, function (ajaxData) {
      template = ajaxData;
      gotTemplate = true;
      if (gotData)
        self.processTemplate(targetID, template, data, callback, append);
    });

    $.getJSON(dataFile, null, function (ajaxData) {
      data = ajaxData;
      gotData = true;
      if (gotTemplate)
        self.processTemplate(targetID, template, data, callback, append);
    });
  };
  // ---------------------------------------------------------------

  // -----------------------------------------------------------------
  // Process a passed JSON data object into a server Mustache template
  //
  self.processDataAndRemoteTemplate = function (
    targetID,
    templateFile,
    data,
    callback,
    append
  ) {
    var template;
    $.get(templateFile, null, function (ajaxData) {
      template = ajaxData;
      self.processTemplate(targetID, template, data, callback, append);
    });
  };
  // -----------------------------------------------------------------

  // --------------------------------------------------------------------
  // Render a Mustache template with data
  // - append = true, add to the end, otherwise replace target div contents
  // - remove target div
  // - execute callback
  //

  // self.setImageHeight = function(){
  // var imageMinHeight;

  // }

  self.processTemplate = function (targetID, template, data, callback, append) {
    var html = Mustache.render(template, data);
    if (typeof append !== "undefined" && append == true) {
      $(targetID).append(html);
    } else {
      $(targetID).html(html);
    }
    if ($.isFunction(callback)) {
      callback.call();
    }
  };
  // ------------------------------------

  // ---------------------------------------------------------------
  // Render cards on page
  // request and render options are required
  self.renderCards = function (cardInfo, requestOptions, renderOptions) {
    var append;
    append =
      typeof renderOptions.appendFlag === "undefined"
        ? false
        : renderOptions.appendFlag;
    self.getCards(cardInfo, requestOptions, function () {
      var success = arguments[0];
      $(renderOptions.cardStatus).html("( retrieving... )");
      if (success) {
        if (cardInfo.cards.length > 0) {
          self.manageCardSizes(cardInfo.cards);
          self.processDataAndRemoteTemplate(
            renderOptions.cardTarget,
            renderOptions.cardTemplateFile,
            cardInfo,
            function () {
              $(renderOptions.cardTarget).setsameheight();
            },
            append
          );

          $(renderOptions.cardStatus).html("");
        } else {
          $(renderOptions.cardStatus).html(
            "(No cards were found for rendering on the page)"
          );
        }
      } else {
        $(renderOptions.cardStatus).html(
          "(This service is currently unavailable, please contact <a href='mailto:ibv@us.ibm.com'>ibv@us.ibm.com</a> if the problem persists.)"
        );
      }
    });
  };
  // ---------------------------------------------------------------

  // -------------------------------------------------------------------------------
  // Truncate paragraph of text at a blank, add an ellipsis, when a limit is reached
  self.manageTextLength = function (text, maxLength) {
    if (
      typeof text !== "undefined" &&
      typeof maxLength !== "undefined" &&
      text.length > maxLength
    ) {
      text = text.substr(0, maxLength);
      text = text.substr(0, Math.min(text.length, text.lastIndexOf(" ")));
      text += " ...";
    }
    return text;
  };
  // -----------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------
  // Process the card data and adjust content based on presence of images, buttons, etc.
  self.manageCardSizes = function (cards) {
    var textLength = 0;
    var charsPerLine = 40;
    var charsPerTitleLine = 32;
    var linesPerImage = 7;
    var linesPerButton = 1;
    var linesPerCard = 16;
    var maxLength = charsPerLine * linesPerCard;
    $.each(cards, function (idx, obj) {
      textLength = maxLength;
      if (typeof obj.description !== "undefined") {
        // image
        if (typeof obj.imageUrl !== "undefined" && obj.imageUrl.length > 0) {
          textLength -= linesPerImage * charsPerLine;
        }
        // buttons
        if (typeof obj.link1Text !== "undefined" && obj.link1Text.length > 0) {
          textLength -= linesPerButton * charsPerLine;
          // button 2
          if (
            typeof obj.link2Text !== "undefined" &&
            obj.link2Text.length > 0 &&
            obj.link1Text.length + obj.link2Text.length > 20
          ) {
            textLength -= linesPerButton * charsPerLine;
          }
        }
        // heading
        if (typeof obj.title !== "undefined") {
          textLength -=
            Math.floor((obj.title.length * charsPerLine) / charsPerTitleLine) +
            charsPerLine;
        }
      }
      obj.description = self.manageTextLength(obj.description, textLength);
    });
  };
  // -----------------------------------------------------------------------------------------
  // set the name of current page to session storage
  self.setPageName = function () {
    sessionStorage.setItem("name", window.location.pathname);
  };
  // return true : come form all pages except explore page
  // || (sessionStorage.getItem("name")!="/index.html"&& window.location.search.indexOf("6000")>-1)
  self.checkLacation = function () {
    let flag =
      sessionStorage.getItem("name") == null ||
      sessionStorage.getItem("name") == window.location.pathname
        ? false
        : true;
    // this.setPageName();
    return flag;
  };
  // ---------------------------------------------------------------
  //getCards({pageSize:2,page:2,taxoIds:"",title:""});
  //getCards({cardIds:"78,87"});
  self.getCards = function (cardInfo, requestOptions, callback) {
    $.ajax({
      type: "POST",
      url: self.setup.url.cardService,
      contentType: "application/json",
      data: JSON.stringify(requestOptions),
      dataType: "json",
      success: function (data) {
        cardInfo.cards = data.cards;
        self.totalNum = data.totalNum;
        callback && callback(true);
      },
      error: function (err) {
        let msg =
          "This service is currently unavailable, please contact <a href='mailto:ibv@us.ibm.com'>ibv@us.ibm.com</a> if the problem persists.";
        $("#cardStatus").html("(" + msg + ")");
        callback && callback(false);
      },
    });
  };
  self.setLocalStorage = function (key, value) {
    var str_val = JSON.stringify(value);
    window.sessionStorage.setItem(key, str_val);
  };
  self.getLocalStorage = function (key) {
    return window.sessionStorage.getItem(key);
  };
  // ---------------------------------------------------------------

  self.unsetFocus = function (event) {
    console.log(event);
    // $(this).blur();
    $("a").blur();
    return false;
    // $(this).css("border","1px dotted")
  };

  // ---------------------------------------------------------------
  self.getLeaderListShow = function (pathmst, domJq, viewData) {
    $.get(pathmst, function (template) {
      mergeLeaderList(viewData, function () {
        $(domJq).html(Mustache.render(template, viewData));
        $(domJq)
          .data("widget")
          .init($(domJq + " .ibm-show-hide"));
        $(domJq).on("click", ".ibm-show-active", function () {
          let _that = $(this);
          let infos = [];
          let key = _that.html();
          // console.log(self);
          let storyVal = self.getLocalStorage(key);
          if (storyVal) {
            renderShowHideList(eval(storyVal), _that);
            return;
          }
          let L = leadersList_content[key].length;
          let arr = leadersList_content[key];
          for (let i = 0; i < arr.length; i++) {
            if (arr[i] && arr[i].hasOwnProperty("cnum") && arr[i]["cnum"]) {
              infos.push(getInfos(arr[i], _that));
            } else {
              arr.splice(i, 1);
              infos.push(getInfos(arr[i], _that));
            }
          }
          Promise.all(infos).then(function (res) {
            console.log(res, arr);
            for (let j = 0; j < res.length; j++) {
              if (res[j].length <= 0) {
                res.splice(j, 1);
                j--;
                continue;
              }
              for (let k = 0; k < arr.length; k++) {
                if (arr[k].cnum == res[j][0].uid) {
                  arr[k].name = res[j][0]["name"];
                  arr[k].bio = res[j][0].bio;
                }
              }
              arr[j].bluepage =
                "https://w3.ibm.com/bluepages/profile.html?uid=" + arr[j].cnum;
            }
            self.setLocalStorage(key, arr);
            renderShowHideList(arr, _that);
          });
        });
      });
    });
  };
  function renderShowHideList(arr, _that) {
    // res done
    $.get("../mst/showhidecontent.mst", function (html) {
      // console.log(_that.find(".ibm-container-body"));
      _that
        .parents(".showHideArea")
        .find(".ibm-container-body")
        .html(Mustache.render(html, { contents: arr }));
      _that
        .parents(".showHideArea")
        .find(".ibm-container-body")
        .setsameheight();
    });
  }
  function mergeLeaderList(json, callback) {
    var list = json.taxos;
    callback();
  }

  function getInfos(json, target) {
    $(target).parents(".showHideArea").find(".bluePage_Notes").hide();
    return new Promise(function (resolve, reject) {
      $.ajax({
        url:
          "https://w3-services1.w3-969.ibm.com/myw3/unified-profile/v1/api/find",
        data: { uid: json["cnum"] },
        dataType: "json",
        type: "get",
        success: function (data) {
          $(target).parents(".showHideArea").find(".ibm-spinner").show();
          resolve(data);
        },
        error: function () {
          console.log("showlist call error");
          $(target).parents(".showHideArea").find(".ibm-spinner").hide();
          $(target).parents(".showHideArea").find(".bluePage_Notes").show();
          // console.log($(target));
        },
      });
    });
  }
  // set same height
  var setSameHeight = function () {
    var heightest = 188;

    var ibvCards = $(".ibv-card");
    ibvCards.height("auto");

    for (var i = 0; i < ibvCards.length; i++) {
      if (ibvCards.eq(i).height() > heightest) {
        heightest = ibvCards.eq(i).height();
      }
    }

    ibvCards.height(heightest);
  };
  window.onresize = function () {
    setSameHeight();
  };
  // get leadership data
  self.getLeadershipData = function (pathmst, domJq, viewData) {
    $.get(pathmst, function (template) {
      mergeData(viewData, function (buffer) {
        // console.log(template);
        $(domJq).html(Mustache.render(template, buffer));
        setSameHeight();
        $("#leaderShip").find(".ibm-columns").setsameheight();
      });
    });
  };
  // get Video
  self.getVideoData = function (pathmst, domJq, viewData) {
    $.get(pathmst, function (template) {
      mergeVideoList(viewData, function () {
        $(domJq).html(Mustache.render(template, viewData));
        try {
          videojs(document.getElementById("videoCom"));
        } catch (e) {
          setTimeout(function () {
            videojs(document.getElementById("videoCom"));
          }, 800);
        }
      });
    });
  };
  function mergeVideoList(json, callback) {
    var list = json.videos;
    callback();
  }

  function mergeData(json, callback) {
    var list = json.leadership;
    var funcs = [];
    // let get_leader_ship_data = self.getLocalStorage("getLeadershipData");
    // if(get_leader_ship_data)
    // {
    //   console.log("2222",JSON.parse(get_leader_ship_data));
    //   callback(JSON.parse(get_leader_ship_data));
    //   console.log("1212",JSON.parse(get_leader_ship_data));
    //   return;
    // }
    for (let i = 0; i < json.leadership.length; i++) {
      funcs.push(askLeadShipInfo(json, i));
    }
    Promise.all(funcs).then(function (res) {
      // res = res.filter((subArr)=>{
      //   return subArr.length>0
      // });
      res = res.map((subArr) => {
        return subArr.length > 0
          ? subArr
          : [
              {
                bio: "Senior Partner - Offering Leader",
                building: "765",
                email: "peter.korsten@nl.ibm.com",
                "is-employee": true,
                location: "Amsterdam, Netherlands",
                "mobile-phone": "31-651-263079",
                name: "Peter Korsten",
                "notes-id": "Peter J Korsten/Netherlands/IBM",
                "office-phone": "31-20-513-6086",
                "org-title": "Global Business Services",
                uid: "0D2954897",
              },
            ];
      });
      // console.log(res);
      for (let i = 0; i < res.length; i++) {
        try {
          json.leadership[i].infomation.bio = res[i][0].bio;
        } catch (e) {
          console.log(res, i);
        }

        json.leadership[i].infomation.email = res[i][0].email;
        json.leadership[i].infomation.name = res[i][0].name;

        json.leadership[i].bluepage =
          "https://w3.ibm.com/bluepages/profile.html?uid=" +
          json.leadership[i].cnum;
        // if(i == json.leadership.length-1)
        // {
        //  self.setLocalStorage("getLeadershipData",json);
        //   callback(json);
        // }
        // console.log(i)
      }
      callback(json);
      console.log(res);
      // console.log("22")
    });
  }
  // ---------------------------------------------------------------
  self.renderSection = function (
    domNameStr,
    dataJson,
    templatePathStr,
    callback
  ) {
    fetch(templatePathStr)
      .then((response) => {
        return response.text();
      })
      .then((res) => {
        $(domNameStr).html(Mustache.render(res, dataJson));
        callback && callback();
      });
  };
};

function askLeadShipInfo(json, i) {
  return new Promise(function (resolve, reject) {
    $.ajax({
      url:
        "https://w3-services1.w3-969.ibm.com/myw3/unified-profile/v1/api/find",
      data: { uid: json.leadership[i]["cnum"] },
      dataType: "json",
      type: "get",
      success: function (data) {
        resolve(data);
      },
      error: function (err) {
        // console.log("hahaha",err);
        $("#bluePage_Notes").show();
      },
    });
  });
}

//video cover show and hide
function showCover() {
  $(".vjs-poster").addClass("endCover");
}

function hideCover() {
  $(".vjs-poster").removeClass("endCover");
}

// init all insights in hm and mm
function initAllInsights() {
  console.log("initAllInsights");
  IBMCore.common.module.masthead.subscribe("ready", "dyncss", function () {
    $("button.ibm-menu-link").click(function () {
      console.log("open");
      $.each($("#ibm-burger-menu-container a"), function (index, item) {
        // console.log($(item).attr("href"));
        let url = $(item).attr("href").replace("lnk=hmstudies-mm", "lnk=hm");

        $(item).attr("href", url);
      });

      // add class
      $(".ibm-container-body .ibv-mega-menu")
        .addClass("single-col")
        .removeClass("menu-content-background")
        .removeClass("mega-menu-title-bgc");
      $(".ibm-container-body .ibv-mega-menu li").removeClass("padding-b-1");
      $(".ibm-container-body .showhide-container-body").addClass("showhide-h");

      $("#ibm-mobilemenu-screen").on("click.mask", function () {
        $(this).off("click.mask");
        $(".ibm-mobilemenu-close").off("click.close");
        $(".ibm-container-body .show-hide-item").off("click");
        // remove class
      });
      $(".ibm-mobilemenu-close").on("click.close", function () {
        $(this).off("click.close");
        $("#ibm-mobilemenu-screen").off("click.mask");
        $(".ibm-container-body .show-hide-item").off("click");
        // remove class
      });

      $(".ibm-container-body .show-hide-item").click(function () {
        let that = $(this);
        let title = that.find("h3");
        let othersLi = that.siblings("li");
        if (title.hasClass("ibm-maximize-link")) {
          title.removeClass("ibm-maximize-link").addClass("ibm-minimize-link");
        } else {
          title.addClass("ibm-maximize-link").removeClass("ibm-minimize-link");
        }
        that.find(".showhide-container-body").slideToggle("fast");
        othersLi
          .find(".ibm-minimize-link")
          .addClass("ibm-maximize-link")
          .removeClass("ibm-minimize-link");
        othersLi.find(".showhide-container-body").slideUp("fast");
      });
    });
  });
}

function lnkSymbol(aim, data, dataname) {
  let a = document.createElement("a");

  let arr = data[dataname]["links"] ? data[dataname]["links"] : [];
  arr.map(function (item) {
    if (item.hasOwnProperty("links")) {
      item["links"].map(function (link) {
        a.href = link.href;
        if (a.search) {
          link.href = link.href + "&" + aim;
        } else {
          link.href = link.href + "?" + aim;
        }
        return link;
      });
      return item;
    }
  });
  return data;
}

// all insights init
$(function () {
  $.get("mst/allInsights.mst", function (data) {
    $.getJSON("data/navigations.json", function (json) {
      json = lnkSymbol("lnk=studies-mm", json, "allInsights");
      // console.log(json)
      $(".ibm-sitenav-menu-container #all-insights").html(
        Mustache.render(data, json)
      );
      IBMCore.common.module.masthead.init();
      $(".ibm-sitenav-menu-container #all-insights").css("width", "unset");
    });
  });
  initAllInsights();
});

try {
  const exportFuncs = {};
  ibv_common.call(exportFuncs);
  const { manageCardSizes, processTemplate } = exportFuncs;
  module.exports = {
    manageCardSizes,
    processTemplate,
  };
} catch (err) {}
