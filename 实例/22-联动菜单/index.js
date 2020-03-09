/*
 * @Author: your name
 * @Date: 2020-03-02 14:43:00
 * @LastEditTime: 2020-03-02 16:07:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /web-issue/实例/22-联动菜单/index.js
 */
function SelectCity($el) {
  this.$el = document.querySelector($el);
  this.data = {};
  this.allSelect = null;
}

SelectCity.prototype = {
  init: function(num) {
    var self = this;
    for (var i = 1; i <= num; i++) {
      var $select = document.createElement("select");
      var $option = document.createElement("option");
      $option.innerHTML = "默认";
      $select.index = i;
      $select.appendChild($option);
      this.$el.appendChild($select);

      $select.onchange = function() {
        self.change(this.index);
      };
    }

    this.allSelect = this.$el.querySelectorAll("select");
    this.first();
  },

  add: function(key, value) {
    this.data[key] = value;
  },

  first: function() {
    var arr = this.data["0"];
    for (var i = 0; i < arr.length; i++) {
      var $option = document.createElement("option");
      $option.innerHTML = arr[i];
      this.allSelect[0].appendChild($option);
    }
  },

  change: function(iNow) {
    var str = "0";
    for (var i = 0; i < iNow; i++) {
      str += "_" + (this.allSelect[i].selectedIndex - 1);
    }

    if (this.data[str]) {
      var arr = this.data[str];
      this.allSelect[iNow].options.length = 1;
      for (var i = 0; i < arr.length; i++) {
        var $option = document.createElement("option");
        $option.innerHTML = arr[i];
        this.allSelect[iNow].appendChild($option);
      }
      this.allSelect[iNow].options[1].selected = true;
    } else {
      if (iNow < this.allSelect.length) {
        this.allSelect[iNow].options.length = 1;
      }
    }

    iNow++;
    if (iNow < this.allSelect.length) {
      this.change(iNow);
    }
  }
};
