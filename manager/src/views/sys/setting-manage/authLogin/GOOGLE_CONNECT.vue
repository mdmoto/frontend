<template>
  <div class="layout">
    <div class="row">
      <div class="col">
        <Card :padding="0">
          <div class="icon-item">
            <div style="font-size: 48px; color: #4285F4; font-weight: bold;">G</div>
          </div>
          <div class='pay-title'>Google OAuth 2.0 登录</div>
          <Divider orientation="left">登录设置</Divider>
          <div class="form-list">
            <Form
              ref="formValidate"
              label-width="150"
              label-position="right"
              :model="formValidate"
              :rules="ruleValidate"
            >
              <FormItem label="Client ID" prop="clientId">
                <Input 
                  v-model="formValidate.clientId" 
                  placeholder="请输入 Google OAuth Client ID"
                  class="w200" 
                />
                <div style="color: #999; font-size: 12px; margin-top: 5px;">
                  从 Google Cloud Console 获取
                </div>
              </FormItem>
              <FormItem label="Client Secret" prop="clientSecret">
                <Input 
                  type="password"
                  v-model="formValidate.clientSecret" 
                  placeholder="请输入 Google OAuth Client Secret"
                  class="w200" 
                />
                <div style="color: #999; font-size: 12px; margin-top: 5px;">
                  从 Google Cloud Console 获取
                </div>
              </FormItem>
              <FormItem label="重定向URI" prop="redirectUri">
                <Input 
                  v-model="formValidate.redirectUri" 
                  placeholder="https://api.maollar.com/buyer/passport/connect/connect/callback/GOOGLE"
                  class="w200" 
                />
                <div style="color: #999; font-size: 12px; margin-top: 5px;">
                  回调地址，需要在 Google Cloud Console 中配置
                </div>
              </FormItem>
              <FormItem label="是否启用" prop="enabled">
                <i-switch v-model="formValidate.enabled" size="large">
                  <span slot="open">启用</span>
                  <span slot="close">禁用</span>
                </i-switch>
              </FormItem>
              <FormItem label="操作">
                <Button type="primary" @click="setupSetting">保存设置</Button>
              </FormItem>
            </Form>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>
<script>
import { setSetting } from "@/api/index";
import { handleSubmit } from "../setting/validate";

export default {
  data() {
    return {
      ruleValidate: {}, // 验证规则
      formValidate: {
        clientId: "",
        clientSecret: "",
        redirectUri: "https://api.maollar.com/buyer/passport/connect/connect/callback/GOOGLE",
        enabled: true
      } // 表单数据
    };
  },
  props: ["res", "type"],
  created() {
    this.init();
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
          this.$Message.error("保存失败: " + (res.message || "未知错误"));
        }
      }).catch((error) => {
        this.$Message.error("保存失败: " + (error.message || "网络错误"));
      });
    },
    // 实例化数据
    init() {
      if (this.res) {
        try {
          const parsed = JSON.parse(this.res);
          this.$set(this, "formValidate", {
            clientId: parsed.clientId || "",
            clientSecret: parsed.clientSecret || "",
            redirectUri: parsed.redirectUri || "https://api.maollar.com/buyer/passport/connect/connect/callback/GOOGLE",
            enabled: parsed.enabled !== undefined ? parsed.enabled : true
          });
        } catch (e) {
          console.error("解析配置失败:", e);
        }
      }
      
      // 设置验证规则
      this.ruleValidate = {
        clientId: [
          {
            required: true,
            message: "请输入 Client ID",
            trigger: "blur",
          },
        ],
        clientSecret: [
          {
            required: true,
            message: "请输入 Client Secret",
            trigger: "blur",
          },
        ],
        redirectUri: [
          {
            required: true,
            message: "请输入重定向URI",
            trigger: "blur",
          },
          {
            type: "url",
            message: "请输入有效的URL",
            trigger: "blur",
          },
        ],
      };
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../setting/style.scss";

.form-list {
  padding: 16px;
}

.pay-title {
  text-align: center;
  margin: 10px 0;
  font-size: 16px;
  font-weight: bold;
}

.col {
  width: 100%;
}

.layout {
  padding: 20px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.row {
  width: 600px;
  margin-right: 10px;
  display: flex;
  margin-bottom: 20px;
  /deep/ .ivu-card-body {
    padding: 0 16px !important;
  }
}

.icon-item {
  width: 100%;
  padding: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.icon {
  width: 100px;
  height: 100px;
}

.w200 {
  width: 100%;
  max-width: 500px;
}
</style>

