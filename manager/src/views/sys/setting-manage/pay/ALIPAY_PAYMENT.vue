<template>
  <div class="layout">
    <Form ref="formValidate" :label-width="160" label-position="right" :model="formValidate" :rules="ruleValidate">
      <FormItem label="appId" prop="appId">
        <Input maxlength="300" class="w200" v-model="formValidate.appId" />
      </FormItem>
      <FormItem label="certPath" prop="certPath">
        <Input maxlength="300"  v-model="formValidate.certPath" />
      </FormItem>
      <FormItem label="alipayPublicCertPath" prop="alipayPublicCertPath">
        <Input maxlength="300" v-model="formValidate.alipayPublicCertPath" />
      </FormItem>
      <FormItem label="privateKey" class="label-item" prop="privateKey">
        <Input maxlength="3000" v-model="formValidate.privateKey" />
      </FormItem>
      <FormItem label="rootCertPath" prop="rootCertPath">
        <Input maxlength="300" v-model="formValidate.rootCertPath" />
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
        appId: "",
        certPath: "",
        alipayPublicCertPath: "",
        privateKey: "",
        rootCertPath: "",
        callbackUrl: "",
      },
    };
  },
  props: ["res", "type"],
  created() {
    console.log('🚀 ALIPAY_PAYMENT created() - res prop:', this.res);
    if (this.res && typeof this.res === 'string' && this.res.trim() !== '') {
      this.init();
    } else {
      console.log('⏳ ALIPAY_PAYMENT created() - res 为空，等待 watch 触发');
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
        console.log('🔍 ALIPAY_PAYMENT init() - 接收到的 res:', this.res);
        // 检查 res 是否为 undefined、null 或空字符串
        if (this.res === undefined || this.res === null || this.res === '' || 
            (typeof this.res === 'string' && (this.res.trim() === '' || this.res === 'null' || this.res === 'undefined'))) {
          console.warn('⚠️ ALIPAY_PAYMENT: res 为空、null 或 undefined，跳过初始化，保持默认值');
          return;
        }
        
        // 确保 res 是字符串类型
        if (typeof this.res !== 'string') {
          console.warn('⚠️ ALIPAY_PAYMENT: res 不是字符串类型，跳过初始化');
          return;
        }
        
        const parsedRes = JSON.parse(this.res);
        console.log('🔍 ALIPAY_PAYMENT init() - 解析后的 result:', parsedRes);
        // 过滤掉 null 值，只合并有效值
        const validRes = {};
        Object.keys(parsedRes).forEach(key => {
          if (parsedRes[key] !== null && parsedRes[key] !== undefined) {
            validRes[key] = parsedRes[key];
          }
        });
        console.log('🔍 ALIPAY_PAYMENT init() - 过滤后的有效值:', validRes);
        
        this.$set(this, "formValidate", { ...this.formValidate, ...validRes });
        console.log('✅ ALIPAY_PAYMENT: 数据初始化成功，formValidate:', this.formValidate);
        Object.keys(this.formValidate).forEach((item) => {
          this.ruleValidate[item] = [
            {
              required: true,
              message: "请填写必填项",
              trigger: "blur",
            },
          ];
        });
      } catch (e) {
        console.error("❌ ALIPAY_PAYMENT 解析设置失败:", e);
        console.error("❌ 失败的 res 值:", this.res);
      }
    },
  },
  watch: {
    res: {
      handler(newVal, oldVal) {
        console.log('🔔 ALIPAY_PAYMENT watch res 触发:', { newVal, oldVal });
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
