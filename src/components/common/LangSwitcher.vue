<template>
  <el-dropdown trigger="click" @command="handleLangChange">
    <div class="lang-container">
      <el-icon :size="20" class="lang-icon">
        <Location />
      </el-icon>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="zh-CN" :class="{ active: currentLang === 'zh-CN' }">
          <span class="flag">🇨🇳</span> 中文
        </el-dropdown-item>
        <el-dropdown-item command="en-US" :class="{ active: currentLang === 'en-US' }">
          <span class="flag">🇺🇸</span> English
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { Location } from '@element-plus/icons-vue';

const { locale, t } = useI18n();
const route = useRoute();
const currentLang = ref(locale.value);

onMounted(() => {
  // 初始化时获取当前语言
  currentLang.value = locale.value;
  // 从本地存储中获取语言设置
  const savedLang = localStorage.getItem('language');
  if (savedLang) {
    locale.value = savedLang;
    currentLang.value = savedLang;
  }
  updatePageTitle();
});

// 更新页面标题
const updatePageTitle = () => {
  const title = route.meta.title ? t(`menu.${route.meta.title as string}`) : '';
  const appTitle = t('common.appTitle');
  document.title = title ? `${title} | ${appTitle}` : appTitle;
};

const handleLangChange = (lang: string) => {
  // 切换语言
  locale.value = lang;
  currentLang.value = lang;
  // 保存语言设置到本地存储
  localStorage.setItem('language', lang);

  // 更新页面标题
  updatePageTitle();

  // 切换语言后刷新页面来应用Element Plus的语言设置
  setTimeout(() => {
    window.location.reload();
  }, 100);
};

// 监听路由变化，更新标题
watch(() => route.path, updatePageTitle);

// 监听语言变化，更新标题
watch(() => locale.value, updatePageTitle);
</script>

<style lang="scss" scoped>
.lang-container {
  @apply transition-all duration-300 relative overflow-hidden flex items-center justify-center rounded-full p-2;

  background: rgb(99 102 241 / 10%);
  border: 1px solid rgb(99 102 241 / 20%);

  &::before {
    content: '';

    @apply absolute inset-0 opacity-0 transition-opacity duration-300 ease-in-out;

    background: radial-gradient(circle, rgb(99 102 241 / 20%) 0%, transparent 70%);
  }

  &:hover::before {
    @apply opacity-100;
  }

  &:hover {
    @apply transform scale-110;

    box-shadow: 0 0 8px rgb(99 102 241 / 40%);
  }

  .lang-icon {
    @apply relative z-10 transition-all duration-300 ease-in-out;

    color: #6366f1;

    &:hover {
      @apply transform scale-110;
    }
  }
}

.el-dropdown-menu {
  .el-dropdown-item {
    @apply flex items-center;

    &.active {
      @apply font-bold;

      color: #6366f1;
    }

    .flag {
      @apply mr-2;
    }
  }
}
</style>
