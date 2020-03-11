<template>
  <div class="wrap wrap-sku">
    <div class="product-box">
      <div class="product-content">
        <div
          class="product-delcom"
          v-for="(specs, index) in commoditySpecs"
          :key="specs.key_id"
        >
          <p>{{ specs.key }}</p>
          <ul class="product-footerlist">
            <li
              :class="{
                disabled: spec.disabled || spec.lock,
                active: spec.selected
              }"
              v-for="spec in specs.value_list"
              :key="spec.value_id"
              @click="handleClickSpecs(specs, spec, index)"
            >
              {{ spec.value }}
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
import { Adjoin, ShopAdjoin } from "../plugin/skuCore";

export default {
  data() {
    return {
      shopAdjoin: null,
      commoditySpecs: [],
      specsS: []
    };
  },
  mounted() {
    // const adjoin = new Adjoin(sku_list[0].specs, "value");
    // adjoin.setAdjoinVertex("七龙珠", ["金属灰", "小号 S"]);
    // console.log(adjoin.getAdjoinVertex("七龙珠"), sku_list);

    this.commoditySpecs = this.getCommoditySpecs(sku_list);
    this.specsS = Array.from({ length: this.commoditySpecs.length });
    this.shopAdjoin = new ShopAdjoin(this.commoditySpecs, sku_list);

    // console.log(this.specsS)
  },
  methods: {
    getCommoditySpecs(skuList) {
      const currentSkuList = skuList.map(item => item.specs);
      const transResult = {};
      // 利用对象的不可重复声明属性的特性合并数据
      currentSkuList.forEach(item => {
        item.forEach(specs => {
          if (!transResult[specs["key_id"]]) {
            transResult[specs["key_id"]] = {
              key_id: specs["key_id"],
              key: specs["key"],
              value_list: {
                [specs["value_id"]]: {
                  value_id: specs["value_id"],
                  value: specs["value"],
                  selected: false,
                  disabled: false,
                  lock: specs["lock"],
                }
              }
            };
          } else if (!transResult[specs["key_id"]].value_list[specs["value_id"]]) {
            transResult[specs["key_id"]].value_list[specs["value_id"]] = {
              value_id: specs["value_id"],
              value: specs["value"],
              selected: false,
              disabled: false,
              lock: specs["lock"],
            }
          }
        });
      });

      // 利用keys + map转化类数组为真实数组（没有length属性不能称为类数组，此次为方便理解）
      const commoditySpecs = Object.keys(transResult).map(key => {
        const obj = JSON.parse(JSON.stringify(transResult[key]));
        obj.value_list = Object.keys(obj.value_list).map(vkey => obj.value_list[vkey]);
        return obj;
      });

      return commoditySpecs;
    },

    handleClickSpecs(specs, spec, index) {
      if (spec.lock || spec.disabled) return;
      if (this.specsS[index] && this.specsS[index].value == spec.value) {
        this.specsS[index] = null;
      } else {
        this.specsS[index] = spec;
      }
      const optionSpecs = this.shopAdjoin.querySpecsOptions(this.specsS);
      const optionSpecsIds = optionSpecs.map(sp => sp.value);
      this.commoditySpecs.forEach(item => {
        item.value_list.forEach(spec => {
          spec.disabled = optionSpecsIds.indexOf(spec.value) < 0,
          spec.selected = this.specsS.filter(sp => sp && sp.value === spec.value).length > 0
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
