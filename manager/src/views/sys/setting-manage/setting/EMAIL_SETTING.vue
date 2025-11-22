<template>
  <div class="layout">
    <Form ref="formValidate" :label-width="150" label-position="right" :model="formValidate" :rules="ruleValidate">
      <FormItem label="邮箱服务器" prop="host">
        <Input v-model="formValidate.host" placeholder="smtp.qq.com"/>
        <span class="desc">QQ邮箱使用：smtp.qq.com</span>
      </FormItem>
      <FormItem label="发送者邮箱账号" prop="username">
        <Input v-model="formValidate.username" placeholder="your_email@qq.com"/>
        <span class="desc">你的QQ邮箱地址</span>
      </FormItem>
      <FormItem label="邮箱授权码" prop="password">
        <Input type="password" v-model="formValidate.password" placeholder="16位授权码"/>
        <span class="desc">在QQ邮箱设置中生成的授权码（不是QQ密码）</span>
      </FormItem>
      <div class="label-btns">
        <Button type="primary" @click="submit('formValidate')">保存</Button>
      </div>
    </Form>
  </div>
</template>
<script>
import {setSetting} from "@/api/index";
import {handleSubmit} from "./validate";

export default {
  props: ["res", "type"],
  data() {
    return {
      ruleValidate: {
        host: [{required: true, message: "请输入邮箱服务器地址", trigger: "blur"}],
        username: [
          {required: true, message: "请输入邮箱账号", trigger: "blur"},
          {type: "email", message: "邮箱格式不正确", trigger: "blur"}
        ],
        password: [{required: true, message: "请输入邮箱授权码", trigger: "blur"}],
      },
      formValidate: {
        host: "smtp.qq.com",
        username: "",
        password: "",
      },
    };
  },
  created() {
    console.log('🚀 EMAIL_SETTING created() - res prop:', this.res);
    if (this.res && this.res.trim() !== '') {
      this.init();
    } else {
      console.log('⏳ EMAIL_SETTING created() - res 为空，等待 watch 触发');
    }
  },
  methods: {
    init() {
      try {
        console.log('🔍 EMAIL_SETTING init() - 接收到的 res:', this.res);
        // 检查 res 是否为 undefined、null 或空字符串
        if (this.res === undefined || this.res === null || this.res === '' || 
            (typeof this.res === 'string' && (this.res.trim() === '' || this.res === 'null' || this.res === 'undefined'))) {
          console.warn('⚠️ EMAIL_SETTING: res 为空、null 或 undefined，跳过初始化，保持默认值');
          return;
        }
        
        // 确保 res 是字符串类型
        if (typeof this.res !== 'string') {
          console.warn('⚠️ EMAIL_SETTING: res 不是字符串类型，跳过初始化');
          return;
        }
        
        const result = JSON.parse(this.res);
        console.log('🔍 EMAIL_SETTING init() - 解析后的 result:', result);
        // 过滤掉 null 值，只合并有效值
        const validResult = {};
        Object.keys(result).forEach(key => {
          const value = result[key];
          if (value !== null && value !== undefined) {
            validResult[key] = value;
          }
        });
        console.log('🔍 EMAIL_SETTING init() - 过滤后的有效值:', validResult);
        
        // 合并数据而不是完全覆盖，保留原有字段
        this.$set(this, "formValidate", { ...this.formValidate, ...validResult });
        console.log('✅ EMAIL_SETTING: 数据初始化成功，formValidate:', this.formValidate);
      } catch (e) {
        console.error("❌ EMAIL_SETTING 解析设置失败:", e);
        console.error("❌ 失败的 res 值:", this.res);
      }
    },
    // 保存
    submit(name) {
      let that = this;
      if (handleSubmit(that, name)) {
        this.setupSetting()
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
  },
  watch: {
    res: {
      handler(newVal, oldVal) {
        console.log('🔔 EMAIL_SETTING watch res 触发:', { newVal, oldVal });
        this.init();
      },
      immediate: false,
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./style.scss";
.desc {
  color: #999;
  font-size: 12px;
  margin-left: 10px;
}
</style>

