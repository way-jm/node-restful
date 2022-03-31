const mongoose = require('mongoose')

const {Schema,model} = mongoose

const userSchema =  new Schema({
    __v:{type:Number,select:false},
    name:{type:String, required:true},
    password:{type:String,required:true,select:false},
    //头像
    avatar_url:{type:String},
    //性别，枚举
    gender:{type:String,enum:['male','female'],default:'male'},
    // 一句话介绍自己
    headLine:{type:String},
    // 地址,数组
    location:{type:[{type:Schema.Types.ObjectId,ref:"Topic"}],select:false },
    // 工作经历
    employments:{
        type:[
            {
                company:{type:Schema.Types.ObjectId,ref:"Topic"},
                job:{type:Schema.Types.ObjectId,ref:"Topic"},
            }
        ],select:false

    },
    // 教育经历
    educations:{
        type:[
            {
                school:{type:Schema.Types.ObjectId,ref:"Topic"},
                major:{type:Schema.Types.ObjectId,ref:"Topic"},
                diploma:{type:Number,enum:[1,2,3,4,5]},
                entrance_year:{type:Number},
                graduate_year:{type:Number}
            }
        ],select:false
    },
    // 关注者,mongoDB的id类型,对应User 的id引用
    following:{
        type:[{type:Schema.Types.ObjectId,ref:'User'}],
        select:false
    },
})
module.exports = model('User',userSchema)
