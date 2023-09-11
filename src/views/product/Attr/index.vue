<template>
    <div>
        <el-card style="margin: 20px 0;">
            <CategorySelect @getCategoryId="getCategoryId"></CategorySelect>
        </el-card>
        <div v-show="isShowTable">
            <el-card>
                <el-button type="primary" icon="el-icon-plus" style="margin-bottom: 5px;" :disabled="!category3Id"
                    @click="addAttr">添加属性</el-button>
                <el-table border stripe style="width:100%" :data="attrList">
                    <el-table-column type="index" align="center" prop="" label="序号" width="80">
                    </el-table-column>
                    <el-table-column align="center" prop="attrName" label="属性名称" width="150">
                    </el-table-column>
                    <el-table-column align="center" prop="" label="属性值列表" width="width">
                        <template slot-scope="{row,$index}">
                            <el-tag type="success" v-for="(attrValue, index) in row.attrValueList" :key="attrValue.id"
                                style="margin: 0 20px;">{{ attrValue.valueName }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="" label="操作" width="150">
                        <template slot-scope="{row,$index}">
                            <el-button type="warning" size="mini" icon="el-icon-edit" @click="updateAttr(row)"></el-button>
                            <el-button type="danger" size="mini" @click="" icon="el-icon-delete"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
        </div>
        <div v-show="!isShowTable">
            <el-form ref="form" label-width="80px" :inline="true">
                <el-form-item label="">
                    <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
                </el-form-item>
            </el-form>
            <el-button type="primary" size="default" icon="el-icon-plue" @click="addAttrValue"
                :disabled="!this.attrInfo.attrName">添加属性值</el-button>
            <el-button type="primary" size="default" icon="el-icon-plue" @click="isShowTable = true">取消</el-button>
            <el-table border stripe style="width: 100%;" :data="attrInfo.attrValueList">
                <el-table-column type="index" align="center" width="80" label="序号">
                </el-table-column>
                <el-table-column align="center" prop="prop" label="属性值名称" width="800">
                    <template slot-scope="{row,$index}">
                        <el-input v-if="row.flag" v-model="row.valueName" placeholder="请输入属性值名称" size="mini" clearable
                            @blur="toLook(row)" @keyup.native.enter="toLook(row)" :ref="$index"></el-input>
                        <span v-else @click="toEdit(row, $index)" style="display: block;">{{ row.valueName }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="prop" label="操作" width="width">
                    <template slot-scope="{row,$index}">
                        <el-popconfirm :title="`确定删除${row.valueName}`" @onConfirm="deleteAttrValue($index)">
                            <el-button type="danger" size="mini" @click="" icon="el-icon-delete" slot="reference"></el-button>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
            <el-button type="primary" @click="addOrUpdateAttr" :disabled="attrInfo.attrValueList.length<1">保存</el-button>
            <el-button type="primary" @click="isShowTable = true">取消</el-button>

        </div>
    </div>
</template>
<script>
    //yinru lodash的深拷贝
    import cloneDeep from 'lodash/cloneDeep'
export default {
    data() {
        return {
            category1Id: '',
            category2Id: '',
            category3Id: '',
            attrList: [],
            isShowTable: true,
            //收集新增属性，修改属性使用的
            attrInfo: {
                attrName: "",//属性名
                attrValueList: [],
                categoryId: 0,//对象收集数据是无序的。所以不能再数据对象里写this.xxx
                categoryLevel: 3,
            }
        }
    },
    name: 'Attr',
    methods: {
        getCategoryId({ categoryId, level }) {
            if (level == 1) {
                this.category1Id = categoryId
                this.category2Id = ''
                this.category3Id = ''
            } else if (level == 2) {
                this.category2Id = categoryId
                this.category3Id = ''
            } else {
                this.category3Id = categoryId
                this.getAttrList()
            }
        },
        async getAttrList() {
            const { category1Id, category2Id, category3Id } = this
            let result = await this.$API.attr.reqAttrList(category1Id, category2Id, category3Id)
            //console.log(result.data);
            if (result.code == 200) {
                this.attrList = result.data
            }
        },
        addAttrValue(){
            this.attrInfo.attrValueList.push({
                attrId:this.attrInfo.id,
                valueName:'',
                flag:true
                })
            this.$nextTick(()=>{
                this.$refs[this.attrInfo.attrValueList.length-1].focus()
            })
        },
        addAttr(){
            this.isShowTable=false
            this.attrInfo= {
                attrName: "",
                attrValueList: [],
                categoryId: this.category3Id,
            }
        },
        updateAttr(row){
            this.isShowTable=false
            //由于数据结构里存在对象里套数组，数组里套对象，所以用深拷贝
            this.attrInfo=cloneDeep(row)
            //
            this.attrInfo.attrValueList.forEach(item => {
                this.$set(item,'flag',false)
            });
        },
        //失去焦点事件，展示span
        toLook(row){
            if (row.valueName.trim()=='') {
                this.$message('输入值不能为空')
                return;
            }
            let isRepeat=this.attrInfo.attrValueList.some(item=>{
                if (row!=item) {
                    return row.valueName==item.valueName
                }
            })
            if (isRepeat) {
                this.$message('请不要输入重复值')
                return;
            }
            row.flag=false
        },
        //点击span的回调，变为编辑模式
        toEdit(row,index){
            row.flag=true
            this.$nextTick(()=>{
                this.$refs[index].focus()
            })
        },
        deleteAttrValue(index){
            //气泡确认框confirm的回调
            //注意版本问题
            this.attrInfo.attrValueList.splice(index,1)
        },
        async addOrUpdateAttr(){
            //整理参数
            this.attrInfo.attrValueList=this.attrInfo.attrValueList.filter(item=>{
                if (item.valueName!=='') {
                    delete item.flag
                    return true
                }
            })
            //发请求
            try {
                await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo)
                this.isShowTable=true
                this.$message({type:'success',message:'保存成功'})
                this.getAttrList()
            } catch (error) {
                //alert(error.message)
        }
    }
}
}
</script>
<style>
</style>