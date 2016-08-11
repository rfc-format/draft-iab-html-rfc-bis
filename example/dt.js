function atv(e, a) {
  if (e == null) {return null;}
  var atr = e.attr(a);
  if (atr == null) {return null;}
  return atr.value();
}

var months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December" ];

function monthName(d) {
  switch (typeof(d)) {
    case 'number':
      return months[d];
    case 'string':
      var num = parseInt(d, 10);
      return isNaN(num) ? d : months[num];
    case 'object':
      // Date
      if (d) {
        return months[d.getMonth()];
      }
  }
  return undefined;
}
exports.monthName =  monthName;

exports.monthNumber = function(m) {
  if (m instanceof Date) {
    m = m.getMonth();
  }
  return months.indexOf(m);
}

function pad2(v) {
  return ("00"+v).slice(-2);
}

function pad4(v) {
  return ("0000"+v).slice(-4);
}

exports.isoYearMonth = function(e) {
  var year = atv(e, 'year');
  if (!year) {return ""};
  var month = atv(e, 'month');
  if (month) {
    var m = months.indexOf(month);
    if (m >= 0) {
      return pad4(year) + "-" + pad2(m+1)
    }
  }
  return pad4(year)
};

exports.isoDate = function(e) {
  var year, month, day;
  if (e instanceof Date) {
    year = e.getUTCFullYear();
    month = e.getUTCMonth()+1;
    day = e.getUTCDate();
  } else {
    var now = new Date();
    year = atv(e, 'year') || now.getUTCFullYear();
    month = atv(e, 'month');
    if (month == null) {
      month = now.getUTCMonth()+1
    } else {
      var m = months.indexOf(month);
      if (m >= 0) {
        month = m+1;
      }
    }
    day = atv(e, 'day') || now.getUTCDate();
  }
  return "" + pad4(year) + "-" + pad2(month) + "-" + pad2(day);
};

exports.isoDateTime = function(d) {
  if (d == null) {
    d = new Date();
  }
  return exports.isoDate(d) + "T" + pad2(d.getUTCHours()) + ":" + pad2(d.getUTCMinutes()) + ":" + pad2(d.getUTCSeconds()) + "Z";
};

exports.monthYear = function(e) {
  var year = atv(e, 'year') || "";
  var month = monthName(atv(e, 'month')) || "";
  if (month && year) {
    return month + " " + year;
  }
  return month + year;
}

exports.monthDayYear = function(iso) {
  // YYYY-MM-DD
  var parts = iso.split('-');
  return months[parseInt(parts[1], 10)-1] + " " +
         parts[2].replace(/^0+/, '') + ", " +
         parts[0];
}
