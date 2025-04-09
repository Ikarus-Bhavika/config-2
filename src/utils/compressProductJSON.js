export default function compressProductJSON(product) {
    return Object.entries(product).reduce((a,[key,value])=>{
        if(value.visible){
            return {...a,[key]:value.parts || {}}
        }
        return a
    },{})
}