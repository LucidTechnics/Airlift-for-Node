var contentContext = require('./contentContext');
var validDomains = require('./domain');
var checkSecurity = function() { return true; }

exports.extractUrlDomain = function(_pathName)
{
	var pathTokens = _pathName.replace(/^\//, '').split('/');

	var lastToken;

	var domains = {};
	var identifierMap = {};
	var domain;
	var pathTokenMap = {};
	
	pathTokens.forEach(function(_token, _index)
	{
		var token = unescape(_token);
		
		pathTokenMap[token] = pathTokenMap[token]||0;
		pathTokenMap[token] = pathTokenMap[token] + 1;
		
		if (lastToken && validDomains.map[lastToken])
		{
			identifierMap[lastToken] = token;
		}
		else if (validDomains.map[token])
		{
			domains[token] = 1;
			domain = token;
		}

		lastToken = token;
	});

	return {domain: domain, idMap: identifierMap, domains: domains, validDomains: validDomains.map, pathName: _pathName, pathTokens: pathTokens, pathTokenMap: pathTokenMap};
}

exports.route = function(_method, _parsedUrl, _userId)
{
	var path = _parsedUrl.pathname;

	var handler, requestMetaData = this.extractUrlDomain(path);

	if (!requestMetaData.domain)
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
		var allowed = checkSecurity(_userId, _method, requestMetaData.domain);
				
		if (allowed)
		{		
			requestMetaData.handlerName = './handlers/' + requestMetaData.domain + '/' + _method;
			requestMetaData.parsedUrl = _parsedUrl;
			handler = require(requestMetaData.handlerName).create(requestMetaData);
		}
		else if (_userId && !allowed)
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