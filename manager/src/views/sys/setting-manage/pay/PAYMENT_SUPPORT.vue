<template>
  <div class="layout">
    <div class="row" v-for="(client,clientIndex) in supportForm.clients" :key="clientIndex">
      <div class="col" v-if="getClientName(client) == getItemClient(item)" v-for="(item,index) in  formValidate" :key="index">
        <Card :padding="0">
          <div>

            <!-- app -->
            <div class="icon-item" v-if="getClientName(client) == getItemClient(item) && getItemClient(item) == 'APP'">
              <img class="icon" src="../../../../assets/setting/app.svg" alt="" srcset="">
            </div>
            <div class="icon-item" v-if="getClientName(client) == getItemClient(item) && getItemClient(item) == 'PC'">
              <!-- pc -->
              <img class="icon" src="../../../../assets/setting/pc.svg" alt="" srcset="">

            </div>
            <div class="icon-item" v-if="getClientName(client) == getItemClient(item) && getItemClient(item) == 'WECHAT_MP'">
              <!-- 小程序 -->

              <img class="icon" src="../../../../assets/setting/wechat_mp.svg" alt="" srcset="">
            </div>

            <div class="icon-item" v-if="getClientName(client) == getItemClient(item) && getItemClient(item) == 'H5'">
              <!-- h5 -->

              <img class="icon" src="../../../../assets/setting/h5.svg" alt="" srcset="">
            </div>
            <div class='pay-title' v-if="getClientName(client) == getItemClient(item)"> {{way[getItemClient(item)]}}</div>

            <div v-if="getClientName(client) == getItemClient(item)">
              <Divider orientation="left">支付设置</Divider>

              <div class="pay-list">
                <CheckboxGroup @on-change="handleChangePayType" v-model="item.supports">

                  <Checkbox v-for="(support,i)  in supportForm.payments" :key="i" :label="getPaymentName(support)">

                    {{payWay[getPaymentName(support)] || getPaymentName(support)}}

                  </Checkbox>
                </CheckboxGroup>
              </div>
            </div>

          </div>
        </Card>

      </div>

    </div>
  </div>
