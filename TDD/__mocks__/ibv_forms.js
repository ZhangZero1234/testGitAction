const getTaxoBeanLis1t = function (allTaxoData, callback) {
  console.log(1);
  $.ajax({
    type: "POST",
    url: "https://ibv-service-dev.dst.ibm.com/jaxrs/content/taxo",
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
