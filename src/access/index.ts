import router from "@/router";
import store from "@/store";
import AccessEnum from "@/access/accessEnum";
import checkAccess from "@/access/checkAccess";

router.beforeEach(async (to, from, next) => {
  let loginUser = store.state.user.loginUser;
  //如果之前没登录，则自动登录
  if (!loginUser || !loginUser.userRole) {
    //加await是为了等用户登录成功后才执行后续的代码
    await store.dispatch("user/getLoginUser");
    loginUser = store.state.user.loginUser;
  }
  const needAccess = (to.meta?.access as string) ?? AccessEnum.NOT_LOGIN;

  //如果跳转的页面必须要登录
  if (needAccess !== AccessEnum.NOT_LOGIN) {
    //用户没登录，则跳转到登录页面
    if (
      !loginUser ||
      !loginUser.userRole ||
      loginUser.userRole === AccessEnum.NOT_LOGIN
    ) {
      next(`/user/login?redirect=${to.fullPath}`);
      return;
    }
    //如果已经登录了，但是权限不足，则跳转到无权限页面
    if (!checkAccess(loginUser, needAccess)) {
      next("/noAuth");
      return;
    }
  }
  next();
});
