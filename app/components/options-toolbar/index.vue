<template>
  <v-toolbar app fixed dark color="primary" class="pr-3 pl-3">
    <v-toolbar-side-icon @click.stop="toggleTreeView"></v-toolbar-side-icon>
    <v-toolbar-title class="white--text"><!--TODO: ??? Working tree path? --></v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon>
      <v-icon>help</v-icon> 
    </v-btn>
    <v-btn icon @click.native.stop="openSettings">
      <v-icon>settings</v-icon>
    </v-btn>
  </v-toolbar>
</template>

<script>
  import { mapMutations } from 'vuex'

  export default {
    name: 'options-toolbar',
    methods: {
      ...mapMutations({
        toggleTreeView: 'treeView/toggleOpen',
        setOpenSettings: 'settings/setOpen'
      }),
      openSettings () {
        this.setOpenSettings({value: true})
      }
    },
    data () {
      return {}
    }
  }
</script>

<style scoped>

</style>
