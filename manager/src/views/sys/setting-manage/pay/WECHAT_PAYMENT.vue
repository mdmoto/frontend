<template>
  <div class="layout">
    <Form
      ref="formValidate"
      :label-width="150"
      label-position="right"
      :model="formValidate"
      :rules="ruleValidate"
    >
      <FormItem label="JSAPI支付应用ID" prop="jsapiAppId">
        <Input maxlength="300" class="w200" v-model="formValidate.jsapiAppId" />
      </FormItem>
      <FormItem label="Native支付应用ID" prop="nativeAppId">
        <Input maxlength="300" class="w200" v-model="formValidate.nativeAppId" />
      </FormItem>
      <FormItem label="小程序支付应用id" prop="mpAppId">
        <Input maxlength="300" class="w200" v-model="formValidate.mpAppId" />
      </FormItem>
      <FormItem label="H5支付应用ID" prop="h5AppId">
        <Input maxlength="300" class="w200" v-model="formValidate.h5AppId" />
      </FormItem>
      <FormItem label="APP支付应用ID" prop="appAppId">
        <Input maxlength="300" class="w200" v-model="formValidate.appAppId" />
      </FormItem>
      <FormItem label="商户号" prop="mchId">
        <Input maxlength="300" class="w200" v-model="formValidate.mchId" />
      </FormItem>
      <FormItem label="APIv3密钥" prop="apiKey3">
        <Input maxlength="300" v-model="formValidate.apiKey3" />
      </FormItem>
      <FormItem label="API证书-证书序列号" prop="serialNumber">
        <Input maxlength="300" v-model="formValidate.serialNumber" />
      </FormItem>
      <FormItem class="form-item-view-el" label="apiclient_key" prop="apiclient_key">
        <Input v-model="formValidate.apiclientKey" :rows="6" maxlength="2500" show-word-limit type="textarea" placeholder="Enter something..." />
      </FormItem>
      <FormItem label="加签方式" prop="publicType">
        <RadioGroup type="button" button-style="solid" v-model="formValidate.publicType" @change="handlePublicTypeChange">
          <Radio label="CERT">平台证书</Radio>
          <Radio label="KEY">微信支付公钥</Radio>
        </RadioGroup>
        <span class="desc">商户接收APIv3的请求应答、回调时验签使用，以下两种方式只能使用一种</span>
      </FormItem>
      <!-- 当加签方式选择“KEY”时展示 -->
      <FormItem v-if="formValidate.publicType === 'KEY'" label="公钥证书ID" prop="publicId">
        <Input maxlength="300" v-model="formValidate.publicId" />
      </FormItem>
      <FormItem v-if="formValidate.publicType === 'KEY'" class="form-item-view-el" label="公钥证书" prop="publicKey">
        <Input v-model="formValidate.publicKey" :rows="6" maxlength="2500" show-word-limit type="textarea" placeholder="Enter something..." />
      </FormItem>
      <FormItem label="支付回调域名" prop="callbackUrl">
        <Input maxlength="300" v-model="formValidate.callbackUrl" />
      </FormItem>
      <div class="label-btns">
        <Button type="primary" @click="submit('formValidate')">保存</Button>
      </div>
    </Form>
  </div>
</template>
<script>
import { setSetting } from "@/api/index";
import { handleSubmit } from "../setting/validate";

export default {
  data() {
    return {
      ruleValidate: {}, // 验证规则
      formValidate: { // 表单数据
        jsapiAppId: "",
        nativeAppId: "",
        mpAppId: "",
        h5AppId: "",
        appAppId: "",
        mchId: "",
        apiKey3: "",
        serialNumber: "",
        apiclientKey: "",
        publicType: "CERT", // Default to CERT
        publicId: "",
        publicKey: "",
        callbackUrl: "",
      },
    };
  },
  props: ["res", "type"],
  created() {
    console.log('🚀 WECHAT_PAYMENT created() - res prop:', this.res);
    if (this.res && typeof this.res === 'string' && this.res.trim() !== '') {
      this.init();
    } else {
      console.log('⏳ WECHAT_PAYMENT created() - res 为空，等待 watch 触发');
    }
  },
  methods: {
    submit(name) {
      let that = this;
      if (handleSubmit(that, name)) {
        this.setupSetting();
      }
    },
    // 保存设置
    setupSetting() {
      setSetting(this.type, this.formValidate).then((res) => {
        if (res.success) {
          this.$Message.success("保存成功!");
        } else {
          this.$Message.error("保存失败!");
        }
      });
    },
    // 实例化数据
    init() {
      try {
        console.log('🔍 WECHAT_PAYMENT init() - 接收到的 res:', this.res);
        // 检查 res 是否为 undefined、null 或空字符串
        if (this.res === undefined || this.res === null || this.res === '' || 
            (typeof this.res === 'string' && (this.res.trim() === '' || this.res === 'null' || this.res === 'undefined'))) {
          console.warn('⚠️ WECHAT_PAYMENT: res 为空、null 或 undefined，跳过初始化，保持默认值');
          return;
        }
        
        // 确保 res 是字符串类型
        if (typeof this.res !== 'string') {
          console.warn('⚠️ WECHAT_PAYMENT: res 不是字符串类型，跳过初始化');
          return;
        }
        
        const parsedRes = JSON.parse(this.res);
        console.log('🔍 WECHAT_PAYMENT init() - 解析后的 result:', parsedRes);
        // 过滤掉 null 值，只合并有效值
        const validRes = {};
        Object.keys(parsedRes).forEach(key => {
          if (parsedRes[key] !== null && parsedRes[key] !== undefined) {
            validRes[key] = parsedRes[key];
          }
        });
        console.log('🔍 WECHAT_PAYMENT init() - 过滤后的有效值:', validRes);
        
        this.$set(this, "formValidate", { ...this.formValidate, ...validRes });
        console.log('✅ WECHAT_PAYMENT: 数据初始化成功，formValidate:', this.formValidate);
        Object.keys(this.formValidate).forEach((item) => {
          if (item.indexOf("pId") < 0) {
            this.ruleValidate[item] = [
              {
                required: true,
                message: "请填写必填项",
                trigger: "blur",
              },
            ];
          }
        });
      } catch (e) {
        console.error("❌ WECHAT_PAYMENT 解析设置失败:", e);
        console.error("❌ 失败的 res 值:", this.res);
      }
    },
    handlePublicTypeChange(value) {
      console.log('Public type changed to:', value);
      // Optionally reset publicId and publicKey if switching from KEY to CERT
      if (value === 'CERT') {
        this.formValidate.publicId = '';
        this.formValidate.publicKey = '';
      }
    }
  },
  watch: {
    res: {
      handler(newVal, oldVal) {
        console.log('🔔 WECHAT_PAYMENT watch res 触发:', { newVal, oldVal });
        this.init();
      },
      immediate: false,
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../setting/style.scss";

.label-item {
  display: flex;
}

.w200 {
  /deep/ .ivu-input {
    width: 250px !important;
    margin: 0 10px;
  }
}

/deep/ .ivu-input {
  width: 450px !important;
  margin: 0 10px;
}

.ivu-input-wrapper {
  width: 450px;
  margin-right: 10px;
}
</style>
