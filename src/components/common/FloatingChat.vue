<template>
  <div class="floating-chat-container" :class="{ 'is-expanded': isExpanded }">
    <!-- 折叠状态下的聊天按钮 -->
    <div v-if="!isExpanded" class="chat-button" @click="expandChat">
      <el-icon class="chat-icon">
        <ChatRound />
      </el-icon>
    </div>

    <!-- 展开状态下的聊天窗口 -->
    <div v-else class="chat-window">
      <!-- 聊天窗口头部 -->
      <div class="chat-header">
        <div class="chat-title">
          <el-icon :size="20" class="mr-2">
            <Service />
          </el-icon>
          <span>{{ t('common.customerService') }}</span>
        </div>
        <div class="chat-actions">
          <el-icon :size="20" class="action-icon" @click="minimizeChat">
            <Minus />
          </el-icon>
          <el-icon :size="20" class="action-icon" @click="closeChat">
            <Close />
          </el-icon>
        </div>
      </div>

      <!-- 聊天窗口内容 -->
      <div class="chat-content" ref="chatContent">
        <div
          v-for="(message, index) in messages"
          :key="index"
          class="message"
          :class="{ 'message-user': message.isUser, 'message-agent': !message.isUser }"
        >
          <div class="message-avatar">
            <el-avatar
              :size="40"
              :icon="message.isUser ? User : Service"
              :src="message.isUser ? userAvatar : null"
            />
          </div>
          <div class="message-bubble">
            <div class="message-text">{{ message.text }}</div>
            <div class="message-time">{{ message.time }}</div>
          </div>
        </div>
      </div>

      <!-- 聊天窗口输入框 -->
      <div class="chat-input">
        <el-input
          v-model="inputMessage"
          type="text"
          :placeholder="t('common.typeMessage')"
          @keyup.enter="sendMessage"
        >
          <template #append>
            <el-button @click="sendMessage">
              <el-icon :size="20">
                <Position />
              </el-icon>
            </el-button>
          </template>
        </el-input>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/store/modules/auth';
import defaultAvatar from '@/assets/images/default-avatar.png';
import { ChatRound, Service, Minus, Close, Position, User } from '@element-plus/icons-vue';

const { t } = useI18n();
const authStore = useAuthStore();

// 用户头像
const userAvatar = computed(() => authStore.userInfo.avatar || defaultAvatar);

// 聊天窗口状态
const isExpanded = ref(false);
const inputMessage = ref('');
const chatContent = ref<HTMLElement | null>(null);

// 聊天消息
const messages = ref([
  {
    isUser: false,
    text: t('common.welcomeMessage'),
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
]);

// 展开聊天窗口
const expandChat = () => {
  isExpanded.value = true;
};

// 最小化聊天窗口
const minimizeChat = () => {
  isExpanded.value = false;
};

// 关闭聊天窗口
const closeChat = () => {
  isExpanded.value = false;
  // 可以添加其他清理逻辑，如清空消息等
};

// 发送消息
const sendMessage = () => {
  if (!inputMessage.value.trim()) return;

  // 添加用户消息
  messages.value.push({
    isUser: true,
    text: inputMessage.value,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  });

  // 清空输入框
  const userMessage = inputMessage.value;
  inputMessage.value = '';

  // 滚动到底部
  scrollToBottom();

  // 模拟客服回复
  setTimeout(() => {
    // 这里可以集成实际的聊天API
    const response = getAutoResponse(userMessage);
    messages.value.push({
      isUser: false,
      text: response,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
    scrollToBottom();
  }, 1000);
};

// 滚动到底部
const scrollToBottom = async () => {
  await nextTick();
  if (chatContent.value) {
    chatContent.value.scrollTop = chatContent.value.scrollHeight;
  }
};

// 模拟自动回复
const getAutoResponse = (message: string) => {
  const lowerMessage = message.toLowerCase();
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return t('common.greetingResponse');
  } else if (lowerMessage.includes('help')) {
    return t('common.helpResponse');
  } else if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
    return t('common.goodbyeResponse');
  } else {
    return t('common.defaultResponse');
  }
};

onMounted(() => {
  scrollToBottom();
});
</script>

<style lang="scss" scoped>
.floating-chat-container {
  @apply fixed z-50 transition-all duration-300 ease-in-out;

  right: 20px;
  bottom: 20px;

  // 聊天按钮样式
  .chat-button {
    @apply rounded-full bg-gradient-primary flex items-center justify-center cursor-pointer shadow-lg transition-all duration-300;

    width: 60px;
    height: 60px;

    &:hover {
      @apply transform scale-110;

      box-shadow: 0 0 15px rgb(99 102 241 / 50%);
    }

    .chat-icon {
      @apply text-white;

      font-size: 28px;
    }
  }

  // 聊天窗口样式
  .chat-window {
    @apply bg-white dark:bg-gray-800 rounded-lg shadow-xl flex flex-col overflow-hidden;

    width: 400px;
    height: 550px;
    border: 1px solid rgb(99 102 241 / 20%);

    .chat-header {
      @apply bg-gradient-primary p-3 flex justify-between items-center;

      padding: 12px 16px;

      .chat-title {
        @apply text-white font-medium flex items-center;

        font-size: 16px;
      }

      .chat-actions {
        @apply flex items-center;

        .action-icon {
          @apply text-white ml-3 cursor-pointer hover:opacity-80 transition-opacity;
        }
      }
    }

    .chat-content {
      @apply flex-1 p-4 overflow-y-auto;

      padding: 16px;

      .message {
        @apply flex mb-4;

        margin-bottom: 16px;

        &.message-user {
          @apply flex-row-reverse;

          .message-bubble {
            @apply bg-gradient-primary text-white ml-0 mr-2;

            border-radius: 18px 18px 0;
          }
        }

        &.message-agent {
          .message-bubble {
            @apply bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 ml-2 mr-0;

            border-radius: 18px 18px 18px 0;
          }
        }

        .message-bubble {
          @apply p-3 max-w-[70%];

          padding: 12px 16px;

          .message-text {
            @apply text-sm;

            font-size: 14px;
          }

          .message-time {
            @apply text-xs opacity-70 text-right mt-1;
          }
        }
      }
    }

    .chat-input {
      @apply p-3 border-t border-gray-200 dark:border-gray-700;

      padding: 12px 16px;

      :deep(.el-input-group__append) {
        @apply bg-gradient-primary border-none;

        .el-button {
          @apply border-none bg-transparent text-white;
        }
      }

      :deep(.el-input__inner) {
        height: 42px;
        font-size: 14px;
      }
    }
  }
}
</style>
