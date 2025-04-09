export default function decompressProductJSON(defaultJSON,curr) {
  Object.keys(defaultJSON).forEach((key)=>{
    if(curr[key]){
        defaultJSON[key] = {visible:true,parts:curr[key]}
    }else{
        defaultJSON[key].visible = false;
    }
  })
  return defaultJSON
}
