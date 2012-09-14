var airlift = require('airlift');
var fileSystem = require('fs');

var generator = { generate: function() { console.log('generator called for') } };

var generators = {
'resource': generator,
'validation': generator,
'persistence': generator,
'html': generator,
'activerecord': generator
};

fileSystem.readFile('./test/dictation.txt', function (_error, _dictation)
{
	if (_error) throw _error;
	airlift.generate({filter: {}, generators: {}, dictation: _dictation.toString()});
});