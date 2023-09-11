<template>
    <div>
        <el-card style="margin: 20px 0px;">
            <CategorySelect @getCategoryId="getCategoryId" :show="sence != 0"></CategorySelect>
        </el-card>
        <!-- 下面的三个部分进行切换 -->
        <el-card>
            <div v-show="sence == 0">
                <el-button type="primary" size="default" @click="addSpu" icon="el-icon-plus"
                    :disabled="!category3Id">添加SPU</el-button>
                <el-table border stripe style="width: 100%;" :data="records">
                    <el-table-column type="index" label="序号" width="80" align="center">
                    </el-table-column>
                    <el-table-column prop="spuName" label="SPU名称" width="width" align="center">
                    </el-table-column>
                    <el-table-column prop="description" label="SPU描述" width="width" align="center">
                    </el-table-column>
                    <el-table-column prop="prop" label="操作" width="width" align="center">
                        <template slot-scope="{row,$index}">
                            <hint-button type="success" size="mini" icon="el-icon-plus" title="添加sku"
                                @click="addSku(row)"></hint-button>
                            <hint-button type="warning" size="mini" icon="el-icon-edit" title="修改spu"
                                @click="updateSpu(row)"></hint-button>
                            <hint-button type="info" size="mini" icon="el-icon-info" title="查看当前spu全部sku列表"
                                @click="handler(row)"></hint-button>
                            <el-popconfirm title="确定删除？" @onConfirm="deleteSpu(row)">
                                <hint-button type="danger" size="mini" icon="el-icon-delete" title="删除spu"
                                    slot="reference"></hint-button>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination :current-page="page" :page-sizes="[3, 5, 10]" :page-size="limit"
                    layout="prev, pager, next, jumper,->,total,sizes" :total="total" @current-change="handleCurrentChange"
                    style="text-align: center;">
                </el-pagination>
            </div>
            <div>
                <SpuForm v-show="sence == 1" @changeSence="changeSence" ref="spu"></SpuForm>
                <SkuForm v-show="sence == 2" ref="sku" @changeSences="changeSences"></SkuForm>
            </div>
        </el-card>
        <el-dialog :title="`${spu.spuName}的sku列表`" :visible.sync="dialogTableVisible" v-loading="loading" :before-close="close">
            <el-table  :data="skuList">
                <el-table-column property="skuName" label="名称" width="width"></el-table-column>
                <el-table-column property="price" label="价格" width="width"></el-table-column>
                <el-table-column property="weight" label="重量" width="width"></el-table-column>
                <el-table-column  label="默认图片" width="width">
                    <template slot-scope="{row,$index}">
                        <img :src="row.skuDefaultImg" alt="" style="width: 100px;height: 100px;">
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>
<script>
import SpuForm from './SpuForm'
import SkuForm from './SkuForm'
export default {
    name: 'Spu',
    data() {
        return {
            category1Id: '',
            category2Id: '',
            category3Id: '',
            show: true,
            page: 1,
            limit: 3,
            records: [],
            total: 0,
            sence: 1,
            dialogTableVisible: false,
            spu:{},
            skuList:[],
            loading:true
        }
    },
    components: {
        SpuForm,
        SkuForm
    },
    methods: {
        //三级联动的自定义事件，可以把子组件的相应的id传递给父组件
        getCategoryId({ categoryId, level }) {
            if (level == 1) {
                this.category1Id = categoryId
                this.category2Id = ''
                this.category3Id = ''
            } else if (level == 2) {
                this.category2Id = categoryId
                this.category3Id = ''
            } else if (level == 3) {
                this.category3Id = categoryId
                this.getSpuList()
            }
        },
        async getSpuList() {
            const { page, limit, category3Id } = this
            let result = await this.$API.spu.reqSpuList(page, limit, category3Id)
            if (result.code == 200) {
                this.total = result.data.total
                this.records = result.data.records
            }
        },
        handleCurrentChange(page) {
            this.page = page
            this.getSpuList()
        },
        //当分页器的某一个展示数据条数发生变化的回调
        handleSizeChange(limit) {

        },
        addSpu() {
            this.sence = 1
            //通知子组件发请求
            this.$refs.spu.addSpuData(this.category3Id)
        },
        //修改某一Spu
        updateSpu(row) {
            this.sence = 1
            //获取子组件spuFORM
            this.$refs.spu.initSpuDate(row)
        },
        changeSence({ sence, flag }) {
            this.sence = sence
            if (flag == '修改') {
                this.getSpuList(this.page)
            } else {
                this.getSpuList()
            }

        },
        async deleteSpu(row) {
            let result = await this.$API.spu.reqDeleteSpu(row.id)
            if (result.code == 200) {
                this.$message({ type: 'success', message: '删除成功' })
                //>当前页，<上一页
                this.getSpuList(this.records.length > 1 ? this.page : this.page - 1)
            }
        },
        addSku(row) {
            this.sence = 2
            //父组件调用子组件的方法，让子组件发请求
            this.$refs.sku.getData(this.category1Id, this.category2Id, row)

        },
        changeSences(sence) {
            this.sence = sence
        },
        async handler(spu) {
            //查看SKU按钮的回调
            this.dialogTableVisible=true
            this.spu=spu
            let result=await this.$API.spu.reqSkuList(spu.id)
            if (result.code==200) {
                this.skuList=result.data
                this.loading=false
            }
        },
        close(done){
            //关闭对话框的回调
            this.loading=true
            //清除sku列表 
            this.skuList=[]
            done()
        }
    }
}
</script>
<style></style>