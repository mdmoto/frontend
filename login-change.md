# 🔐 注册功能关闭变更日志

**文档名称**: login-change  
**创建日期**: 2025-10-31  
**变更类型**: 临时关闭注册功能（内测阶段）  
**影响范围**: 买家端前端  
**提交记录**: `f640ba3d` - "feat: 暂时关闭注册功能，显示内测提示信息"

---

## 📋 变更概述

为了内测阶段管理，暂时关闭了用户注册功能。所有注册入口都改为显示提示信息：

> **提示内容**：  
> 标题：注册暂未开放  
> 内容：目前内测阶段，暂不支持注册，账户定向开放。如有需求请联系：ss@maollar.com  
> 按钮：知道了

---

## 📁 修改的文件清单

### 1️⃣ 登录页面
- **文件路径**: `lilishop-ui/buyer/src/pages/Login.vue`
- **修改位置**: 第 129 行，第 415-422 行

### 2️⃣ 头部导航组件
- **文件路径**: `lilishop-ui/buyer/src/components/header/Header.vue`
- **修改位置**: 第 10-12 行，第 185-192 行

### 3️⃣ 注册页面
- **文件路径**: `lilishop-ui/buyer/src/pages/SignUp.vue`
- **修改位置**: 第 210-220 行，第 226 行

---

## 🔧 详细变更记录

### 1️⃣ Login.vue - 登录页面

#### 变更 A: 修改注册链接点击行为

**原始代码** (第 129 行):
```vue
<span style="color:red" @click="$router.push('signUp')">还没有账号？点击立即注册</span>
```

**修改后代码**:
```vue
<span style="color:red" @click="showRegisterNotice">还没有账号？点击立即注册</span>
```

**变更说明**: 将路由跳转改为调用提示方法

---

#### 变更 B: 添加提示方法

**插入位置**: 第 415-422 行 (methods 中最后一个方法后)

**原始代码** (第 414-415 行):
```javascript
      });
    },
  },
  destroyed() {
```

**修改后代码**:
```javascript
      });
    },
    // 显示注册关闭提示
    showRegisterNotice() {
      this.$Modal.info({
        title: '注册暂未开放',
        content: '目前内测阶段，暂不支持注册，账户定向开放。<br/><br/>如有需求请联系：<a href="mailto:ss@maollar.com" style="color:#2d8cf0;">ss@maollar.com</a>',
        okText: '知道了'
      });
    },
  },
  destroyed() {
```

**变更说明**: 在 methods 对象中添加新方法

---

### 2️⃣ Header.vue - 头部导航组件

#### 变更 A: 修改注册链接

**原始代码** (第 10-14 行):
```vue
          <li class="first" v-show="!userInfo.username">
            <router-link :to="`/signUp`" class="nav-item">
              <span>立即注册</span>
            </router-link>
          </li>
```

**修改后代码**:
```vue
          <li class="first" v-show="!userInfo.username">
            <span class="nav-item hover-pointer" @click="showRegisterNotice">立即注册</span>
          </li>
```

**变更说明**: 将 `<router-link>` 改为 `<span>` 并添加点击事件

---

#### 变更 B: 添加提示方法

**插入位置**: 第 185-192 行 (methods 中最后一个方法后)

**原始代码** (第 175-186 行):
```javascript
    getCartList() {
      // 获取购物车列表
      if (this.userInfo.username) {
        cartGoodsAll().then((res) => {
          this.shoppingCart = res.result.skuList;
          this.$store.commit('SET_CARTNUM', this.shoppingCart.length);
          this.Cookies.setItem('cartNum', this.shoppingCart.length);
        });
      }
    }
  }
};
```

**修改后代码**:
```javascript
    getCartList() {
      // 获取购物车列表
      if (this.userInfo.username) {
        cartGoodsAll().then((res) => {
          this.shoppingCart = res.result.skuList;
          this.$store.commit('SET_CARTNUM', this.shoppingCart.length);
          this.Cookies.setItem('cartNum', this.shoppingCart.length);
        });
      }
    },
    // 显示注册关闭提示
    showRegisterNotice() {
      this.$Modal.info({
        title: '注册暂未开放',
        content: '目前内测阶段，暂不支持注册，账户定向开放。<br/><br/>如有需求请联系：<a href="mailto:ss@maollar.com" style="color:#2d8cf0;">ss@maollar.com</a>',
        okText: '知道了'
      });
    }
  }
};
```

