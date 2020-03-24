/**
 * Created by lkt on 15-4-17.
 */

function Room(classId,userId){
    this.users = new Array();
    this.addUser(userId);
    this.userId=userId;
    this.classId=classId;
    return this;
}
module.exports = Room;

Room.prototype.addUser=function addUser(user){
    this.users.push(user);
}
Room.prototype.removeUser=function removeUser(user){

    var index = this.users.indexOf(user);
    //删除数组中的元素，长度也跟着改变
    this.users.splice(index,1);

}
Room.prototype.setClassId=function setClassId(classId){
    this.classId=classId;
}
Room.prototype.getClassId=function getClassId(){
    return this.classId;
}
Room.prototype.getUsers=function getUsers(){
    return this.users;
}
Room.prototype.setUserId=function setUserId(userId){
    this.userId=userId;
}
Room.prototype.getUserId=function getUserId(){
    return this.userId;
}
Room.prototype.userContains=function userContains(user){
    for(var i=0;i<this.users.length;i++){
        if(this.users[i]==user){
            return true;
        }
    }
    return false;
}