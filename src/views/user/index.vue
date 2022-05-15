<template>
  <div class="app-container">
    <el-row>
      <el-input v-model="searchText" placeholder="请输入内容" clearable />
      <el-button type="primary">搜索</el-button>
    </el-row>

    <el-table
      :data="userList"
      style="width: 100%"
      stripe
      :default-sort="{ prop: 'userName', order: 'descending' }"
    >
      <el-table-column type="index" label="序号" width="50" />
      <el-table-column prop="userName" label="用户名" sortable />
      <el-table-column prop="nickName" label="昵称" />
      <el-table-column prop="phonenumber" label="手机号" sortable />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="sex" label="性别" sortable>
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.sex === '1' ? 'primary' : 'success'"
            disable-transitions
          >{{ scope.row.sex === "1" ? "女" : "男" }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="avatar" label="头像">
        <template slot-scope="scope">
          <el-popover placement="right" trigger="hover">
            <el-avatar slot="reference" :src="scope.row.avatar" />
            <el-image
              style="width: 150px; height: 150px"
              :src="scope.row.avatar"
              fit="fit"
            />
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" sortable>
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status === 1 ? 'danger' : 'success'"
            disable-transitions
          >{{ scope.row.status === 1 ? "停用" : "正常" }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="userType" label="用户类型" sortable>
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.userType === '0' ? 'warning' : 'info'"
            disable-transitions
          >{{ scope.row.userType === '0' ? "管理员" : "普通用户" }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="editUser(scope.row)"
          >编辑</el-button>
          <el-button
            size="mini"
            :type="scope.row.status === '0' ? 'danger' : 'success'"
            @click="handleRecover(scope.$index, scope.row)"
          >{{ scope.row.status === "0" ? "禁用" : "启用" }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalCount"
      :page-size="pageSize"
      :page-sizes="[10, 30, 50, 100]"
      :current-page="currentPage"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <el-dialog title="修改用户信息" :visible.sync="dialogFormVisible">
      <el-form :model="user">
        <el-form-item label="昵称" :label-width="formLabelWidth">
          <el-input v-model="user.nickName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="user.userName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="user.password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="user.email" autocomplete="off" />
        </el-form-item>
        <el-form-item label="头像" :label-width="formLabelWidth">
          <el-input v-model="user.avatar" autocomplete="off" />
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="user.phonenumber" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import { selectDeletedBook, updateDeletedBook } from '@/api/book'
import { findAllUser
//  updateUser
} from '@/api/user'
export default {
  components: {},
  data() {
    return {
      searchText: '',
      pageBooks: [],
      totalCount: 0, // 总条数
      currentPage: 1,
      pageSize: 10, // 每页显示条目个数
      userList: [],
      // 表单数据
      dialogFormVisible: false,
      user: {},
      formLabelWidth: '120px'
    }
  },
  watch: {
    searchText: {
      handler() {
        this.searchData()
      },
      deep: true
    }
  },
  created() {},
  mounted() {
    // this.fetchData()
    this.toFindAllUser()
  },
  methods: {
    async toFindAllUser() {
      const { data } = await findAllUser()
      this.userList = data
      this.totalCount = this.userList.length
      console.log(data)
    },
    editUser(user) {
      this.dialogFormVisible = true
      this.user = user
      // this.toUpdateUser(user)
    },
    async toUpdateUser(user) {
      console.log('更新用户信息', user)
      // const { data } = await updateUser(user)
      // console.log(data)
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    async toupdateDeletedBook(book) {
      // const { data } = await updateDeletedBook(book)
      // console.log('恢复后的数据', data)
      // this.fetchData()
    },
    searchData() {
      // this.currentPage = 1
      // if (this.searchText) {
      //   const newListData = [] // 用于存放搜索出来数据的新数组
      //   if (this.searchText) {
      //     this.pageBooks.filter((item) => {
      //       if (item.bookName.indexOf(this.searchText) !== -1 ||
      //       item.author.indexOf(this.searchText) !== -1 ||
      //       item.subTitle.indexOf(this.searchText) !== -1
      //       ) {
      //         newListData.push(item)
      //       }
      //     })
      //   }
      //   this.pageBooks = newListData
      // } else {
      //   this.fetchData()
      // }
    },
    async fetchData() {
      // const { data } = await selectDeletedBook()
      // this.pageBooks = data
      // console.log(data)
      this.totalCount = this.pageBooks.length
    },
    // 每页显示的条数
    handleSizeChange(val) {
      // 改变每页显示的条数
      this.pageSize = val
      console.log(val, this.pageSize)
      // 对象参数需要和后端接口参数一致，传一个对象类型
      const obj = { page: 1, rows: this.pageSize }
      this.fetchData(obj)
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      this.currentPage = 1
    },
    // 显示第几页
    handleCurrentChange(val) {
      // 改变默认的页数
      this.currentPage = val
      const obj = { page: val, rows: this.pageSize }
      this.fetchData(obj)
    },
    handleRecover(index, row) {
      this.toupdateDeletedBook({ bookId: row.bookId })

      console.log(index, row)
    },
    handleDelete(index, row) {
      const caozuo = '删除'
      this.$confirm(`此操作将${caozuo}该文件, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.toDeleteBook({ bookId: row.bookId })
          this.pageBooks.splice(index, index + 1)

          // this.$set(this.pageBooks, index, null)
          this.$message({
            type: 'success',
            message: `${caozuo}成功!`
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: `已取消${caozuo}`
          })
        })

      // this.toDeleteBook({ bookId: row.bookId })
      // this.pageBooks.splice(index, index + 1)
      // this.handleCurrentChange(this.currentPage)
      console.log(index)
    }
  }
}
</script>
<style scoped>
.el-input {
  width: 380px;
  margin-right: 20px;
}
.el-pagination {
  text-align: center;
  margin: 25px 0;
}
</style>
