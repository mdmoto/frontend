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
    this.init();
  },
  methods: {
    init() {
      if (this.res) {
        this.$set(this, "formValidate", {...JSON.parse(this.res)});
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

