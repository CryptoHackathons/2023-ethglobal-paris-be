function isEmpty(s){
  return s === undefined || s == null || s.length === 0;
}

function makeSend(obj){
  if(typeof obj === 'number' ){
    return obj.toString();
  } else if (typeof obj === 'object'){
    return JSON.stringify(obj);
  }
  return obj;
}

module.exports = { isEmpty, makeSend };
