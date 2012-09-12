var cluster = require("cluster");
var server = require("./lib/server");

exports.start = function(_config)
{
	var config = _config ||{};
	
	if (cluster.isMaster)
	{
		var totalProcesses = config.totalProcesses || (require('os').cpus().length * 4);

		console.log('Instantiating', totalProcesses, 'processe(s)');

		for (var i = 0; i < totalProcesses; i++)
		{
			cluster.fork();
		}

		cluster.on('death', function(_worker)
		{
			console.log('Worker', _worker.pid,'died ...');

			if (config.restartWorker)
			{
				config.restartWorker(_worker);
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
		server.start(config);
	}
};