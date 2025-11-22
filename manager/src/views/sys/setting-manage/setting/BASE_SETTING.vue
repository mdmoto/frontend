<template>
  <div class="layout">
    <Form ref="formValidate" :label-width="150" label-position="right" :model="formValidate" :rules="ruleValidate">

      <FormItem label="站点名称" prop="siteName">
        <Input style="width:200px;" v-model="formValidate.siteName" />
        <span class="desc">配置买家端站点名称</span>
      </FormItem>
      <FormItem label="icp" prop="icp">

        <Input v-model="formValidate.icp" />
      </FormItem>

      <FormItem label="后台Logo" prop="domainLogo">
        <div class="label-item-upload">

          <img v-if="formValidate.domainLogo" class="img" :src="formValidate.domainLogo" />
          <img v-else class="img" src="../../../../assets/emptyImg.png" alt="">
          <Button @click="onClickImg('domainLogo')">选择图片</Button>
           <span class="desc">后台管理左上角logo展示 	17∶6</span>
        </div>
      </FormItem>
      <FormItem label="后台Icon" prop="domainIcon">
        <div class="label-item-upload">

          <img v-if="formValidate.domainIcon" class="img" :src="formValidate.domainIcon" />
          <img v-else class="img" src="../../../../assets/emptyImg.png" alt="">
          <Button @click="onClickImg('domainIcon')">选择图片</Button>
            <span class="desc">后台管理网站icon展示 	1∶1</span>
        </div>
      </FormItem>
      <FormItem label="买家端Logo" prop="buyerSideLogo">
        <div class="label-item-upload">
          <img v-if="formValidate.buyerSideLogo" class="img" :src="formValidate.buyerSideLogo" />
          <img v-else class="img" src="../../../../assets/emptyImg.png" alt="">
          <Button @click="onClickImg('buyerSideLogo')">选择图片</Button>
           <span class="desc">买家端logo展示 	17∶6</span>
        </div>
      </FormItem>
      <FormItem label="买家端Icon" prop="buyerSideIcon">
        <div class="label-item-upload">
          <img v-if="formValidate.buyerSideIcon" class="img" :src="formValidate.buyerSideIcon" />
          <img v-else class="img" src="../../../../assets/emptyImg.png" alt="">
          <Button @click="onClickImg('buyerSideIcon')">选择图片</Button>
            <span class="desc">买家端网站icon展示 	1∶1</span>
        </div>
      </FormItem>
      <FormItem label="商家端Logo" prop="storeSideLogo">
        <div class="label-item-upload">
          <img v-if="formValidate.storeSideLogo" class="img" :src="formValidate.storeSideLogo" />
          <img v-else class="img" src="../../../../assets/emptyImg.png" alt="">
          <Button @click="onClickImg('storeSideLogo')">选择图片</Button>
          <span class="desc">商家端logo展示 	17∶6</span>
        </div>
      </FormItem>
      <FormItem label="商家端Icon" prop="storeSideIcon">
        <div class="label-item-upload">
          <img v-if="formValidate.storeSideIcon" class="img" :src="formValidate.storeSideIcon" />
          <img v-else class="img" src="../../../../assets/emptyImg.png" alt="">
          <Button @click="onClickImg('storeSideIcon')">选择图片</Button>
           <span class="desc">商家端icon展示 	1∶1</span>
        </div>
      </FormItem>

      <FormItem label="站点地址" prop="staticPageAddress">
        <Input  style="width:200px;" v-model="formValidate.staticPageAddress" />

      </FormItem>
      <FormItem label="wap站点地址" prop="staticPageWapAddress">
        <Input v-model="formValidate.staticPageWapAddress" />
      </FormItem>
      <div class="label-btns">
        <Button type="primary" @click="submit('formValidate')">保存</Button>

      </div>
    </Form>
    <Modal width="1200px" v-model="picModelFlag">
      <ossManage @callback="callbackSelected" :isComponent="true" :initialize="picModelFlag" ref="ossManage" />
    </Modal>

  </div>
