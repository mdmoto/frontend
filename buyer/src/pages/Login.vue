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
        <div class="account-number">
          <div class="tab-switch">
            <span>{{ type ? '账号登录' : '验证码登录' }}</span>
            <span @click="type = !type,scannerCodeLoginFLag=false">{{ type ? '验证码登录' : '账号登录' }}</span>
          </div>
          <!---->
          <div @click="scannerCodeLoginFLag=!scannerCodeLoginFLag">{{!scannerCodeLoginFLag ? '扫码登录' : '返回'}}</div>
        </div>
        <!--扫码登录-->
        <div v-show="scannerCodeLoginFLag">
          <div class="qr-container">
            <div class='qr-shadow flex' v-show="qrCodeStatus == 'fail'">
              <span>
                二维码已失效
              </span>
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
          <div class="drag-area">
          <!--    等待扫码-->
          <div v-if="scannerCodeLoginStatus === 0" class="pending-scan">
            <p>打开手机App/小程序，扫码登录</p>
          </div>
          <!--    已经扫码-->
          <div v-else-if="scannerCodeLoginStatus === 1" class="scanned">
            <p>扫码成功，等待确认</p>
          </div>

          <!--    存在session，等待发送给客户端验证-->
          <div v-if="scannerCodeLoginStatus === 2" class="scanned">
            <p>登录成功，正在页面跳转</p>
          </div>

          <!--    已经发送登录请求-->
          <div v-else-if="scannerCodeLoginStatus === 3" class="quick-logining">
            <p>取消登录</p>
          </div>
        </div>
        </div>

        <div>
          <div v-show="!scannerCodeLoginFLag">
          <!-- 账号密码登录 -->
          <Form ref="formInline" :model="formData" :rules="ruleInline" v-show="type === true"
                @click.self='$refs.verify.show = false'>
            <FormItem prop="username">
              <i-input type="text" v-model="formData.username" clearable placeholder="用户名">
                <Icon type="md-person" slot="prepend"></Icon>
              </i-input>
            </FormItem>
            <FormItem prop="password">
              <i-input type="password" v-model="formData.password" clearable placeholder="密码">
                <Icon type="md-lock" slot="prepend"></Icon>
              </i-input>
            </FormItem>
            <FormItem>
              <Button type="error" @click.stop="handleSubmit('formInline')" long>登录</Button>
            </FormItem>
          </Form>
          <!-- 验证码登录 -->
          <Form ref="formSms" :model="formSms" :rules="ruleInline" v-show="type === false"
                @click.self='$refs.verify.show = false'>
            <!-- 邀请码输入（手机号登录时需要） -->
            <FormItem>
              <i-input 
                type="text" 
                v-model="inviteCode" 
                clearable 
                placeholder="🔐 输入邀请码"
                maxlength="20"
                @on-input="checkInviteCode"
                :class="{'invite-code-input': true, 'invite-code-valid': inviteCodeValid, 'invite-code-error': inviteCodeError}">
                <Icon type="md-key" slot="prepend"></Icon>
              </i-input>
              <div v-if="inviteCodeError" class="invite-code-error-msg">{{ inviteCodeError }}</div>
              <div v-if="inviteCodeValid" class="invite-code-success-msg">✓ 验证成功</div>
            </FormItem>
            <FormItem prop="mobile">
              <i-input type="text" v-model="formSms.mobile" clearable placeholder="手机号">
                <Icon type="md-lock" slot="prepend"></Icon>
              </i-input>
            </FormItem>
            <FormItem prop="code">
              <i-input type="text" v-model="formSms.code" placeholder="手机验证码">
                <Icon type="ios-text-outline" style="font-weight: bold" slot="prepend"/>
                <Button slot="append" @click="sendCode" :disabled="!inviteCodeValid">{{ codeMsg }}</Button>
              </i-input>
            </FormItem>
            <FormItem>
              <Button @click.stop="verifyBtnClick" long
                      :type="verifyStatus?'success':'default'">{{ verifyStatus ? '验证通过' : '点击完成安全验证' }}
              </Button>
            </FormItem>
            <FormItem>
              <Button type="error" @click="handleSubmit('formSms')" long :disabled="!inviteCodeValid">登录</Button>
            </FormItem>
          </Form>
        </div>
          <div class="other">
            <!-- 第三方登录区域（需要邀请码） -->
            <div class="third-party-section">
              <div class="section-divider">
                <div class="divider-line"></div>
                <div class="divider-text">第三方账号登录</div>
                <div class="divider-line"></div>
              </div>
              
              <!-- 邀请码输入 -->
              <div class="invite-code-section">
                <FormItem>
                  <i-input 
                    type="text" 
                    v-model="inviteCode" 
                    clearable 
                    placeholder="🔐 输入邀请码"
                    maxlength="20"
                    @on-input="checkInviteCode"
                    :class="{'invite-code-input': true, 'invite-code-valid': inviteCodeValid, 'invite-code-error': inviteCodeError}">
                    <Icon type="md-key" slot="prepend"></Icon>
                  </i-input>
                  <div v-if="inviteCodeError" class="invite-code-error-msg">{{ inviteCodeError }}</div>
                  <div v-if="inviteCodeValid" class="invite-code-success-msg">✓ 验证成功</div>
                </FormItem>
              </div>

              <!-- Google/Apple 登录按钮 -->
              <div class="other-login">
                <div 
                  class="login-btn-google" 
                  :class="{'disabled': !inviteCodeValid}"
                  @click="handleGoogleLogin">
                  <svg t="1631154766336" class="icon" viewBox="0 0 1024 1024" version="1.1"
                      xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                    <path d="M881 442.4H519.7v148.5h206.4c-8.9 48-35.9 88.6-76.6 115.8-34.4 23-78.3 36.6-129.9 36.6-99.9 0-184.4-67.5-214.6-158.2-9.9-29.5-15.6-61.3-15.6-95.2 0-33.9 5.7-65.7 15.6-95.2C280.1 178.8 364.6 111.3 464.5 111.3c56.3 0 106.8 19.4 146.6 57.4l110-110.1C629.8 22 561.2 0 484.1 0 210.9 0 0 210.9 0 484.1s210.9 484.1 484.1 484.1c268 0 482.4-190.3 482.4-458.4 0-19.4-1.4-38.4-4.2-57.4z" fill="#4285F4"></path>
                  </svg>
                  <span>Google</span>
                </div>
                <div 
                  class="login-btn-apple disabled" 
                  @click="handleAppleLogin">
                  <svg t="1631154766336" class="icon" viewBox="0 0 1024 1024" version="1.1"
                      xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                    <path d="M747.4 535.7c1-85.6 73.7-126.6 77-128.5-41.9-61.3-107.1-69.7-130.3-70.7-55.4-5.6-108.2 32.6-136.2 32.6-28.5 0-70.3-31.7-115.8-30.8-59.6 0.9-114.7 34.7-145.5 88.1-62 107.6-15.9 267 44.7 354.4 29.4 42.2 64.5 89.5 110.6 87.8 44.3-1.8 61-28.7 114.6-28.7 53.7 0 68.7 28.7 115.5 27.8 47.8-0.9 78.3-42.5 107.6-84.7 33.9-49.5 47.8-97.4 48.6-99.8-1.1-0.5-93.5-35.9-94.5-142.7zM655.9 154.9c24.7-30 41.3-71.7 36.8-113.3-35.6 1.5-78.7 23.7-104.3 53.8-23 26.6-43.1 69.1-37.7 109.9 39.6 3.1 80.1-20.1 105.2-50.4z" fill="#000000"></path>
                  </svg>
                  <span>Apple</span>
                </div>
              </div>
              <div class="invite-code-hint" v-if="!inviteCodeValid">
                输入邀请码后可使用 Google/Apple 登录
              </div>
            </div>
            <div class="register">
              <span style="color:red" @click="showRegisterNotice">还没有账号？点击立即注册</span>
              <span @click="$router.push('forgetPassword')">忘记密码</span>
            </div>
          </div>
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
        <a href="https://pickmall.cn" target="_blank" style="margin: 0 5px">{{config.title}}</a>
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
      qrCodeStatus:"success", //
      qrCode: '',
      qrSessionToken:'',
      //是否是二维码登录
      scannerCodeLoginFLag: false,
      scannerCodeLoginStatus: 0,
      qrCodeTimer:null,
      config: require('@/config'),
      type: true, // true 账号登录  false 验证码登录
      formData: {
        // 登录表单
        username: "",
        password: "",
      },
      formSms: {
        // 手机号登录
        code: "",
        mobile: "",
      },
      verifyStatus: false, // 是否图片验证通过
      ruleInline: {
        // 验证规则
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
      codeMsg: "发送验证码", // 验证码文字
      interval: null, // 定时器
      time: 60, // 倒计时
      year: new Date().getFullYear(),
      // 邀请码相关
      inviteCode: "",
      inviteCodeValid: false,
      inviteCodeError: "",
      // 可用邀请码列表（包含之前的和新生成的，统一转换为大写存储）
      validInviteCodes: [
        "OK4MOTO",  // 之前的邀请码
        "LJVLP9", "2Z2RWY", "L96HWH", "FGHVKE", "PKZTYN",
        "GV3AXJ", "6PBY6L", "BSA6ND", "B4E7YT", "FHWC3X"
      ],
    };
  },
  watch:{

    scannerCodeLoginFLag(val){
      !val ? this.clearInterval() : ''
    }
  },
  methods: {

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
      const code = this.inviteCode.trim().toUpperCase();
      if (this.validInviteCodes.includes(code)) {
        this.inviteCodeValid = true;
        this.inviteCodeError = "";
      } else if (code.length > 0) {
        this.inviteCodeValid = false;
        this.inviteCodeError = "邀请码错误，请重新输入";
      } else {
        this.inviteCodeValid = false;
        this.inviteCodeError = "";
      }
    },
    // 发送手机验证码
    sendCode() {
      if (this.time === 60) {
        // 检查邀请码
        if (!this.inviteCodeValid) {
          this.$Message.warning("请先输入正确的邀请码");
          return;
        }
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
      // 拼图验证码回显
      if (!con.status) return;

      if (this.type === true) {
        // 账号密码登录
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
    // 开启滑块验证
    verifyBtnClick() {
      if (!this.verifyStatus) {
        this.$refs.verify.init();
      }
    },
    handleWebLogin(type) {
      // 第三方登录
      webLogin(type);
    },
    // Google登录
    handleGoogleLogin() {
      if (!this.inviteCodeValid) {
        this.$Message.warning("请先输入正确的邀请码");
        return;
      }
      this.handleWebLogin('GOOGLE');
    },
    // Apple登录
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

          this.qrCodeStatus = 'fail' // 如果过期将二维码转为失效状态
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
    // 显示注册关闭提示
    showRegisterNotice() {
      this.$Modal.info({
        title: '注册暂未开放',
        content: '目前内测阶段，暂不支持注册，账户定向开放。<br/><br/>如有需求请联系：<a href="mailto:ss@maollar.com" style="color:#2d8cf0;">ss@maollar.com</a>',
        okText: '知道了'
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
        console.log("二维码登录");
      }else{
        console.log("取消二维码登录");
        this.clearQRLoginInfo();
      }
    },
    type(v) {
      if (v) {
        this.$refs.formInline.resetFields();
      } else {
        this.$refs.formSms.resetFields();
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
.drag-area{
  margin: 10px 0;
}
.login {
  height: 100%;
  background-color: #f0f2f5;
}
.other{
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.qr-container{
  text-align: center;
  margin: 20px 0;
  position: relative;
  >.qr-shadow{
    background: rgba(0, 0, 0, 0.45);
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
    >span{
      margin-bottom: 20px;
      font-size: 13px;
      letter-spacing: 2px;
    }
  }
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
      margin-top: 10px;
    }
  }
}
.pending-scan{
  text-align: center;
  color:black;
}
.scanned{
  text-align: center;
  color:green;
}
.quick-logining{
  text-align: center;
  color:red;
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

.login-container {
  position: relative;
  width: 100%;
  height: 550px;
}

.form-box {
  width: 350px;
  box-sizing: border-box;
  position: absolute;
  top: 80px;
  right: 15%;
  padding: 20px;
  background: rgba(255, 255, 255, 0.8);

  .account-number {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    font-weight: bold;

    > div:nth-child(2) {
      color: $theme_color;
      cursor: pointer;
    }

    .tab-switch {
      height: 40px;
      font-size: 14px;

      span:nth-child(1) {
        font-size: 16px;
        border-right: 1px solid #ddd;
        padding-right: 10px;
      }

      span:nth-child(2) {
        cursor: pointer;
        padding-left: 10px;

        &:hover {
          color: $theme_color;
        }
      }
    }
  }
}

.verify-con {
  position: absolute;
  right: 16%;
  top: 90px;
  z-index: 10;
}

.other-login {
  display: flex;
  gap: 10px;
  margin-top: 10px;
  
  .login-btn-google,
  .login-btn-apple {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px 20px;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s;
    background: #fff;
    
    &:hover:not(.disabled) {
      border-color: #2d8cf0;
      background: #f0f9ff;
    }
    
    &.disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background: #f5f5f5;
    }
    
    .icon {
      width: 24px;
      height: 24px;
    }
    
    span {
      font-size: 14px;
      color: #333;
    }
  }
}

.third-party-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.section-divider {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  
  .divider-line {
    flex: 1;
    height: 1px;
    background: #eee;
  }
  
  .divider-text {
    padding: 0 10px;
    font-size: 12px;
    color: #999;
  }
}

.invite-code-section {
  margin-bottom: 15px;
  
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

.invite-code-hint {
  margin-top: 10px;
  font-size: 12px;
  color: #999;
  text-align: center;
}

.register {
  display: flex;

  margin-top: -10px;

  span {
    margin-left: 10px;

    &:hover {
      cursor: pointer;
      color: $theme_color;
    }
  }
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

.icon-hover {
  cursor: pointer;
}

</style>
