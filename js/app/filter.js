/*
 * File: filter.js
 * Filter
 *
 * @author: Emil Bergold
 * @version: 1.0
 *
 */


chat.filter('fromNow', function() {
	return function(dateString) {
		return moment(new Date(dateString)).fromNow();
	};
});
