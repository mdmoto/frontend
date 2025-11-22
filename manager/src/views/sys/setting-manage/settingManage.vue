
<template>
  <Card v-if="show">
    <Tabs v-model="selected" @on-click="clickTab">
      <TabPane :label="tabItem.name" :name="tabItem.type" v-for="(tabItem, tabIndex) in tabWay" :key="tabIndex">
        <component v-if="settingData !== undefined || tabItem.type === selected" :res="settingData || '{}'" :type="selected"
                   :is="templateSetting[tabItem.type]"></component>
      </TabPane>
    </Tabs>
  </Card>
</template>
<script>
import {getSetting} from "@/api/index.js";
import templateSetting from "./template";

export default {
  name: 'SettingManage',
  data() {
    return {
      templateSetting, // 设置模板
      selected: "", // 已选
      settingData: "", // 模板数据
      show: true, // 是否显示
      setting: [
        //基础配置
        {
          type: "BASE_SETTING",
          name: "基础配置",
        },
        //商品设置
        {
          type: "GOODS_SETTING",
          name: "商品设置",
        },
        //订单配置
        {
          type: "ORDER_SETTING",
          name: "订单配置",
        },
        //喵币设置
        {type: "POINT_SETTING", name: "喵币设置"},
        {
          type: "WITHDRAWAL_SETTING",
          name: "提现设置",
        },
        //  快递查询设置
        {
          type: "LOGISTICS_SETTING",
          name: "快递查询设置",
        },
        //静态资源配置
        {
          type: "OSS_SETTING",
          name: "静态资源配置",
        },
        //短信配置
        {
          type: "SMS_SETTING",
          name: "短信配置",
        },
        //邮箱配置
        {
          type: "EMAIL_SETTING",
          name: "邮箱配置",
        },
        //阿里短信配置
        {
          type: "IM_SETTING",
          name: "客服设置",
        },
      ],
      authLogin: [
        // 登录设置
        {type: "CONNECT_SETTING", name: "登录设置"},
        // 微信设置
        {type: "WECHAT_CONNECT", name: "微信设置"},
        // QQ设置
        {type: "QQ_CONNECT", name: "QQ设置"},
        // Google OAuth 设置
        {type: "GOOGLE_CONNECT", name: "Google登录设置"},
      ],
      pay: [
        //支付宝支付设置
        {type: "PAYMENT_SUPPORT", name: "支付开启/关闭"},
        //支付宝支付设置
        {type: "ALIPAY_PAYMENT", name: "支付宝支付设置"},
        //微信支付设置
        {type: "WECHAT_PAYMENT", name: "微信支付设置"},
      ],
      tabWay: [], // tab数据
    };
  },

  watch: {
    $route(to, from) {
      this.selected = "";
      this.show = false;
      // 路由变化时重新初始化tabWay
      const routeName = to.name;
      console.log('路由变化，新路由名称:', routeName);
      if (routeName === 'setting-manage' || routeName === 'setting' || routeName === 'settingManage') {
        this.tabWay = this.setting;
      } else if (routeName === 'authLogin' || routeName === 'auth-login') {
        this.tabWay = this.authLogin;
      } else if (routeName === 'pay' || routeName === 'payment') {
        this.tabWay = this.pay;
      } else {
        Object.keys(this).forEach((item) => {
          if (routeName == item) {
            this.tabWay = this[item];
          }
        });
      }
      if (!this.tabWay || this.tabWay.length === 0) {
        this.tabWay = this.setting;
      }
      console.log('路由变化后的tabWay:', this.tabWay);
      this.getSettingData(this.selected);
      this.$nextTick(() => {
        this.show = true;
      });
    },
  },
  mounted() {
    // 初始化时设置tabWay - 直接使用setting，因为这是系统设置页面
    console.log('=== SettingManage组件已挂载 ===');
    console.log('当前路由名称:', this.$route.name);
    console.log('当前路由路径:', this.$route.path);
    console.log('当前路由查询参数:', this.$route.query);
    
    // 直接设置tabWay为setting，因为这是系统设置页面
    this.tabWay = this.setting;
    console.log('初始化tabWay为setting，包含', this.tabWay.length, '个标签页');
    console.log('标签页列表:', this.tabWay.map(t => `${t.name}(${t.type})`));
    console.log('是否包含邮箱配置:', this.tabWay.some(t => t.type === 'EMAIL_SETTING'));
    
    // 如果没有选中项，选择第一个
    if (!this.selected && this.tabWay.length > 0) {
      this.selected = this.tabWay[0].type;
    }
    
    console.log('当前选中的标签:', this.selected);
    console.log('templateSetting中是否有EMAIL_SETTING:', !!this.templateSetting.EMAIL_SETTING);
    console.log('=== 初始化完成 ===');
    
    this.clickTab(this.selected);
  },
  methods: {
    // tab切换
    clickTab(name) {
      this.selected = name;
      this.getSettingData(name);
    },
    /**
     * 进入页面请求第一个配置
     */
    getSettingData(name) {
      this.settingData = "";
      // 支持多种路由名称匹配
      const routeName = this.$route.name;
      if (routeName === 'setting-manage' || routeName === 'setting') {
        this.tabWay = this.setting;
      } else if (routeName === 'authLogin' || routeName === 'auth-login') {
        this.tabWay = this.authLogin;
      } else if (routeName === 'pay' || routeName === 'payment') {
        this.tabWay = this.pay;
      } else {
        // 原有的匹配逻辑
        Object.keys(this).forEach((item) => {
          if (routeName == item) {
            this.tabWay = this[item];
          }
        });
      }
      // 点击页面给每项第一个数据赋值
      if (!name) {
        name = this.tabWay[0].type;
        this.selected = name;
      }

      console.log('📡 请求设置数据，类型:', name);
      getSetting(name).then((res) => {
        console.log('📥 获取设置响应 - 完整对象:', res);
        console.log('📥 响应类型:', typeof res);
        console.log('📥 res.success:', res.success);
        console.log('📥 res.code:', res.code);
        console.log('📥 res.result:', res.result);
        console.log('📥 res.result 类型:', typeof res.result);
        
        // 检查响应是否是错误对象（从拦截器返回的错误）
        if (res && res.response) {
          console.warn('⚠️ 响应包含 response 对象（可能是错误对象）:', res.response.status);
          this.settingData = '';
          return;
        }
        
        // 检查是否是正常的响应对象
        if (res && typeof res === 'object') {
          // 检查是否有 success 字段（正常响应格式）
          if (res.success !== undefined) {
            if (res.success && res.result) {
              // 检查 result 是否为空对象
              const resultKeys = Object.keys(res.result);
              console.log('📥 res.result 的键:', resultKeys);
              console.log('📥 res.result 的键数量:', resultKeys.length);
              
              // 即使 result 是空对象，也传递它（后端可能返回所有字段为 null 的对象）
              this.settingData = JSON.stringify(res.result);
              console.log('✅ 设置数据已更新，settingData:', this.settingData.substring(0, 200));
              console.log('✅ settingData 长度:', this.settingData.length);
            } else if (res.success && !res.result) {
              console.warn('⚠️ success 为 true 但没有 result 数据');
              this.settingData = '';
            } else {
              console.warn('⚠️ success 为 false，错误信息:', res.message || res.msg);
              this.settingData = '';
            }
          } else {
            console.warn('⚠️ 响应格式异常，没有 success 字段:', res);
            this.settingData = '';
          }
        } else {
          console.warn('⚠️ 响应不是对象:', res);
          this.settingData = '';
        }
      }).catch((err) => {
        console.error('❌ 获取设置失败 - catch 块:', err);
        console.error('❌ 错误类型:', typeof err);
        console.error('❌ 错误详情:', {
          message: err.message,
          response: err.response,
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data
        });
        // API失败时，设置为空字符串
        this.settingData = '';
      });
    },
  },
};
</script>
