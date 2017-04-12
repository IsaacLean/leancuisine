console.log('Start script...');

var cortexConfig;
var cortexAPI;
var req = new XMLHttpRequest();
req.open('GET', 'cortexConfig.json');
req.send(null);
req.onload = function(e) {
  if(req.readyState === 4) {
    if(req.status === 200) {
      cortexConfig = JSON.parse(req.responseText);
      cortexAPI = new CortexAPI(cortexConfig.env, cortexConfig.org, cortexConfig.apiKey);
      console.log('"cortexAPI" is now ready');
    } else {
      console.error(req.statusText);
    }
  }
};