**变更说明**: 在 methods 对象中添加新方法

---

### 3️⃣ SignUp.vue - 注册页面

#### 变更 A: 添加提示方法

**插入位置**: 第 210-220 行 (verifyBtnClick 方法后)

**原始代码** (第 205-210 行):
```javascript
    // 打开图片验证码
    verifyBtnClick () {
      if (!this.verifyStatus) {
        this.$refs.verify.init();
      }
    }
  },
  mounted () {
```

**修改后代码**:
```javascript
    // 打开图片验证码
    verifyBtnClick () {
      if (!this.verifyStatus) {
        this.$refs.verify.init();
      }
    },
    // 显示注册关闭提示
    showRegisterNotice() {
      this.$Modal.info({
        title: '注册暂未开放',
        content: '目前内测阶段，暂不支持注册，账户定向开放。<br/><br/>如有需求请联系：<a href="mailto:ss@maollar.com" style="color:#2d8cf0;">ss@maollar.com</a>',
        okText: '知道了',
        onOk: () => {
          this.$router.push('/login');
        }
      });
    }
  },
  mounted () {
```

**变更说明**: 在 methods 对象中添加新方法，点击"知道了"后跳转到登录页

---

#### 变更 B: 页面加载时自动显示提示

**原始代码** (第 224-226 行):
```javascript
  mounted () {
    this.$refs.formRegist.resetFields();
    document.querySelector('.sign-up').style.height = window.innerHeight + 'px'
  }
```

**修改后代码**:
```javascript
  mounted () {
    this.$refs.formRegist.resetFields();
    document.querySelector('.sign-up').style.height = window.innerHeight + 'px';
    // 显示注册关闭提示
    this.showRegisterNotice();
  }
```

**变更说明**: 在 mounted 生命周期中调用提示方法

---

## 🔄 恢复步骤（开放注册时使用）

### 方法 1: 使用 Git 回退（推荐）

```bash
# 1. 查看当前提交
cd /Users/adam/0.9/lilishop-ui
git log --oneline | head -5

# 2. 回退到关闭注册之前的版本
git revert f640ba3d

# 3. 或者使用 checkout 恢复单个文件
git checkout 2c9b9e15 -- buyer/src/pages/Login.vue
git checkout 2c9b9e15 -- buyer/src/components/header/Header.vue
git checkout 2c9b9e15 -- buyer/src/pages/SignUp.vue

# 4. 提交恢复
git add .
git commit -m "feat: 恢复注册功能，开放用户注册"
git push origin master
```

---

### 方法 2: 手动修改代码

#### 步骤 1: 恢复 Login.vue

**文件**: `lilishop-ui/buyer/src/pages/Login.vue`

**位置 1** - 第 129 行，恢复路由跳转：
```vue
<!-- 改回 -->
<span style="color:red" @click="$router.push('signUp')">还没有账号？点击立即注册</span>
```

**位置 2** - 第 415-422 行，删除新增的方法：
```javascript
// 删除以下代码块：
    // 显示注册关闭提示
    showRegisterNotice() {
      this.$Modal.info({
        title: '注册暂未开放',
        content: '目前内测阶段，暂不支持注册，账户定向开放。<br/><br/>如有需求请联系：<a href="mailto:ss@maollar.com" style="color:#2d8cf0;">ss@maollar.com</a>',
        okText: '知道了'
      });
    },
```

---

#### 步骤 2: 恢复 Header.vue

**文件**: `lilishop-ui/buyer/src/components/header/Header.vue`

**位置 1** - 第 10-12 行，恢复路由链接：
```vue
<!-- 改回 -->
          <li class="first" v-show="!userInfo.username">
            <router-link :to="`/signUp`" class="nav-item">
              <span>立即注册</span>
            </router-link>
          </li>
```

