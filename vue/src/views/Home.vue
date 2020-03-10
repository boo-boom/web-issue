<template>
  <div class="home">
    <Sku />
  </div>
</template>

<script>
import Sku from "@/components/Sku";

export default {
  name: "Home",
  components: {
    Sku
  }
};
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}
ul,
li {
  list-style: none;
}
</style>
