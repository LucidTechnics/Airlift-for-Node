var checkSecurity = function() { return true; }

exports.extractResource = function(_pathName, _validResources)
{
	var pathTokens = _pathName.replace(/^\//, '').split('/');

	var lastToken;

	var resources = {};
	var identifierMap = {};
	var resource;
	var pathTokenMap = {};
	
	pathTokens.forEach(function(_token, _index)
	{
		var token = unescape(_token);
		
		pathTokenMap[token] = pathTokenMap[token]||0;
		pathTokenMap[token] = pathTokenMap[token] + 1;
		
		if (lastToken && _validResources.map[lastToken])
		{
			identifierMap[lastToken] = token;
		}
		else if (_validResources.map[token])
		{
			resources[token] = 1;
			resource = token;
		}

		lastToken = token;
	});

	return {resource: resource, idMap: identifierMap, resources: resources, validResource: _validResources.map, pathName: _pathName, pathTokens: pathTokens, pathTokenMap: pathTokenMap};
}

exports.route = function(_config)
{
	var validResources = _config.validResources;
	var method = _config.method;
	var parsedUrl = _config.parsedUrl;
	var userId = _config.userId;
	
	var handler, path = parsedUrl.pathname, requestMetaData = this.extractResource(path, validResources);

	if (!requestMetaData.resource)
	{
		handler = function(_contentContext, _request, _response, _respond)
		{
			_contentContext.responseCode = 404;
			_contentContext.content = 'Not Found';
			_respond(_contentContext);
		}
	}
	else
	{
		var allowed = checkSecurity(userId, method, requestMetaData.resource);
				
		if (allowed)
		{		
			requestMetaData.handlerName = './handlers/' + requestMetaData.resource + '/' + method;
			requestMetaData.parsedUrl = parsedUrl;
			handler = require(requestMetaData.handlerName).create(requestMetaData);
		}
		else if (userId && !allowed)
		{
			handler = function(_contentContext, _request, _response, _respond)
			{
				_contentContext.responseCode = 401;
				_contentContext.content = 'Unauthorized';
				_respond(_contentContext);
			} 
		}
		else
		{
			//return an authentication handler
			//handler = authenticationHandler;
		}
	}

	return handler;
};