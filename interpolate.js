module.exports = function(string, data) {

    return string.replace(/{([^{}]*)}/g, function(original, match) {

        var result = data;

        var parts = match.split('.');

        var i = -1;

        while(++i < parts.length - 1) {

            if(typeof result[parts[i]] === 'object') {

                result = result[parts[i]];
            }
            else {

                throw Error('failed to interpolate ' + parts.join('.') + ' at ' + parts.slice(0, i+1).join('.'));
            }
        }

        if(typeof result[parts[i]] === 'number' || typeof result[parts[i]] === 'string') {

            result = result[parts[i]];
        }
        else {

            throw Error('failed to interpolate ' + parts.join('.') + ' at ' + parts.slice(0, i+1).join('.'));
        }

        return result;
    });
};
