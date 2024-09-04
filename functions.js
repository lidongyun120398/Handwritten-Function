//Object.create
function myCreate(obj) {
  function F() {}
  F.prototype = obj;
  return new F();
}

//instanceof
// function myInstanceOf(left,right){
//   let proto =
// }
