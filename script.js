console.log('Start script...');

var cortexConfig;
var cortexAPI;
var req = new XMLHttpRequest();
req.open('GET', 'cortexConfig.json');
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
req.send(null);

var fileData = {
  file: null,
  fileURL: null
};

var fileInput = document.getElementById('c_image');
fileInput.addEventListener('change', function(evt) {
  var file = evt.target.files[0];
  var reader = new FileReader();

  reader.addEventListener('load', function(evt) {
    fileData.file = file;
    fileData.fileURL = reader.result;
    document.getElementById('img_preview').innerHTML = '<img src="'+evt.target.result+'" />';
  });

  reader.readAsDataURL(file);
}, false);

var testForm = document.getElementById('test_form');
testForm.addEventListener('submit', function(evt) {
  evt.preventDefault();

  var formData = {
    c_test_str: document.getElementById('c_test_str').value
  };

  console.log('fileData: ', fileData);

  cortexAPI.request('POST', 'c_tests', formData, function(responseText) {
    console.log('Cortex API Request Complete: ', JSON.parse(responseText));
  });
});
