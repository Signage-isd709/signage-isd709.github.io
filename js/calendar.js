(function($) {

  $.fn.gCalReader = function(options) {
    var $div = $(this);

    var defaults = $.extend({
        calendarId: 'web.printshop@isd709.org',
        apiKey: 'AIzaSyCHhi-u9BPj-jFIqLVw4VKpzZUzeriG1ow',
        dateFormat: 'LongDate',
        errorMsg: 'No events in calendar',
        maxEvents: 15,
        futureEventsOnly: true,
        sortDescending: true
      },
      options);

    var s = '';
    var feedUrl = 'https://www.googleapis.com/calendar/v3/calendars/' +
      encodeURIComponent(defaults.calendarId.trim()) +'/events?key=' + defaults.apiKey +
      '&orderBy=startTime&singleEvents=true';
      if(defaults.futureEventsOnly) {
        feedUrl+='&timeMin='+ new Date().toISOString();
      }

    $.ajax({
      url: feedUrl,
      dataType: 'json',
      success: function(data) {
        if(defaults.sortDescending){
          data.items = data.items.reverse();
        }
        data.items = data.items.slice(0, defaults.maxEvents);

        $.each(data.items, function(e, item) {
          var eventdate = item.start.dateTime || item.start.date ||'';
          console.log(item.start.dateTime);
          console.log(item.start.date);
          var summary = item.summary || '';
					var description = item.description;
					var location = item.location;
					var eventDate = formatDate(eventdate, defaults.dateFormat.trim());
					var monthCal = eventDate[1];
					var dayNumCal = eventDate[2];
					var dayCal = eventDate[3];
					var calIcon;
					calIcon = '<time datetime= ' + item.start.date + ' class="icon"><em>' + dayCal + '</em><strong>' + monthCal + '</strong><span>' + dayNumCal + '</span></time>';
					s = '<div class="eventtitle">'+ summary +'</div>';
					//s +='<div class="eventdate"> When: '+ eventDate[0]; +'</div>';
					if(location) {
						s +='<div class="location">Where: '+ location +'</div>';
					}
					if(description) {
						s +='<div class="description">'+ description +'</div>';
					}
					$($div).append('<div name="eventWrapper"><table><td><div name="eventIcon" align="left">' + calIcon + '</div></td><td><div name="eventInfo">' + s + '</div></td></table>');
        });
      },
      error: function(xhr, status) {
        $($div).append('<p>' + status +' : '+ defaults.errorMsg +'</p>');
      }
    });

    function formatDate(strDate, strFormat) {
      var fd, arrDate, am, time;
      var calendar = {
        months: {
          full: ['', 'January', 'February', 'March', 'April', 'May',
            'June', 'July', 'August', 'September', 'October',
            'November', 'December'
          ],
          short: ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
            'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
          ]
        },
        days: {
          full: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
            'Friday', 'Saturday', 'Sunday'
          ],
          short: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat',
            'Sun'
          ]
        }
      };

      if (strDate.length > 10) {
        arrDate = /(\d+)\-(\d+)\-(\d+)T(\d+)\:(\d+)/.exec(strDate);

        am = (arrDate[4] < 12);
        time = am ? (parseInt(arrDate[4]) + ':' + arrDate[5] + ' AM') : (
          arrDate[4] - 12 + ':' + arrDate[5] + ' PM');

        if (time.indexOf('0') === 0) {
          if (time.indexOf(':00') === 1) {
            if (time.indexOf('AM') === 5) {
              time = 'MIDNIGHT';
            } else {
              time = 'NOON';
            }
          } else {
            time = time.replace('0:', '12:');
          }
        }

      } else {
        arrDate = /(\d+)\-(\d+)\-(\d+)/.exec(strDate);
        time = 'Time not present in feed.';
      }

      var year = parseInt(arrDate[1]);
      var month = parseInt(arrDate[2]);
      var dayNum = parseInt(arrDate[3]);

      var d = new Date(year, month - 1, dayNum);
      var monthCal = calendar.months.full[month];
      var daynumCal = dayNum;
      var dayCal = calendar.days.full[d.getDay()];
      console.log(monthCal);
      console.log(daynumCal);
      console.log(dayCal);

      switch (strFormat) {
        case 'ShortTime':
          fd = time;
          break;
        case 'ShortDate':
          fd = month + '/' + dayNum + '/' + year;
          break;
        case 'LongDate':
          fd = calendar.days.full[d.getDay()] + ' ' + calendar.months.full[
            month] + ' ' + dayNum + ', ' + year;
          break;
        case 'LongDate+ShortTime':
          fd = calendar.days.full[d.getDay()] + ' ' + calendar.months.full[
            month] + ' ' + dayNum + ', ' + year + ' ' + time;
          break;
        case 'ShortDate+ShortTime':
          fd = month + '/' + dayNum + '/' + year + ' ' + time;
          break;
        case 'DayMonth':
          fd = calendar.days.short[d.getDay()] + ', ' + calendar.months.full[
            month] + ' ' + dayNum;
          break;
        case 'MonthDay':
          fd = calendar.months.full[month] + ' ' + dayNum;
          break;
        case 'YearMonth':
          fd = calendar.months.full[month] + ' ' + year;
          break;
        default:
          fd = calendar.days.full[d.getDay()] + ' ' + calendar.months.short[
            month] + ' ' + dayNum + ', ' + year + ' ' + time;
      }

      return [fd, monthCal, daynumCal, dayCal]; 
    }
  };
  $(document).ready(function(){
  $('.CalEvents').slick({
    slidesToShow: 3,
    vertical: true,
    autoplay: true,
    arrows: false
  });
});
}(jQuery));
