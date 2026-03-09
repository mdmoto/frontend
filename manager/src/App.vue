<template>
  <div id="main" class="app-main">
    <router-view></router-view>
  </div>
</template>

<script>
import { getCategoryTree } from '@/api/goods.js'
export default {
  updated () {
    if (!localStorage.getItem('category') && this.$route.path !== '/login') {
      getCategoryTree(0).then(res => {
        if (res.success) {
          localStorage.setItem('category', JSON.stringify(res.result))
        }
      })
    }
  },
  watch: {
    '$store.state.app.lang': {
      handler(lang) {
        if (lang === 'ar-SA' || lang === 'ar') {
          document.documentElement.setAttribute('dir', 'rtl');
          document.body.classList.add('rtl-layout');
        } else {
          document.documentElement.setAttribute('dir', 'ltr');
          document.body.classList.remove('rtl-layout');
        }
      },
      immediate: true
    }
  }
};
</script>

<style lang="scss">
html,
body {
  width: 100%;
  height: 100%;
  background: #f0f0f0;
  font-size: 12px;
}

.app-main {
  width: 100%;
  height: 100%;
}

// RTL Logic for iView Components
.rtl-layout {
  direction: rtl;
  text-align: right;

  .ivu-menu-item, .ivu-menu-submenu-title {
    text-align: right;
  }
  
  .ivu-icon-ios-arrow-forward, .ivu-icon-ios-arrow-back {
    transform: scaleX(-1);
  }

  /* Reverse Float and Margins */
  .ivu-btn {
    margin-left: initial;
    margin-right: -1px; // Fix for button groups
  }

  .operation button, .br button {
    margin-right: 0 !important;
    margin-left: 5px !important;
  }

  /* Flex Mirroring */
  .ivu-row-flex {
    flex-direction: row-reverse;
  }

  .ivu-modal-footer, .ivu-modal-header {
    text-align: left; // Reversing from right-align
  }
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

.tox-notifications-container {
  display: none !important;
}
</style>
