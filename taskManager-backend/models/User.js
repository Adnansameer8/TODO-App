const mongoose=require("mongoose");
const bcrypt=require("bcrypt");

const userSchema=new mongoose.Schema({
    email:String,
    password:String
});

userSchema.pre("save",async function(next) {
    this.password=await bcrypt.hash(this.password,10);
    next();
})

userSchema.methods.checkPassword=function(plainPassword){
    return bcrypt.compare(plainPassword,this.password);
};

module.exports=mongoose.model("User",userSchema);