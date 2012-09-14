var airlift = require('airlift');
var fileSystem = require('fs');

fileSystem.readFile('./test/dictation.txt', function (_error, _dictation)
{
	if (_error) throw _error;
	airlift.generate({filter: {}, generators: {}, dictation: _dictation.toString()});
});