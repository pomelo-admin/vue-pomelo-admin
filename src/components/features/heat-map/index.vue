<template>
  <div class="heat-map-container">
    <div
      v-if="
        (!provinceData || Object.keys(provinceData).length === 0) &&
        (!provinceDataArray || provinceDataArray.length === 0)
      "
      class="empty-state"
    >
      {{ t('features.heatMap.emptyState') }}
    </div>
    <div v-else ref="mapContainer" class="map-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import * as echarts from 'echarts';
import chinaMapData from './map-data.json';

// 国际化
const { t } = useI18n();

// 定义属性
const props = defineProps({
  provinceData: {
    type: Object as () => Record<string, number>,
    required: false,
    default: () => ({}),
  },
  provinceDataArray: {
    type: Array as () => Array<{ name: string; value: number }>,
    required: false,
    default: () => [],
  },
  maxValue: {
    type: Number,
    default: 120,
  },
  minValue: {
    type: Number,
    default: 0,
  },
  unit: {
    type: String,
    default: '',
  },
});

// 地图容器引用
const mapContainer = ref<HTMLElement | null>(null);
let chart: echarts.ECharts | null = null;

// 准备地图数据
const mapData = computed(() => {
  // 如果提供了数组格式的数据，直接使用
  if (props.provinceDataArray && props.provinceDataArray.length > 0) {
    return props.provinceDataArray;
  }

  // 否则使用对象格式的数据并转换
  // 从地图数据中提取省份名称
  const features = (chinaMapData as any).features || [];
  const provinceMap: Record<string, string> = {};

  // 构建省份名称映射
  features.forEach((feature: any) => {
    if (feature && feature.properties) {
      const fullName = feature.properties.name;
      const shortName = feature.properties.地名.replace(/[省市区自治区特别行政区]/g, '');
      provinceMap[shortName] = fullName;
    }
  });

  return Object.entries(props.provinceData).map(([name, value]) => {
    const mappedName = provinceMap[name] || name;
    return {
      name: mappedName,
      value,
    };
  });
});

// 初始化图表
const initChart = async () => {
  if (!mapContainer.value) return;

  // 确保DOM已经渲染完成
  await nextTick();

  // 销毁现有图表实例
  if (chart) {
    chart.dispose();
  }

  try {
    // 注册地图数据
    echarts.registerMap('china', chinaMapData as any);

    // 创建图表实例
    chart = echarts.init(mapContainer.value);

    // 获取映射后的数据
    const mappedData = mapData.value;

    // 设置图表选项
    const option = {
      title: {
        text: t('features.heatMap.mapTitle'),
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          const { name, value } = params;
          return `${name}: ${value || 0}${props.unit}`;
        },
      },
      visualMap: {
        min: props.minValue,
        max: props.maxValue,
        left: 'right',
        top: 'center',
        orient: 'vertical',
        itemWidth: 15,
        itemHeight: 120,
        text: [`${props.maxValue}${props.unit}`, `${props.minValue}${props.unit}`],
        calculable: true,
        inRange: {
          color: ['#e0f3f8', '#abd9e9', '#74add1', '#4575b4', '#313695'],
        },
      },
      series: [
        {
          name: t('features.heatMap.seriesName'),
          type: 'map',
          map: 'china',
          roam: true,
          emphasis: {
            label: {
              show: true,
            },
            itemStyle: {
              areaColor: '#ffd700',
            },
          },
          data: mappedData,
        },
      ],
    };

    // 应用选项
    chart.setOption(option);

    // 添加窗口大小改变的监听
    window.addEventListener('resize', handleResize);
  } catch (error) {
    console.error('初始化图表失败:', error);
  }
};

// 监听窗口大小变化
const handleResize = () => {
  if (chart) {
    chart.resize();
  }
};

// 监听数据变化
watch(
  [() => props.provinceData, () => props.provinceDataArray],
  () => {
    if (chart) {
      chart.setOption({
        series: [
          {
            data: mapData.value,
          },
        ],
      });
    }
  },
  { deep: true }
);

// 监听最大值和最小值变化
watch([() => props.maxValue, () => props.minValue], () => {
  if (chart) {
    chart.setOption({
      visualMap: {
        min: props.minValue,
        max: props.maxValue,
        text: [`${props.maxValue}${props.unit}`, `${props.minValue}${props.unit}`],
      },
    });
  }
});

// 组件挂载时初始化图表
onMounted(() => {
  // 确保DOM完全渲染并且地图数据已加载
  setTimeout(() => {
    // 检查容器尺寸
    if (mapContainer.value) {
      const { clientWidth, clientHeight } = mapContainer.value;
      if (clientWidth === 0 || clientHeight === 0) {
        setTimeout(initChart, 500);
      } else {
        initChart();
      }
    }
  }, 300); // 增加延迟时间，确保DOM已完全渲染
});

// 组件卸载时销毁图表
onBeforeUnmount(() => {
  if (chart) {
    chart.dispose();
    chart = null;
  }
  window.removeEventListener('resize', handleResize);
});
</script>

<style lang="scss" scoped>
.heat-map-container {
  position: relative;
  width: 100%;
  height: 500px;
  margin: 0 auto;

  .empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-style: italic;
    color: #909399;
  }

  .map-container {
    width: 100%;
    height: 100%;
    min-height: 500px; /* 设置最小高度 */
    background-color: #fafafa;
    border-radius: 4px;
  }
}
</style>
