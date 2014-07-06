/*
 * File: filter.js
 * Filter
 *
 * @author: Emil Bergold
 * @version: 1.0
 *
 */


det.filter('msgmd', ['$filter', function($filter) {
	return function(msg) {
        var parsed = _.decode(msg);
        parsed = parsed.replace(/\[file:(\d+)\]/g, "<file id=\"$1\" />");
        parsed = $filter('linky')(parsed, '_blank');
		return parsed;
	};
}]);
