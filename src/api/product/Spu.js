import request from "@/utils/request";

export const reqSpuList=(page,limit,category3Id)=>{
    return request({
        url:`/admin/product/${page}/${limit}`,
        method:'get',
        params:{category3Id}
    })
}
export const reqSpu=(spuid)=>{
    return request({
        url:`/admin/product/getSpuById/${spuid}`,
        method:'get'
    })
}
export const reqTradeMarkList=()=>{
    return request({
        url:`/admin/product/baseTrademark/getTrademarkList`,
        method:'get'
    })
}
export const reqSpuImageList=(spuId)=>{
    return request({
        url:`/admin/product/spuImageList/${spuId}`,
        method:'get'
    })
}
export const reqBaseSaleAttrList=()=>{
    return request({
        url:'/admin/product/baseSaleAttrList',
        method:'get'
    })
}
export const reqAddOrUpdateSpu=(spuInfo)=>{
    if (spuInfo.id) {
        return request({
            url:'/admin/product/updateSpuInfo',
            method:'post',
            data:spuInfo
        })
    }else{
        return request({
            url:'/admin/product/saveSpuInfo',
            method:'post',
            data:spuInfo
        })
    }

}
export const reqDeleteSpu=(spuId)=>{
    return request({
        url:`admin/product/deleteSpu/${spuId}`,
        method:'delete'
    })
}
//获取图片的数据
// export const reqSpuImageList=(spuId)=>{
//     return request({
//         url:`/admin/product/spuImageList/${spuId}`,
//         method:'get'
//     })
// }

export const reqSpuSaleAttrList=(spuId)=>{
    return request({
        url:`/admin/product/spuSaleAttrList/${spuId}`,
        method:'get'
    })
}

export const reqAttrInfoList=(category1Id,category2Id,category3Id)=>{
    return request({
        url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
        method:'get'
    })
}
export const reqAddSku=(skuInfo)=>{
    return request({
        url:'/admin/product/saveSkuInfo',
        method:'post',
        data:skuInfo
    })
}

//获取SKU列表的接口
export const reqSkuList=(spuId)=>{
    return request({
        url:`/admin/product/findBySpuId/${spuId}`,
        method:'get'
    })
}