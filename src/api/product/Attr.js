//平台属性管理系统请求文件
import request from "@/utils/request";

//获取一级分类接口
export const reqCategory1List=()=>{
    return request({
        url:'/admin/product/getCategory1',
        method:'get'
    })
}
//获取二级分类接口
export const reqCategory2List=(category1Id)=>{
    return request({
        url:`/admin/product/getCategory2/${category1Id}`,
        method:'get'
    })
}
//获取三级分类接口
export const reqCategory3List=(category2Id)=>{
    return request({
        url:`/admin/product/getCategory3/${category2Id}`,
        method:'get'
    })
}
//获取平台属性的接口
export const reqAttrList=(category1Id,category2Id,category3Id)=>{
    return request({
        url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
        method:'get'
    })
}
//添加属性与属性值的接口
export const reqAddOrUpdateAttr=(data)=>{
    return request({
        url: '/admin/product/saveAttrInfo',
        method:'post',
        data
    })
}
//删除属性值
export const reqDeleteAttr=(attrId)=>{
    return request({
        url:`/admin/product/deleteAttr/${attrId}`,
        method:'delete',
    })
}