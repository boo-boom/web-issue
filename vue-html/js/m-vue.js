// // 1. 解析html模版：获取页面字面量并根据data属性进行匹配渲染
// class MVue {
//   constructor(options) {
//     this.$options = options;
//     this._data = options.data;
//     this.compile(options.el);
//   }
//   // 对页面模版进行渲染
//   compile(el) {
//     // 查找当前根节点下需要渲染的节点
//     const element = document.querySelector(el);
//     this.compileNode(element);
//   }
//   // 递归查找所有节点
//   compileNode(element) {
//     const childNodes = element.childNodes;
//     Array.from(childNodes).forEach(node => {
//       if (node.nodeType === 3) {
//         // 文本
//         const nodeContent = node.textContent;
//         const reg = /\{\{\s*(\S*)\s*\}\}/;    // 匹配表达式
//         // 使用正则匹配到字面量，如message
//         if (reg.test(nodeContent)) {
//           // 将页面变量替换为匹配到到的_data数据
//           node.textContent = this._data[RegExp.$1];
//         }
//       } else if (node.nodeType === 1) {
//         // 标签
//       }
//       // 开始递归
//       if (node.childNodes.length > 0) {
//         this.compileNode(node);
//       }
//     });
//   }
// }


// // 2. 数据劫持：劫持data数据的修改进行数据绑定
// class MVue {
//   constructor(options) {
//     this.$options = options;
//     this._data = options.data;
//     // 数据劫持
//     this.observer(this._data);
//     // 渲染模版
//     this.compile(options.el);
//   }


//   // 数据劫持
//   observer(data) {
//     Object.keys(data).forEach(key => {
//       let value = data[key];
//       Object.defineProperty(data, key, {
//         configurable: true,   // 可配置
//         enumerable: true,   // 可枚举
//         get() {
//           return value;
//         },
//         set(newVal) {
//           console.log(key, newVal);
//           value = newVal;
//         }
//       });
//     });
//   }


//   // 对页面模版进行渲染
//   compile(el) {
//     // 查找当前根节点下需要渲染的节点
//     const element = document.querySelector(el);
//     this.compileNode(element);
//   }
//   // 递归查找所有节点
//   compileNode(element) {
//     const childNodes = element.childNodes;
//     Array.from(childNodes).forEach(node => {
//       if (node.nodeType === 3) {
//         // 文本
//         const nodeContent = node.textContent;
//         const reg = /\{\{\s*(\S*)\s*\}\}/;    // 匹配表达式
//         // 使用正则匹配到字面量，如message
//         if (reg.test(nodeContent)) {
//           // 将页面变量替换为匹配到到的_data数据
//           node.textContent = this._data[RegExp.$1];
//         }
//       } else if (node.nodeType === 1) {
//         // 标签
//       }
//       // 开始递归
//       if (node.childNodes.length > 0) {
//         this.compileNode(node);
//       }
//     });
//   }
// }


// 3. 发布订阅：注册收集多个发布，当数据劫持到变化时进行统一通知并更新
class MVue {
  constructor(options) {
    this.$options = options;
    this._data = options.data;
    // 数据劫持
    this.observer(this._data);
    // 渲染模版
    this.compile(options.el);
  }


  // 数据劫持
  observer(data) {
    Object.keys(data).forEach(key => {
      const dep = new Dep();
      let value = data[key];
      Object.defineProperty(data, key, {
        configurable: true,   // 可配置
        enumerable: true,   // 可枚举
        get() {
          // 如果Dep.target为Watcher，如果存在则将其注册
          if (Dep.target) {
            dep.addSub(Dep.target);
          }
          return value;
        },
        set(newVal) {
          if (value !== newVal) {
            value = newVal;
            // set时进行统一通知订阅者
            dep.notify(newVal);
          }
        }
      });
    });
  }


  // 对页面模版进行渲染
  compile(el) {
    // 查找当前根节点下需要渲染的节点
    const element = document.querySelector(el);
    this.compileNode(element);
  }
  // 递归查找所有节点
  compileNode(element) {
    const childNodes = element.childNodes;
    Array.from(childNodes).forEach(node => {
      if (node.nodeType === 3) {
        // 文本
        const nodeContent = node.textContent;
        const reg = /\{\{\s*(\S*)\s*\}\}/;    // 匹配表达式
        // 使用正则匹配到插值，如message
        if (reg.test(nodeContent)) {
          // 将页面变量替换为匹配到到的_data数据
          node.textContent = this._data[RegExp.$1];
          // 订阅信息
          new Watcher(this, RegExp.$1, newVal => {
            node.textContent = newVal;
          });
        }
      } else if (node.nodeType === 1) {
        // 标签
        // 如果标签上有指令时处理
        const attrs = Array.from(node.attributes);
        attrs.forEach(attr => {
          let attrName = attr.name;
          const attrValue = attr.value;
          if (attrName.indexOf("v-") === 0) {
            attrName = attrName.substr(2);
            // v-model双向绑定
            if (attrName === "model") {
              node.value = this._data[attrValue];
            }
            node.addEventListener("input", e => {
              this._data[attrValue] = e.target.value;
            });
            // 订阅者实例化
            new Watcher(this, attrValue, newVal => {
              node.value = newVal;
            });
          }
        });
      }
      // 开始递归
      if (node.childNodes.length > 0) {
        this.compileNode(node);
      }
    });
  }
}


// 发布订阅
// 发布者收集订阅信息
class Dep {
  constructor() {
    this.subs = [];
  }
  addSub(sub) {
    this.subs.push(sub);
  }
  notify(newVal) {
    console.log(this.subs)
    this.subs.forEach(sub => {
      sub.update(newVal);
    });
  }
}
// 订阅者订阅发布的信息
class Watcher {
  constructor(vm, exp, cb) {
    // 把当前的Watcher绑定为Dep的属性，用来判断addSub时，当前的Watcher是否存在
    Dep.target = this;
    // 执行一次获取属性，让其触发get()
    vm._data[exp];
    // 利用回调传参将最新的值返回给渲染的逻辑中
    this.cb = cb;
    // 触发之后将target删除，避免重复添加subs
    Dep.target = null;
  }
  update(newVal) {
    console.log("更新: " + newVal);
    // 发布订阅只负责发布订阅的问题，具体的渲染逻辑利用回调带回参数
    this.cb(newVal);
  }
}
