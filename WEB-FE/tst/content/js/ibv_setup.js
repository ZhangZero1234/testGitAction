// IBV common setup
if(ibv === undefined) {
  var ibv = {};
};
var setup = {
  "url": {
    "cardService": "https://ibv-tst.dst.ibm.com/cms/jaxrs/website/search", 
  	"taxoService": "https://ibv-tst.dst.ibm.com/cms/jaxrs/website/search/explore"
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
