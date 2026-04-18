<template>
  <div class="audio-player">
    <audio
      ref="audioRef"
      :src="src"
      :loop="loop"
      :preload="preload"
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoadedMetadata"
      @ended="onEnded"
    />

    <div class="audio-main">
      <div class="audio-info">
        <div class="audio-title" v-if="title">{{ title }}</div>
        <div class="audio-sub-title" v-if="artist || album">
          <span v-if="artist">{{ artist }}</span>
          <span v-if="artist && album" class="dot">·</span>
          <span v-if="album">{{ album }}</span>
        </div>
      </div>

      <div class="audio-controls">
        <el-button circle type="primary" size="small" @click="togglePlay" :disabled="!src">
          <el-icon>
            <VideoPause v-if="isPlaying" />
            <VideoPlay v-else />
          </el-icon>
        </el-button>

        <div class="audio-progress">
          <span class="time-text">{{ formatTime(currentTime) }}</span>
          <el-slider v-model="progress" :step="0.1" :show-tooltip="false" @change="onSeek" />
          <span class="time-text">{{ formatTime(duration) }}</span>
        </div>

        <div class="audio-volume">
          <el-icon class="volume-icon" @click="toggleMute">
            <Mute v-if="muted || volume === 0" />
            <Microphone v-else />
          </el-icon>
          <el-slider
            v-model="volume"
            :min="0"
            :max="1"
            :step="0.01"
            :show-tooltip="false"
            class="volume-slider"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { VideoPlay, VideoPause, Mute, Microphone } from '@element-plus/icons-vue';

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: '',
  },
  artist: {
    type: String,
    default: '',
  },
  album: {
    type: String,
    default: '',
  },
  autoplay: {
    type: Boolean,
    default: false,
  },
  loop: {
    type: Boolean,
    default: false,
  },
  preload: {
    type: String as () => 'auto' | 'metadata' | 'none',
    default: 'metadata',
  },
});

const audioRef = ref<HTMLAudioElement | null>(null);
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const progress = ref(0);
const volume = ref(0.8);
const muted = ref(false);

const initAudio = () => {
  const audio = audioRef.value;
  if (!audio) return;

  audio.volume = volume.value;

  if (props.autoplay) {
    play();
  }
};

const play = async () => {
  const audio = audioRef.value;
  if (!audio) return;
  try {
    await audio.play();
    isPlaying.value = true;
  } catch (error) {
    // 自动播放可能被浏览器阻止
    console.warn(error);
    ElMessage.warning('自动播放被浏览器阻止，请手动点击播放');
    isPlaying.value = false;
  }
};

const pause = () => {
  const audio = audioRef.value;
  if (!audio) return;
  audio.pause();
  isPlaying.value = false;
};

const togglePlay = () => {
  if (isPlaying.value) {
    pause();
  } else {
    play();
  }
};

const onTimeUpdate = () => {
  const audio = audioRef.value;
  if (!audio) return;
  currentTime.value = audio.currentTime;
  duration.value = audio.duration || 0;
  if (duration.value > 0) {
    progress.value = (currentTime.value / duration.value) * 100;
  }
};

const onLoadedMetadata = () => {
  const audio = audioRef.value;
  if (!audio) return;
  duration.value = audio.duration || 0;
};

const onEnded = () => {
  isPlaying.value = false;
  currentTime.value = 0;
  progress.value = 0;
};

const onSeek = (value: number | number[]) => {
  const audio = audioRef.value;
  if (!audio || !duration.value || Array.isArray(value)) return;
  const targetTime = (value / 100) * duration.value;
  audio.currentTime = targetTime;
  currentTime.value = targetTime;
};

const toggleMute = () => {
  const audio = audioRef.value;
  if (!audio) return;
  muted.value = !muted.value;
  audio.muted = muted.value;
};

watch(volume, newVal => {
  const audio = audioRef.value;
  if (!audio) return;
  audio.volume = newVal;
  if (newVal === 0) {
    muted.value = true;
  } else if (muted.value) {
    muted.value = false;
    audio.muted = false;
  }
});

watch(
  () => props.src,
  () => {
    // 切换音频源时重置状态
    pause();
    currentTime.value = 0;
    duration.value = 0;
    progress.value = 0;
    if (props.autoplay) {
      play();
    }
  }
);

const formatTime = (time: number) => {
  if (!time || Number.isNaN(time)) return '00:00';
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');
  return `${mm}:${ss}`;
};

onMounted(() => {
  initAudio();
});

onBeforeUnmount(() => {
  const audio = audioRef.value;
  if (!audio) return;
  audio.pause();
});
</script>

<style scoped lang="scss">
.audio-player {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgb(0 0 0 / 6%);

  audio {
    display: none;
  }

  .audio-main {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 8px;
  }

  .audio-info {
    .audio-title {
      font-size: 14px;
      font-weight: 600;
      color: #303133;
    }

    .audio-sub-title {
      margin-top: 2px;
      font-size: 12px;
      color: #909399;

      .dot {
        margin: 0 4px;
      }
    }
  }

  .audio-controls {
    display: flex;
    gap: 12px;
    align-items: center;

    .audio-progress {
      display: flex;
      flex: 1;
      gap: 8px;
      align-items: center;

      .time-text {
        width: 44px;
        font-size: 12px;
        color: #909399;
        text-align: center;
      }
    }

    .audio-volume {
      display: flex;
      gap: 4px;
      align-items: center;
      width: 120px;

      .volume-icon {
        color: #606266;
        cursor: pointer;

        &:hover {
          color: #409eff;
        }
      }

      .volume-slider {
        flex: 1;
      }
    }
  }
}
</style>
