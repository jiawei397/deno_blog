/**
 * Created by Administrator on 2017/6/12 0012.
 */
$(function () {
  // 点击按钮弹出下拉框
  $('.ui.dropdown').dropdown();
  // 鼠标悬浮在头像上，弹出气泡提示框
  $('.post-content .avatar').popup({
    inline: true,
    position: 'bottom right',
    lastResort: 'bottom right'
  });
});
