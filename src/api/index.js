//将四个模块的请求的接口函数统一暴露
import * as tradeMark from './product/tradeMark'
import * as attr from './product/Attr'
import * as spu from './product/Spu'
import * as sku from './product/Sku'

export default{
    tradeMark,
    attr,
    spu,
    sku
}
