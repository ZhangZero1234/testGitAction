// ==============================
// Usage:
//
// Adding the to ibv namespace
// ibv_forms.call(ibv);
//
// Excuting once added
// ibv.getTaxoBeanList();
//
// DF : function direction
// ===============================
try {
  window.$ = require("../../../node_modules/jQuery");
} catch (err) {}

var ibv_forms = function (ctx) {
  var self = this;

  // -------------------------------------------------------------
  self.getTaxoBeanList = function (allTaxoData, callback) {
    $.ajax({
      type: "POST",
      url: self?.setup?.url?.taxoService,
      contentType: "application/json",
      dataType: "json",
      success: function (data) {
        allTaxoData.taxoBeanList = data.taxoBeanList;
        if ($.isFunction(callback)) {
          callback.call();
        }
      },

      error: function (err) {
        let msg =
          "This service is currently unavailable, please contact <a href='mailto:ibv@us.ibm.com'>ibv@us.ibm.com</a> if the problem persists.";
        $("#cardStatus").html("(" + msg + ")");
      },
    });
  };
  // -------------------------------------------------------------

  // -------------------------------------------------------------
  // Map the top-level taxonomy IDs (taxoId) to the array index in
  // taxonomy data object (taxoBeanList)
  self.createTaxoBeanListMap = function (taxoBeanList, taxoBeanListMap) {
    if (
      typeof taxoBeanList !== "undefined" &&
      typeof taxoBeanListMap !== "undefined"
    ) {
      $.each(taxoBeanList, function (idx, obj) {
        taxoBeanListMap[obj.taxoId] = idx;
      });
    }
  };
  // ---------------------------------------------------------------
  // Add selected = true in the taxonomy data object (taxoBeanList) for
  // selected taxos
  self.markSelectedTaxos = function (taxoBeanList, selectedTaxos) {
    if (
      typeof taxoBeanList !== "undefined" &&
      typeof selectedTaxos !== "undefined"
    ) {
      $.each(taxoBeanList, function (idx, obj) {
        if (typeof obj.subTaxoBeans !== "undefined") {
          self.markSelectedTaxos(obj.subTaxoBeans, selectedTaxos);
        }
        if (selectedTaxos.hasOwnProperty(obj.taxoId)) {
          obj.selected = true;
        }
      });
    }
  };
  // ------------------------------------------------------
  // Add entries of taxonomy data object (taxoBeanList) to the
  // taxoSelectControls object
  self.updateTaxoSelectControls = function (
    taxoBeanList,
    taxoBeanListMap,
    taxoSelectControls
  ) {
    if (
      typeof taxoBeanList !== "undefined" &&
      typeof taxoBeanListMap !== "undefined" &&
      typeof taxoSelectControls !== "undefined"
    ) {
      $.each(taxoSelectControls, function (key, obj) {
        if (taxoBeanListMap.hasOwnProperty(obj.taxoId)) {
          obj.taxoBeanList = taxoBeanList[taxoBeanListMap[obj.taxoId]];
        }
      });
    }
  };
  // ---------------------------------------------------------------
  // To be removed at a later time, demo only
  self.showSelection = function (exploreRequest, selectControls) {
    exploreRequest.taxoIds = self.getSelectIDs(selectControls);
    alert("The explorer request would be: " + JSON.stringify(exploreRequest));
  };
  // ---------------------------------------------------------------

  // ---------------------------------------------------------------
  // Grab all of the select taxonomy IDs from the select controls
  self.getSelectIDs = function (selectControls) {
    var selectIDs = [];
    var idString = "";
    // this is the control
    $(selectControls).each(function () {
      var selectControl = $(this);
      idString = "";
      selectControl.find(":selected").each(function () {
        idString += idString.length > 0 ? "," + this.value : this.value;
      });
      if (idString.length > 0) selectIDs.push(idString);
    });
    return selectIDs;
  };
  // ---------------------------------------------------------------

  // ---------------------------------------------------------------
  // Explore replace or append
  self.processExplore = function (
    cardInfo,
    exploreRequest,
    selectControls,
    renderOptions
  ) {
    var firstIn = false;
    var append;
    if (exploreRequest.page > 1) {
      append = true;
    } else {
      append = false;
      exploreRequest.taxoIds = self.getSelectIDs(selectControls);
    }
    self.getCards(cardInfo, exploreRequest, function () {
      var success = arguments[0];
      var additional = exploreRequest.page > 1;
      var msg = "";
      $(renderOptions.cardStatus).html("[ searching... ]");
      if (success) {
        if (cardInfo.cards.length > 0) {
          self.manageCardSizes(cardInfo.cards);
          self.processDataAndRemoteTemplate(
            renderOptions.cardTarget,
            renderOptions.cardTemplateFile,
            cardInfo,
            function () {
              $(renderOptions.cardTarget).data("widget").adjustHeights(true);
              if (self.checkLacation()) {
                self.setPageName();
                exploreRequest.page = 2;
                exploreRequest.pageSize = 8;
              } else {
                if (window.innerWidth <= 579) {
                  firstIn = false;
                } else {
                  firstIn = true;
                }
              }
              //FD:scroll to last 8 cards
              if ($(".ibm-card").length > 8) {
                let currentIndex =
                  $(".ibm-card").length - exploreRequest.pageSize < 0
                    ? 0
                    : $(".ibm-card").length - exploreRequest.pageSize;
                let decemo = currentIndex % exploreRequest.pageSize;
                if (decemo > 0) {
                  currentIndex = $(".ibm-card").length - decemo;
                }
                $("html,body").animate(
                  {
                    scrollTop:
                      $(".ibm-card").eq(currentIndex).offset().top - 100 + "px",
                  },
                  500
                );
              } else {
                if (firstIn) return;
                firstIn = false;
                $("html,body").animate(
                  { scrollTop: $(".ibm-card").eq(0).offset().top - 100 + "px" },
                  500
                );
              }
            },
            append
          );
          //  additional true page>1
          //  addltional false page1
          msg = additional
            ? parseInt(cardInfo.cards.length) +
              (parseInt(exploreRequest.page) - 1) *
                parseInt(exploreRequest.pageSize)
            : cardInfo.cards.length;
          msg +=
            cardInfo.cards.length > 1
              ? " of " + self.totalNum + " insights have been displayed"
              : " of " + self.totalNum + " insight has been displayed";
        } else {
          msg = additional
            ? "there are no additional insights to display, " +
              self.totalNum +
              " are displayed"
            : "there are no insights matching your search criteria";
          if (additional) {
            exploreRequest.page -= 1;
          } else {
            $(renderOptions.cardTarget).html("");
          }
        }
      } else {
        msg =
          "This service is currently unavailable, please contact <a href='mailto:ibv@us.ibm.com'>ibv@us.ibm.com</a> if the problem persists.";
        if (additional) exploreRequest.page -= 1;
      }
      $(renderOptions.cardStatus).html("(" + msg + ")");
    });
  };
  // ---------------------------------------------------------------
  //**click "Filter Apply" & "Reset" to change the params of the browser address On reload*/
  self.push_state = function (params) {
    if (typeof history.pushState != "undefined") {
      let title = "your saved search";
      let url = window.location.origin + window.location.pathname + params;
      let obj = { title, url };
      history.pushState(obj, title, url);
    } else {
    }
  };
  // ---------------------------------------------------------------
  // Reset the selections and reload the cards
  self.explore = function (
    cardInfo,
    exploreRequest,
    selectControls,
    renderOptions,
    mouseEvent
  ) {
    exploreRequest.page = 1;
    exploreRequest.pageSize = this.checkLacation() ? 16 : 8;
    self.processExplore(
      cardInfo,
      exploreRequest,
      selectControls,
      renderOptions
    );
    if (mouseEvent) {
      self.push_state(
        "?tids=" +
          ibv.getSelectIDs("#taxoExploreSelectForm").toString() +
          "&search=" +
          exploreRequest.searchContent
      );
    }
  };
  // ---------------------------------------------------------------

  // ---------------------------------------------------------------
  // Reset the selections and reload the cards
  self.exploreReset = function (
    cardInfo,
    exploreRequest,
    selectControls,
    renderOptions
  ) {
    $(selectControls).val(["6000", "5004"]).trigger("change");

    exploreRequest.page = 1;
    self.processExplore(
      cardInfo,
      exploreRequest,
      selectControls,
      renderOptions
    );
    self.push_state("?tids=6000,5004");
  };
  // ---------------------------------------------------------------

  // ---------------------------------------------------------------
  // Reset the selections and reload the cards
  self.exploreMore = function (
    cardInfo,
    exploreRequest,
    selectControls,
    renderOptions
  ) {
    console.log(exploreRequest);
    exploreRequest.page += 1;
    self.processExplore(
      cardInfo,
      exploreRequest,
      selectControls,
      renderOptions
    );
  };
  // ---------------------------------------------------------------

  // ----------------------------------------------------------------
  // Toggle the show hide button and visbility of the select controls
  self.showHideFilters = function (showHideSection, toggleButton) {
    // IBMCore.common.widget.selectlist.init("#selectFilters2 select.taxoSelect");
    if ($("#selectFilters2 select.taxoSelect").length <= 0) return;
    var sh = document.getElementById(showHideSection);
    var b = document.getElementById(toggleButton);
    if (sh.style.display === "none") {
      sh.style.display = "block";
      sh.style.height = "unset";
      sh.style.overflow = "unset";
      $("#taxoExploreSelectForm").css("height", "unset");
      b.classList.remove("ibm-expand-link");
      b.classList.add("ibm-collapse-link");
      b.innerHTML = "Hide filters";
      b.blur();
    } else {
      sh.style.display = "none";
      sh.style.height = "0px";
      sh.style.overflow = "hidden";
      let height = $("#operationContrls").height();
      $("#taxoExploreSelectForm").css("height", height);
      b.classList.remove("ibm-collapse-link");
      b.classList.add("ibm-expand-link");
      b.innerHTML = `Show filters (${
        self.getSelectIDs("form#taxoExploreSelectForm select.taxoSelect").length
      })`;
      b.blur();
    }
  };
  // ---------------------------------------------------------------

  // ---------------------------------------------------------------
  // Clear all select filter selections
  self.clearSelectionsFilters = function (selectControls) {
    $(selectControls).val(null).trigger("change");
  };
  // ---------------------------------------------------------------

  self.shareByMail = function (aId) {
    var browserLink = window.location.href;
    var subject = "IBV Explore";
    var body = "Here's an IBV link to explore:" + browserLink;

    subject = escape(subject);
    body = escape(body);

    var mailLink = `mailto:name1@mail.com,name2@mail.com?subject=${subject}&body=${body}`;

    $(aId).attr("href", mailLink);
    // $("#shareFilters2").data("widget").destroy()
    // $("#shareFilters2").data("widget").init("#shareFilters2")
  };

  self.copyUrlToBoard = function () {
    $("#shareFilters2").tipso("hide");
  };

  self.reGrid = function () {
    let selectParentList = $("#taxoExploreSelectForm .ibm-col-medium-4-2");
    let currentElHeight = 0;
    let nextElHeight = 0;
    selectParentList.attr("style", "");
    if (window.innerWidth < 580) return;
    for (let i = 0; i < selectParentList.length - 1; i++) {
      if (i % 2 == 0) {
        currentElHeight = $(selectParentList[i]).height();
        nextElHeight = $(selectParentList[i + 1]).height();
        currentElHeight >= nextElHeight
          ? $(selectParentList[i + 1]).height(currentElHeight)
          : $(selectParentList[i]).height(nextElHeight);
      }
    }
  };

  self.handleGrif = function () {
    let timer;
    window.onresize = function () {
      clearTimeout(timer);
      timer = setTimeout(() => {
        self.reGrid();
        clearTimeout(timer);
      }, 500);
    };

    $(".taxoSelect").on("select2:select", function () {
      console.log("select");
      self.reGrid();
    });
    $(".taxoSelect").on("select2:unselect", function () {
      console.log("unselect");
      self.reGrid();
    });
  };
};

try {
  const exportFuncs = {};
  ibv_forms.call(exportFuncs);
  const {
    getTaxoBeanList,
    getSelectIDs,
    createTaxoBeanListMap,
    push_state,
    markSelectedTaxos,
  } = exportFuncs;
  module.exports = {
    getTaxoBeanList,
    getSelectIDs,
    createTaxoBeanListMap,
    push_state,
    markSelectedTaxos,
  };
} catch (err) {}
