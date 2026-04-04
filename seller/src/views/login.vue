<template>
  <div class="login">
    <div class="login-lang-switch">
      <lang-switch></lang-switch>
    </div>
    <Row type="flex" @keydown.enter.native="submitLogin">
      <Col style="width: 368px">
      <Header />
      <Row style="flex-direction: column">
        <Tabs v-model="loginType">
          <Tab-pane :label="$t('usernameLogin')" name="passwordLogin">
            <!--账号密码登录-->
            <Form ref="usernameLoginForm" :model="form" :rules="rules" class="form">
              <FormItem prop="username">
                <Input v-model="form.username" prefix="ios-contact" clearable :placeholder="$t('usernamePlaceholder')"
                  autocomplete="off" />
              </FormItem>
              <FormItem prop="password">
                <Input type="password" v-model="form.password" prefix="ios-lock" password
                  :placeholder="$t('passwordPlaceholder')" autocomplete="off" />
              </FormItem>
            </Form>
            <div class="register">
              <a @click="$router.push('forgetPassword')">{{ $t('forgetPass') }}</a>
            </div>
          </Tab-pane>
          <Tab-pane :label="$t('mobileLogin')" name="mobileLogin">
            <!-- 验证码登录 -->
            <Form ref="formSms" :model="formSms" :rules="ruleInline" @click.self='$refs.verify.show = false'>
              <FormItem prop="mobile">
                <i-input type="text" maxlength="11" v-model="formSms.mobile" clearable :placeholder="$t('mobilePlaceholder')">
                  <Icon type="md-lock" slot="prepend"></Icon>
                </i-input>
              </FormItem>
              <FormItem prop="code">
                <i-input type="text" v-model="formSms.code" :placeholder="$t('codePlaceholder')">
                  <Icon type="ios-text-outline" style="font-weight: bold" slot="prepend" />
                  <Button slot="append" @click="sendCode" :loading="sendCodeLoading">{{ codeMsg }}</Button>
                </i-input>
              </FormItem>
              <FormItem>
                <!-- <Button @click.stop="verifyBtnClick" long :type="verifyStatus ? 'success' : 'default'">{{ verifyStatus ?
                  '验证通过' :
                  '点击完成安全验证' }}
                </Button> -->
              </FormItem>
            </Form>
          </Tab-pane>
        </Tabs>
        <Row>
          <div class="login-btn" type="primary" size="large" :loading="loading" @click="submitLogin" long>
            <span v-if="!loading">{{ $t('loginBtn') }}</span>
            <span v-else>{{ $t('loginingBtn') }}</span>
          </div>
        </Row>
      </Row>
      <Footer />
      </Col>
    </Row>
  </div>
</template>

