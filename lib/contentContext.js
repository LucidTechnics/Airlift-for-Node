var ContentContext = function()
{
	this.responseCode = 200;
	this.content = 'no content';
	this.headerMap = {"Content-Type": "text/plain"};
}

ContentContext.prototype.setResponseCode = function(_value)
{
	this.responseCode = _value;
}

ContentContext.prototype.setContentType = function(_value)
{
	this.headerMap["Content-Type"] = _value;
}

ContentContext.prototype.setHeader = function(_name, _value)
{
	this.headerMap[_name] = _value;
}

exports.create = function()
{
	return new ContentContext();
}