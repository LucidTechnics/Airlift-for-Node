var airlift = require('airlift');

fs.readFile('./dictation.txt', function (_error, _dictation)
{
	if (_error) throw _error;
	airlift.generate({filter: {}, generators: {}, dictation: _dictation});
});