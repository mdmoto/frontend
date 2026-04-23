<template>
  <div>
    <card _Title="收货地址" />
    <div class="add-box">
      <Form :model="formData" ref="form" label-position="left" :label-width="100" :rules="ruleInline">
        <FormItem label="收件人" prop="name">
          <i-input v-model="formData.name" placeholder="请输入收件人姓名" style="width: 600px"></i-input>
        </FormItem>
        <FormItem label="国家/地区" prop="countryCode">
          <Select v-model="formData.countryCode" style="width: 200px" @on-change="onCountryChange">
            <Option v-for="item in countryList" :value="item.code" :key="item.code">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="收件地区" prop="address">
          <span>{{ formData.address || '暂无地址' }}</span>
          <Button type="default" style="margin-left: 10px;" size="small" @click="handleOpenMap">选择</Button>
        </FormItem>
        <FormItem label="邮政编码" prop="postalCode" v-if="formData.countryCode !== 'CN'">
          <i-input v-model="formData.postalCode" placeholder="请输入邮政编码" style="width: 200px"></i-input>
        </FormItem>
        <FormItem label="详细地址" prop="detail">
          <i-input v-model="formData.detail" placeholder="请输入详细地址" style="width: 600px"></i-input>
        </FormItem>
        <FormItem label="手机号码" prop="mobile">
          <i-input v-model="formData.mobile" placeholder="请输入收件人手机号" style="width: 600px"></i-input>
        </FormItem>
        <FormItem label="地址别名">
          <i-input v-model="formData.alias" length :maxlength="4" placeholder="请输入地址别名，例如公司" style="width: 600px">
          </i-input>
        </FormItem>
        <FormItem label="默认地址">
          <i-switch v-model="formData.isDefault" />
        </FormItem>
      </Form>
    </div>
    <div class="mt_20">
      <Button type="primary" class="mr_10" :loading="loading" @click="save">保存收货地址</Button>
      <Button @click="$router.back()">返回</Button>
    </div>

    <multipleMap  ref="map" @callback="getAddress" />
  </div>
</template>

<script>
import card from "@/components/card";

import multipleMap from "@/components/map/multiple-map";
import * as RegExp from "@/plugins/RegExp.js";
import {
  newMemberAddress,
  editMemberAddress,
  getAddrDetail,
} from "@/api/address";
export default {
  name: "AddAddress",
  data() {
    return {
      formData: {
        // 添加地址表单
        isDefault: false,
        countryCode: 'CN',
        postalCode: '',
        address: '',
      },
      countryList: [
        { name: '中国', code: 'CN', id: 0 },
        { name: '日本', code: 'JP', id: 2000000001 },
        { name: '美国', code: 'US', id: 2000000002 },
        { name: '中国香港', code: 'HK', id: 2000000003 },
        { name: '中国台湾', code: 'TW', id: 2000000004 },
        { name: '新加坡', code: 'SG', id: 2000000005 },
        { name: '西班牙', code: 'ES', id: 2000000006 },
        { name: '澳大利亚', code: 'AU', id: 2000000007 },
        { name: '英国', code: 'GB', id: 2000000008 },
        { name: '加拿大', code: 'CA', id: 2000000009 },
        { name: '泰国', code: 'TH', id: 2000000010 },
        { name: '越南', code: 'VN', id: 2000000011 },
        { name: '印尼', code: 'ID', id: 2000000012 },
        { name: '马来西亚', code: 'MY', id: 2000000013 },
        { name: '韩国', code: 'KR', id: 2000000014 },
        { name: '沙特阿拉伯', code: 'SA', id: 2000000015 },
        { name: '阿联酋', code: 'AE', id: 2000000016 }
      ],
      ruleInline: {
        // 验证规则
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        address: [{ required: true, message: "请输入地址", trigger: "change" }],
        detail: [
          { required: true, message: "请输入详细地址", trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号码" },
          {
            pattern: RegExp.mobile,
            trigger: "blur",
            message: "请输入正确的手机号",
          },
        ],
      },
      loading: false, // 加载状态
      mapMsg: {}, // 地图信息
    };
  },
  methods: {
    save() {
      // 保存地址
      this.$refs.form.validate((valid) => {
        if (valid) {
          const params = JSON.parse(JSON.stringify(this.formData));
          params.consigneeAddressPath = params.address.replace(/\s/g, ",");
          delete params.address;
          this.loading = true;
          if (this.$route.query.id) {
            editMemberAddress(params)
              .then((res) => {
                if (res.success) {
                  this.loading = false;
                  this.$router.push("/home/MyAddress");
                }
              })
              .catch(() => {
                this.loading = false;
              });
          } else {
            newMemberAddress(params)
              .then((res) => {
                if (res.success) {
                  this.loading = false;
                  this.$router.push("/home/MyAddress");
                }
              })
              .catch(() => {
                this.loading = false;
              });
          }
        }
      });
    },
    getAddrById(id) {
      // 获取地址详情
      getAddrDetail(id).then((res) => {
        if (res.success) {
          console.log(res);
          const data = res.result;
          data.address = res.result.consigneeAddressPath.replace(/,/g, " ");
          this.formData = data;
        }
      });
    },
    getAddress(val) {
      // 获取地图选择信息
      if(val.type === 'select'){
        const paths = val.data.map(item => item.name).join(',')
        const ids = val.data.map(item => item.id).join(',')
        this.$set(this.formData,'address',paths)
        this.$set(this.formData,'consigneeAddressIdPath',ids)
        const coord = val.data[val.data.length - 1].center.split(',')
        this.formData.lat = coord[1]
        this.formData.lon = coord[0]
      }else{
        this.$set(this.formData, "address", val.data.addr);
        this.$set(this.formData, "consigneeAddressIdPath", val.data.addrId);
        this.$set(this.formData, "detail", val.data.address);
        this.formData.lat = val.data.position.lat;
        this.formData.lon = val.data.position.lng;
      }


    },
    onCountryChange(val) {
      this.formData.address = '';
      this.formData.consigneeAddressIdPath = '';
    },
    handleOpenMap() {
      const country = this.countryList.find(c => c.code === this.formData.countryCode);
      const rootId = country ? country.id : 0;
      this.$refs.map.open(rootId);
    }
  },
  mounted() {
    const id = this.$route.query.id;
    if (id) this.getAddrById(id);
  },
  components: {
    card,
    multipleMap
  },
};
</script>

<style scoped lang="scss">
.add-box {
  margin: 40px 0;
}
</style>
