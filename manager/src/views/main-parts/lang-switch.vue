<template>
  <div class="lang-icon">
    <Dropdown @on-click="langChange" trigger="click">
      <a href="javascript:void(0)">
         <Icon type="md-globe" size="24"/>
         <span class="lang-text">{{ currentLangName }}</span>
         <Icon type="ios-arrow-down"></Icon>
      </a>
      <DropdownMenu slot="list">
        <DropdownItem name="zh-CN">简体中文</DropdownItem>
        <DropdownItem name="en-US">English</DropdownItem>
        <DropdownItem name="ja-JP">日本語</DropdownItem>
        <DropdownItem name="ko-KR">한국어</DropdownItem>
        <DropdownItem name="ar-SA">العربية (RTL)</DropdownItem>
        <DropdownItem name="es-ES">Español</DropdownItem>
        <DropdownItem name="fr-FR">Français</DropdownItem>
        <DropdownItem name="de-DE">Deutsch</DropdownItem>
        <DropdownItem name="th-TH">ไทย</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
export default {
  name: "langSwitch",
  computed: {
    currentLangName() {
      const langMap = {
        'zh-CN': '中文',
        'en-US': 'EN',
        'ja-JP': '日本語',
        'ko-KR': 'KO',
        'ar-SA': 'AR',
        'es-ES': 'ES',
        'fr-FR': 'FR',
        'de-DE': 'DE',
        'th-TH': 'TH'
      };
      return langMap[this.$store.state.app.lang] || 'EN';
    }
  },
  methods: {
    langChange(v) {
      this.$i18n.locale = v;
      this.$store.commit("switchLang", v);
      // 强制刷新或由 App.vue Watcher 处理样式切换
    }
  }
};
</script>

<style lang="scss" scoped>
.lang-icon {
  display: inline-block;
  margin: 0 10px;
  cursor: pointer;
  
  a {
    color: inherit;
    display: flex;
    align-items: center;
  }
  
  .lang-text {
    margin: 0 4px;
    font-size: 14px;
    font-weight: 500;
  }
}

/* RTL Support for the component itself */
.rtl-layout .lang-icon {
  margin-left: 15px;
  margin-right: 0;
}
</style>
