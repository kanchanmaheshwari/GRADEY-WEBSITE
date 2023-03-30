class InvalidRGBValueError extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidRGBValueError";
  }
}

class InvalidHSVValueError extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidHSVValueError";
  }
}

function RGBtoHSV(r, g, b) {
  if (r < 0 || g < 0 || b < 0 || r > 255 || g > 255 || b > 255) {
    throw new InvalidRGBValueError("RGB values must be in the range 0 to 255.");
  }
  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    throw new InvalidRGBValueError("RGB values must be numeric.");
  }
  //remove spaces from input RGB values, convert to int
  r = parseInt(('' + r).replace(/\s/g, ''), 10);
  g = parseInt(('' + g).replace(/\s/g, ''), 10);
  b = parseInt(('' + b).replace(/\s/g, ''), 10);

  r = r / 255; g = g / 255; b = b / 255;
  var minRGB = Math.min(r, Math.min(g, b));
  var maxRGB = Math.max(r, Math.max(g, b));

  // Black-gray-white
  if (minRGB == maxRGB) {
    return [0, 0, minRGB];
  }

  // Colors other than black-gray-white:
  var d = (r == minRGB) ? g - b : ((b == minRGB) ? r - g : b - r);
  var h = (r == minRGB) ? 3 : ((b == minRGB) ? 1 : 5);
  var computedH = 60 * (h - d / (maxRGB - minRGB));
  var computedS = (maxRGB - minRGB) / maxRGB;
  var computedV = maxRGB;
  return { h: computedH, s: computedS, v: computedV };
}

function HSVtoRGB(hue, saturation, value) {
  let d = 0.0166666666666666 * hue;
  let c = value * saturation;
  let x = c - c * Math.abs(d % 2.0 - 1.0);
  let m = value - c;
  c += m;
  x += m;

  c = Math.round(c * 255)
  x = Math.round(x * 255)
  m = Math.round(m * 255)
  switch (d >>> 0) {
    case 0: return { red: c, green: x, blue: m };
    case 1: return { red: x, green: c, blue: m };
    case 2: return { red: m, green: c, blue: x };
    case 3: return { red: m, green: x, blue: c };
    case 4: return { red: x, green: m, blue: c };
  }
  return { red: c, green: m, blue: x };
};

function formatRGBColor(red, green, blue) {
  return (` rgb(${red}, ${green}, ${blue})`)
}

function getAccentColorFor(red, green, blue) {
  if (red < 0 || green < 0 || blue < 0 || red > 255 || green > 255 || blue > 255) {
    throw new InvalidRGBValueError('RGB values must be in the range 0 to 255.');
  }
  let HSVColor = RGBtoHSV(red, green, blue)

  let accentColor = {
    h: HSVColor['h']
  }

  if (HSVColor['s'] > 0.65) {
    accentColor['s'] = (HSVColor['s'] / 1.55)
  } else {
    accentColor['s'] = (HSVColor['s'] * 1.55) > 1 ? 1 : (HSVColor['s'] * 1.55)
  }

  if (HSVColor['v'] < 0.55) {
    accentColor['v'] = (HSVColor['v'] * 1.5) > 1 ? 1 : (HSVColor['v'] * 1.5)
  } else {
    accentColor['v'] = (HSVColor['v'] / 2.5)
  }

  let RGBDict = HSVtoRGB(accentColor['h'], accentColor['s'], accentColor['v'])

  return formatRGBColor(RGBDict['red'], RGBDict['green'], RGBDict['blue'])
};


function getTextColorForBackground(red, green, blue) {
  const brightness = Math.round(((parseInt(red) * 299) +
    (parseInt(green) * 587) +
    (parseInt(blue) * 114)) / 1000);

  const textColour = (brightness > 125) ? 'black' : 'white';

  return textColour
}

export { getAccentColorFor, getTextColorForBackground, RGBtoHSV, HSVtoRGB }











// function cutString(color){
//   return (color.charAt(0) === "#") ? color.substring(1,7) : color;
// }

// function HextoRgb(color){
//   // console.log(color)
//   let hexToR = parseInt(cutString(color).substring(0,2), 16);
//   let hexToG = parseInt(cutString(color).substring(2,4), 16);
//   let hexToB = parseInt(cutString(color).substring(4,6), 16);
//   return formatRGBColor(hexToR, hexToG, hexToB)
// }

 // function colorForCourse(color){
 //      let courseColorRgb = "";
 //     if(color.includes('rgb')) {
 //        courseColorRgb = `${color}`;
 //       console.log(`rgb: ${courseColorRgb}`)
 //     } 
 //     if(color.includes('#')) {
 //       courseColorRgb = HextoRgb(color);
 //       console.log(`#: ${courseColorRgb}`)
 //     }
 //       else { courseColorRgb = getComputedStyle(document.documentElement)
 //    .getPropertyValue(`--${course.color}`)
 //             console.log(`string: ${courseColorRgb}`)
 //    }
 //      return courseColorRgb
 //    }
