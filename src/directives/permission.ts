import type { Directive, DirectiveBinding } from 'vue';
import { useSystemStore } from '@/store/modules/system';
import { useAuthStore } from '@/store/modules/auth';

/**
 * 权限指令
 * 使用方式：v-permission="'user:create'"
 * 或者：v-permission="['user:create', 'user:edit']"
 */
export const permission: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const systemStore = useSystemStore();
    const { value } = binding;

    if (value) {
      let hasPermission = false;

      if (typeof value === 'string') {
        // 单个权限
        hasPermission = systemStore.hasPermission(value);
      } else if (Array.isArray(value)) {
        // 多个权限（满足其中一个即可）
        hasPermission = value.some(permission => systemStore.hasPermission(permission));
      }

      if (!hasPermission) {
        // 无权限则移除元素
        el.parentNode?.removeChild(el);
      }
    } else {
      throw new Error('需要指定权限值');
    }
  },
};

/**
 * 角色指令
 * 使用方式：v-role="'admin'"
 * 或者：v-role="['admin', 'user_manager']"
 */
export const role: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value } = binding;
    const authStore = useAuthStore();
    const { roles } = authStore.userInfo;

    if (value) {
      let hasRole = false;

      if (typeof value === 'string') {
        // 单个角色
        hasRole = roles.includes(value);
      } else if (Array.isArray(value)) {
        // 多个角色（满足其中一个即可）
        hasRole = value.some(role => roles.includes(role));
      }

      if (!hasRole) {
        // 无角色则移除元素
        el.parentNode?.removeChild(el);
      }
    } else {
      throw new Error('需要指定角色值');
    }
  },
};
