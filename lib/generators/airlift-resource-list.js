exports.name = 'airlift-resource-list';

exports.generate = function(_config)
{
	if (!_config.resourceMap) { throw 'resource map required'; }
	if (!_config.dependencies) { throw 'dependency graph required'; }
	if (!_config.targetDirectory) { throw 'target directory required'; }
	if (!_config.templateRoot) { throw 'template root directory required'; }

	var resourceMap = _config.resourceMap, dependencies = _config.dependencies,
		targetDirectory = _config.targetDirectory, templateRoot = _config.templateRoot,
		filter = _config.filter||{};
	
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