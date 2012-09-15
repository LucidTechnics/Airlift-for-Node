var cluster = require('cluster');
var server = require('./lib/server');
var _ = require('underscore');

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
	var targetDirectory = _config.targetDirectory||'./genjs';
	var templateRoot = _config.templateRoot||'./templates';

	_.each(resourceMap, function(_resource, _name, _resourceMap)
	{
		_.each(_resource.ancestorList, function(_ancestor)
		{
			dependencyGraph[_ancestor] = dependencyGraph[_ancestor]||{};
			dependencyGraph[_ancestor][_name] = 1;
		});
	});

	console.log('processing resources', resourceMap);
	console.log('dependencies', dependencyGraph);
	
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

	setupGenerator(generators, 'resource-list', require('./lib/generators/airlift-resource-list'));
	setupGenerator(generators, 'resource', require('./lib/generators/airlift-resource'));
	setupGenerator(generators, 'validation', require('./lib/generators/airlift-validation'));
	setupGenerator(generators, 'persistence', require('./lib/generators/airlift-redis-persistence'));
	setupGenerator(generators, 'html', require('./lib/generators/airlift-html'));
	setupGenerator(generators, 'activerecord', require('./lib/generators/airlift-activerecord'));

	_.each(generators, function(_generator, _name)
	{
		console.log(_name, 'generating ...');
		_generator.generate({filter: filter, resources: resourceMap, dependencies: dependencyGraph, targetDirectory: targetDirectory});
	});
};