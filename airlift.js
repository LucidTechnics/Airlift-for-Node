var cluster = require("cluster");
var server = require("./lib/server");

exports.start = function(_config)
{
	if (cluster.isMaster)
	{
		var totalProcesses = _config.totalProcesses || (require('os').cpus().length * 4);

		console.log('Instantiating', totalProcesses, 'processe(s)');

		for (var i = 0; i < totalProcesses; i++)
		{
			cluster.fork();
		}

		cluster.on('death', function(_worker)
		{
			console.log('Worker', _worker.pid,'died ...');

			if (_config.restartWorker)
			{
				_config.restartWorker(_worker);
			}
			else
			{
				cluster.fork();
			}
		});

		console.log("Web Services started successfully.");
	}
	else
	{
		server.start(_config);
	}
};
