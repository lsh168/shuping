<template>
  <div class="app-container">
    <div class="tinymceDiv">
      <el-form ref="bookData" :rules="rules" :model="bookData" label-position="right" label-width="80px">
        <el-form-item label="书名" prop="bookName">
          <el-input v-model="bookData.bookName" placeholder="请输入书名" />
        </el-form-item>
        <el-form-item class="categoryForm" label="分类" prop="categoryId">

          <el-select v-model="bookData.categoryId" placeholder="请选择图书分类" @change="selectChange">
            <el-option v-for="(item,index) in category" :key="index" :label="item.categoryName" :value="item.categoryId" />
          </el-select>

          <el-input v-model="newCategory" prop="newCategory" placeholder="请输入新的分类名" /><el-button @click="addCategory">新增分类</el-button>

        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="bookData.author" placeholder="请输入作者" />
        </el-form-item>
        <el-form-item label="子标题" prop="subTitle">
          <el-input v-model="bookData.subTitle" placeholder="请输入子标题" />
        </el-form-item>

        <el-form-item label="图书简介">
          <tinymce id="tinymce" ref="tinymce" v-model="bookData.description" :width="900" />
        </el-form-item>
        <el-form-item class="endBtn">
          <el-button type="primary" round @click="cancelBtn">返回</el-button>
          <el-button type="primary" round @click="toUpdateBook">提交</el-button>
          <el-button type="primary" round @click="resetForm('bookData')">重置</el-button>
        </el-form-item>
        <el-form-item />
      </el-form>

      <!-- <el-row :gutter="20">
        <el-col :span="2"><span>书名:</span></el-col>
        <el-col :span="5"><el-input v-model="bookData.bookName" placeholder="请输入书名" /></el-col>
        <el-col :span="2">
          <span>作者:</span>
        </el-col>
        <el-col :span="5">
          <el-input v-model="bookData.author" placeholder="请输入作者" />
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="2">
          <span>子标题:</span>
        </el-col>
        <el-col :span="12">
          <el-input v-model="bookData.subTitle" placeholder="请输入子标题" />
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="3">
          <span>上传图书封面:</span>
        </el-col>
        <el-col :span="14">
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
          >
            <i class="el-icon-plus" />
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <span>图书简介(简介中，默认第一张为图书封面)</span>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="16">
          <tinymce id="tinymce" v-model="bookData.description" :width="900" />
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="2" :offset="4">
          <el-button type="primary" round @click="resetBtn">重置</el-button>
        </el-col>
        <el-col :span="2" :offset="2">
          <el-button type="primary" round @click="toUpdateBook">提交</el-button>
        </el-col>

      </el-row> -->

    </div>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
// import { mapGetters } from 'vuex'
import { updateBook, createBook, bookCategory } from '@/api/book'
import { addCategory } from '@/api/category'
export default {
  components: {
    Tinymce
  },
  data() {
    return {
      bookData: {
        author: '',
        bookName: '',
        subTitle: '',
        description: '请填入图书简介，至少包含一张图片作为图书封面,默认第一张为图书封面)。',
        categoryId: ''
        // evaluationQuantity: 0,
        // evaluationScore: 0,
      },
      category: [],
      newCategory: '',
      rules: {
        bookName: [
          { required: true, message: '请输入书名', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        newCategory: [
          { required: false, message: '不能提交空值', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        categoryId: [
          { required: true, message: '请选择分类', trigger: 'change' }
        ],
        author: [
          { required: true, message: '此项不能为空', trigger: 'blur' }
        ],
        subTitle: [
          { required: true, message: '子标题不能为空', trigger: 'blur' }
        ]

      }
      // categoryValue: 0

      // dialogImageUrl: '',
      // dialogVisible: false
    }
  },
  computed: {
    // ...mapGetters(['updateDataRow'])
  },
  created() {},
  mounted() {
    this.showRow()
    this.getBookCategory()
  },
  methods: {
    addCategory() {
      // console.log(' new category')
      this.toaddCategory()
      // this.getBookCategory()
      // // 在请求商品后的事件中，重置select的值 ：
      // this.$set(this.category, '')
    },
    async toaddCategory() {
      const data = await addCategory({ categoryName: this.newCategory })
      this.category.push(data.data)
      console.log(this.category)
      // console.log(data)
    },
    resetForm(formName) {
      // 重置在form 加入ref="bookData" :model="bookData"，保持相等
      // el-form-item  prop="author"   prop属性要和v-model="bookData.author"的author对应
      this.$refs['tinymce'].setContent('请填入图书简介，至少包含一张图片作为图书封面。')
      this.$refs[formName].resetFields()
    },
    selectChange(value) {
      this.$forceUpdate()
      console.log(value)
    },
    async getBookCategory() {
      const data = await bookCategory()
      this.category = data.categoryList
      // categoryId
      console.log(data.categoryList)
    },
    toCreateBook() {
      this.$confirm('创建图书, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const data = await createBook(this.bookData)
        console.log(data)
        this.resetForm('bookData')
        this.$message({
          type: 'success',
          message: '创建成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消创建！'
        })
      })
    },
    cancelBtn() {
      this.$router.back()
    },
    // 图书创建和更新
    async toUpdateBook() {
      if (!this.bookData.bookId) {
        // 创建图书
        this.toCreateBook()

        return
      }
      try {
        const data = await updateBook(this.bookData)
        console.log(data)
        this.$message({
          message: '更新图书信息成功！',
          type: 'success'
        })
      } catch (error) {
        this.$message.error('更新图书信息出现错误！', error)
      }
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    showRow() {
      // console.log('更新', this.updateDataRow)
      // console.log('router', this.$route.params)
      // 不判断会出错
      if (this.$route.params.bookRow) {
        // console.log(this.$route.params.bookRow)
        this.bookData = this.$route.params.bookRow
      }
    }
  }
}
</script>
<style scoped>

.el-input{
  width: 50%;
}
.categoryForm .el-input{
  width: 15%;
  /* margin-right: 15px; */
  margin:auto 15px;
}
.endBtn .el-button{
  margin: auto 70px;

}

</style>
