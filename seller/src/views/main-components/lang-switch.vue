<template>
  <div class="lang-icon">
    <Dropdown @on-click="langChange">
      <Icon type="md-globe" size="20"/>
      <DropdownMenu slot="list">
        <DropdownItem name="zh-CN">简体中文</DropdownItem>
        <DropdownItem name="en-US">English</DropdownItem>
        <DropdownItem name="ja-JP">日本語</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
export default {
  name: "langSwitch",
  methods: {
    langChange(v) {
      this.$i18n.locale = v;
      window.localStorage.lang = v;
      // If there's a store mutation for lang, we should call it
      if (this.$store.state.app && this.$store.commit) {
         // Some projects use this to trigger layout updates
         // this.$store.commit("switchLang", v); 
      }
      location.reload(); // Hard reload to ensure all components refresh their computed translations
    }
  }
};
</script>

<style lang="scss" scoped>
.lang-icon {
  cursor: pointer;
  padding: 0 10px;
  display: flex;
  align-items: center;
}
</style>
