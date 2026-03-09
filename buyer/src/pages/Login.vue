<template>
  <div class="login" @keyup.enter="handleSubmit('formInline')">
    <!-- 顶部logo -->
    <div class="top-content" @click='$refs.verify.show = false'>
      <div class="logo-box">
        <img :src="$store.state.logoImg" @click="$router.push('/')" />
        <div>欢迎登录</div>
      </div>
    </div>
    <!-- 登录主体 包含轮播图 登录模块 -->
    <div class="login-container">
      <!-- 轮播 -->
      <Carousel loop :autoplay-speed="5000" class="login-carousel" arrow="never">
        <CarouselItem>
          <div class="demo-carousel" @click='$refs.verify.show = false'>
            <img src="https://lili-system.oss-cn-beijing.aliyuncs.com/background.jpg" />
          </div>
        </CarouselItem>
      </Carousel>
      <!-- 登录模块 -->
      <div class="form-box" @click='$refs.verify.show = false'>
        <!-- 邀请码输入（已隐藏） -->
        <div v-if="false" class="invite-code-wrapper">
          <FormItem>
            <i-input 
              type="text" 
              v-model="inviteCode" 
              clearable 
              placeholder="🔐 输入邀请码（第三方登录需要）"
              maxlength="20"
              @on-input="checkInviteCode"
              :class="{'invite-code-input': true, 'invite-code-valid': inviteCodeValid, 'invite-code-error': inviteCodeError}">
              <Icon type="md-key" slot="prepend"></Icon>
            </i-input>
            <div v-if="inviteCodeError" class="invite-code-error-msg">{{ inviteCodeError }}</div>
            <div v-if="inviteCodeValid" class="invite-code-success-msg">✓ 验证成功</div>
          </FormItem>
        </div>

        <!-- 登录方式切换 -->
        <div class="login-tabs">
          <div class="tab-item" :class="{active: type && !scannerCodeLoginFLag}" @click="switchToAccountLogin">
            <Icon type="md-person" />
            <span>账号登录</span>
          </div>
          <div class="tab-item" :class="{active: !type && !scannerCodeLoginFLag}" @click="switchToSmsLogin">
            <Icon type="ios-text-outline" />
            <span>验证码登录</span>
          </div>
          <div class="tab-item" :class="{active: scannerCodeLoginFLag}" @click="switchToQrLogin">
            <Icon type="md-qr-scanner" />
            <span>扫码登录</span>
          </div>
        </div>

        <!-- 扫码登录 -->
        <div v-show="scannerCodeLoginFLag" class="qr-login-section">
          <div class="qr-container">
            <div class='qr-shadow flex' v-show="qrCodeStatus == 'fail'">
              <span>二维码已失效</span>
              <Button size='small' @click="createPCLoginSession">刷新二维码</Button>
            </div>
            <vue-qr
              :text="qrCode"
              :margin="0"
              colorDark="#000"
              colorLight="#fff"
              :size="150"
            ></vue-qr>
          </div>
          <div class="qr-status">
            <div v-if="scannerCodeLoginStatus === 0" class="status-text pending">
              <Icon type="ios-information-circle-outline" />
              <span>打开手机App/小程序，扫码登录</span>
            </div>
            <div v-else-if="scannerCodeLoginStatus === 1" class="status-text scanned">
              <Icon type="ios-checkmark-circle-outline" />
              <span>扫码成功，等待确认</span>
            </div>
            <div v-else-if="scannerCodeLoginStatus === 2" class="status-text success">
              <Icon type="ios-checkmark-circle" />
              <span>登录成功，正在页面跳转</span>
            </div>
            <div v-else-if="scannerCodeLoginStatus === 3" class="status-text cancelled">
              <Icon type="ios-close-circle-outline" />
              <span>已取消登录</span>
            </div>
          </div>
        </div>

        <!-- 账号密码登录 -->
        <Form ref="formInline" :model="formData" :rules="ruleInline" v-show="type === true && !scannerCodeLoginFLag"
              @click.self='$refs.verify.show = false'>
          <FormItem prop="username">
            <i-input type="text" v-model="formData.username" clearable placeholder="用户名/邮箱/手机号">
              <Icon type="md-person" slot="prepend"></Icon>
            </i-input>
          </FormItem>
          <FormItem prop="password">
            <i-input type="password" v-model="formData.password" clearable placeholder="密码">
              <Icon type="md-lock" slot="prepend"></Icon>
            </i-input>
          </FormItem>
          <FormItem>
            <Button type="error" @click.stop="handleSubmit('formInline')" long size="large">登录</Button>
          </FormItem>
        </Form>

        <!-- 验证码登录 -->
        <Form ref="formSms" :model="formSms" :rules="ruleInline" v-show="type === false && !scannerCodeLoginFLag"
              @click.self='$refs.verify.show = false'>
          <FormItem prop="mobile">
            <i-input type="text" v-model="formSms.mobile" clearable placeholder="手机号">
              <Icon type="ios-phone-portrait" slot="prepend"></Icon>
            </i-input>
          </FormItem>
          <FormItem prop="code">
            <i-input type="text" v-model="formSms.code" placeholder="手机验证码">
              <Icon type="ios-text-outline" slot="prepend"/>
              <Button slot="append" @click="sendCode" :disabled="!verifyStatus">{{ codeMsg }}</Button>
            </i-input>
          </FormItem>
          <FormItem>
            <Button @click.stop="verifyBtnClick" long
                    :type="verifyStatus?'success':'default'">
              {{ verifyStatus ? '✓ 安全验证通过' : '点击完成安全验证' }}
            </Button>
          </FormItem>
          <FormItem>
            <Button type="error" @click="handleSubmit('formSms')" long size="large">登录</Button>
          </FormItem>
        </Form>

        <!-- 第三方登录 -->
        <div v-if="showThirdParty" class="third-party-section">
          <div class="section-divider">
            <div class="divider-line"></div>
            <div class="divider-text">或使用第三方账号</div>
            <div class="divider-line"></div>
          </div>
          <div class="other-login">
            <div 
              class="login-btn-google" 
              @click="handleGoogleLogin">
              <svg t="1631154766336" class="icon" viewBox="0 0 1024 1024" version="1.1"
                  xmlns="http://www.w3.org/2000/svg" width="20" height="20">
                <path d="M881 442.4H519.7v148.5h206.4c-8.9 48-35.9 88.6-76.6 115.8-34.4 23-78.3 36.6-129.9 36.6-99.9 0-184.4-67.5-214.6-158.2-9.9-29.5-15.6-61.3-15.6-95.2 0-33.9 5.7-65.7 15.6-95.2C280.1 178.8 364.6 111.3 464.5 111.3c56.3 0 106.8 19.4 146.6 57.4l110-110.1C629.8 22 561.2 0 484.1 0 210.9 0 0 210.9 0 484.1s210.9 484.1 484.1 484.1c268 0 482.4-190.3 482.4-458.4 0-19.4-1.4-38.4-4.2-57.4z" fill="#4285F4"></path>
              </svg>
              <span>Google</span>
            </div>
            <div 
              class="login-btn-apple disabled" 
              @click="handleAppleLogin">
              <svg t="1631154766336" class="icon" viewBox="0 0 1024 1024" version="1.1"
                  xmlns="http://www.w3.org/2000/svg" width="20" height="20">
                <path d="M747.4 535.7c1-85.6 73.7-126.6 77-128.5-41.9-61.3-107.1-69.7-130.3-70.7-55.4-5.6-108.2 32.6-136.2 32.6-28.5 0-70.3-31.7-115.8-30.8-59.6 0.9-114.7 34.7-145.5 88.1-62 107.6-15.9 267 44.7 354.4 29.4 42.2 64.5 89.5 110.6 87.8 44.3-1.8 61-28.7 114.6-28.7 53.7 0 68.7 28.7 115.5 27.8 47.8-0.9 78.3-42.5 107.6-84.7 33.9-49.5 47.8-97.4 48.6-99.8-1.1-0.5-93.5-35.9-94.5-142.7zM655.9 154.9c24.7-30 41.3-71.7 36.8-113.3-35.6 1.5-78.7 23.7-104.3 53.8-23 26.6-43.1 69.1-37.7 109.9 39.6 3.1 80.1-20.1 105.2-50.4z" fill="#000000"></path>
              </svg>
              <span>Apple</span>
            </div>
          </div>
          <div v-if="false" class="invite-code-hint">
            <Icon type="ios-information-circle-outline" />
            <span>输入邀请码后可使用第三方登录</span>
          </div>
        </div>

        <!-- 底部链接 -->
        <div class="footer-links">
          <span class="register-link" @click="$router.push('/SignUp')">还没有账号？立即注册</span>
          <span class="divider">|</span>
          <span class="forget-link" @click="$router.push('forgetPassword')">忘记密码</span>
        </div>
      </div>

      <!-- 拼图验证码 -->
      <verify ref="verify" class="verify-con" verifyType="LOGIN" @change="verifyChange"></verify>
    </div>
    <div class="foot">
      <Row type="flex" justify="space-around" class="help">
        <router-link to="/article" class="item" target="_blank">帮助</router-link>
        <router-link to="/article?id=1371779927900160000" class="item" target="_blank">隐私</router-link>
        <router-link to="/article?id=1371992704333905920" class="item" target="_blank">条款</router-link>
      </Row>
      <Row type="flex" justify="center" class="copyright">
        Copyright © {{year}} - Present
        <a href="https://maollar.com" target="_blank" style="margin: 0 5px">{{config.title}}</a>
        版权所有
      </Row>
    </div>
  </div>
