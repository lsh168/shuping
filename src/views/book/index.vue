<template>
  <div class="app-container">
    <el-row>
      <el-input
        v-model="searchText"
        placeholder="请输入内容"
        clearable
      />
      <el-button type="primary">搜索</el-button>
      <el-button type="primary" @click="addBook">新增图书</el-button>

    </el-row>

    <el-table
      :data="pageBooks"
      style="width: 100%"
      stripe
      :default-sort="{prop: 'bookName', order: 'descending'}"
    >
      <el-table-column
        type="index"
        label="序号"
        width="50"
      />
      <el-table-column
        prop="bookName"
        label="书名"
        sortable
        width="180"
      />
      <el-table-column
        prop="author"
        label="作者"
        width="180"
      />
      <el-table-column
        prop="subTitle"
        label="子标题"
      />
      <el-table-column
        prop="evaluationQuantity"
        label="评分人数"
        sortable
      />
      <el-table-column
        prop="evaluationScore"
        label="评分"
        sortable
      />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalCount"
      :page-size="pageSize"
      :page-sizes="[ 10 ,30, 50, 100]"
      :current-page="currentPage"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { getPageBooks, deleteBook } from '@/api/book'
import { mapGetters } from 'vuex'
export default {
  components: {
  },
  data() {
    return {
      searchText: '',
      pageBooks: [],
      totalCount: 0, // 总条数
      currentPage: 1,
      pageSize: 10 // 每页显示条目个数

    }
  },
  computed: {
    ...mapGetters(['updateDataRow'])

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
    this.fetchData()
  },
  methods: {
    async toDeleteBook(query) {
      const data = await deleteBook(query)
      this.fetchData()
      console.log(data)
    },
    addBook() {
      this.$router.push('/bookUpdate/index')
    },
    searchData() {
      this.currentPage = 1
      if (this.searchText) {
        const newListData = [] // 用于存放搜索出来数据的新数组
        if (this.searchText) {
          this.pageBooks.filter((item) => {
            if (item.bookName.indexOf(this.searchText) !== -1 ||
            item.author.indexOf(this.searchText) !== -1 ||
            item.subTitle.indexOf(this.searchText) !== -1
            ) {
              newListData.push(item)
            }
          })
        }
        this.pageBooks = newListData
      } else {
        this.fetchData()
      }
    },
    async fetchData(query) {
      const res = await getPageBooks(query)
      console.log(res)
      this.pageBooks = res.data
      this.totalCount = res.count
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
    handleEdit(index, row) {
      // 路由跳转传参
      this.$router.push({
        name: 'bookUpdate', params: { bookRow: row }
      })
      // vuex容器传参
      this.$store.state.app.updateDataRow = row
      // this.$store.commit('setUpdateDataRow', row)

      console.log(index, row)
    },
    handleDelete(index, row) {
      const caozuo = '删除'

      this.$confirm(`此操作将${caozuo}该文件, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.toDeleteBook({ bookId: row.bookId })
        // this.pageBooks.splice(index, index + 1)

        this.fetchData()
        this.currentPage = 1

        // this.$set(this.pageBooks, index, null)
        this.$message({
          type: 'success',
          message: `${caozuo}成功!`
        })
      }).catch(() => {
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
.el-input{
  width: 30%;
  margin-right: 20px;
}
.el-pagination{
  text-align: center;
  margin: 25px 0;
}
</style>
