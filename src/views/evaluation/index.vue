<template>
  <div class="app-container">
    <el-row>
      <el-input
        v-model="searchText"
        placeholder="根据短评内容、图书名、用户名查询"
        clearable
      />
      <el-button type="primary">搜索</el-button>

    </el-row>

    <el-table

      :data="evaluationList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      style="width: 100%"
      stripe
      :default-sort="{prop: 'enjoy', order: 'descending'}"
    >
      <el-table-column
        type="index"
        label="序号"
      />
      <el-table-column
        prop="bookName"
        label="书名"
        sortable
        width="180"
      />
      <el-table-column
        prop="content"
        label="内容"
        width="180"
        sortable
      />
      <el-table-column
        prop="createTime"
        label="评论时间"
      />
      <el-table-column
        prop="disableReason"
        label="禁用原因"
        sortable
      />
      <el-table-column
        prop="disableTime"
        label="禁用时间"
        sortable
      />
      <el-table-column
        prop="enjoy"
        label="点赞数"
        sortable
      />
      <el-table-column
        prop="nickname"
        label="用户昵称"
        sortable
      />
      <el-table-column
        prop="username"
        label="用户名"
        sortable
      />
      <el-table-column
        prop="score"
        label="用户评分"
        sortable
      />
      <el-table-column
        prop="state"
        label="短评状态"
        sortable
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.state === 'enable' ? 'success':'danger'">{{ scope.row.state ==='enable' ? '启用':'禁用' }}</el-tag>
        </template>

      </el-table-column>
      <el-table-column label="操作" fixed="right" width="200">
        <template slot-scope="scope">
          <el-button
            :type="scope.row.state !== 'enable' ? 'success':''"
            size="mini"
            @click="handleState(scope.$index, scope.row)"
          >{{ scope.row.state ==='enable' ? '禁用' : '启用' }}</el-button>
          <!-- <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button> -->
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

    <!-- <el-dialog
      title="添加禁用原因"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-input
        v-model="disableReason"
        type="textarea"
        :rows="2"
        placeholder="请输入禁用原因"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleConfirm()">确 定</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
import { selectEvaluationState, updateState } from '@/api/evaluate'

export default {
  data() {
    return {
      searchText: '',
      evaluationList: [],
      totalCount: 0, // 总条数
      currentPage: 1,
      pageSize: 10, // 每页显示条目个数
      dialogVisible: false,
      disableReason: '',
      row: {},
      tableindex: 0,
      tablekey: 1

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
    this.fetchData()
  },
  methods: {
    // 搜索
    searchData() {
      this.currentPage = 1
      if (this.searchText) {
        const newListData = [] // 用于存放搜索出来数据的新数组
        if (this.searchText) {
          this.evaluationList.filter((item) => {
            if (item.bookName.indexOf(this.searchText) !== -1 ||
            item.content.indexOf(this.searchText) !== -1 ||
            // item.disableReason.indexOf(this.searchText) !== -1 ||
            item.username.indexOf(this.searchText) !== -1
            ) {
              newListData.push(item)
            }
          })
        }
        this.evaluationList = newListData
      } else {
        this.fetchData()
      }
    },
    async fetchData() {
      const { data } = await selectEvaluationState()
      console.log(data)
      this.evaluationList = data
      this.totalCount = this.evaluationList.length
    },
    // dialog最后点确认需要处理的函数
    handleConfirm() {
      this.toUpdateState(this.row)
      this.dialogVisible = false
      this.fetchData()
    },
    // 处理短频禁用状态
    async handleState(index, row) {
      // 获取当前数据
      // this.row = row
      // this.tableindex = index
      // console.log(index)
      // console.log(this.tableindex)
      // 状态启用，表示用户想禁用
      if (row.state === 'enable') {
        this.$prompt('请输入禁用原因', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          row.disableReason = value
          row.state = 'disable'
          this.toUpdateState(row)
          this.$message({
            type: 'success',
            message: '你的禁用原因是: ' + value
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消操作'
          })
        })

        // row.state = 'disable'
        // this.dialogVisible = true
        // // 回显禁用原因到输入框
        // this.disableReason = row.disableReason
      } else {
        row.state = 'enable'
        const data = await updateState({
          evaluationId: row.evaluationId,
          state: row.state
        })
        // row.state = 'enable'
        console.log(data)
      }
    },
    async toUpdateState(row) {
      // this.disableReason = row.disableReason
      const data = await updateState({
        evaluationId: row.evaluationId,
        disableReason: row.disableReason,
        state: row.state
      })
      console.log(data)
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
