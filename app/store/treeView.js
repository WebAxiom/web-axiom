export const state = () => ({
  open: false
})

export const mutations = {
  setOpen: (state, {value}) => {
    state.open = value
  },
  toggleOpen: (state) => {
    state.open = !state.open
  }
}

export const actions = {
}
