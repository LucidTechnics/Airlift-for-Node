var Configuration = function()
{
	this.templateDirectory = 'src/templates';

	//this.host = 'ec2-107-20-52-9.compute-1.amazonaws.com';
	this.host = '127.0.0.1';

	this.filingsModelServerMap = {
		'127.0.0.1:6380': {host: this.host, port: '6380'},
		'127.0.0.2:6382': {host: this.host, port: '6382'},
		'127.0.0.3:6383': {host: this.host, port: '6383'},
		'127.0.0.3:6384': {host: this.host, port: '6384'}
	};

	this.taxonomyModelServerMap = {
		'127.0.0.1:6379': {host: this.host, port: '6379'},
	};

	this.gazetteerModelServerMap = 
	{
		'127.0.0.1:6385': {host: this.host, port: '6385'},
	};
};

exports.create = function()
{
	return new Configuration();
};