<template>
  <div class="wrap wrap-sku">
    <div class="product-box">
      <!-- <div class="product-content">
        <div
          class="product-delcom"
          v-for="(specs, index) in commoditySpecs1"
          :key="specs.title"
        >
          <p>{{ specs.title }}</p>
          <ul class="product-footerlist">
            <li
              v-for="spec in specs.list"
              :key="spec"
              @click="handleClick(spec, index)"
            >
              {{ spec }}
            </li>
          </ul>
        </div>
        <p class="price">¥999</p>
      </div>
      <div class="product-footer">立即购买</div> -->
    </div>
  </div>
</template>

<script>
import Adjoin from "../plugin/adjoin";

export default {
  data() {
    return {
      shopAdjoin: null,
      specsS: [],
      optionSpecs: []
    };
  },
  mounted() {
    // 创建矩阵
    const demo = new Adjoin(["v0", "v1", "v2", "v3", "v4"]);
    // 注册邻接点
    demo.setAdjoinVertex("v0", ["v2", "v3"]);
    demo.setAdjoinVertex("v1", ["v3", "v4"]);
    demo.setAdjoinVertex("v2", ["v0", "v3", "v4"]);
    demo.setAdjoinVertex("v3", ["v0", "v1", "v2"]);
    demo.setAdjoinVertex("v4", ["v1", "v2"]);
    // 获取邻接点
    console.log(demo.getAdjoinVertex("v0"));
    console.log(demo.getAdjoinVertex("v1"));
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
