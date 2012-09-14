var url = require("url");
var connect = require('connect');
var router = require('./router');
var contentContext = require("./contentContext");
var util = require('util');

exports.start = function(_config)
{
	var config = _config||{};
	
	var onRequest = function(_request, _response)
	{
		var parsedUrl = url.parse(_request.url, true);

		var handle = router.route({method: _request.method, parsedUrl: parsedUrl, validResources: _config.validResources});
		var context = contentContext.create();

		var responder = function (_context)
		{
			_response.writeHead(_context.responseCode, _context.headerMap);

			if (!_context.stream)
			{
				_response.write(_context.content);
				_response.end();
			}
			else
			{
				_context.stream.resume();
				_context.stream.on('data', function(_data)
				{
					_response.write(_data);
				});

				_context.stream.on('end', function(_error)
				{
					_response.end();
				});
			}	
		};
		
		handle(context, _request, _response, responder);
	}
	
	var app = connect();
	var http = config.http || require('http');
	var port = config.port || 8080;
	var static = config.static || './static';
	var parser = config.parser || connect.bodyParser();

	if (config.logger) { app = app.use(connect.logger(config.logger)); };
	app = app.use(connect.static(static)).use(parser).use(onRequest);

	http.createServer(app).listen(port);
};