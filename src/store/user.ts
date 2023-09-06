import { StoreOptions } from "vuex";
import AccessEnum from "@/access/accessEnum";

export default {
  namespaced: true,
  state: () => ({
    loginUser: {
      userName: "未登录",
      userRole: AccessEnum.NOT_LOGIN,
    },
  }),
  //actions执行异步操作，触发mutations的更改（action调用mutations）
  actions: {
    getLoginUser({ commit, state }, payload) {
      //TODO 改成从远程获取登录信息
      commit("updateUser", payload);
    },
  },
  //mutations对变量进行更新
  mutations: {
    updateUser(state, payload) {
      state.loginUser = payload;
    },
  },
} as StoreOptions<any>;
