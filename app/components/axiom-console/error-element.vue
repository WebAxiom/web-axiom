<template>
  <div :class="`${data.display ? 'expanded' : ''} ${data.compilation ? 'compilation-message' : 'error-message'} mt-2 mb-2`">
    <v-chip class="ma-1"
            text-color="white"
            :color="data.compilation ? 'orange' : 'red'"
            @click.native="data.display = !data.display">
      <v-avatar><v-icon color="white">mdi-alert-circle-outline</v-icon></v-avatar>
      {{data.type}}
    </v-chip>
    <pre v-if="(data.error || data.compilation) && data.display">
          {{data.text}}
      </pre>
  </div>
</template>

<script>
  export default {
    name: 'error-element',
    props: ['data']
  }
</script>

<style lang="stylus" scoped>
  .expanded
    border-radius: 20px
    border: 2px solid
  .compilation-message
    border-color: orange
  .error-message
    border-color: red

</style>