**位置 2** - 第 185-192 行，删除新增的方法：
```javascript
// 删除以下代码块（包括前面的逗号）：
    ,
    // 显示注册关闭提示
    showRegisterNotice() {
      this.$Modal.info({
        title: '注册暂未开放',
        content: '目前内测阶段，暂不支持注册，账户定向开放。<br/><br/>如有需求请联系：<a href="mailto:ss@maollar.com" style="color:#2d8cf0;">ss@maollar.com</a>',
        okText: '知道了'
      });
    }
```

---

#### 步骤 3: 恢复 SignUp.vue

**文件**: `lilishop-ui/buyer/src/pages/SignUp.vue`

**位置 1** - 第 210-220 行，删除新增的方法：
```javascript
// 删除以下代码块（包括前面的逗号）：
    ,
    // 显示注册关闭提示
    showRegisterNotice() {
      this.$Modal.info({
        title: '注册暂未开放',
        content: '目前内测阶段，暂不支持注册，账户定向开放。<br/><br/>如有需求请联系：<a href="mailto:ss@maollar.com" style="color:#2d8cf0;">ss@maollar.com</a>',
        okText: '知道了',
        onOk: () => {
          this.$router.push('/login');
        }
      });
    }
```

**位置 2** - 第 226 行，删除自动调用：
```javascript
// 修改前：
  mounted () {
    this.$refs.formRegist.resetFields();
    document.querySelector('.sign-up').style.height = window.innerHeight + 'px';
    // 显示注册关闭提示
    this.showRegisterNotice();
  }

// 修改后（删除最后两行）：
  mounted () {
    this.$refs.formRegist.resetFields();
    document.querySelector('.sign-up').style.height = window.innerHeight + 'px'
  }
```

---

#### 步骤 4: 提交并部署

```bash
cd /Users/adam/0.9/lilishop-ui
git add buyer/src/pages/Login.vue buyer/src/components/header/Header.vue buyer/src/pages/SignUp.vue
git commit -m "feat: 恢复注册功能，开放用户注册"
git push origin master
```

等待 Cloudflare Pages 自动部署（约 5-10 分钟）

---

## ✅ 验证清单

### 关闭注册后需验证：
- [ ] 登录页点击"立即注册"显示提示
- [ ] 头部导航点击"立即注册"显示提示
- [ ] 直接访问 `/signUp` 页面显示提示并可返回登录页

### 恢复注册后需验证：
- [ ] 登录页点击"立即注册"跳转到注册页面
- [ ] 头部导航点击"立即注册"跳转到注册页面
- [ ] 注册页面可以正常填写表单
- [ ] 可以发送验证码
- [ ] 可以完成注册流程

---

## 📊 Git 信息

### 关闭注册的提交
```
Commit: f640ba3d
Author: [Your Name]
Date: 2025-10-31
Message: feat: 暂时关闭注册功能，显示内测提示信息

Changed files:
  - buyer/src/pages/Login.vue
  - buyer/src/components/header/Header.vue
  - buyer/src/pages/SignUp.vue
```

### 之前的提交（注册功能正常时）
```
Commit: 2c9b9e15
Message: fix: 更正买家端域名为 shop.maollar.com
```

---

## 📝 注意事项

1. **邮箱地址**: 提示信息中的联系邮箱为 `ss@maollar.com`，如需修改请在所有三个文件中同步更新

2. **样式一致性**: 三个文件中的提示信息完全相同，保持一致性

3. **路由行为**: 
   - Login.vue 和 Header.vue：点击后只显示提示
   - SignUp.vue：显示提示后点击"知道了"会跳转到登录页

4. **自动部署**: 推送到 GitHub 后，Cloudflare Pages 会自动构建部署

5. **测试环境**: 建议在本地先测试恢复效果再推送到生产环境

---

## 🔗 相关文档

- Git 提交历史: `git log --oneline --grep="注册"`
- 完整 diff: `git show f640ba3d`
- 前端部署文档: `QUICK_START.md`

---

**最后更新**: 2025-10-31  
**文档版本**: 1.0  
**维护者**: 开发团队

