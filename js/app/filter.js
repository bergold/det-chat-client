/*
 * File: filter.js
 * Filter
 *
 * @author: Emil Bergold
 * @version: 1.0
 *
 */


chat.filter('msgmd', ['$filter', function($filter) {
	return function(raw) {
        var parsed = raw;
        parsed = parsed.replace(/\[file:(\d+)\]/g, "<file id=\"$1\" />");
        parsed = $filter('linky')(raw, '_blank');
		return parsed;
	};
}]);