</template>

<script>

import * as RegExp from "@/plugins/RegExp.js";
import { md5 } from "@/plugins/md5.js";
import * as apiLogin from "@/api/login.js";
import { sendSms } from "@/api/common.js";
import { webLogin, loginCallback,sCLogin,getSCLoginCode} from "@/api/login.js";
import storage from "@/plugins/storage.js";
import verify from "@/components/verify";
import vueQr from "vue-qr";

export default {
  name: "Login",
  components: {
    verify,
    vueQr
  },
  data() {
    return {
      qrCodeStatus:"success",
      qrCode: '',
      qrSessionToken:'',
      scannerCodeLoginFLag: false,
      scannerCodeLoginStatus: 0,
      qrCodeTimer:null,
      config: require('@/config'),
      type: true, // true 账号登录  false 验证码登录
      showThirdParty: true, // 是否显示第三方登录
      formData: {
        username: "",
        password: "",
      },
      formSms: {
        code: "",
        mobile: "",
      },
      verifyStatus: false,
      ruleInline: {
        username: [{required: true, message: "请输入用户名"}],
        password: [
          {required: true, message: "请输入密码"},
          {type: "string", min: 6, message: "密码不能少于6位"},
        ],
        mobile: [
          {required: true, message: "请输入手机号码"},
          {
            pattern: RegExp.mobile,
            message: "请输入正确的手机号",
          },
        ],
        code: [{required: true, message: "请输入手机验证码"}],
      },
      codeMsg: "发送验证码",
      interval: null,
      time: 60,
      year: new Date().getFullYear(),
      inviteCode: "",
      inviteCodeValid: true,
      inviteCodeError: "",
      validInviteCodes: [
        "OK4MOTO",
        "LJVLP9", "2Z2RWY", "L96HWH", "FGHVKE", "PKZTYN",
        "GV3AXJ", "6PBY6L", "BSA6ND", "B4E7YT", "FHWC3X"
      ],
    };
  },
  methods: {
    // 切换到账号登录
    switchToAccountLogin() {
      this.type = true;
      this.scannerCodeLoginFLag = false;
      this.showThirdParty = true;
      this.$refs.formInline && this.$refs.formInline.resetFields();
    },
    // 切换到验证码登录
    switchToSmsLogin() {
      this.type = false;
      this.scannerCodeLoginFLag = false;
      this.showThirdParty = true;
      this.$refs.formSms && this.$refs.formSms.resetFields();
      this.verifyStatus = false;
      clearInterval(this.interval);
      this.codeMsg = "发送验证码";
      this.time = 60;
    },
    // 切换到扫码登录
    switchToQrLogin() {
      this.scannerCodeLoginFLag = true;
      this.showThirdParty = true;
      if (!this.qrCode) {
        this.createPCLoginSession();
      }
    },
    // 登录
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.type) {
            this.$refs.verify.init();
          } else {
            let data = JSON.parse(JSON.stringify(this.formSms));
            apiLogin.smsLogin(data).then((res) => {
              this.$refs.verify.show = false;
              if (res.success) {
                this.$Message.success("登录成功");
                storage.setItem("accessToken", res.result.accessToken);
                storage.setItem("refreshToken", res.result.refreshToken);
                storage.setItem('getTimes',0)
                apiLogin.getMemberMsg().then((res) => {
                  if (res.success) {
                    storage.setItem("userInfo", res.result);
                    let query = this.$route.query;
                    if (query.rePath) {
                      this.$router.push({
                        path: query.rePath,
                        query: JSON.parse(query.query),
                      });
                    } else {
                      this.$router.push("/");
                    }
                  }
                });
              } else {
                this.$Message.error(res.message);
              }
            });
          }
        }
      });
    },
    // 检查邀请码
    checkInviteCode() {
      // 已取消验证要求
      this.inviteCodeValid = true;
      this.inviteCodeError = "";
      this.showThirdParty = true;
    },
    // 发送手机验证码
    sendCode() {
      if (this.time === 60) {
        // 已取消验证要求
        this.inviteCodeValid = true;
        if (this.formSms.mobile === "") {
          this.$Message.warning("请先填写手机号");
          return;
        }
        if (!this.verifyStatus) {
          this.$Message.warning("请先完成安全验证");
          return;
        }
        let params = {
          mobile: this.formSms.mobile,
          verificationEnums: "LOGIN",
        };
        sendSms(params).then((res) => {
          if (res.success) {
            this.$Message.success("验证码发送成功");
            let that = this;
            this.interval = setInterval(() => {
              that.time--;
              if (that.time === 0) {
                that.time = 60;
                that.codeMsg = "重新发送";
                that.verifyStatus = false;
                clearInterval(that.interval);
              } else {
                that.codeMsg = that.time;
              }
            }, 1000);
          } else {
            this.$Message.warning(res.message);
          }
        });
      }
    },
    verifyChange(con) {
      if (!con.status) return;

      if (this.type === true) {
        let data = JSON.parse(JSON.stringify(this.formData));
        data.password = md5(data.password);
        this.$refs.verify.show = false;
        this.$Spin.show();
        apiLogin
          .login(data)
          .then((res) => {
            if (res.success) {
              this.loginSuccess(res.result.accessToken,res.result.refreshToken);
            } else {
              this.$Spin.hide();
              this.$Message.error(res.message);
            }
          })
          .catch(() => {
            this.$Spin.hide();
          });
      } else {
        this.verifyStatus = true;
        this.$refs.verify.show = false;
      }
    },
    verifyBtnClick() {
      if (!this.verifyStatus) {
        this.$refs.verify.init();
      }
    },
    handleWebLogin(type) {
      webLogin(type);
    },
    handleGoogleLogin() {
      // 已取消验证要求
      this.inviteCodeValid = true;
      this.handleWebLogin('GOOGLE');
    },
    handleAppleLogin() {
      this.$Message.info("Apple 登录即将开放，敬请期待");
    },
    loginSuccess(accessToken,refreshToken){
      this.$Message.success("登录成功");
      storage.setItem("accessToken", accessToken);
      storage.setItem("refreshToken", refreshToken);
      apiLogin.getMemberMsg().then((res) => {
        this.$Spin.hide();
        if (res.success) {
          storage.setItem("userInfo", res.result);
          let query = this.$route.query;
          if (query.rePath) {
            this.$router.push({
              path: query.rePath,
              query: JSON.parse(query.query),
            });
          } else {
            this.$router.push("/");
          }
        }
      });
    },
    async createPCLoginSession() {
      getSCLoginCode({}).then(response=>{
        this.clearQRLoginInfo();
        if (response.code == 200) {
          this.qrCodeStatus = 'success'
          let session = response.result;
          this.qrSessionToken = session.token;
          if (session.status === 0) {
            this.qrCode = session.token;
            this.refreshQrCode();
          }
          this.qrLogin();
        }
      });
    },
    async refreshQrCode() {
      if (!this.qrCodeTimer) {
        this.qrCodeTimer = setInterval(() => {
          this.qrCodeStatus = 'fail'
        }, 10 * 1000);
      }
    },
    clearQRLoginInfo(){
      this.scannerCodeLoginStatus=0;
      this.qrSessionToken='';
      if (this.qrCodeTimer) {
        clearInterval(this.qrCodeTimer)
      }
      this.qrCodeTimer= null;
    },
    async qrLogin() {
      if(!this.qrSessionToken) return;
      sCLogin(this.qrSessionToken,{beforeSessionStatus:this.scannerCodeLoginStatus}).then(response=>{
        if (response.success) {
          this.scannerCodeLoginStatus = response.result.status;
          switch (response.result.status) {
            case 0:
            case 1:
              this.qrLogin();break;
            case 2:
              this.loginSuccess(response.result.token.accessToken,response.result.token.refreshToken);
              break;
            case 3:
              this.createPCLoginSession();
              break;
            default:
              this.clearQRLoginInfo();
              break
          }
        }  else{
          this.clearQRLoginInfo();
        }
      });
    },
  },
  destroyed() {
    this.clearQRLoginInfo();
  },
  mounted() {
    let uuid = this.$route.query.state;
    if (uuid) {
      storage.setItem("uuid", uuid);
      loginCallback(uuid).then((res) => {
        if (res.success) {
          this.loginSuccess(res.result.accessToken,res.result.refreshToken);
        }
      });
    }
  },
  watch: {
    scannerCodeLoginFLag(v){
      if(v){
        this.createPCLoginSession();
      }else{
        this.clearQRLoginInfo();
      }
    },
    type(v) {
      if (v) {
        this.$refs.formInline && this.$refs.formInline.resetFields();
      } else {
        this.$refs.formSms && this.$refs.formSms.resetFields();
      }
      this.verifyStatus = false;
      this.$refs.verify.show = false;
      clearInterval(this.interval);
      this.codeMsg = "发送验证码";
      this.time = 60;
    },
  },
};
</script>
<style scoped lang="scss">
.login {
  height: 100%;
  background-color: #f0f2f5;
}

