<template>
  <FeatureDemo
    :title="t('features.heatMap.title')"
    :description="t('features.heatMap.description')"
    path="src/components/features/heat-map/index.vue"
  >
    <heat-map :province-data-array="provinceData" :max-value="120" :min-value="0" unit="单位" />
  </FeatureDemo>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { FeatureDemo } from '@/components/common';
import { HeatMap } from '@/components/features';

const { t } = useI18n();

// 原始数据对象
const rawProvinceData = {
  北京: 100,
  天津: 80,
  河北: 120,
  山西: 50,
  内蒙古: 40,
  辽宁: 60,
  吉林: 30,
  黑龙江: 45,
  上海: 95,
  江苏: 85,
  浙江: 90,
  安徽: 70,
  福建: 65,
  江西: 55,
  山东: 75,
  河南: 65,
  湖北: 60,
  湖南: 50,
  广东: 80,
  广西: 40,
  海南: 30,
  重庆: 55,
  四川: 65,
  贵州: 35,
  云南: 45,
  西藏: 20,
  陕西: 50,
  甘肃: 30,
  青海: 25,
  宁夏: 20,
  新疆: 35,
  台湾: 60,
  香港: 70,
  澳门: 65,
};

// 省份名称映射表（中文名到英文名）
const provinceNameMap: Record<string, string> = {
  北京: 'Beijing',
  天津: 'Tianjin',
  河北: 'Hebei',
  山西: 'Shanxi',
  内蒙古: 'Neimenggu',
  辽宁: 'Liaoning',
  吉林: 'Jilin',
  黑龙江: 'Heilongjiang',
  上海: 'Shanghai',
  江苏: 'Jiangsu',
  浙江: 'Zhejiang',
  安徽: 'Anhui',
  福建: 'Fujian',
  江西: 'Jiangxi',
  山东: 'Shandong',
  河南: 'Henan',
  湖北: 'Hubei',
  湖南: 'Hunan',
  广东: 'Guangdong',
  广西: 'Guangxi',
  海南: 'Hainan',
  重庆: 'Chongqing',
  四川: 'Sichuan',
  贵州: 'Guizhou',
  云南: 'Yunnan',
  西藏: 'Xizang',
  陕西: 'Shaanxi',
  甘肃: 'Gansu',
  青海: 'Qinghai',
  宁夏: 'Ningxia',
  新疆: 'Xinjiang',
  台湾: 'Taiwan',
  香港: 'HongKong',
  澳门: 'Aomen',
};

// 转换为数组格式
const provinceData = Object.entries(rawProvinceData).map(([name, value]) => {
  return {
    name: provinceNameMap[name] || name, // 使用英文名称，如果没有映射则使用原名称
    value,
  };
});
</script>
