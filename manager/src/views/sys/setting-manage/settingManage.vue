
<template>
  <Card v-if="show">
    <Tabs v-model="selected" @on-click="clickTab">
      <TabPane :label="tabItem.name" :name="tabItem.type" v-for="(tabItem, tabIndex) in tabWay" :key="tabIndex">
        <component v-if="settingData" :res="settingData" :type="selected"
                   :is="templateSetting[tabItem.type]"></component>
      </TabPane>
    </Tabs>
  </Card>
</template>
<script>
import {getSetting} from "@/api/index.js";
import templateSetting from "./template";

export default {
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
    // 初始化时设置tabWay
    const routeName = this.$route.name;
    console.log('当前路由名称:', routeName);
    console.log('可用配置:', Object.keys(this).filter(k => ['setting', 'authLogin', 'pay'].includes(k)));
    
    // 支持多种路由名称匹配
    if (routeName === 'setting-manage' || routeName === 'setting' || routeName === 'settingManage') {
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
    
    // 如果tabWay还是空，默认使用setting
    if (!this.tabWay || this.tabWay.length === 0) {
      console.warn('tabWay为空，使用默认setting配置');
      this.tabWay = this.setting;
    }
    
    console.log('初始化后的tabWay:', this.tabWay);
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

      getSetting(name).then((res) => {
        if (res.result) {
          this.settingData = JSON.stringify(res.result);
        } else {
          // 如果没有数据，也设置一个空对象，确保组件能渲染
          this.settingData = JSON.stringify({});
        }
      }).catch((err) => {
        console.error('获取设置失败:', err);
        // 即使API失败，也设置空对象，确保组件能渲染
        this.settingData = JSON.stringify({});
      });
    },
  },
};
</script>
