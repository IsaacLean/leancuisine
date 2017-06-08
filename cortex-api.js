/*
 * TEST MEDABLE CORTEX API LIBRARY
 * A simple example library that interfaces with the Medable Cortex API
 */
function CortexAPI(env, org, apiKey) {
  // @private: Check if variables are expected type
  function typeCheckVar(type, variable) {
    if(typeof type !== 'string') {
      throw new Error('Invalid type (Type must be the string name you expect the variable type to be)');
    }

    if(typeof variable !== type.toLowerCase()) {
      throw new Error('Invalid variable type (Passed in '+typeof variable+' type. Expected '+type+' type.)');
    }
  }

  // @private: Check if multiple variables are expected type
  function typeCheckVars(type, vars) {
    if(typeof type !== 'string') {
      throw new Error('Invalid type (Type must be the string name you expect each variable type to be)');
    }

    if(typeof vars !== 'object') {
      throw new Error('Invalid vars (Vars must be an array of variables you want to type check)');
    } else if(vars.constructor !== Array) {
      throw new Error('Invalid vars (Vars must be an array of variables you want to type check)');
    }

    for(var i in vars) {
      var variable = vars[i];

      typeCheckVar(type, variable);
    }
  }

  typeCheckVars('string', [apiKey, env, org]);

  // @private: Create frozen object to store Medable Cortex settings
  var settings = Object.create(null);
  settings.apiKey = apiKey;
  settings.env = env;
  settings.org = org;
  Object.freeze(settings);

  // @public: Make an XMLHttpRequest to Medable Cortex API
  this.request = function(method, path, data, callback) {
    typeCheckVars('string', [method, path]);
    if(callback) {
      typeCheckVar('function', callback);
    }

    var req = new XMLHttpRequest();
    var url = 'https://'+env+'.medable.com/'+settings.org+'/v2/'+path;
    var payload = null;

    method = method.toUpperCase();

    switch(method) {
      case 'GET':
        // TODO: add support for query string
        req.open('GET', url);
        break;
      case 'POST':
        if(data) {
          payload = JSON.stringify(data);
        }

        req.open('POST', url);
        break;
      default:
        throw new Error('Invalid request method');
    }

    req.setRequestHeader('Medable-Client-Key', settings.apiKey);
    req.setRequestHeader('Content-Type', 'application/json');
    req.withCredentials = true;
    req.onload = function(e) {
      if(req.readyState === 4) {
        if(req.status === 200) {
          if(callback) {
            callback(req.responseText);
          }
        } else {
          console.error(req.statusText);
        }
      }
    };

    if(method === 'GET') {
      req.send();
    } else {
      req.send(payload);
    }
  };

  // @public: Authenticate login to Medable Cortex API
  this.login = function(payload) {
    typeCheckVar('object', payload);
    typeCheckVars('string', [payload.email, payload.password]);

    this.request('POST', 'accounts/login', {email: payload.email, password: payload.password});
  };

  // @public: Logout from Medable Cortex API
  this.logout = function() {
    this.request('POST', 'accounts/me/logout');
  };

  Object.freeze(this); // Make sure instances of CortexAPI are frozen
}
