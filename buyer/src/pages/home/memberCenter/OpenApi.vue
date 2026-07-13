<template>
  <div class="wrapper">
    <card _Title="Open API 设置" />
    <div class="api-container">
      <Alert show-icon v-if="!apiKeyData">
        您尚未生成 API 密钥
        <template slot="desc">
          点击下方按钮生成您的专属 API 密钥。请注意妥善保管您的 Secret，它只会在生成时显示一次！
        </template>
      </Alert>

      <div v-if="apiKeyData" class="key-info">
        <Form :label-width="120">
          <FormItem label="API Key">
            <Input v-model="apiKeyData.apiKey" readonly style="width: 400px">
              <Button slot="append" @click="copy(apiKeyData.apiKey)">复制</Button>
            </Input>
          </FormItem>
          <FormItem label="API Secret">
            <Input v-model="apiSecretDisplay" :readonly="!isNewKey" style="width: 400px" type="password">
              <Button slot="append" @click="copy(apiSecretDisplay)">复制</Button>
            </Input>
            <div class="tips" v-if="isNewKey" style="color: red; margin-top: 5px;">
              请立即保存您的 Secret，刷新页面后将无法再次查看！
            </div>
          </FormItem>
          <FormItem label="权限范围">
            <Tag color="blue">{{ apiKeyData.permissions }}</Tag>
          </FormItem>
          <FormItem label="状态">
            <Tag :color="apiKeyData.status === 'OPEN' ? 'green' : 'red'">{{ apiKeyData.status === 'OPEN' ? '正常' : '已禁用' }}</Tag>
          </FormItem>
        </Form>
      </div>

      <div class="actions">
        <Button type="primary" :loading="loading" @click="handleGenerate">
          {{ apiKeyData ? '重新生成密钥' : '生成 API 密钥' }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
import { getMyApiKey, generateApiKey } from '@/api/openapi';

export default {
  name: 'OpenApi',
  data() {
    return {
      apiKeyData: null,
      loading: false,
      isNewKey: false,
      apiSecretDisplay: '********'
    };
  },
  mounted() {
    this.fetchKey();
  },
  methods: {
    fetchKey() {
      getMyApiKey().then(res => {
        if (res.success && res.result) {
          this.apiKeyData = res.result;
          this.isNewKey = false;
          this.apiSecretDisplay = '********';
        }
      });
    },
    handleGenerate() {
      this.$Modal.confirm({
        title: '确认生成',
        content: '<p>重新生成会使旧的 API 密钥立即失效，确认继续吗？</p>',
        onOk: () => {
          this.loading = true;
          generateApiKey().then(res => {
            this.loading = false;
            if (res.success) {
              this.$Message.success('生成成功！');
              this.apiKeyData = res.result;
              this.isNewKey = true;
              this.apiSecretDisplay = res.result.apiSecret;
            }
          }).catch(() => {
            this.loading = false;
          });
        }
      });
    },
    copy(text) {
      if (text === '********') {
        this.$Message.warning('无法复制隐藏的 Secret');
        return;
      }
      navigator.clipboard.writeText(text).then(() => {
        this.$Message.success('复制成功');
      });
    }
  }
};
</script>

<style scoped lang="scss">
.api-container {
  padding: 20px;
}
.actions {
  margin-top: 20px;
  padding-left: 120px;
}
</style>
