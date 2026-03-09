<template>
  <div id="main" class="app-main">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  watch: {
    "$i18n.locale": {
      handler(val) {
        if (val === "ar-SA") {
          document.documentElement.setAttribute("dir", "rtl");
          document.body.classList.add("rtl-layout");
        } else {
          document.documentElement.setAttribute("dir", "ltr");
          document.body.classList.remove("rtl-layout");
        }
      },
      immediate: true,
    },
  },
};
</script>

<style>
/* ... existing styles ... */
.rtl-layout {
  direction: rtl;
  text-align: right;
}
.rtl-layout .ivu-icon {
  transform: scaleX(-1);
}
</style>
html,
body {
  width: 100%;
  height: 100%;
  background: #f0f0f0;
}

.app-main {
  width: 100%;
  height: 100%;
}

.br button {
  margin-right: 5px;
}

.operation button {
  margin-right: 5px;
}

.ivu-btn-text:focus {
  box-shadow: none !important;
}

.ivu-tag {
  cursor: pointer;
}
.tox-notifications-container{
  display: none !important;
}
</style>
