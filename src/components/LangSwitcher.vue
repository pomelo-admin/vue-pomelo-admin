<template>
  <el-dropdown @command="handleLangChange">
    <span class="lang-dropdown-link">
      {{ currentLang === 'zh-CN' ? '中文' : 'English' }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="zh-CN" :disabled="currentLang === 'zh-CN'"
          >中文</el-dropdown-item
        >
        <el-dropdown-item command="en-US" :disabled="currentLang === 'en-US'"
          >English</el-dropdown-item
        >
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { ArrowDown } from '@element-plus/icons-vue';

const { locale, t } = useI18n();
const route = useRoute();
const currentLang = ref(locale.value);

onMounted(() => {
  // 初始化时获取当前语言
  currentLang.value = locale.value;
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
};

// 监听路由变化，更新标题
watch(() => route.path, updatePageTitle);

// 监听语言变化，更新标题
watch(() => locale.value, updatePageTitle);
</script>

<style scoped>
.lang-dropdown-link {
  cursor: pointer;
  display: flex;
  align-items: center;
  color: inherit;
}
</style>