</template>
<script>
import { setSetting } from "@/api/index";
import { handleSubmit } from "../setting/validate";
import { getPaymentSupportForm } from "@/api/setting";
export default {
  data() {
    return {
      ruleValidate: {}, // 验证规则
      way: { // 类型
        APP: "移动应用端",
        H5: "移动端",
        WECHAT_MP: "小程序端",
        PC: "PC端",
      },
      formValidate: [], // 表单数据（应该是数组）
      // key obj
      payWay: { // 支付方式
        ALIPAY: "支付宝支付",
        WECHAT: "微信支付",
        WALLET: "余额支付",
      },
      supportForm: { clients: [], payments: [] }, // 支持的支付方式（应该是对象）
      checkSupport: {},
    };
  },
  props: ["res", "type"],
  watch: {
    // 监听 res 变化，当数据加载时重新初始化
    res: {
      handler(newVal, oldVal) {
        console.log('🔵 PAYMENT_SUPPORT: res 变化，重新初始化', { newVal, oldVal });
        if (newVal !== oldVal) {
          this.init();
        }
      },
      immediate: false,
      deep: false
    }
  },
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
    // 修改支付设置
    handleChangePayType(val) {
      this.$Modal.confirm({
        title: "修改支付设置",
        content: "您是否修改此项？",
        loading: true,
        onOk: () => {
          this.setupSetting();
        },
        onCancel: () => {
          this.formValidate = JSON.parse(JSON.stringify(this.checkSupport));
        },
      });
    },
    // 保存设置
    setupSetting() {
      setSetting(this.type, { paymentSupportItems: this.formValidate }).then(
        (res) => {
          if (res.success) {
            this.checkSupport =  JSON.parse(JSON.stringify(this.formValidate));
            this.$Message.success("保存成功!");
            this.$Modal.remove();
          } else {
            this.$Message.error("保存失败!");
            this.$Modal.remove();
          }
        }
      );
    },
    // 实例化数据
    async init() {
      try {
        // 先获取支持的表单结构
        await getPaymentSupportForm().then((res) => {
          if (res && res.result) {
            this.supportForm = res.result;
            console.log('✅ 获取支付支持表单成功:', this.supportForm);
          } else {
            console.warn('⚠️ 获取支付支持表单失败，使用默认值');
            this.supportForm = { clients: [], payments: [] };
          }
        }).catch((err) => {
          console.error('❌ 获取支付支持表单异常:', err);
          this.supportForm = { clients: [], payments: [] };
        });

        // 检查 res 是否为 undefined、null 或空字符串
        if (this.res === undefined || this.res === null || this.res === '' || 
            (typeof this.res === 'string' && (this.res.trim() === '' || this.res === 'null' || this.res === 'undefined'))) {
          console.warn('⚠️ PAYMENT_SUPPORT: res 为空、null 或 undefined，使用默认值');
          // 如果 res 为空，使用 supportForm 生成默认的 formValidate
          if (this.supportForm && this.supportForm.clients && this.supportForm.payments) {
            this.formValidate = this.supportForm.clients.map(client => ({
              client: client.name || client,
              supports: [...this.supportForm.payments.map(p => p.name || p)]
            }));
          } else {
            this.formValidate = [];
          }
          this.checkSupport = JSON.parse(JSON.stringify(this.formValidate));
        } else {
          // 确保 res 是字符串类型
          if (typeof this.res !== 'string') {
            console.warn('⚠️ PAYMENT_SUPPORT: res 不是字符串类型，尝试转换');
            try {
              this.res = JSON.stringify(this.res);
            } catch (e) {
              console.error('❌ 无法转换 res 为字符串:', e);
              this.formValidate = [];
              this.checkSupport = {};
              return;
            }
          }
          
          try {
            const parsedRes = JSON.parse(this.res);
            this.formValidate = parsedRes.paymentSupportItems || [];
            // 如果 formValidate 为空，使用默认值
            if (!this.formValidate || this.formValidate.length === 0) {
              if (this.supportForm && this.supportForm.clients && this.supportForm.payments) {
                this.formValidate = this.supportForm.clients.map(client => ({
                  client: client.name || client,
                  supports: [...this.supportForm.payments.map(p => p.name || p)]
                }));
              }
            }
            this.checkSupport = JSON.parse(JSON.stringify(this.formValidate));
            console.log('✅ PAYMENT_SUPPORT 初始化成功，formValidate:', this.formValidate);
          } catch (e) {
            console.error('❌ PAYMENT_SUPPORT 解析 JSON 失败:', e);
            // 解析失败时使用默认值
            if (this.supportForm && this.supportForm.clients && this.supportForm.payments) {
              this.formValidate = this.supportForm.clients.map(client => ({
                client: client.name || client,
                supports: [...this.supportForm.payments.map(p => p.name || p)]
              }));
            } else {
              this.formValidate = [];
            }
            this.checkSupport = JSON.parse(JSON.stringify(this.formValidate));
          }
        }
      } catch (e) {
        console.error("❌ PAYMENT_SUPPORT 解析设置失败:", e);
        console.error("❌ 失败的 res 值:", this.res);
        this.formValidate = [];
        this.checkSupport = {};
      }
    },
    // 获取客户端名称（处理枚举对象或字符串）
    getClientName(client) {
      if (!client) return '';
      if (typeof client === 'string') return client;
      if (client.name) return client.name;
      // 如果是枚举对象，尝试获取 name() 方法或直接使用 toString()
      try {
        return String(client);
      } catch (e) {
        return '';
      }
    },
    // 获取支付项客户端名称
    getItemClient(item) {
      if (!item) return '';
      return item.client || '';
    },
    // 获取支付方式名称（处理枚举对象或字符串）
    getPaymentName(payment) {
      if (!payment) return '';
      if (typeof payment === 'string') return payment;
      if (payment.name) return payment.name;
      // 如果是枚举对象，尝试获取 name() 方法或直接使用 toString()
      try {
        return String(payment);
      } catch (e) {
        return '';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../setting/style.scss";
.pay-title {
  text-align: center;
  margin: 10px 0;
}
.layout {
  padding: 20px;

  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.row {
  width: 300px;
  margin-right: 20px;
  display: flex;
  margin-bottom: 20px;
  /deep/ .ivu-card-body {
    padding: 0 16px !important;
  }
}

.label-item {
  display: flex;
}
.label-item {
  display: flex;
  align-items: center;
}
.pay-list {
  display: flex;
  justify-content: center;
  padding-bottom: 10px;
}
.icon-item {
  width: 100%;
  padding: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.ivu-form-item {
  display: flex;

  align-items: center;
}
.ivu-row {
  width: 100%;
}
.icon {
  width: 100px;
  height: 100px;
}
</style>
