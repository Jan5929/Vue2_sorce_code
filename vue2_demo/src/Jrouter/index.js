let Vue
class JRouter {
  constructor (options) {
    this.$options = options
    // defineReactive 让对象的属性变成响应式
    Vue.util.defineReactive(this, 'currentUrl', window.location.hash.slice(1) || '/')
    // 监听hash变化
    window.addEventListener('hashchange', () => {
      this.currentUrl = window.location.hash.slice(1)
    })
  }
}
// vue插件执行的方法
JRouter.install = function (_Vue) {
  Vue = _Vue
  // 全局混入
  Vue.mixin({
    beforeCreate () {
      if (this.$options.router) {
        Vue.prototype.$router = this.$options.router
      }
    }
  })
  // 注册全局组件 router-link、router-view
  Vue.component('router-link', {
    props: {
      to: {
        type: String,
        require: true
      }
    },
    render (h) {
      const color = this.to === this.$router.currentUrl ? 'blue' : 'black'
      return h('a', {
        attrs: {
          href: '#' + this.to,
          style: `color: ${color}`
        }
      }, this.$slots.default)
    }
  })
  Vue.component('router-view', {
    render (h) {
      // 核心部分
      const { routes } = this.$router.$options
      const component = routes.find(item => item.path === this.$router.currentUrl).component
      return h(component)
    }
  })
}
export default JRouter
