<template>
    <v-app>
        <options-toolbar></options-toolbar>
        <preferences></preferences>
        <tree-view></tree-view>
        <v-content>
            <nuxt/>
        </v-content>
    </v-app>
</template>

<script>
  import OptionsToolbar from '~/components/options-toolbar'
  import TreeView from '~/components/tree-view'
  import Preferences from '~/components/settings'

  export default {
    components: {OptionsToolbar, TreeView, Preferences},
    data () {
      return {}
    }
  }
</script>
