<template>
  <div class="app-container">
    <el-row>
      <el-input v-model="searchText" placeholder="请输入会员昵称、用户名" clearable />
      <el-button type="primary" @click="searchData()">搜索</el-button>
    </el-row>

    <el-table
      :data="memberList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      style="width: 100%"
      stripe
      :default-sort="{ prop: 'nickname', order: 'descending' }"
    >
      <el-table-column type="index" label="序号" width="50" />
      <el-table-column prop="username" label="用户名" sortable />
      <el-table-column prop="nickname" label="昵称" />
      <el-table-column prop="createTime" label="注册时间" />
      <el-table-column prop="avatar" label="头像">
        <template slot-scope="scope">
          <el-popover placement="right" trigger="hover">
            <el-avatar slot="reference" :src="scope.row.avatar">NULL</el-avatar>
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
            :type="scope.row.status === '1' ? 'danger' : 'success'"
            disable-transitions
          >{{ scope.row.status === '1' ? "停用" : "正常" }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="memberProfile(scope.row)"
          >详情</el-button>
          <el-button
            size="mini"
            :type="scope.row.status === '0' ? 'danger' : 'success'"
            @click="handleRecover(scope.$index, scope.row)"
          >{{ scope.row.status === '0' ? "禁用" : "启用" }}</el-button>
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
    <el-dialog title="会员信息" :visible.sync="dialogFormVisible">

      <el-form :model="user">
        <el-form-item label="头像" :label-width="formLabelWidth">
          <!-- <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" /> -->
          <template>
            <el-avatar :src="user.avatar" />
          </template>

          <!-- <el-input v-model="user.avatar" autocomplete="off" /> -->
        </el-form-item>
        <el-form-item label="昵称" :label-width="formLabelWidth">
          <el-input v-model="user.nickname" autocomplete="off" :disabled="true" />
        </el-form-item>
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="user.username" autocomplete="off" :disabled="true" />
        </el-form-item>
        <el-form-item label="创建日期" :label-width="formLabelWidth">
          <el-input v-model="user.createTime" autocomplete="off" disabled />
        </el-form-item>

        <!-- <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="user.phonenumber" autocomplete="off" />
        </el-form-item> -->
      </el-form>
      <!-- <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div> -->
    </el-dialog>
  </div>
</template>

<script>
import { selectMemberAll, updateStatus } from '@/api/member'
export default {
  components: {},
  data() {
    return {
      searchText: '',
      // pageBooks: [],
      totalCount: 0, // 总条数
      currentPage: 1,
      pageSize: 10, // 每页显示条目个数
      memberList: [],
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
    // memberList: {
    //   handler() {
    //     this.toSelectMemberAll()
    //   }
    // }

  },
  created() {},
  mounted() {
    this.toSelectMemberAll()
  },
  methods: {
    // 获取会员列表
    async toSelectMemberAll() {
      try {
        const { data } = await selectMemberAll()
        this.memberList = data
        this.totalCount = this.memberList.length
        console.log(this.memberList[0])
      } catch (error) {
        this.$message('获取会员列表失败！', error)
      }
    },
    // 变更会员状态
    async toUpdateStatus(member) {
      const { data } = await updateStatus(member)
      console.log('更新阅读状态', data)
    },
    memberProfile(member) {
      this.dialogFormVisible = true
      this.user = member
      console.log(this.user)
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

    searchData() {
      this.currentPage = 1
      if (this.searchText) {
        const newListData = [] // 用于存放搜索出来数据的新数组
        if (this.searchText) {
          this.memberList.filter((item) => {
            if (item.nickname.indexOf(this.searchText) !== -1 ||
            item.username.indexOf(this.searchText) !== -1

            ) {
              newListData.push(item)
            }
          })
        }
        // 分页总数
        this.totalCount = newListData.length
        this.memberList = newListData
      } else {
        // this.fetchData()
        this.toSelectMemberAll()
      }
    },
    async fetchData() {
      // const { data } = await selectDeletedBook()
      // this.pageBooks = data
      // console.log(data)
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
    // 启用、禁用点击事件
    handleRecover(index, row) {
      // 1禁用状态，启用会员
      if (row.status === '1') {
        this.toUpdateStatus({
          memberId: row.memberId,
          status: '0'
        })
        row.status = '0'
      } else {
        // 0 正常状态，去禁用
        this.toUpdateStatus({
          memberId: row.memberId,
          status: '1'
        })
        row.status = '1'
      }

      console.log(index, row)
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
