exports.name = 'airlift-resource-list';

exports.generate = function(_config)
{
	var resourceMap = _config.resourceMap||throw 'resource map required';
	var dependencies = _config.dependencies||throw 'dependency graph required';
	var filter = _config.filter||{};
	var targetDirectory = _config.targetDirectory||throw 'target directory required';
	var templateRoot = _config.templateRoot||throw 'template root directory required';

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