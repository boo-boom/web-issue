// 无向图的几个特点：
// 矩阵的length必然是顶点个数的平方 length^2
// 矩阵主对角线必然无值，左上至右下的对角线
// 矩阵依据斜边对称

// 矩阵数据化后的格式
// const arr = [
//   // v0  v1  v2  v3  v4
//      0,  0,  1,  1,  0, // v0
//      0,  0,  0,  1,  1, // v1
//      1,  0,  0,  1,  1, // v2
//      1,  1,  1,  0,  0, // v3
//      0,  1,  1,  0,  0, // v4
// ]

class Adjoin {
  constructor(vertex) {
    this.vertex = vertex; // 顶点数组
    // console.log(vertex)
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
    const pIndex = this.vertex.indexOf(id);
    sides.forEach(item => {
      // ["v0", "v1", "v2", "v3", "v4"]
      const index = this.vertex.indexOf(item);
      // pIndex可以理解成每一行
      // 0 * 5 = 0    =>   [0  ~  4]第零行   =>   v0
      // 1 * 5 = 5    =>   [5  ~  9]第一行   =>   v1
      // 2 * 5 = 10   =>   [10 ~ 14]第二行   =>   v2
      // 3 * 5 = 15   =>   [15 ~ 19]第三行   =>   v3
      // 4 * 5 = 20   =>   [20 ~ 24]第四行   =>   v4
      this.adjoinArray[pIndex * this.quantity + index] = 1;
    });
    // console.log(pIndex, sides, this.adjoinArray);
  }
  // 获取矩阵某一行
  getVertexRow(id) {
    // 当前第id在vertex中第几位，可以理解为当前第行
    const pIndex = this.vertex.indexOf(id);
    const col = [];
    this.vertex.forEach((item, index) => {
      // 将0*5[第零行]的第2,3[index]位获取到col中
      col.push(this.adjoinArray[pIndex * this.quantity + index]);
    });
    return col;
  }
  // 获取邻接点
  getAdjoinVertex(id) {
    return this.getVertexRow(id)
      .map((item, index) => (item ? this.vertex[index] : ""))
      .filter(Boolean);
  }

  // 所有可选项
  getRowTotal(params) {
    params = params.map(id => this.getVertexRow(id));
    const adjoinNames = [];
    this.vertex.forEach((item, index) => {
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
    console.log(params, row)
    return row.map((item, index) => item >= params.length && this.vertex[index]).filter(Boolean);
  }

  // 并集
  getCollection(params) {
    params = this.getRowTotal(params);
    return params.map((item, index) => item && this.vertex[index]).filter(Boolean);
  }
}

// class ShopAdjoin extends Adjoin {
//   constructor(commoditySpecs, data) {
//     super(commoditySpecs.reduce((total, current) => [...total, ...current.list], []));
//     this.commoditySpecs = commoditySpecs;
//     this.data = data;
//     // 单规格矩阵创建
//     this.initCommodity();
//     // 同类顶点创建
//     this.initSimilar();
//     // console.log(this.commoditySpecs, this.data);
//   }

//   initCommodity() {
//     this.data.forEach(item => {
//       this.applyCommodity(item.specs);
//     });
//   }

//   initSimilar() {
//     // 获得所有可选项
//     const specsOption = this.getCollection(this.vertex);
//     this.commoditySpecs.forEach(item => {
//       const params = [];
//       item.list.forEach(value => {
//         if (specsOption.indexOf(value) > -1) {
//           params.push(value);
//         }
//       });
//       this.applyCommodity(params);
//     });
//   }

//   // 同级点位创建
//   applyCommodity(params) {
//     // console.log(params)
//     params.forEach(param => {
//       this.setAdjoinVertex(param, params);
//     });
//   }

//   querySpecsOptions(params) {
//     // 判断是否存在选项填一个
//     if (params.some(Boolean)) {
//       // 过滤一下选项
//       params = this.getUnions(params.filter(Boolean));
//     } else {
//       // 兜底选一个
//       params = this.getCollection(this.vertex);
//     }
//     // console.log(params)
//     return params
//   }
// }

export default Adjoin;
