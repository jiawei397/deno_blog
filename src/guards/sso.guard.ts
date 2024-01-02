import { CanActivate, Context, Injectable } from "@nest";

/**
 * 如果没有登陆，跳转到登陆页面
 */
@Injectable()
export class SSOGuard implements CanActivate {
  canActivate(context: Context) {
    const b = this.validateRequest(context);
    if (!b) {
      context.state.error = "未登陆";
      context.response.redirect("/signin");
    }
    return b;
  }

  validateRequest(context: Context) {
    return context.state.session?.user;
  }
}

/**
 * 如果已经登陆，直接跳转到首页
 */
@Injectable()
export class LoginedGuard implements CanActivate {
  canActivate(context: Context) {
    const b = this.validateRequest(context);
    if (!b) {
      context.state.error = "已登陆";
      context.response.redirect("/posts");
    }
    return b;
  }

  validateRequest(context: Context) {
    return !context.state.session || !context.state.session.user;
  }
}
