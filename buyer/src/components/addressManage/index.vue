<template>
  <div>
    <Modal v-model="showAddr" width="800" title="收件人地址">
      <Form
        :model="formData"
        ref="form"
        label-position="left"
        :label-width="100"
        :rules="ruleInline"
      >
        <FormItem label="国家/地区" prop="countryCode">
          <Select v-model="formData.countryCode" style="width: 600px" @on-change="changeCountry">
            <Option v-for="item in countryList" :value="item.code" :key="item.code">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="收件地区" prop="address">
          {{ formData.address || '暂无地址' }}
          <Button type="primary" style="margin-left: 10px;" size="small" @click="openMap">选择</Button>
        </FormItem>
        <FormItem label="详细地址" prop="detail">
          <i-input v-model="formData.detail" style="width: 600px"></i-input>
        </FormItem>
        <FormItem label="手机号码" prop="mobile">
          <i-input v-model="formData.mobile" style="width: 600px"></i-input>
        </FormItem>
        <FormItem label="地址别名">
          <i-input
            v-model="formData.alias"
            length
            :maxlength="4"
            placeholder="请输入地址别名，例如公司"
            style="width: 600px"
          ></i-input>
        </FormItem>
        <FormItem label="默认地址">
          <i-switch v-model="formData.isDefault" />
        </FormItem>
      </Form>
      <div class="mt_20" slot="footer">
        <Button @click="hide">取消</Button>
        <Button type="primary" class="mr_10" :loading="loading" @click="save">保存收货地址</Button>
      </div>
    </Modal>
    <multipleMap ref="map" @callback="getAddress"></multipleMap>
  </div>
</template>

<script>
import multipleMap from "@/components/map/multiple-map";
import {
  newMemberAddress,
  editMemberAddress,
  getAddrDetail
} from '@/api/address';
export default {
  name: 'addressManage',
  props: {
    id: { // 传入的地址id
      defalut: '',
      type: String
    }
  },
  data () {
    return {
      showAddr: false, // 控制模态框显隐
      formData: { // 表单数据
        isDefault: false,
        countryCode: 'CN',
        countryName: '中国'
      },
      countryList: [
        { name: '中国', code: 'CN', id: 0 },
        { name: '西班牙', code: 'ES', id: 1001 },
        { name: '澳大利亚', code: 'AU', id: 1002 },
        { name: '英国', code: 'GB', id: 1003 },
        { name: '加拿大', code: 'CA', id: 1004 },
        { name: '泰国', code: 'TH', id: 1005 },
        { name: '越南', code: 'VN', id: 1006 },
        { name: '印尼', code: 'ID', id: 1007 },
        { name: '马来西亚', code: 'MY', id: 1008 },
        { name: '韩国', code: 'KR', id: 1009 },
        { name: '沙特阿拉伯', code: 'SA', id: 1010 },
        { name: '阿联酋', code: 'AE', id: 1011 },
        { name: '美国', code: 'US', id: 1012 },
        { name: '日本', code: 'JP', id: 1013 }
      ],
      ruleInline: { // 验证规则
        name: [{ required: true, message: '请输入收件人姓名', trigger: 'blur' }],
        address: [{ required: true, message: '请输入地址', trigger: 'change' }],
        detail: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          {
            type: 'string',
            pattern: /^1[3|4|5|6|7|8][0-9]{9}$/,
            message: '手机号格式出错',
            trigger: 'blur'
          }
        ]
      },
      loading: false, // 提交的加载状态
      mapMsg: {} // 地图信息
    };
  },
  methods: {
    save () { // 保存地址
      this.$refs.form.validate((valid) => {
        if (valid) {
          const params = JSON.parse(JSON.stringify(this.formData));
          params.consigneeAddressPath = params.address.replace(/\s/g, ',');
          delete params.address;
          this.loading = true;
          if (this.id) {
            editMemberAddress(params).then((res) => {
              this.loading = false;
              if (res.success) {
                this.$Message.success('编辑地址成功');
                this.$emit('change', true);
                this.hide();
              }
            }).catch(() => { this.loading = false; });
          } else {
            newMemberAddress(params).then((res) => {
              this.loading = false;
              if (res.success) {
                this.$Message.success('新增地址成功');
                this.$emit('change', true);
                this.hide();
              }
            }).catch(() => { this.loading = false; });
          }
        }
      });
    },
    getAddrById (id) {
      // 获取地址详情
      getAddrDetail(id).then((res) => {
        if (res.success) {
          console.log(res);
          const data = res.result;
          data.address = res.result.consigneeAddressPath.replace(/,/g, ' ');
          this.formData = data;
        }
      });
    },
    getAddress (val) {
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
    changeCountry (code) {
      const country = this.countryList.find(c => c.code === code);
      if (country) {
        this.formData.countryName = country.name;
      }
      this.formData.address = "";
      this.formData.consigneeAddressIdPath = "";
    },
    openMap () {
      const country = this.countryList.find(c => c.code === this.formData.countryCode);
      this.$refs.map.open(country ? country.id : 0);
    },
    show () { // 地址模态框显示
      this.showAddr = true;
    },
    hide () { // 地址模态框隐藏
      this.showAddr = false;
    }
  },
  watch: {
    id: { // 传入的地址id
      handler: function (v) {
        if (v) {
          this.getAddrById(v);
        } else {
          this.formData = {isDefault: false}
          this.$refs.form.resetFields();
        }
      }
    }
  },
  components: {
    multipleMap
  }
};
</script>

<style scoped lang="scss">
.add-box {
  margin: 40px 0;
}
</style>
