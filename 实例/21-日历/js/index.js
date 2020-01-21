/*
 * @Author: czx
 * @Date: 2020-01-20 18:13:32
 * @Description: 平铺日历效果插件
 * @LastEditors  : czx
 * @LastEditTime : 2020-01-21 18:20:22
 * @FilePath: /web-issue/实例/21-日历/js/index.js
 */
(function () {
  function Calendar(el, options) {
    this.el = document.querySelector(el);
    this.timeContainer = null;
    this.content = null;
    this.timerWarp = null;
    this.allGrid = 42;
    this.date = new Date();
    this.date.setMonth(1);
    this.year = this.date.getFullYear();
    this.month = this.date.getMonth();
    this.day = this.date.getDate();
    this.week = this.date.getDay();
    this.opts = Object.assign({}, defaults, options);
    this.init();
  }
  var defaults = {
    title: "日历",              // 标题
    minMonth: 1,               // 开始月份
    maxMonth: 3,               // 最多显示几个月份
    showDisabled: false,       // 是否填充显示空白日期
    changeDate: null,          // 切换日期时的回调，可获得当前年月日，需要星期则需要配置isGetWeek
    isGetWeek: false,          // 是否在回调中获取星期
  };

  Calendar.prototype.init = function () {
    this.showDate();
  };

  Calendar.prototype.showDate = function () {
    this.container();
    this.title();
    this.createWeek();
    this.createContent();
    this.eachMonth();
    this.today();
  };

  // 创建标题
  Calendar.prototype.title = function () {
    var title = document.createElement("p");
    title.className = "title";
    title.innerHTML = this.opts.title;
    this.el.insertBefore(title, this.timeContainer);
  };

  // 创建整个时间dom的容器
  Calendar.prototype.container = function () {
    var container = document.createElement("div");
    container.className = "time-container";
    this.el.appendChild(container);
    this.timeContainer = this.el.querySelector(".time-container");
  };

  // 创建星期
  Calendar.prototype.createWeek = function () {
    var ul = document.createElement("ul");
    var week = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    for (var i = 0; i < week.length; i++) {
      var li = document.createElement("li");
      if (i == 0 || i == week.length - 1) {
        li.style.color = "#ff163a";
      }
      li.innerHTML = week[i];
      ul.appendChild(li);
    }
    ul.className = "week";
    this.timeContainer.appendChild(ul);
  };

  // 创建日历的年月日最外层dom容器
  Calendar.prototype.createContent = function () {
    var content = document.createElement("div");
    content.className = "content";
    this.timeContainer.appendChild(content);
    this.content = this.timeContainer.querySelector(".content");
  };

  // 创建年月日内层容器
  Calendar.prototype.createTimerWarp = function (curMonth) {
    var timerWarp = document.createElement("div");
    timerWarp.className = "timerWarp";
    this.content.appendChild(timerWarp);
    this.timerWarp = this.content.querySelector(".timerWarp");
    this.createYearMonth(curMonth);
    this.createDay(curMonth);
  };

  // 创建年月
  Calendar.prototype.createYearMonth = function (curMonth) {
    var year = this.year;
    var YearMonth = document.createElement("div");
    YearMonth.className = "year-month";
    var oSpan =
      '<span class="year">' +
      year +
      '</span><span>年</span><span class="month">' +
      curMonth +
      "</span><span>月</span>";
    YearMonth.innerHTML = oSpan;
    this.timerWarp.appendChild(YearMonth);
  };

  // 创建天
  Calendar.prototype.createDay = function (curMonth) {
    var dayNode = document.createElement("ul");
    dayNode.className = "day";
    dayNode.setAttribute("data-month", curMonth);
    var days = this.getMonthNum(curMonth);

    for (var i = 1; i <= this.allGrid; i++) {
      var oLi = document.createElement("li");
      oLi.innerHTML = "";
      dayNode.append(oLi);
    }
    var allLi = dayNode.querySelectorAll("li");

    // 设置当前1日所在位置
    this.date.setFullYear(this.year);
    this.date.setMonth(curMonth - 1);
    this.date.setDate(1);

    // 根据当前1日对应的星期几给li赋值
    for (var j = 0; j < days; j++) {
      allLi[j + this.date.getDay()].innerHTML = j + 1;
    }

    this.timerWarp.appendChild(dayNode);

    this.opts.showDisabled && this.getDayDisabled(curMonth, allLi);
    this.hideBlank(allLi);
    this.oldDate(curMonth, allLi);

    var self = this;
    if (this.opts.isGetWeek) {
      var _date = new Date();
    }
    this.bindEvent(dayNode, function () {
      var all = self.timerWarp.querySelectorAll("li");
      for (var i = 0; i < all.length; i++) {
        if (all[i].className == "current") {
          all[i].className = "";
        }
      }
      this.className = "current";

      var date = {
        year: self.year,
        month: Math.floor(this.parentNode.getAttribute("data-month")),
        day: Math.floor(this.innerHTML)
      };
      if (self.opts.isGetWeek) {
        _date.setFullYear(date.year);
        _date.setMonth(date.month - 1);
        _date.setDate(date.day);
        date.week = _date.getDay();
      }
      self.opts.changeDate && self.opts.changeDate(date);
    });
  };

  // 根据配置创建月份长度
  Calendar.prototype.eachMonth = function () {
    var curMonth = this.opts.minMonth > 0 ? this.opts.minMonth - 1 : this.date.getMonth();
    if (this.opts.maxMonth <= 0) {
      this.opts.maxMonth = 1;
    } else if (this.opts.maxMonth > 12 - curMonth) {
      this.opts.maxMonth = 12 - curMonth;
    }
    for (var i = 0; i < this.opts.maxMonth; i++) {
      this.createTimerWarp(curMonth + 1 + i);
    }
  };

  // 计算每个月的总天数
  Calendar.prototype.getMonthNum = function (curMonth) {
    var isTotal1 = [1, 3, 5, 7, 8, 10, 12]; // 31天
    var isTotal2 = [4, 6, 9, 11]; // 30天
    var isTotal3 = [2]; // 闰年29天 平年28天
    if (isTotal1.indexOf(curMonth) !== -1) {
      return 31;
    } else if (isTotal2.indexOf(curMonth) !== -1 && this.isLeapYear()) {
      return 30;
    } else if (isTotal3.indexOf(curMonth) !== -1) {
      return 29;
    } else {
      return 28;
    }
  };

  // 判断是否是闰年
  Calendar.prototype.isLeapYear = function () {
    var year = this.year;
    if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
      return true;
    } else {
      return false;
    }
  };

  // 获取每个月开始不可选位置
  Calendar.prototype.getDayDisabled = function (curMonth, allLi) {
    var prevMonth = curMonth - 1;
    var date = new Date();
    if (prevMonth <= 0) {
      date.setFullYear(this.date.getFullYear() - 1);
      prevMonth = 12;
    }
    var week = this.date.getDay();
    var prevArr = [];
    for (var i = this.getMonthNum(prevMonth); i > this.getMonthNum(prevMonth) - week; i--) {
      prevArr.unshift(i);
    }
    for (var i = 0; i < prevArr.length; i++) {
      allLi[i].innerHTML = prevArr[i];
      allLi[i].className = "disabled";
    }
    // 每个月结束的空白位置，直接按缺的数量补充即可
    for (var i = 0; i < this.allGrid - (this.getMonthNum(curMonth) + week); i++) {
      allLi[this.getMonthNum(curMonth) + week + i].innerHTML = i + 1;
      allLi[this.getMonthNum(curMonth) + week + i].className = "disabled";
    }
  };

  // 今天日期高亮
  Calendar.prototype.today = function () {
    var year = this.year;
    var month = this.month + 1;
    var day = this.day;
    var allYearMonthNode = this.timerWarp.querySelectorAll(".year-month");
    for (var i = 0; i < allYearMonthNode.length; i++) {
      var yearInner = allYearMonthNode[i].querySelector(".year").innerHTML;
      var monthInner = allYearMonthNode[i].querySelector(".month").innerHTML;
      if (year == yearInner && month == monthInner) {
        var allDayNode = this.timerWarp.querySelectorAll(".day")[i].querySelectorAll("li");
        for (var j = 0; j < allDayNode.length; j++) {
          var dayInner = allDayNode[j].innerHTML;
          if (dayInner == day) {
            allDayNode[j].className = "current";
          }
        }
      }
    }
  };

  // 隐藏空白日期
  Calendar.prototype.hideBlank = function (allLi) {
    for (var i = 35; i < allLi.length; i++) {
      if (allLi[i].innerHTML == "") {
        allLi[i].style.display = "none";
      }
    }
  };

  // 绑定事件
  Calendar.prototype.bindEvent = function (parent, fn) {
    parent.onclick = function () {
      var event = window.event;
      var target = event.target || event.srcElement;
      if (target.nodeName.toLowerCase() == "li" && target.innerHTML != "" && target.className != "disabled") {
        fn && fn.call(target);
      }
    };
  };

  // 过去的时间处理
  Calendar.prototype.oldDate = function (curMonth, allLi) {
    var nowMonth = this.month + 1;
    var nowDay = this.day;
    var nowWeek = this.week;
    if (curMonth < nowMonth) {
      for (var i = 0; i < allLi.length; i++) {
        allLi[i].className = "disabled";
      }
    }
    if (nowMonth == curMonth) {
      for (var i = 0; i < nowDay + nowWeek; i++) {
        allLi[i].className = "disabled";
      }
    }
    // console.log("已过去时间处理", curMonth, nowMonth, allLi, nowDay, nowWeek);
  };

  window.Calendar = Calendar;
})();
