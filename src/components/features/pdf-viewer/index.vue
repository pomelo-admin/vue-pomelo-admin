<template>
  <div
    class="pdf-viewer-container"
    v-loading="loading"
    :element-loading-text="t('features.pdfViewer.loading')"
  >
    <!-- 顶部导航栏 -->
    <div class="pdf-toolbar" v-if="totalPages > 0">
      <div class="nav-buttons">
        <template v-if="!showAllPages">
          <el-button size="small" :disabled="currentPage <= 1" @click="prevPage">
            <el-icon><ArrowLeft /></el-icon>
          </el-button>
          <span class="page-counter">{{ currentPage }} / {{ totalPages }}</span>
          <el-button size="small" :disabled="currentPage >= totalPages" @click="nextPage">
            <el-icon><ArrowRight /></el-icon>
          </el-button>
        </template>
        <template v-else>
          <span class="page-counter">{{
            t('features.pdfViewer.totalPages', { total: totalPages })
          }}</span>
        </template>
      </div>
      <div class="view-options">
        <el-checkbox v-model="showAllPages">{{ t('features.pdfViewer.showAllPages') }}</el-checkbox>
        <el-button size="small" type="primary" @click="printPdf" class="print-button">
          <el-icon><Printer /></el-icon>
          <span>{{ t('features.pdfViewer.print') }}</span>
        </el-button>
      </div>
    </div>

    <!-- PDF内容 -->
    <vue-pdf-embed
      ref="pdfRef"
      :source="props.src"
      :page="showAllPages ? undefined : currentPage"
      @rendered="handleRendered"
      @loading="handleLoading"
      @loaded="handleLoaded"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import VuePdfEmbed from 'vue-pdf-embed';
import { ArrowLeft, ArrowRight, Printer } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

// 使用项目的i18n系统
const { t } = useI18n();

const props = defineProps({
  src: {
    type: [String, ArrayBuffer],
    required: true,
  },
});

const pdfRef = ref<any>(null);
const loading = ref(true);
const currentPage = ref(1);
const totalPages = ref(0);
const showAllPages = ref(false);

// 处理PDF加载完成
const handleLoaded = (pdf: any) => {
  if (pdf) {
    totalPages.value = pdf.numPages || 0;
    loading.value = false;
  }
};

// 处理PDF渲染完成
const handleRendered = () => {
  loading.value = false;
};

// 处理PDF加载中
const handleLoading = () => {
  loading.value = true;
};

// 上一页
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

// 下一页
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

// 打印PDF
const printPdf = () => {
  try {
    if (pdfRef.value) {
      // 调用vue-pdf-embed组件提供的打印方法
      // 参数1: 打印分辨率 (dpi)
      // 参数2: 文件名 (可选)
      // 参数3: 是否打印所有页面 (默认为true)
      pdfRef.value.print(150, 'document.pdf', true);
    } else {
      ElMessage.warning(t('features.pdfViewer.pdfNotReady'));
    }
  } catch (error) {
    console.error('打印失败:', error);
    ElMessage.error(t('features.pdfViewer.printFailed'));
  }
};

// 监听src变化，重新加载PDF
watch(
  () => props.src,
  newSrc => {
    if (newSrc) {
      loading.value = true;
      currentPage.value = 1; // 重置页码
      totalPages.value = 0;
      showAllPages.value = false; // 重置显示所有页面的选项
    }
  }
);

// 组件挂载时加载PDF
onMounted(() => {
  loading.value = true;
});
</script>

<style lang="scss" scoped>
.pdf-viewer-container {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 500px;

  .pdf-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    margin-bottom: 10px;
    background-color: #f5f7fa;
    border-bottom: 1px solid #e4e7ed;

    .nav-buttons {
      display: flex;
      align-items: center;

      .page-counter {
        margin: 0 10px;
        font-size: 14px;
        color: #606266;
      }
    }

    .view-options {
      display: flex;
      gap: 15px;
      align-items: center;

      .print-button {
        display: flex;
        align-items: center;

        .el-icon {
          margin-right: 5px;
        }
      }
    }
  }
}
</style>
