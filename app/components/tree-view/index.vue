<template>
  <v-navigation-drawer
    v-model="open"
    disable-resize-watcher
    clipped fixed app
  >
    <v-list dense>
      <!--<v-list-tile @click="">-->
        <!--<v-list-tile-action>-->
          <!--<v-icon>dashboard</v-icon>-->
        <!--</v-list-tile-action>-->
        <!--<v-list-tile-content>-->
          <!--<v-list-tile-title>Dashboard</v-list-tile-title>-->
        <!--</v-list-tile-content>-->
      <!--</v-list-tile>-->
      <!--<v-list-tile @click="">-->
        <!--<v-list-tile-action>-->
          <!--<v-icon>settings</v-icon>-->
        <!--</v-list-tile-action>-->
        <!--<v-list-tile-content>-->
          <!--<v-list-tile-title>Settings</v-list-tile-title>-->
        <!--</v-list-tile-content>-->
      <!--</v-list-tile>-->
    </v-list>
  </v-navigation-drawer>
</template>

<script>
  export default {
    name: 'tree-view',
    computed: {
      open: {
        get () {
          return this.$store.state.treeView.open
        },
        set (value) {
          this.$store.commit('treeView/setOpen', {value})
        }
      }
    },
    data () {
      return {
      }
    }
  }
</script>

<style scoped>

</style>
