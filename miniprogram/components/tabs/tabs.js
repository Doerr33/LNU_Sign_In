// components/tabs/tabs.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabs:{
      type:Array,
      value:[]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    changeActive(e) {
      let index = e.currentTarget.dataset.index;
      // let { tabs } = this.data;
      // // 最严谨的写法
      // // let tabs = JSON.parse(JSON.stringify(this.data.tabs))
      // let tab = tabs;
      // tab.forEach((v, i) => {
      //   i === index ? v.isActive = true : v.isActive = false;
      // })
      // this.setData({
      //   tabs:tab
      // })
      // 子向父传递数据：自定义事件
      this.triggerEvent("tabsChange",{index});
    }
  }
})