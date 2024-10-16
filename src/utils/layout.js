/**
 * Changes the HTML attributes
 */
const changeHTMLAttribute = (attribute, value) => {
  if (document.body) document.getElementsByTagName('html')[0].setAttribute(attribute, value);
};

export { changeHTMLAttribute };
