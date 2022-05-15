<template>
  <div class="app-container">

    <div class="base-info">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>基本信息</span>
        </div>
        <div class="text item img-avatar">
          <el-avatar :size="72" :src="user.avatar" />
        </div>
        <div class="text item">
          {{ '用户名： ' + user.userName }}
        </div>
        <div class="text item">
          {{ '昵称： ' + user.nickName }}
        </div>
        <div class="text item">
          {{ '邮箱： ' + user.email }}
        </div>
        <div class="text item">
          {{ '手机号： ' + user.phonenumber }}
        </div>
        <div class="text item">
          性别：{{ user.sex==='1'?'男':'女' }}
        </div>
        <div class="text item">
          状态：{{ user.status==='0'?'正常':'停用' }}
        </div>
        <div class="text item">
          {{ '创建时间： ' + user.createTime }}
        </div>

      </el-card>

      <el-card class="card-update-pwd" style="width:680px;">
        <div slot="header" class="clearfix">
          <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="修改信息" name="first">
              <div>
                <el-form label-width="80px">
                  <el-form-item label="昵称">
                    <el-input v-model="newUser.nickName" />
                  </el-form-item>
                  <el-form-item label="邮箱">
                    <el-input v-model="newUser.email" />
                  </el-form-item>
                  <el-form-item label="手机">
                    <el-input v-model="newUser.phonenumber" />
                  </el-form-item>
                  <el-form-item label="性别">
                    <el-select v-model="newUser.sex" placeholder="请选择">
                      <el-option label="男" value="0" />
                      <el-option label="女" value="1" />
                      <el-option label="未知" value="2" />
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="onSubmit">保存</el-button>
                    <el-button>取消</el-button>
                  </el-form-item>
                </el-form>
              </div>

            </el-tab-pane>
            <el-tab-pane label="修改密码" name="second">
              <el-form ref="ruleForm" :model="ruleForm" status-icon :rules="rules" label-width="100px" class="demo-ruleForm">
                <el-form-item label="原密码" prop="oldPass">
                  <el-input v-model="ruleForm.oldPass" type="password" autocomplete="off" />
                </el-form-item>
                <el-form-item label="密码" prop="pass">
                  <el-input v-model="ruleForm.pass" type="password" autocomplete="off" />
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPass">
                  <el-input v-model="ruleForm.checkPass" type="password" autocomplete="off" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                  <el-button @click="resetForm('ruleForm')">重置</el-button>
                </el-form-item>
              </el-form>

            </el-tab-pane>
          </el-tabs>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getInfo, updateUser, updateUserPassword } from '@/api/user'
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      activeName: 'first',
      user: {}, // 存储用户信息
      newUser: {
        nickName: '',
        phonenumber: '',
        email: '',
        sex: ''
      },

      ruleForm: {
        oldPass: '',
        pass: '',
        checkPass: '',
        age: ''
      },
      rules: {
        oldPass: [
          { required: true, message: '请输入原密码', trigger: 'blur' }
        ],
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      }

    }
  },
  computed: {},
  created() {},
  mounted() {
    this.getUserInfo()
  },
  methods: {
    // 修改密码
    async updatePwd() {
      const data = await updateUserPassword({
        userName: this.user.userName,
        password: this.ruleForm.oldPass,
        newPassword: this.ruleForm.pass
      })
      console.log(data)
    },
    // 更新用户信息   部分更新
    async updateUserProfile() {
      try {
        const { data } = await updateUser(this.newUser)
        console.log(data)
        this.$message({
          message: '修改用户信息成功！',
          type: 'success'
        })
      } catch (error) {
        this.$message('错误', error)
      }
    },
    // 提交按钮修改信息
    onSubmit() {
      this.updateUserProfile()
    },
    // 获取用户信息
    async getUserInfo() {
      const { data } = await getInfo()
      this.user = data
      this.newUser.nickName = this.user.nickName
      this.newUser.phonenumber = this.user.phonenumber
      this.newUser.email = this.user.email
      this.newUser.sex = this.user.sex
      console.log(this.user)
    },
    // 提交表单数据
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.updatePwd()
        } else {
          this.$message('修改密码失败！')
          console.log('error submit!!')
          return false
        }
      })
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }

  }
}
</script>
<style scoped>
.img-avatar{
  text-align: center;
}
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }
    .box-card {
    width: 350px;
  }
 .base-info .el-card{
   display: inline-block;
   vertical-align: top;
   /* 顶部对齐 */
 }
 .card-update-pwd{
   margin-left: 15px;

 }
.base-info{
  /* display: inline; */
  /* width: 350px; */
  /* height: 600px; */
  /* padding: 35px; */
  /* box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1) */
}
.el-row {
    margin-bottom: 20px;
  }
/* .el-input{ */
  /* width: 60%; */
  /* min-width: 500px; */
  /* max-width: 450px; */
/* } */
</style>
