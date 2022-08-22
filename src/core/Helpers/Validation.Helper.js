
Isset = (field)=>{
    return (field && field != null && field != "" && field != typeof undefined) ? true : false
}
module.exports = {Isset}