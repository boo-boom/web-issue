// 首先先了解下发布订阅
// 3-1: 发布
class Dep {
  constructor() {
    this.subs = [];   // 所有的订阅者信息
  }
  // 收集所有的订阅
  addSub(sub) {
    this.subs.push(sub);
  }
  // 收集完成后进行一次性通知所有订阅者进行更新
  notify() {
    this.subs.forEach(sub => {
      sub.update();
    });
  }
}
// 3-2: 订阅
class Watcher {
  constructor() {}
  update() {
    console.log("更新了...")
  }
}
// 此时只需要将发布的信息进行注册
const dep = new Dep();
const watcher1 = new Watcher();
const watcher2 = new Watcher();
const watcher3 = new Watcher();
dep.addSub(watcher1);
dep.addSub(watcher2);
dep.addSub(watcher3);
// 都注册完成后进行统一通知
dep.notify();
