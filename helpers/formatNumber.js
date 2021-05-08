function setSeparator(separator) {
  const separatorFormat = {};
  switch (separator) {
    case 'commaDot': {
      separatorFormat.thousand = ',';
      separatorFormat.decimal = '.';
      break;
    }
    case 'dotComma': {
      separatorFormat.thousand = '.';
      separatorFormat.decimal = ',';
      break;
    }
    default: {
      separatorFormat.thousand = ' ';
      separatorFormat.decimal = '.';
      break;
    }
  }
  return separatorFormat;
}

function replaceSeparators(number, decimalSeparator, thousandsSeparator) {
  const formattedNumber = number.replace(
    /[,.]/g,
    n => (n === ',' ? thousandsSeparator : decimalSeparator)
  );
  return formattedNumber;
}

function formatNumber(number, fraction, separator) {
  const defaultFormattedNumber = number.toLocaleString('en', {
    minimumFractionDigits: fraction,
    maximumFractionDigits: fraction,
  });
  const separatorFormat = setSeparator(separator);
  const formattedNumber = replaceSeparators(
    defaultFormattedNumber,
    separatorFormat.decimal,
    separatorFormat.thousand
  );
  return formattedNumber;
}

function zeroFill( number, width )
{
  width -= number.toString().length;
  if ( width > 0 )
  {
    return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
  }
  return number + ""; // always return a string
}

export { formatNumber, zeroFill };
