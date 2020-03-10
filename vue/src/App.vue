<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">SKU选择器</router-link> |
      <router-link to="/about">邻接矩阵</router-link>
    </div>
    <router-view />
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
