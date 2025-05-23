<script setup lang="ts">
import { ElMessageBox } from 'element-plus';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

/**
 * 处理删除操作
 * @param entity 要删除的实体对象
 * @param entityType 实体类型，可选，用于自定义提示信息
 */
const handleDelete = async <T extends Record<string, any>>(entity: T) => {
  try {
    // 确定显示的名称，优先使用 name，其次使用 username，最后使用 id
    const displayName = entity.name || entity.username || entity.id;

    await ElMessageBox.confirm(
      t('common.deleteConfirm', { name: displayName }),
      t('permission.warning'),
      {
        confirmButtonText: t('permission.confirm'),
        cancelButtonText: t('permission.cancel'),
        type: 'warning',
      }
    );

    emit('delete', entity);
  } catch (error) {
    // 用户取消删除
  }
};

// 由于我们不能预知具体的实体类型，这里使用泛型
const emit = defineEmits(['delete']);

defineExpose({
  handleDelete,
});
</script>
