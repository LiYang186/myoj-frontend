<template>
  <a-row id="globalHeader" align="center" :wrap="false">
    <a-col flex="auto">
      <div>
        <a-menu
          mode="horizontal"
          :selected-keys="selectedKeys"
          @menu-item-click="doMenuClick"
        >
          <a-menu-item
            key="0"
            :style="{ padding: 0, marginRight: '38px' }"
            disabled
          >
            <div class="title-bar">
              <img class="logo" src="../assets/oj-logo.jpg" />
              <div class="title">OJ</div>
            </div>
          </a-menu-item>
          <a-menu-item v-for="item in visibleRoutes" :key="item.path">
            {{ item.name }}
          </a-menu-item>
        </a-menu>
      </div>
    </a-col>
    <a-space size="large">
      <a-dropdown trigger="hover">
        <template
          v-if="loginUser && loginUser.userRole !== AccessEnum.NOT_LOGIN"
        >
          <!--         用户已经登录且有头像-->
          <template v-if="loginUser.userAvatar">
            <a-avatar
              shape="circle"
              :image-url="loginUser.userAvatar"
              style="margin-right: 20px"
            >
            </a-avatar>
          </template>
          <!--          用户已登录但没有头像,使用默认的头像-->
          <template v-else>
            <a-avatar
              :style="{ backgroundColor: '#3370ff', marginRight: '20px' }"
            >
              <IconUser />
            </a-avatar>
          </template>
        </template>
        <template v-else>
          <!--          用户没有登录，默认的黑色头像-->
          <a-avatar shape="circle" :style="{ marginRight: '20px' }">
            <IconUser />
          </a-avatar>
        </template>
        <template #content>
          <template v-if="loginUser.userRole !== AccessEnum.NOT_LOGIN">
            <a-doption>
              <template #icon>
                <icon-idcard />
              </template>
              <template #default>
                <a-anchor-link @click="toUserInfoPage(loginUser.id)"
                  >个人信息</a-anchor-link
                >
              </template>
            </a-doption>
            <a-doption>
              <template #icon>
                <icon-poweroff />
              </template>
              <template #default>
                <a-anchor-link @click="logout">退出登录</a-anchor-link>
              </template>
            </a-doption>
          </template>

          <template v-else>
            <a-doption>
              <template #icon>
                <icon-user />
              </template>
              <template #default>
                <a-anchor-link href="/user/login">登录</a-anchor-link>
              </template>
            </a-doption>
            <a-doption>
              <template #icon>
                <icon-user />
              </template>
              <template #default>
                <a-anchor-link href="/user/register">注册</a-anchor-link>
              </template>
            </a-doption>
          </template>
        </template>
      </a-dropdown>
    </a-space>
  </a-row>
</template>

<script setup lang="ts">
import { routes } from "@/router/routes";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import checkAccess from "@/access/checkAccess";
import AccessEnum from "@/access/accessEnum";
import { LoginUserVO, Question, UserControllerService } from "../../generated";

const router = useRouter();
const store = useStore();

// setTimeout(() => {
//   store.dispatch("user/getLoginUser", {
//     userName: "admin",
//     userRole: AccessEnum.USER,
//   });
// }, 3000);

//默认主页
const selectedKeys = ref(["/"]);

// 获取登录用户信息
const loginUser: LoginUserVO = computed(
  () => store.state.user?.loginUser
) as LoginUserVO;

//过滤不显示的页面
const visibleRoutes = computed(() => {
  return routes.filter((item, index) => {
    if (item.meta?.hideInMenu) {
      return false;
    }
    return checkAccess(
      store.state.user.loginUser,
      item?.meta?.access as string
    );
  });
});

//路由跳转后，更新选中的菜单项
router.afterEach((to) => {
  selectedKeys.value = [to.path];
});

//绑定页面跳转事件，刷新页面会执行此方法
const doMenuClick = (key: string) => {
  router.push({
    path: key,
  });
};

// 用户注销
const logout = () => {
  UserControllerService.userLogoutUsingPost(); //请求后台注销
  localStorage.removeItem("token");
  location.reload();
};

const toUserInfoPage = (question: Question) => {
  router.push({
    path: `/user/info/${question.id}`,
  });
};
</script>

<style scoped>
.title-bar {
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
}

.logo {
  height: 48px;
}

.title {
  color: #444;
  margin-left: 16px;
}
</style>
