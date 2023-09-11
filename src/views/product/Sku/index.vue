<template>
    <div>
        <el-table :data="records" border stripe>
            <el-table-column type="index" label="序号" width="width" align="center">
            </el-table-column>
            <el-table-column prop="skuName" label="名称" width="width">
            </el-table-column>
            <el-table-column prop="skuDesc" label="描述" width="width">
            </el-table-column>
            <el-table-column label="默认图片" width="width">
                <template slot-scope="{row,$index}">
                    <img :src="row.skuDefaultImg" style="width: 80px;height: 80px;">
                </template>
            </el-table-column>
            <el-table-column prop="weight" label="重量" width="width">
            </el-table-column>
            <el-table-column prop="price" label="价格" width="width">
            </el-table-column>
            <el-table-column prop="prop" label="操作" width="width">
                <template slot-scope="{row,$index}">
                    <el-button type="success" size="mini" icon="el-icon-sort-down" v-if="row.isSale==0" @click="sale(row)"></el-button>
                    <el-button type="success" size="mini" icon="el-icon-sort-up" v-else @click="cancel(row)"></el-button> 
                    <el-button type="primary" size="mini" icon="el-icon-edit" @click="edit"></el-button>                   
                    <el-button type="info" size="mini" icon="el-icon-info"></el-button>    
                    <el-button type="danger" size="mini" icon="el-icon-delete"></el-button>                                    
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            style="text-align: center;"
            :current-page="page"
            :page-sizes="[3,5,10]"
            :page-size="limit"
            layout=" prev, pager, next, jumper,->,total, sizes"
            :total="total"
            >
        </el-pagination>
        
    </div>
</template>
<script>
import { recordExpression } from '@babel/types'

export default {
name: 'Sku',
data(){
    return {
        page:1,
        limit:10,
        records:[],
        total:0
    }
},
methods:{
    async getSkuList(pages=1){
        this.page=pages
        const {page,limit}=this
        let result=await this.$API.sku.reqSkuList(page,limit)
        //console.log(result);
        if (result.code==200) {
            this.total=result.data.total
            this.records=result.data
        }
        //console.log(this.records);
    },
    async sale(row){
        console.log(row);
        let result=await this.$API.sku.reqSale(row.id)
        if (result.code==200) {
            this.$message({type:'success',messge:'上架成功'})
            row.isSale=1
        }
    },
    async cancel(row){
        let result=await this.$API.sku.reqCancel(row.id)
        if (result.code==200) {
            row.isSale=0
            this.$message({type:'success',messge:'下架成功'})
        }
    },
    edit(){
        this.$message({type:'primary',message:'正在开发中'})
    }
},
mounted(){
    this.getSkuList()
},
}
</script>
<style>
</style>