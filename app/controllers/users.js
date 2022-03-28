class Users{
    list(ctx){
        ctx.body = '用户列表';
    }
    findById(ctx){
        ctx.body = '查找特定用户';
    }
    create(ctx){
        ctx.body = '添加用户';
    }
    update(ctx){
        ctx.body = '修改用户';
    }
    del(ctx){
        ctx.set('Allow','GET,POST')
        ctx.status =204
        ctx.body = '删除用户';
    }
}

module.exports = new Users()