</template>
<script>
import { setSetting } from "@/api/index";
import { handleSubmit } from "./validate";
import ossManage from "@/views/sys/oss-manage/ossManage";
export default {
  title: "基础设置",
  props: {
    res:{
      type:null,
      default:""
    },
    type:''
  },
  components: {
    ossManage,
  },
  data() {
    return {
      handleSubmit, // 验证规则

      picModelFlag: false, // 预览图片显隐
      formValidate: { // 表单数据
        buyerSideLogo: "",
        domainLogo: "",
        icp: "",
        storeSideLogo: "",
        siteName: "",
        staticPageAddress: "",
        staticPageWapAddress: "",
      },
      selected: "", // 已选数据
      ruleValidate: {}, // 验证规则
      result:""
    };
  },
  created() {
    console.log('🚀 BASE_SETTING created() - res prop:', this.res);
    // 如果 res 已经有值，在 created 时初始化
    if (this.res && this.res.trim() !== '') {
      this.init();
    } else {
      console.log('⏳ BASE_SETTING created() - res 为空，等待 watch 触发');
    }
  },
  methods: {
    // 点击图片
    onClickImg(item) {
      this.selected = item;
      this.$refs.ossManage.selectImage = true;
      this.picModelFlag = true;
    },
    submit(name) {
      let that = this;
      if (handleSubmit(that, name)) {
        this.setupSetting();
      }
    },
    // 选择回显
    callbackSelected(val) {
      this.picModelFlag = false;
      this.formValidate[this.selected] = val.url;
    },
    // 保存设置
    setupSetting() {
      setSetting(this.type, this.formValidate).then((res) => {
        if (res.success) {
          this.$Message.success("保存成功!");
          localStorage.setItem("icon", this.formValidate.domainLogo);
          window.document.title = this.formValidate.siteName + " - 运营后台";
          this.setStore("title", this.formValidate.siteName);
        } else {
          this.$Message.error("保存失败!");
        }
      });
    },
    /**添加必填项 */
    init() {
      try {
        console.log('🔍 BASE_SETTING init() - 接收到的 res:', this.res);
        console.log('🔍 BASE_SETTING init() - res 类型:', typeof this.res);
        console.log('🔍 BASE_SETTING init() - res 是否为 undefined:', this.res === undefined);
        console.log('🔍 BASE_SETTING init() - res 是否为 null:', this.res === null);
        
        // 如果 res 是 undefined、null、空字符串，不进行解析
        if (this.res === undefined || this.res === null || this.res === '' || 
            (typeof this.res === 'string' && (this.res.trim() === '' || this.res === 'null' || this.res === 'undefined'))) {
          console.warn('⚠️ BASE_SETTING: res 为空、null 或 undefined，跳过初始化，保持默认值');
          return;
        }
        
        // 确保 res 是字符串类型
        if (typeof this.res !== 'string') {
          console.warn('⚠️ BASE_SETTING: res 不是字符串类型，跳过初始化');
          return;
        }
        
        this.result = JSON.parse(this.res);
        console.log('🔍 BASE_SETTING init() - 解析后的 result:', this.result);
        console.log('🔍 BASE_SETTING init() - result 的键:', Object.keys(this.result));
        console.log('🔍 BASE_SETTING init() - result 的键数量:', Object.keys(this.result).length);
        
        // 检查是否有有效的字段值（非空值）
        const hasValidValues = Object.keys(this.result).some(key => {
          const value = this.result[key];
          return value !== null && value !== undefined && value !== '';
        });
        
        console.log('🔍 BASE_SETTING init() - 是否有有效值:', hasValidValues);
        
        // 过滤掉 null 值，只合并有效值
        // 这样可以避免 null 值覆盖默认的空字符串
        const validResult = {};
        Object.keys(this.result).forEach(key => {
          const value = this.result[key];
          // 只保留非 null、非 undefined 的值
          if (value !== null && value !== undefined) {
            validResult[key] = value;
          }
        });
        
        console.log('🔍 BASE_SETTING init() - 过滤后的有效值:', validResult);
        console.log('🔍 BASE_SETTING init() - 有效值的键:', Object.keys(validResult));
        
        // 合并数据而不是完全覆盖，保留原有字段
        // 只合并有效值，避免 null 值覆盖默认值
        this.$set(this, "formValidate", { ...this.formValidate, ...validResult });
        
        // 只为 result 中存在的键设置验证规则（包括 null 值的字段）
        Object.keys(this.result).forEach((item) => {
          this.ruleValidate[item] = [
            {
              required: true,
              message: "请填写必填项",
              trigger: "blur",
            },
          ];
        });
        
        console.log('✅ BASE_SETTING: 数据初始化成功');
        console.log('✅ BASE_SETTING: formValidate:', JSON.stringify(this.formValidate, null, 2));
        console.log('✅ BASE_SETTING: formValidate 的键:', Object.keys(this.formValidate));
      } catch (e) {
        console.error("❌ BASE_SETTING 解析设置失败:", e);
        console.error("❌ 失败的 res 值:", this.res);
        // 解析失败时，至少保持默认值
      }
    },
  },
  watch: {
    res: {
      handler(newVal, oldVal) {
        console.log('🔔 BASE_SETTING watch res 触发:', { newVal, oldVal });
        this.init();
      },
      immediate: false,
    },
  },
};
</script>
<style scoped lang="scss">
@import "./style.scss";
.label-item {
  display: flex;
  > .ivu-input {
    width: 200px;
    margin: 0 10px;
  }
}
.label-item-upload {
  display: flex;
  align-items: flex-end;
  img {
    margin-right: 10px;
    width: 100px;
    height: 100px;
  }
}
</style>
