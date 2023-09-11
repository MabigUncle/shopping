import request from "@/utils/request";

//获取SKU列表的接口
export const reqSkuList=(spuId)=>{
    return request({
        url:`/admin/product/findBySpuId/${spuId}`,
        method:'get'
    })
}

export const reqSale=(skuId)=>{
    return request({
        url:`/admin/product/onSale/${skuId}`,
        method:'get'
    })
}

export const reqCancel=(skuId)=>{
    return request({
        url:`/admin/product/cancelSale/${skuId}`,
        method:'get'
    })
}