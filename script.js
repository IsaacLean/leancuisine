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

  var formData = {};

  var c_test_str = document.getElementById('c_test_str').value;
  if(c_test_str) {
    formData.c_test_str = c_test_str;
  }

  if(fileData.file && fileData.fileURL) {
    formData.c_image = { content: fileData.file.name };
  }

  cortexAPI.request('POST', 'c_tests', formData, function(responseText) {
    var response = JSON.parse(responseText);
    console.log('Cortex API Request Complete: ', response);

    if(fileData.file && fileData.fileURL) {
      var imageXHR = new XMLHttpRequest();
      imageXHR.open('POST', response.c_image.uploads[0].uploadUrl);

      var imageForm = new FormData();

      for(var i in response.c_image.uploads[0].fields) {
        var currField = response.c_image.uploads[0].fields[i];
        imageForm.append(currField.key, currField.value);
      }

      imageForm.append('file', fileData.file);

      imageXHR.send(imageForm);

      fileData.file = null;
      fileData.fileURL = null;
    }
  });
});
