export function stringToBool(data:string){
    if(data==='true' || data ==='available' && typeof data==='string'){
        console.log("true data")
        return true
    } else if(data==='false' || data==='not available' && typeof data==='string'){
        console.log("elseif false")
        return false
    } else {
        console.log("false data")
        false
    }
} 