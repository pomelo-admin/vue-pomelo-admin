<template>
  <FeatureDemo
    :title="t('features.watermark.title')"
    :description="t('features.watermark.description')"
    path="src/directives/watermark.ts"
  >
    <el-card class="mb-4">
      <template #header>
        <div class="card-header">
          <span>{{ t('features.watermark.basicUsage') }}</span>
        </div>
      </template>
      <div
        class="content-box"
        v-watermark="{
          opacity: 0.5,
          color: 'rgba(0, 0, 0, 0.3)',
          text: t('features.watermark.defaultText'),
        }"
      >
        <div class="content-inner">
          <p>{{ t('features.watermark.basicDescription') }}</p>
        </div>
      </div>
    </el-card>

    <el-card class="mb-4">
      <template #header>
        <div class="card-header">
          <span>{{ t('features.watermark.customText') }}</span>
        </div>
      </template>
      <div
        class="content-box"
        v-watermark="{
          text: t('features.watermark.confidential'),
          fontSize: 18,
          opacity: 0.5,
          color: 'rgba(0, 0, 0, 0.3)',
        }"
      >
        <div class="content-inner">
          <p>{{ t('features.watermark.customTextDescription') }}</p>
        </div>
      </div>
    </el-card>

    <el-card class="mb-4">
      <template #header>
        <div class="card-header">
          <span>{{ t('features.watermark.customStyle') }}</span>
        </div>
      </template>
      <div
        class="content-box"
        v-watermark="{
          text: t('features.watermark.doNotShare'),
          fontSize: 20,
          color: 'rgba(64, 158, 255, 0.35)',
          rotate: -25,
          opacity: 0.6,
        }"
      >
        <div class="content-inner">
          <p>{{ t('features.watermark.customStyleDescription') }}</p>
        </div>
      </div>
    </el-card>

    <el-card class="mb-4">
      <template #header>
        <div class="card-header">
          <span>{{ t('features.watermark.dynamicWatermark') }}</span>
        </div>
      </template>
      <div class="content-box" v-watermark="dynamicWatermark">
        <div class="content-inner">
          <p>{{ t('features.watermark.dynamicDescription') }}</p>
          <el-form :model="watermarkForm" label-width="130px" class="mt-4">
            <el-form-item :label="t('features.watermark.watermarkText')">
              <el-input
                v-model="watermarkForm.text"
                :placeholder="t('features.watermark.enterText')"
              ></el-input>
            </el-form-item>
            <el-form-item :label="t('features.watermark.fontSize')">
              <el-slider v-model="watermarkForm.fontSize" :min="12" :max="30"></el-slider>
            </el-form-item>
            <el-form-item :label="t('features.watermark.rotateAngle')">
              <el-slider v-model="watermarkForm.rotate" :min="-45" :max="45"></el-slider>
            </el-form-item>
            <el-form-item :label="t('features.watermark.opacity')">
              <el-slider
                v-model="watermarkForm.opacity"
                :min="0.1"
                :max="0.8"
                :step="0.1"
              ></el-slider>
            </el-form-item>
            <el-form-item :label="t('features.watermark.textColor')">
              <el-color-picker v-model="watermarkForm.color" show-alpha></el-color-picker>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-card>
  </FeatureDemo>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { FeatureDemo } from '@/components/common';

// 使用 i18n
const { t } = useI18n();

// 水印表单数据
const watermarkForm = ref({
  text: t('features.watermark.dynamicWatermark'),
  fontSize: 16,
  rotate: -30,
  opacity: 0.5,
  color: 'rgba(0, 0, 0, 0.3)',
});

// 计算属性：动态水印配置
const dynamicWatermark = computed(() => {
  return { ...watermarkForm.value };
});
</script>

<style lang="scss" scoped>
.mb-4 {
  margin-bottom: 16px;
}

.mt-4 {
  margin-top: 16px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.content-box {
  position: relative;
  min-height: 200px;
  padding: 20px;
  overflow: hidden;
  border: 1px solid #eaeaea;
  border-radius: 4px;
}

.content-inner {
  position: relative;
  z-index: 1;
}
</style>
