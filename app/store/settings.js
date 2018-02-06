export const state = () => ({
  console: {
    displayPlainText: false
  },
  open: false
})

export const mutations = {
  setOpen: (state, {value}) => {
    state.open = value
  },
  setDisplayPlainText: (state, {value}) => {
    state.console.displayPlainText = value
  }
}

export const actions = {

}