<script>
import { sendSms } from "@/api/common.js";
import { login, storeSmsLogin, userMsg } from "@/api/index";
import util from "@/libs/util.js";
import Footer from "@/views/main-components/footer";
import Header from "@/views/main-components/header";
import langSwitch from "@/views/main-components/lang-switch.vue";
import Cookies from "js-cookie";
export default {
  components: {
    Header,
    Footer,
    langSwitch
  },
  data() {
    return {
      saveLogin: true, // 保存登录状态
      sendCodeLoading:false,
      loading: false, // 加载状态
      time: 60, // 倒计时
      loginType: 'passwordLogin', //登陆类型
      form: {
        // 表单数据
        username: "",
        password: "",
        mobile: "",
        code: "",
      },
      formSms: {
        mobile: '',
        code: '',
      },
      rules: {
        // 验证规则
        username: [
          {
            required: true,
            message: this.$t('usernameEmpty'),
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: this.$t('passwordEmpty'),
            trigger: "blur",
          },
        ],
      },
      ruleInline: {
        // 验证规则
        username: [{ required: true, message: this.$t('usernamePlaceholder') }],
        password: [
          { required: true, message: this.$t('passwordPlaceholder') },
          { type: "string", min: 6, message: this.$t('passwordShort') },
        ],
        mobile: [
          { required: true, message: this.$t('mobileEmpty') },
          {
            pattern: RegExp.mobile,
            message: this.$t('mobileError'),
          },
        ],
        code: [{ required: true, message: this.$t('codeEmpty') }],
      },
      codeMsg: this.$t('sendCode'), // 验证码文字
    };
  },
  created() {
    window.localStorage.setItem("menuData", "");
  },

  methods: {
    afterLogin(res) {
      let accessToken = res.result.accessToken;
      this.setStore("accessToken", accessToken);
      this.setStore("refreshToken", res.result.refreshToken);

      // 获取用户信息
      userMsg().then((res) => {
        if (res.success) {
          // location.reload();
          // this.$router.go(0);

          this.setStore("saveLogin", this.saveLogin);
          if (this.saveLogin) {
            // 保存7天
            Cookies.set("userInfoSeller", JSON.stringify(res.result), {
              expires: 7,
            });
          } else {
            Cookies.set("userInfoSeller", JSON.stringify(res.result));
          }

          util.initRouter(this);
          this.$store.commit("setAvatarPath", res.result.storeLogo);

          const redirectRouter = this.$route.query.redirect;
          // 加载菜单
          const push = {
            path: redirectRouter || "/home",
          }

          this.$router.push(push);
        } else {
          this.loading = false;
        }
      });
    },
    // 发送手机验证码
    sendCode() {
      if (this.formSms.mobile === "") {
        this.$Message.warning(this.$t('fillMobileFirst'));
        return;
      }
      if (this.time === 60) {
        this.sendCodeLoading = true
        let params = {
          mobile: this.formSms.mobile,
          verificationEnums: "LOGIN",
        };
        sendSms(params).then((res) => {

          if (res.success) {
            this.$Message.success(this.$t('smsSuccess'));
            let that = this;
            this.interval = setInterval(() => {
              // this.sendCodeLoading = false
              that.time--;
                if (that.time === 0) {
                  this.sendCodeLoading = false
                  that.time = 60;
                  that.codeMsg = this.$t('reSendCode');
                  clearInterval(that.interval);
                } else {
                  that.codeMsg = that.time;
                }
            }, 1000);
          } else {
            this.$Message.warning(res.message);
          }
        }).catch(() => {
          this.sendCodeLoading = false
        });
      }
    },
    submitLogin() {
      // 登录提交
      if (this.loginType == 'passwordLogin') {
        this.$refs.usernameLoginForm.validate((valid) => {
          if (valid) {
            this.loading = true;
            let fd = new FormData();
            fd.append("username", this.form.username);
            fd.append("password", this.md5(this.form.password));
            login(fd)
              .then((res) => {
                this.loading = false;
                if (res && res.success) {
                  this.afterLogin(res);
                }
              })
              .catch(() => {
                this.loading = false;
              });
          }
        });
      } else if (this.loginType == 'mobileLogin') {
        this.$refs['formSms'].validate((valid) => {
          if (valid) {
            this.loading = true;

            storeSmsLogin(this.formSms).then(res => {
              this.loading = false;

              if (res.success) {
                this.afterLogin(res)
              }
            }).catch(() => {
              this.loading = false;
            })
          }
        })
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.login {
  height: 100%;
  background: url("../assets/background.png") no-repeat;
  background-size: 100%;
  background-position-y: bottom;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;

  .login-lang-switch {
    position: absolute;
    top: 20px;
    right: 20px;
  }

  .form {
    padding-top: 1vh;
  }

  .login-btn {
    background: linear-gradient(135deg, $theme_color 0%, $warning_color 100%);
    height: 40px;
    cursor: pointer;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    color: #fff;
    width: 100%;
    text-align: center;
    transition: 0.35s;
  }

  .login-btn:hover {
    opacity: 0.9;
    border-radius: 10px;
  }

}
</style>
