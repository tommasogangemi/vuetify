// Composables
import { VClassIcon } from '@/composables/icons'

// Types
import type { IconAliases, IconSet } from '@/composables/icons'

const aliases: IconAliases = {
  collapse: 'fas fa-chevron-up',
  complete: 'fas fa-check',
  cancel: 'fas fa-times-circle',
  close: 'fas fa-times',
  delete: 'fas fa-times-circle', // delete (e.g. v-chip close)
  clear: 'fas fa-times-circle', // delete (e.g. v-chip close)
  success: 'fas fa-check-circle',
  info: 'fas fa-info-circle',
  warning: 'fas fa-exclamation',
  error: 'fas fa-exclamation-triangle',
  prev: 'fas fa-chevron-left',
  next: 'fas fa-chevron-right',
  checkboxOn: 'fas fa-check-square',
  checkboxOff: 'far fa-square', // note 'far'
  checkboxIndeterminate: 'fas fa-minus-square',
  delimiter: 'fas fa-circle', // for carousel
  sortAsc: 'fas fa-arrow-up',
  sortDesc: 'fas fa-arrow-down',
  expand: 'fas fa-chevron-down',
  menu: 'fas fa-bars',
  subgroup: 'fas fa-caret-down',
  dropdown: 'fas fa-caret-down',
  radioOn: 'far fa-dot-circle',
  radioOff: 'far fa-circle',
  edit: 'fas fa-edit',
  ratingEmpty: 'far fa-star',
  ratingFull: 'fas fa-star',
  ratingHalf: 'fas fa-star-half',
  loading: 'fas fa-sync',
  first: 'fas fa-step-backward',
  last: 'fas fa-step-forward',
  unfold: 'fas fa-arrows-alt-v',
  file: 'fas fa-paperclip',
  plus: 'fas fa-plus',
  minus: 'fas fa-minus',
  calendar: 'fas fa-calendar',
  treeviewCollapse: 'fas fa-caret-down',
  treeviewExpand: 'fas fa-caret-right',
  eyeDropper: 'fas fa-eye-dropper',
  upload: 'fas fa-cloud-upload-alt',
  color: 'fas fa-palette',
  command: 'fas fa-keyboard',
  ctrl: 'fas fa-keyboard',
  shift: 'fas fa-arrow-up',
  alt: 'fas fa-keyboard',
  space: 'fas fa-square',
  enter: 'fas fa-reply',
  arrowup: 'fas fa-arrow-up',
  arrowdown: 'fas fa-arrow-down',
  arrowleft: 'fas fa-arrow-left',
  arrowright: 'fas fa-arrow-right',
  backspace: 'fas fa-backspace',
  play: 'fas fa-play',
  pause: 'fas fa-pause',
  fullscreen: 'fas fa-fullscreen',
  fullscreenExit: 'fas fa-compress',
  volumeHigh: 'fas fa-volume-high',
  volumeMedium: 'fas fa-volume-low',
  volumeLow: 'fas fa-volume-off',
  volumeOff: 'fas fa-volume-off',
}

const fa: IconSet = {
  component: VClassIcon,
}

export { aliases, fa }
