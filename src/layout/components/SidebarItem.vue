<template>
  <div v-if="!item.meta || !item.meta.hidden" class="menu-wrapper">
    <!-- 有子菜单的情况: 显示 submenu -->
    <el-sub-menu
      v-if="hasOneShowingChild(item.children, item) && (!onlyOneChild.children || onlyOneChild.noShowingChildren) && item.children"
      :index="resolvePath(item.path)">
      <template #title>
        <menu-icon :icon="item.meta?.icon" />
        <span>{{ item.meta?.title }}</span>
      </template>
      <sidebar-item v-for="child in item.children" :key="child.path" :is-nest="true" :item="child"
        :base-path="resolvePath(child.path)" />
    </el-sub-menu>

    <!-- 链接类菜单 -->
    <template v-else>
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)">
          <menu-icon :icon="onlyOneChild.meta.icon || item.meta?.icon" />
          <template #title>{{ onlyOneChild.meta.title }}</template>
        </el-menu-item>
      </app-link>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import path from 'path-browserify';
import { isExternal } from '@/utils/validate';
import AppLink from './AppLink.vue';
import MenuIcon from './MenuIcon.vue';

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  isNest: {
    type: Boolean,
    default: false
  },
  basePath: {
    type: String,
    default: ''
  }
});

const onlyOneChild = ref<any>({});

/**
 * 判断是否有一个显示的子菜单
 */
const hasOneShowingChild = (children: any[] = [], parent: any) => {
  if (!children) return false;

  const showingChildren = children.filter(item => {
    if (item.meta && item.meta.hidden) {
      return false;
    } else {
      // 临时设置(如果只有一个显示的子菜单，则将其分配给变量;否则使用父菜单)
      onlyOneChild.value = item;
      return true;
    }
  });

  // 当只有一个子路由器时，默认情况下显示子路由器
  if (showingChildren.length === 1) {
    return true;
  }

  // 如果没有要显示的子路由器，并且当前路由有meta.menu=true，则显示父路由器
  if (showingChildren.length === 0) {
    onlyOneChild.value = { ...parent, path: '', noShowingChildren: true };
    return true;
  }

  return false;
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
  return path.resolve(props.basePath, routePath);
};
</script>