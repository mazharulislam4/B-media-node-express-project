
// error 
 export  function erro(msg ,  status){
 const e = new Error();
 e.message = msg;
 e.status = status; 
 return e;
}