.top-content {
  width: 100%;
  height: 80px;
  position: relative;
  z-index: 1;
  box-shadow: 0 1px 1px #ddd;
  background-color: #fff;

  .logo-box {
    width: 80%;
    max-width: 1200px;
    height: 80px;
    margin: 0 auto;
    display: flex;
    align-items: center;

    img {
      width: 150px;
      cursor: pointer;
    }

    div {
      font-size: 20px;
      margin-left: 20px;
      color: #333;
    }
  }
}

.login-container {
  position: relative;
  width: 100%;
  height: 550px;
}

.login-carousel {
  width: 100%;
  height: 550px;

  .demo-carousel {
    height: 550px;
    width: inherit;
    display: flex;
    justify-content: center;
  }
}

.form-box {
  width: 400px;
  box-sizing: border-box;
  position: absolute;
  top: 80px;
  right: 10%;
  padding: 30px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  // 邀请码输入区域
  .invite-code-wrapper {
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #eee;

    .invite-code-input {
      &.invite-code-valid {
        border-color: #19be6b;
      }
      
      &.invite-code-error {
        border-color: #ed4014;
      }
    }
    
    .invite-code-error-msg {
      margin-top: 5px;
      font-size: 12px;
      color: #ed4014;
    }
    
    .invite-code-success-msg {
      margin-top: 5px;
      font-size: 12px;
      color: #19be6b;
    }
  }

  // 登录方式切换标签
  .login-tabs {
    display: flex;
    gap: 10px;
    margin-bottom: 25px;
    border-bottom: 2px solid #f0f0f0;

    .tab-item {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 12px 0;
      cursor: pointer;
      color: #666;
      font-size: 14px;
      transition: all 0.3s;
      border-bottom: 2px solid transparent;
      margin-bottom: -2px;

      i {
        font-size: 18px;
      }

      &:hover {
        color: $theme_color;
      }

      &.active {
        color: $theme_color;
        border-bottom-color: $theme_color;
        font-weight: 500;
      }
    }
  }

  // 扫码登录区域
  .qr-login-section {
    text-align: center;
    padding: 20px 0;

    .qr-container {
      margin: 20px 0;
      position: relative;
      display: inline-block;

      >.qr-shadow {
        background: rgba(0, 0, 0, 0.7);
        position: absolute;
        left: 50%;
        margin-left: -75px;
        top: 0;
        z-index: 99;
        width: 150px;
        height: 150px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        color: #fff;
        border-radius: 4px;

        >span {
          margin-bottom: 15px;
          font-size: 13px;
        }
      }
    }

    .qr-status {
      margin-top: 15px;

      .status-text {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        font-size: 14px;

        i {
          font-size: 18px;
        }

        &.pending {
          color: #666;
        }

        &.scanned {
          color: #2d8cf0;
        }

        &.success {
          color: #19be6b;
        }

        &.cancelled {
          color: #ed4014;
        }
      }
    }
  }

  // 第三方登录区域
  .third-party-section {
    margin-top: 25px;
    padding-top: 20px;
    border-top: 1px solid #eee;

    .section-divider {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      
      .divider-line {
        flex: 1;
        height: 1px;
        background: #eee;
      }
      
      .divider-text {
        padding: 0 15px;
        font-size: 12px;
        color: #999;
      }
    }

    .other-login {
      display: flex;
      gap: 12px;
      
      .login-btn-google,
      .login-btn-apple {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 12px 20px;
        border: 1px solid #ddd;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.3s;
        background: #fff;
        
        &:hover:not(.disabled) {
          border-color: #2d8cf0;
          background: #f0f9ff;
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(45, 140, 240, 0.2);
        }
        
        &.disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background: #f5f5f5;
        }
        
        .icon {
          width: 20px;
          height: 20px;
        }
        
        span {
          font-size: 14px;
          color: #333;
          font-weight: 500;
        }
      }
    }

    .invite-code-hint {
      margin-top: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      font-size: 12px;
      color: #999;

      i {
        font-size: 16px;
      }
    }
  }

  // 底部链接
  .footer-links {
    margin-top: 20px;
    padding-top: 15px;
    border-top: 1px solid #eee;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    font-size: 13px;

    .register-link {
      color: $theme_color;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }

    .divider {
      color: #ddd;
    }

    .forget-link {
      color: #666;
      cursor: pointer;

      &:hover {
        color: $theme_color;
        text-decoration: underline;
      }
    }
  }
}

.verify-con {
  position: absolute;
  right: 11%;
  top: 90px;
  z-index: 10;
}

.foot {
  position: fixed;
  bottom: 4vh;
  width: 368px;
  left: calc(50% - 184px);
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;

  .help {
    margin: 0 auto;
    margin-bottom: 1vh;
    width: 60%;

    .item {
      color: rgba(0, 0, 0, 0.45);
    }

    :hover {
      color: rgba(0, 0, 0, 0.65);
    }
  }
}
</style>





