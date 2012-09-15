exports.name = 'airlift-resource-list';

exports.generate = function(_config)
{
	var resourceMap = if (!_config.resourceMap) { throw 'resource map required'; }
	var dependencies = if (!_config.dependencies) { throw 'dependency graph required'; }
	var targetDirectory = if (!_config.targetDirectory) { throw 'target directory required'; }
	var templateRoot = if (!_config.templateRoot) { throw 'template root directory required'; }
	var filter = _config.filter||{};
	
	var mustache = require('mu2');

	mustache.root = templateRoot.replace(/\/$/, '') + '/airlift/resource-list/';

	var resourceNames = {'resource-list': []};

	for (var resource in resourceMap)
	{
		resourceNames['resource-list'].push(resource);
	}
	
	mu.compileAndRender('resource.mu', resourceNames).on('data', function (data)
	{
		console.log(data.toString());
	});
	
	console.log('generation completed ...');
};