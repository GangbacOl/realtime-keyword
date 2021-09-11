const STANDARD_DAY = new Date("1970-01-01 00:00:00");

export const parseXML = (data) => {
  let xml;
  if (!data || typeof data !== "string") {
    return null;
  }
  try {
    if (window.DOMParser) {
      // Standard
      const tmp = new DOMParser();
      xml = tmp.parseFromString(data, "text/xml");
    } else {
      // IE
      xml = new ActiveXObject("Microsoft.XMLDOM");
      xml.async = "false";
      xml.loadXML(data);
    }
  } catch (e) {
    xml = undefined;
  }
  if (
    !xml ||
    !xml.documentElement ||
    xml.getElementsByTagName("parsererror").length
  ) {
    throw new Error("Invalid XML: " + data);
  }
  return xml;
};

export const xmlToJson = (xml) => {
  // Create the return object
  let obj = {};
  if (xml.nodeType == 1) {
    // element
    // do attributes
    if (xml.attributes.length > 0) {
      // xml.attributes is not array
      obj["@attributes"] = {};
      for (let i = 0; i < xml.attributes.length; i++) {
        let attribute = xml.attributes.item(i);
        obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
      }
    }
  } else if (xml.nodeType == 3) {
    // text
    obj = xml.nodeValue;
  }

  // do children
  if (xml.hasChildNodes()) {
    for (let i = 0; i < xml.childNodes.length; i++) {
      const item = xml.childNodes.item(i);
      const nodeName = item.nodeName;
      if (typeof obj[nodeName] == "undefined") {
        obj[nodeName] = xmlToJson(item);
      } else {
        if (typeof obj[nodeName].push == "undefined") {
          let old = obj[nodeName];
          obj[nodeName] = [];
          obj[nodeName].push(old);
        }
        obj[nodeName].push(xmlToJson(item));
      }
    }
  }
  return obj;
};

export const getEpochDate = (targetDay) => {
  const res = Math.abs(STANDARD_DAY - targetDay) / 1000;
  const betweens = Math.floor(res / 86400);
  return betweens;
};

export const getSelectedKeysFromObject = (currentObject, surviveKeys) => {
  const newObj = {};
  surviveKeys.forEach((targetKey) => {
    newObj[targetKey] = currentObject[targetKey];
  });

  return newObj;
};
