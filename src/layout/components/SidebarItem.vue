<template>
  <div v-if="!item.meta || !item.meta.hidden" class="menu-wrapper">
    <!-- 如果设置了alwaysShow或者有多个子菜单，显示submenu -->
    <el-sub-menu
      v-if="item.meta?.alwaysShow || (item.children && item.children.length > 1)"
      :index="resolvePath(item.path)"
      :popper-append-to-body="true"
    >
      <template #title>
        <menu-icon :icon="item.meta?.icon" />
        <span v-if="!isCollapse">{{ getMenuTitle(item.meta?.title) }}</span>
      </template>
      <!-- 渲染子菜单项 -->
      <template v-for="child in item.children" :key="child.path">
        <!-- 特殊处理错误页面和控制台页面的子菜单项 -->
        <template v-if="item.path === '/error' || item.path === '/dashboard'">
          <app-link :to="resolvePath(child.path)">
            <el-menu-item :index="resolvePath(child.path)">
              <menu-icon :icon="child.meta?.icon" />
              <template #title>{{ getMenuTitle(child.meta?.title) }}</template>
            </el-menu-item>
          </app-link>
        </template>
        <template v-else>
          <sidebar-item
            v-if="!child.meta?.hidden"
            :is-nest="true"
            :item="child"
            :base-path="resolvePath(child.path)"
          />
        </template>
      </template>
    </el-sub-menu>

    <!-- 如果只有一个子菜单且没有设置alwaysShow，直接显示子菜单 -->
    <template v-else-if="item.children && item.children.length === 1 && !item.meta?.alwaysShow">
      <template v-for="child in item.children" :key="child.path">
        <sidebar-item
          v-if="!child.meta?.hidden"
          :is-nest="true"
          :item="child"
          :base-path="resolvePath(child.path)"
        />
      </template>
    </template>

    <!-- 没有子菜单的情况，显示普通菜单项 -->
    <template v-else>
      <app-link :to="props.basePath">
        <el-menu-item :index="props.basePath">
          <menu-icon :icon="item.meta?.icon" />
          <template #title>{{ getMenuTitle(item.meta?.title) }}</template>
        </el-menu-item>
      </app-link>
    </template>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import path from 'path-browserify';
import { useI18n } from 'vue-i18n';
import { isExternal } from '@/utils/validate';
import AppLink from './AppLink.vue';
import MenuIcon from './MenuIcon.vue';

const { t } = useI18n();
const isCollapse = inject('isCollapse', false);

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  isNest: {
    type: Boolean,
    default: false,
  },
  basePath: {
    type: String,
    default: '',
  },
});

/**
 * 获取菜单标题的国际化文本
 */
const getMenuTitle = (title: string) => {
  if (!title) return '';
  // 尝试从菜单国际化配置中获取，如果没有则使用原始标题
  const hasKey = t(`menu.${title}`);
  if (hasKey !== `menu.${title}`) {
    return t(`menu.${title}`);
  }
  return title;
};

/**
 * 解析菜单路径
 */
const resolvePath = (routePath: string) => {
  if (isExternal(routePath)) {
    return routePath;
  }
  if (isExternal(props.basePath)) {
    return props.basePath;
  }

  // 特殊处理错误页面和控制台页面的子路由
  if (props.basePath === '/error' || props.basePath === '/dashboard') {
    // 直接构建完整路径，不使用path.resolve
    const fullPath = `${props.basePath}/${routePath}`;
    return fullPath;
  }

  // 常规路径解析
  const result = path.resolve(props.basePath, routePath);
  console.log('props.basePath', props.basePath);
  console.log('routePath', routePath);
  console.log('result', result);
  return result;
};
</script>

<style lang="scss" scoped>
.menu-wrapper {
  .el-menu-item,
  .el-sub-menu__title {
    display: flex;
    align-items: center;
  }

  // 确保折叠状态下弹出的子菜单中显示文本
  :deep(.el-menu--popup) {
    .el-menu-item {
      span {
        display: inline-block !important;
      }
    }
  }
}
</style>
