//品牌管理数据模块
import request from '@/utils/request'

export const reqTradeMark=(page,limit)=>{
    return request({
        url:`/admin/product/baseTrademark/${page}/${limit}`,
        method:'get'
    })
}
//处理添加品牌  POST /admin/product/baseTrademark/save
//PUT /admin/product/baseTrademark/update  修改品牌
export const reqAddOrUpdateTradeMark=(tradeMark)=>{
    //有ID为修改
    if (tradeMark.id) {
        return request({
            url:"/admin/product/baseTrademark/update",
            method:'put',
            data:tradeMark
        })
    } else {
        return request({
            url:"/admin/product/baseTrademark/save",
            method:'post',
            data:tradeMark
        })
    }
}
//DELETE /admin/product/baseTrademark/remove/{id}  删除品牌
export const reqDeleteTradeMark=(id)=>{
    return request({
        url:`/admin/product/baseTrademark/remove/${id}`,
        method:'delete'
    })
}