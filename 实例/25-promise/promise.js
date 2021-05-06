/**
 * Promise规定：
 * - Promise存在三个状态（state）pending、fulfilled、rejected
 * - pending（等待态）为初始态，并可以转化为fulfilled（成功态）和rejected（失败态）
 * - 成功时，不可转为其他状态，且必须有一个不可改变的值（value）
 * - 失败时，不可转为其他状态，且必须有一个不可改变的原因（reason）
 * - new Promise((resolve, reject)=>{resolve(value)}) resolve为成功，接收参数value，状态改变为fulfilled，不可再次改变。
 * - new Promise((resolve, reject)=>{reject(reason)}) reject为失败，接收参数reason，状态改变为rejected，不可再次改变。
 * - 若是executor函数报错 直接执行reject();
 *
 * then方法:
 * - Promise有一个叫做then的方法，里面有两个参数：onFulfilled,onRejected,成功有成功的值，失败有失败的原因
 * - 当状态state为fulfilled，则执行onFulfilled，传入this.value。当状态state为rejected，则执行onRejected，传入this.reason
 * - onFulfilled,onRejected如果他们是函数，则必须分别在fulfilled，rejected后被调用，value或reason依次作为他们的第一个参数
 *
 * 解决异步实现:
 * - 现在基本可以实现简单的同步代码，但是当resolve在setTimeout内执行，then时state还是pending等待状态 我们就需要在then调用的时候，将成功和失败存到各自的数组，一旦reject或者resolve，就调用它们
 * - 类似于发布订阅，先将then里面的两个函数储存起来，由于一个promise可以有多个then，所以存在同一个数组内。
 */

class Promise {
  // 构造器
  constructor(executor) {
    // 初始化state为等待态
    this.state = "pending";
    // 成功的值
    this.value = undefined;
    // 失败的原因
    this.reason = undefined;
    // 成功存放的数组
    this.onResolvedCallbacks = [];
    // 失败存放法数组
    this.onRejectedCallbacks = [];

    // 成功
    const resolve = (value) => {
      // state改变,resolve调用就会失败
      if (this.state === "pending") {
        // resolve调用后，state转化为成功态
        this.state = "fulfilled";
        // 储存成功的值
        this.value = value;
        // 一旦resolve执行，调用成功数组的函数
        this.onResolvedCallbacks.forEach((fn) => fn());
      }
    };

    // 失败
    const reject = (reason) => {
      // state改变,reject调用就会失败
      if (this.state === "pending") {
        // reject调用后，state转化为失败态
        this.state = "reject";
        // 储存失败的原因
        this.reason = reason;
        // 一旦reject执行，调用失败数组的函数
        this.onRejectedCallbacks((fn) => fn());
      }
    };

    // 如果executor执行报错，直接执行reject
    try {
      // 立即执行
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  // then 方法 有两个参数onFulfilled onRejected
  then(onFulfilled, onRejected) {
    // 状态为fulfilled，执行onFulfilled，传入成功的值
    if (this.state === "fulfilled") {
      onFulfilled(this.value);
    }
    // 状态为rejected，执行onRejected，传入失败的原因
    if (this.state === "rejected") {
      onRejected(this.reason);
    }
    // 当状态state为pending时
    if (this.state === "pending") {
      // onFulfilled传入到成功数组
      this.onResolvedCallbacks.push(() => {
        onFulfilled(this.value);
      });
      // onRejected传入到失败数组
      this.onRejectedCallbacks.push(() => {
        onRejected(this.reason);
      });
    }
  }
}
