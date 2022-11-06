<script setup lang="ts">
import NavigationBar from '@/components/NavigationBar.vue'
import PageList from '@/components/PageList.vue'
</script>

<template>
  <v-app>
    <navigation-bar/>
    <v-main>
      <div class="main">
        <div style="height: 100%">
          <page-list/>
        </div>
        <div class="container-wrapper">
          <v-container>
            <slot/>
          </v-container>
        </div>
      </div>
    </v-main>
  </v-app>
</template>

<style scoped>
.main {
  display: flex;
  height: 100%;
  max-height: 100%;
}

.container-wrapper {
  /*
  overflow-x: hidden;
  overflow-y: scroll;
  */
  height: 100%;
  flex: 1;
}
</style>
