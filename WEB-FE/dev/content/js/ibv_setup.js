// IBV common setup
if(ibv === undefined) {
  var ibv = {};
};
var setup = {
  "url": {
    "cardService": "https://ibv-service-dev.dst.ibm.com/jaxrs/search/card", 
  	"taxoService": "https://ibv-service-dev.dst.ibm.com/jaxrs/content/taxo"
  }
};
ibv_common.call(ibv, setup);

// IBM site wide configuration
IBMCore.common.util.config.set({
  "masthead": {
    "type": "alternate"
  },
  "footer":{
    "type": "alternate",
    "socialLinks":{
      "enabled":false
    }
  },
  "backtotop": {
    "enabled": true
  }
});
