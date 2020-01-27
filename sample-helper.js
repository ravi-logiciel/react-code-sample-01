/**
 * Validate String
 *
 * @param {Any} str
 * @param {String} r [Return value if invalid string]
 *
 * @return {String}
 */
export const validateString = (str, r) => {
  const trimString = String(str).trim();

  if (trimString === 'undefined') return r;

  return trimString || r;
};

/**
 * Get Formatted Number
 *
 * Ex: 1234567 -> 1,234,567
 *
 * @param {String|Number} n
 *
 * @return {String}
 */
export const getFormattedNumber = n => {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Scroll to Specific element by class name
 *
 * @param {String} sourceElementSelector [Class name with dot(.) prefix]
 * @param {String} targetElementSelector [Class name with dot(.) prefix]
 *
 * @return {Boolean}
 */
export const scrollTo = (sourceElementSelector, targetElementSelector = '') => {
  const sourceElement = document.querySelector(sourceElementSelector);

  if (!sourceElement) return false;

  const targetElement =
    targetElementSelector && document.querySelector(targetElementSelector);

  const options = {
    behavior: 'smooth',
    block: 'center',
    inline: 'center',
  };

  if (targetElement) {
    targetElement.scrollIntoView(options);
  } else {
    sourceElement.parentElement.scrollIntoView(options);
  }

  return true;
};

/**
 * Format Cell Phone
 *
 * @param {String} phone
 *
 * @return {String}
 */
export const formatPhone = phone => {
  if (!phone) phone = '';
  let v = phone.replace(/[^\d]/g, '');
  v = v.substring(0, 10);

  switch (v.length) {
    case 4:
    case 5:
    case 6:
      return v.replace(/(\d{3})/, '($1) ');

    case 7:
    case 8:
    case 9:
      return v.replace(/(\d{3})(\d{3})/, '($1) $2-');

    default:
      return v.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  }
};

/**
 * Get Only Numbers from String
 *
 * @param {String|Number} v
 *
 * @return {Number|String}
 */
export const getNumbers = v => {
  if (!v) return '';

  const stringValue = String(v);
  let d = stringValue.match(/\d/g);
  d = d ? d.join('') : '';
  d = d === 0 ? '' : d;

  return d;
};

/**
 * Capitalize the first letter of given word
 *
 * @param {String} string
 */
export const capitalize = string => {
  string = String(string);

  return string.charAt(0).toUpperCase() + string.slice(1);
};


/**
 * Programmatically Load By Url
 *
 * @param {String} url
 */
export const programmaticallyLoadByUrl = url => {
  const downloadLink = document.createElement('a');
  downloadLink.href = url;

  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
};
