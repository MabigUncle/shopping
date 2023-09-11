<template>
    <div>
        <!-- 按钮 -->
        <el-button type="primary" icon="el-icon-plus" style="margin:10px 0px;" @click="showDialog">添加</el-button>
        <!-- 表格组件 -->
        <el-table style="width: 100%;" border :data="list">
            <el-table-column label="序号" width="" align="center" type="index">
            </el-table-column>
            <el-table-column prop="tmName" label="品牌名称" width="">
            </el-table-column>
            <el-table-column prop="logoUrl" label="品牌LOGO" width="">
                <template slot-scope="{row,$index}">
                    <img :src="row.logoUrl" style="height: 70px; width: 100px;">
                </template>
            </el-table-column>
            <el-table-column prop="prop" label="操作" width="">
                <template slot-scope="{row,$index}">
                    <el-button type="warning" size="mini" @click="updateTradeMark(row)" icon="el-icon-edit">修改</el-button>
                    <el-button type="danger" size="mini" @click="deleteTradeMark(row)" icon="el-icon-delete">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 添加品牌 -->
        <el-dialog :title="this.tmForm.id ? '修改品牌' : '添加品牌'" :visible.sync="dialogFormVisible">
            <el-form style="width: 80%;" :model="tmForm" :rules="rules" ref='ruleForm'>
                <el-form-item label="品牌名称" label-width="100px" prop="tmName">
                    <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
                </el-form-item>
                <el-form-item label="品牌logo" label-width="100px" prop="logoUrl">
                    <!-- 这里收集数据，不能使用v-model因为不是表单元素 -->
                    <el-upload class="avatar-uploader" action="dev-api/admin/product/fileUpload" :show-file-list="true"
                        :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                        <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addOrUpdateTradeMark">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 分页器 -->
        <el-pagination style="margin-top: 20px;text-align: center;" :current-page="1" :page-sizes="[3, 5, 10]"
            :page-size="3" layout="prev, pager, next, jumper,->,sizes,total" :total="this.total" background :pager-count="5"
            @current-change="getPizeList" @size-change="handleSizeChange">
        </el-pagination>
    </div>
</template>
<script>

//import { Script } from 'vm'

export default {
    name: 'tradeMark',
    data() {
        return {
            //分页第几页
            page: 1,
            //当前页展示数据条数
            limit: 3,
            //列表展示的数据
            list: [],
            //总共的数据条数
            total: 0,
            //对话框显示与隐藏的控制的属性
            dialogFormVisible: false,
            //收集品牌信息
            tmForm: {
                tmName: '',
                logoUrl: ''
            },
            rules: {
                //tmNamed的验证规则
                tmName: [
                    { required: true, message: '请输入品牌名称', trigger: 'blur' },
                    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'cange' }
                ],
                //logourl的验证规则
                logoUrl: [
                    { required: true, message: '请选择品牌的logo', trigger: 'change' }
                ]
            }
        }
    },
    mounted() {
        this.getPizeList()
    },
    methods: {
        async getPizeList(pager = 1) {
            this.page = pager
            const { page, limit } = this
            let result = await this.$API.tradeMark.reqTradeMark(page, limit)
            this.total = result.data.total
            this.list = result.data.records
        },
        handleSizeChange(limit) {
            this.limit = limit
            this.getPizeList()
        },
        showDialog() {
            this.dialogFormVisible = true
            //清理一下数据
            this.tmForm = {
                tmName: '',
                logoUrl: ''
            }
        },
        updateTradeMark(row) {
            this.dialogFormVisible = true
            this.tmForm = { ...row }
        },
        deleteTradeMark(row) {
            this.$confirm(`此操作将永久删除${row.tmName}, 是否继续?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                //用户点击确认按钮
                let result=await this.$API.tradeMark.reqDeleteTradeMark(row.id)
                if (result.code==200) {
                    this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
                this.getPizeList(this.list.length>1? this.page:this.page=1)
                }
            }).catch(() => {
                //用户点击取消按钮
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        //图片上传成功
        handleAvatarSuccess(res, file) {
            this.tmForm.logoUrl = URL.createObjectURL(file.raw);
        },
        //图片上传之前
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        addOrUpdateTradeMark() {
            this.$refs.ruleForm.validate(async (success) => {
                if (success) {
                    //发请求，或修改
                    let result = await this.$API.tradeMark.reqAddOrUpdateTradeMark(this.tmForm)
                    if (result.code == 200) {
                        this.$message({ message: this.tmForm.id ? '修改品牌成功' : '添加品牌成功', type: 'success' })
                        //添加品牌，停留在第一页，修改品牌，停留在当前页
                        this.getPizeList(this.tmForm.id ? this.page : 1)
                    }
                    this.dialogFormVisible = false
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        }
    }
}
</script>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}

.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>