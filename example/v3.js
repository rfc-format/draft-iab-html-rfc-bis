var romanize = require('romanize');

function atv(e, a) {
  if (e == null) {return null;}
  var atr = e.attr(a);
  if (atr == null) {return null;}
  return atr.value();
}

var ignored = [
  "name"
];

exports.isIgnored = function(e) {
  if (e == null) {return null};
  var nm = (typeof(e) == "string") ? e : e.name();
  return (ignored.indexOf(nm) >= 0);
};

exports.ws = function(ary) {
  return ary.map(function(s) {
    s = s.trim();
    return s.replace(/\s+/gm, ' ');
  }).filter(function(s) {
    return s.length > 0;
  }).join(' ');
}

var categories = {
  std:      "Standards Track",
  bcp:      "BCP",
  info:     "Informational",
  exp:      "Experimental",
  historic: "Historic"
};

exports.status = function(e) {
  return categories[atv(e, 'category')];
};

function to26(n) {
  if (n==0) {
    return [0];
  }
  var rem = n;
  var digs = [];
  while (rem > 0) {
    // for the first 26, we've already subtracted 1.
    // For other digits, subtract 1 so that we can add to 'a' later
    digs.unshift((rem % 26) - (digs.length>0? 1 : 0));
    rem = Math.floor(rem/26)
  }
  return digs;
}

exports.olStyledNum = function(style, num) {
  return style.replace(/%([cCdiIt%])/g, function(match, s) {
    switch (s) {
      case '%':
        return '%';
      case 't':
        return to26(num-1).toString();
      case 'c':
        return to26(num-1).map(function (n) {
          return String.fromCharCode('a'.charCodeAt(0)+n)
        }).join('');
      case 'C':
        return to26(num-1).map(function (n) {
          return String.fromCharCode('A'.charCodeAt(0)+n);
        }).join('');
      case 'd':
        return "" + num;
      case 'i':
        return romanize(num).toLowerCase();
      case 'I':
        return romanize(num);
    }
  })
}

function strcmp(a,b) {
  if (a === null) {
    if (b === null) {
      return 0;
    }
    return -1
  }
  if (b === null) {
    return 1;
  }
  if (a < b) {
    return -1;
  }
  if (b < a) {
    return 1;
  }
  return 0;
}

function compareIrefs(a,b) {
  var ret = strcmp(atv(a, 'item'), atv(b, 'item'));
  if (ret === 0) {
    ret = strcmp(atv(a, 'subitem'), atv(b, 'subitem'));
  }
  return ret;
}

function getSection(iref) {
  var section = iref.get('ancestor::section');
  var pn = atv(section, 'pn');
  return {
    irefid: atv(iref, 'irefid'),
    section: pn.replace(/^s-/, ''),
    primary: atv(iref, 'primary') === 'true'
  }
}

exports.indexPartition = function(irefs) {
  irefs = irefs.sort(compareIrefs);
  // partition by starting first letter
  var arefs = []
  var lastChar = {
    char:null,
    items:[]
  };
  var lastItem = {
    item: null,
    subItems: [],
    irefids: []
  };
  var lastSubItem = {
    subItem: null,
    irefids: []
  };
  irefs.forEach(function(iref) {
    var i = atv(iref, 'item')
    var fc = i[0].toUpperCase();
    if (fc !== lastChar.char) {
      lastChar = {
        char: fc,
        items: []
      }
      arefs.push(lastChar);
    }
    if (i !== lastItem.item) {
      lastItem = {
        item: i,
        subItems: [],
        irefids: []
      }
      lastChar.items.push(lastItem);
    }
    var si = atv(iref, 'subitem');
    if (si) {
      if (si !== lastSubItem.subItem) {
        lastSubItem = {
          subItem: si,
          irefids: []
        };
        lastItem.subItems.push(lastSubItem);
      }
      lastSubItem.irefids.push(getSection(iref));
    } else {
      lastItem.irefids.push(getSection(iref));
    }
  });
  return arefs;
}

exports.pickNames = function pickNames(author, initials_surname, preferAscii) {
  var initials = atv(author, 'initials');
  var surname = atv(author, 'surname');
  var fullname = atv(author, 'fullname');
  var asciiInitials = atv(author, 'asciiInitials');
  var asciiSurname = atv(author, 'asciiSurname');
  var asciiFullname = atv(author, 'asciiFullname');
  var hasAscii = !!(asciiInitials || asciiSurname || asciiFullname);
  // if there is no ascii* attribs, it's old-school.
  if (!hasAscii) {
    preferAscii = false;
  }
  if (preferAscii) {
    if (asciiInitials && asciiSurname) {
      if (initials_surname) {
        return asciiInitials + " " + asciiSurname;
      } else {
        return asciiSurname + ", " + asciiInitials;
      }
    }
    if (asciiFullname) {
      return asciiFullname;
    }
    // if we don't have enough to make a name from ascii, try to make
    // a name from non-ascii.  This assumes that just a surname or just
    // an initial isn't enough for a name.
  }
  if ((initials||asciiInitials) && (surname||asciiSurname)) {
    if (initials_surname) {
      return (initials||asciiInitials) + " " + (surname||asciiSurname);
    } else {
      return (surname||asciiSurname) + ", " + (initials||asciiInitials);
    }
  }
  if (fullname||asciiFullname) {
    return fullname||asciiFullname;
  }
  return surname || asciiSurname || "";
}

exports.preferTrim = function(non, ascii, preferAscii) {
  var nonT = non ? non.trim() : "";
  var asciiT = ascii ? ascii.trim() : "";

  if (preferAscii) {
    return asciiT || nonT;
  } else {
    return nonT || asciiT;
  }
}
