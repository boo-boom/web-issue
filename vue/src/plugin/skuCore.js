const specsArrName = "value_list";    // commoditySpecs最终处理后的自定义字段名
const specsName = "value";    // commoditySpecs最终处理后自定义的集合字段名

class Adjoin {
    constructor(vertex) {
      this.vertex = vertex;  // 顶点数组
      this.vertexIds = vertex.map(v => v[specsName]);  // 获取顶点数组内的value并返回新数组
      this.quantity = vertex.length; // 顶点的个数
      this.adjoinArray = []; // 矩阵的数组
      this.init();
    }

    init() {
      // 矩阵的length必然是顶点个数的平方
      this.adjoinArray = Array.from({ length: this.quantity * this.quantity });
    }

    // 注册邻接点
    setAdjoinVertex(id, sides) {
      const vertexIds = this.vertex.map(item => item[specsName]);
      const pIndex = vertexIds.indexOf(id[specsName]);
      sides.forEach(item => {
        const index = vertexIds.indexOf(item[specsName]);
        this.adjoinArray[pIndex * this.quantity + index] = 1;
      });
    }

    // 获取矩阵某一行
    getVertexRow(id) {
      const index = this.vertexIds.indexOf(id[specsName]);
      const col = [];
      this.vertex.forEach((item, pIndex) => {
        col.push(this.adjoinArray[index + this.quantity * pIndex]);
      });
      return col;
    }

    // 获取邻接点
    getAdjoinVertex(id) {
      return this.getVertexRow(id).map((item, index) => (item ? this.vertex[index] : "")).filter(Boolean);
    }

    // 所有可选项
    getRowTotal(params) {
      params = params.map(id => this.getVertexRow(id));
      const adjoinNames = [];
      this.vertex.forEach((item, index) => {
        // 如果点击了多项规格，params为二维数组，遍历会将为`1`值的下标进行累加，如果下标相同则说明该属性多个规格均满足
        const rowTotal = params.map(value => value[index]).reduce((total, current) => {
          total += current || 0;
          return total;
        }, 0);
        adjoinNames.push(rowTotal);
      });
      return adjoinNames;
    }

    // 交集
    getUnions(params) {
      const row = this.getRowTotal(params);
      // 将选中并符合的规格筛选出来
      return row.map((item, index) => item >= params.length && this.vertex[index]).filter(Boolean);
    }

    // 并集
    getCollection(params) {
      // 获取所有规格并集
      params = this.getRowTotal(params);
      return params.map((item, index) => item && this.vertex[index]).filter(Boolean);
    }
  }

  class ShopAdjoin extends Adjoin {
    constructor(commoditySpecs, data) {
      super(commoditySpecs.reduce((total, current) => [...total, ...current[specsArrName]], []));
      this.commoditySpecs = commoditySpecs;
      this.data = data;

      // 单规格矩阵创建
      this.initCommodity();
      // 同类顶点创建
      this.initSimilar();
    }

    initCommodity() {
      this.data.forEach(item => {
        this.applyCommodity(item.specs);
      });
    }

    initSimilar() {
      // 获得所有可选项
      const specsOption = this.getCollection(this.vertex);
      this.commoditySpecs.forEach(item => {
        const params = [];
        item[specsArrName].forEach(specs => {
          if (specsOption.indexOf(specs.value) > -1) {
            params.push(specs.value);
          }
        });
        this.applyCommodity(params);
      });
    }

    // 同级点位创建
    applyCommodity(params) {
      params.forEach(param => {
        this.setAdjoinVertex(param, params);
      });
    }

    querySpecsOptions(params) {
      // 判断是否存在选项填一个
      if (params.some(Boolean)) {
        // 过滤一下选项
        params = this.getUnions(params.filter(Boolean));
      } else {
        // 兜底选一个
        params = this.getCollection(this.vertex);
      }
      // console.log(params)
      return params
    }
  }

  export { Adjoin, ShopAdjoin };
