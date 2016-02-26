// Filters used throughout the application
angular.module('devops')
  .filter('fromNow', fromNow)
  .filter('timestamp', timestamp)
  .filter('reWord', reWord)
  .filter('panelFilter', panelFilter);

// Replaces timestamp with custom formatted version.
function timestamp() {
  return function(input) {
    return input ? moment(input).format("MM/DD/YY h:mm a") : '';
  };
}

// Replaces timestamp with a from now version using moment
function fromNow() {
  return function(input) {
    return input ? moment(input).fromNow(true) : '';
  };
}

// Re-wording for tooltips when hovering over status of builds
function reWord() {
  return function(input) {
    var alts = {
      red: 'Failed',
      blue: 'Success',
      disabled: 'Disabled',
      yellow: 'Unstable',
      blue_anime: 'In Progress',
      red_anime: 'In Progress',
      aborted_anime: 'In Progress',
      yellow_anime: 'In Progress',
      aborted: 'Aborted',
      grey: 'Disabled'
    };
    if (alts[input])
      return alts[input];
    else
      return input;
  };
}

// Re-words panel-type for correct coloring
function panelFilter() {
  return function(input) {
    var alts = {
      SUCCESS: 'success',
      FAILURE: 'danger',
      UNSTABLE: 'warning'
    };
    if (alts[input])
      return alts[input];
    else
      return 'default';
  };
}
