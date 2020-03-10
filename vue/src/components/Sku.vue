<template>
  <div class="wrap wrap-sku">
    <div class="product-box">
      <div class="product-content">
        <div
          class="product-delcom"
          v-for="(specs, x) in allSpecsList"
          :key="specs.key_id"
        >
          <p>{{ specs.key }}</p>
          <ul class="product-footerlist">
            <li
              :class="{
                disabled: value.disabled || value.lock,
                active: value.selected
              }"
              v-for="(value, y) in specs.value_list"
              :key="value.value_id"
              @click="handleClickSpecs(specs, value, x, y)"
            >
              {{ value.value }}
            </li>
          </ul>
        </div>
        <p class="price">¥999</p>
      </div>
      <div class="product-footer">立即购买</div>
    </div>
  </div>
</template>

<script>
import { sku_list } from "./../assets/data/skuList";
export default {
  name: "Sku",
  data() {
    return {
      currentSkuList: [],
      allSpecsList: [],
      selectable: {},
      selected: []
    };
  },
  mounted() {
    // this.getAllSpecsList();
    this.getSelectable();
  },
  methods: {
    getCurrentSkuList() {
      this.currentSkuList = sku_list.map(item => item.specs);
    },
    // 测试-数据转换
    transMatrix() {
      this.getCurrentSkuList();

      const transResult = {};
      this.currentSkuList.forEach(specs => {
        specs.forEach(item => {
          if (!transResult[item["key_id"]]) {
            transResult[item["key_id"]] = {
              key_id: item["key_id"],
              key: item["key"],
              value_list: {
                [item["value_id"]]: {
                  value_id: item["value_id"],
                  value: item["value"],
                  selected: false,
                  disabled: false,
                  lock: item["lock"]
                }
              }
            };
          } else if (
            !transResult[item["key_id"]].value_list[item["value_id"]]
          ) {
            transResult[item["key_id"]].value_list[item["value_id"]] = {
              value_id: item["value_id"],
              value: item["value"],
              selected: false,
              disabled: false,
              lock: item["lock"]
            };
          }
        });
      });

      return transResult;
    },
    // 将提取结果变为数组格式
    getAllSpecsList() {
      const transResult = this.transMatrix();
      this.allSpecsList = Object.keys(transResult).map(key => {
        // 深拷贝
        const obj = JSON.parse(JSON.stringify(transResult[key]));
        obj.value_list = Object.keys(obj.value_list).map(
          vkey => obj.value_list[vkey]
        );
        return obj;
      });
    },
    // 匹配
    getSelectable() {
      if (this.currentSkuList.length === 0) {
        this.getCurrentSkuList();
      }
      if (this.allSpecsList.length === 0) {
        this.getAllSpecsList();
      }
      const rowLength = this.allSpecsList.length;
      for (let row = 0; row < rowLength; row++) {
        const { key_id, key } = this.allSpecsList[row];
        const columnList = this.allSpecsList[row].value_list;
        this.selectable[key_id] = {
          key_id,
          key,
          selectableList: {}
        };
        for (let column = 0; column < columnList.length; column++) {
          const { value_id, value } = columnList[column];
          this.selectable[key_id].selectableList[value_id] = {
            value_id,
            value,
            matchItems: null
          };
        }
        this.currentSkuList.forEach(specificSpecs => {
          const matchItems = {};
          let currentVlaueId = "";
          specificSpecs.forEach(specsItem => {
            if (specsItem.key_id !== key_id) {
              matchItems[specsItem.key_id] = [specsItem];
            } else {
              currentVlaueId = specsItem.value_id;
            }
          });
          if (
            !this.selectable[key_id].selectableList[currentVlaueId].matchItems
          ) {
            this.selectable[key_id].selectableList[
              currentVlaueId
            ].matchItems = matchItems;
          } else {
            Object.keys(
              this.selectable[key_id].selectableList[currentVlaueId].matchItems
            ).forEach(k => {
              this.selectable[key_id].selectableList[currentVlaueId].matchItems[
                k
              ].push(...matchItems[k]);
            });
          }
          // console.log(matchItems, currentVlaueId);
        });
      }
      // console.log(this.selectable, this.allSpecsList);
    },
    handleClickSpecs(specs, value, x, y) {
      if (value.disabled || value.lock) return;

      if (value.selected) {
        this.clearAllSelectedAndDisabled();
        this.selected.forEach((item, index) => {
          if (item.x === x && item.y === y) {
            this.selected.splice(index, 1);
            console.log(this.selected, item, index);
          }
        });
        this.selected.forEach(item => {
          this.handleSelectOneOption(
            item.x,
            item.y,
            item.key_id,
            item.value_id
          );
        });
        // console.log(specs, value, x, y);
      } else {
        this.selected.forEach((item, index) => {
          if (item.x === x) {
            this.selected.splice(index, 1);
          }
        });
        this.selected.push({
          x,
          y,
          key: specs.key,
          key_id: specs.key_id,
          value_id: value.value_id,
          value: value.value
        });
        this.handleSelectOneOption(x, y, specs.key_id, value.value_id);
      }

      console.log(this.selected);
    },
    clearAllSelectedAndDisabled() {
      this.allSpecsList.forEach(row => {
        row.value_list.forEach(specs => {
          specs.selected = false;
          specs.disabled = false;
        });
      });
    },
    handleSelectOneOption(x, y, key_id, value_id) {
      // console.log(x, y, key_id, value_id);
      this.allSpecsList[x].value_list[y].selected = true;
      this.allSpecsList[x].value_list.forEach((specs, index) => {
        if (index === y) {
          specs.selected = true;
        } else {
          specs.selected = false;
        }
      });
      const selectableMatchItems = this.selectable[key_id].selectableList[
        value_id
      ].matchItems;
      // console.log(123, this.selectable, selectableMatchItems);
      this.allSpecsList.forEach((specsRow, index) => {
        if (index === x) {
          return;
        }
        specsRow.value_list.forEach(specs => {
          specs.disabled = false;
          if (specs.selected) {
            return;
          }
          const result = selectableMatchItems[specsRow.key_id].find(
            item => item.value_id === specs.value_id
          );
          if (!result) {
            specs.disabled = true;
          }
        });
      });
    }
  }
};
</script>

<style lang="scss">
.wrap-sku {
  padding: 20px;
  .product-box {
    display: block;
  }
  .product-content {
    margin-bottom: 40px;
  }
  .product-delcom {
    color: #323232;
    font-size: 14px;
    border-bottom: 1px solid #eeeeee;
    padding: 15px 0;
  }
  .product-footerlist {
    margin-top: 10px;
    display: flex;
  }
  .price {
    font-size: 20px;
    padding-top: 10px;
  }
  .product-footerlist li {
    border: 1px solid #606060;
    color: #606060;
    text-align: center;
    padding: 5px 10px;
    margin-right: 15px;
    cursor: pointer;
  }
  .product-footerlist li.disabled {
    border: 1px dashed #999999;
    color: #999999;
  }
  .product-footerlist li.active {
    border: 1px solid #000;
    background: #000;
    color: #fff;
  }
  .product-footer {
    color: #fff;
    background: #000;
    padding: 10px 0;
    text-align: center;
  }
}
</style>
