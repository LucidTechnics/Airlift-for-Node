exports.name = 'airlift-resource-list';

exports.generate = function(_config)
{
	if (!_config.resources) { throw 'resource map required'; }
	if (!_config.dependencies) { throw 'dependency graph required'; }
	if (!_config.targetDirectory) { throw 'target directory required'; }
	if (!_config.templateRoot) { throw 'template root directory required'; }

	var resources = _config.resources, dependencies = _config.dependencies,
		targetDirectory = _config.targetDirectory, templateRoot = _config.templateRoot,
		filter = _config.filter||{};
	
	var mustache = require('mu2');

	mustache.root = templateRoot.replace(/\/$/, '') + '/airlift/resource-list/';

	var resourceNames = {'resource-list': []};

	for (var resource in resources)
	{
		resourceNames['resource-list'].push({resourceName: resource});
	}
	
	mustache.compileAndRender('resource.mu', resourceNames).on('data', function (data)
	{
		console.log(data.toString());
	});
	
	console.log('generation completed ...');
};