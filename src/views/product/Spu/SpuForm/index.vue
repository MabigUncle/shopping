<template>
    <div>
        <el-form ref="form" label-width="80px">
            <el-form-item label="SPU名称">
                <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
            </el-form-item>
            <el-form-item label="品牌">
                <el-select placeholder="请选择品牌" v-model="spu.tmId">
                    <el-option :label="tm.tmName" :value="tm.id" v-for="(tm, index) in tradeMarkList"
                        :key="tm.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="SPU描述">
                <el-input placeholder="SPU描述" type="textarea" rows="4" v-model="spu.description"></el-input>
            </el-form-item>
            <el-form-item label="SPU图片">
                <el-upload action="/dev-api/admin/product/fileUpload" list-type="picture-card"
                    :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :file-list="spuImageList" :on-success="handlerSuccess">
                    <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
            </el-form-item>
            <el-form-item label="品牌">
                <el-select :placeholder="`还有${unSelectSaleAttr.length}未选择`" v-model="attrIdAndAttrName">
                    <el-option :label="unselect.name" :value="`${unselect.id}:${unselect.name}`" v-for="(unselect,index) in unSelectSaleAttr" :key="unselect.id"></el-option>
                </el-select>
                <el-button type="primary" size="default" @click="addSaleAttr" icon="el-icon-plus" :disabled="!attrIdAndAttrName
                ">添加销售属性</el-button>
                <el-table border stripe style="width: 100%;" :data="spu.spuSaleAttrList">
                    <el-table-column type="index" prop='prop' label="序号" width="80px" align="center">
                    </el-table-column>
                    <el-table-column type="type" prop='saleAttrName' label="属性名" width="80px" align="center">
                    </el-table-column>
                    <el-table-column prop='prop' label="属性名称列表" width="width" align="center">
                        <template slot-scope="{row,$index}">
                                <el-tag :key="tag.id" v-for=" (tag,index) in row.spuSaleAttrValueList" closable :disable-transitions="false" @close="row.spuSaleAttrValueList.splice(index,1)">
                                    {{ tag.saleAttrValueName }}
                                    </el-tag>
                                    <!--  @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm" -->
                                <el-input v-if="row.inputVisible"  class="input-new-tag" v-model="row.inputValue" ref="saveTagInput" size="small" @blur="handleInputConfirm(row)"></el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row)">+ 新标签</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column type="type" prop='prop' label="操作" width="80px" align="center">
                        <template slot-scope="{row,$index}">
                            <el-button type="mini" size="danger" icon="el-icon-delete"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
                <el-button @click="cancel">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
export default {
    name: 'SpuForm',
    data() {
        return {
            dialogImageUrl: '',
            dialogVisible: false,
            dynamicTags: ['标签一', '标签二', '标签三'],
            inputVisible: false,
            inputValue: '',
            spu: {
                //3及分类id
                category3Id: 0,
                //描述
                description: "",
                spuName: "",
                //品牌id
                tmId: "",
                //收集图片信息
                spuImageList: [
                ],
                spuSaleAttrList: [
                    {
                        baseSaleAttrId: 0,
                        id: 0,
                        saleAttrName: "string",
                        spuId: 0,
                        spuSaleAttrValueList: [
                            {
                                baseSaleAttrId: 0,
                                id: 0,
                                isChecked: "string",
                                saleAttrName: "string",
                                saleAttrValueName: "string",
                                spuId: 0
                            }
                        ]
                    }
                ]
            },
            tradeMarkList: [],//存储品牌信息
            spuImageList: [],//存储spu图片数据
            saleAttrList: [],//销售属性的数据
            attrIdAndAttrName:'',//收集未选择的销售属性id
        }
    },
    computed:{
        unSelectSaleAttr(){
            let result=this.saleAttrList.filter((item)=>{
                return this.spu.spuSaleAttrList.every((item1)=>{
                    return item.name!=item1.saleAttrName
                })
            })
            return result
        }
    },
    methods: {
        //照片墙删除某一图片会触发
        handleRemove(file, fileList) {
            this.spuImageList=fileList
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        //初始化spuform的数组
        async initSpuDate(spu) {
            //spu
            let spuResult = await this.$API.spu.reqSpu(spu.id)
            if (spuResult.code == 200) {
                this.spu = spuResult.data
            }
            //品牌
            let tradeResult = await this.$API.spu.reqTradeMarkList()
            if (tradeResult.code == 200) {
                this.tradeMarkList = tradeResult.data
            }
            //图片
            let imageResult = await this.$API.spu.reqSpuImageList(spu.id)
            if (imageResult.code == 200) {
                let imageArr = imageResult.data
                imageArr.forEach(item => {
                    item.name = item.imgName
                    item.url = item.imgUrl
                });
                this.spuImageList = imageArr
            }
            //销售属性
            let saleResult = await this.$API.spu.reqBaseSaleAttrList()
            if (saleResult.code == 200) {
                this.saleAttrList = saleResult.data
            }
        },
        //照片请图片上传成功的回调
        handlerSuccess(response,file,fileList){
            this.spuImageList=fileList
        },
        addSaleAttrValue(row) {
            this.$set(row,'inputVisible',true)
            this.$set(row,'inputValue','')
        },
        handleInputConfirm(row) {
            const {baseSaleAttrId,inputValue}=row
            if (inputValue.trim()=='') {
                this.$message('属性值不能为空')
                return
            }
            let result=row.spuSaleAttrValueList.every(item=>item.saleAttrValueName!=inputValue)
            let newSaleAttrValue={baseSaleAttrId,saleAttrValueName:inputValue}
            row.spuSaleAttrValueList.push(newSaleAttrValue)
            row.inputVisible = false;
        },
        addSaleAttr(){
            //把收集到的销售属性的字段分割
            const [baseSaleAttrId,saleAttrName]=this.attrIdAndAttrName.split(':')
            //向spu对象的数组属性添加
            let newSaleAttr={baseSaleAttrId,saleAttrName,spuSaleAttrValueList:[]}
            this.spu.spuSaleAttrList.push(newSaleAttr)
            this.attrIdAndAttrName=''

        },
        async addOrUpdateSpu(){
            this.spu.spuImageList=this.spuImageList.map((item)=>{
                return{
                    imageName:item.name,
                    imageUrl:(item.response&&item.response.data)||item.url
                }
            })
            let result=await this.$API.spu.reqAddOrUpdateSpu(this.spu)
            //console.log(result);
            if (result.code==200) {
                this.$message({type:'success',message:'保存成功'})
                this.$emit('changeSence',{sence:0,flag:this.spu.id?"修改":"添加"})
            }
            Object.assign(this._data,this.$options.data())
        },
        async addSpuData(category3Id){
            //添加dpu时候手机三级分类的id
            this.spu.category3Id=category3Id
            let tradeMarkResult=await this.$API.spu.reqTradeMarkList()
            if (tradeMarkResult.code==200) {
                this.tradeMarkList=tradeMarkResult.data
            }
            let saleResult = await this.$API.spu.reqBaseSaleAttrList()
            if (saleResult.code == 200) {
                this.saleAttrList = saleResult.data
            }
        },
        cancel(){
            this.$emit('changeSence',{sence:0,flag:""})
            Object.assign(this._data,this.$options.data())
        },
    }

}

</script>
<style>
.el-tag+.el-tag {
    margin-left: 10px;
}

.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}

.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
}
</style>