//
// Analytics for the main layout. This includes buttons in the header, footer
// or any other actions that occur on each page.
//

analytics.page();

// Track 15 second bounce rate TODO: Refactor to analytics.track
setTimeout(function() {
  alert('15 sec');
  ga('send', 'event', '15 Seconds', 'time on page more than 15 seconds');
}, 15000);

// Track 3 Minute bounce rate TODO: Refactor to analytics.track
setTimeout(function() {
  alert('3 sec');
  ga('send', 'event', '3 Minutes', 'time on page more than 3 minutes');
}, 180000);
