var cluster = require('cluster');
var server = require('./lib/server');

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

exports.generate = function(_config)
{
	var dictation = require('dictation');
	var resourceMap = dictation.parse(_config.dictation||'');
	var filter = _config.filter||{};
	var dependencyGraph = {};

	_.each(resourceMap, function(_resource, _name, _resourceMap)
	{
		_.each(_resource.ancestors, function(_ancestor)
		{
			dependencyGraph[_ancestor.name] = dependencyGraph[_ancestor.name]||{};
			dependencyGraph[_ancestor.name][_name] = 1;
		});
	});
	
	var generators = _config.generators||{};

	var setupGenerator = function(_generators, _type, _default)
	{
		if (_generators[_type] === undefined || _generators[_type] === null)
		{
			_generators[_type] = _default;
		}
		else if (_generators[_type] === false)
		{
			delete _generators[_type];
		}
	};

	setupGenerator(generators, 'resource', require('./lib/generators/airlift-resource'));
	setupGenerator(generators, 'validation', require('./lib/generators/airlift-validation'));
	setupGenerator(generators, 'persistence', require('./lib/generators/airlift-redis-persistence'));
	setupGenerator(generators, 'html', require('./lib/generators/airlift-html'));
	setupGenerator(generators, 'activerecord', require('./lib/generators/airlift-activerecord'));
	
	var memory = {};

	for (var resource in resourceMap)
	{
		if (filter.isEmpty() === true || (filter.isEmpty() === false && filter[resource] === true))
		{
			_.each(generators, function(_generator, _name)
			{
				memory[_name] = memory[_name]||{};
				_generator.generate({resource: resource, resources: resourceMap, dependencies: dependencyGraph, memory: memory[_name]});
			});
		}
	}
};