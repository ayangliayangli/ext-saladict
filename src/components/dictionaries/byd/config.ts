import { DictItem } from '@/app-config/dicts'

export type BydConfig = DictItem<{
  tense: boolean
  phsym: boolean
  cdef: boolean
  related: boolean
  sentence: number
  bydSpec: string
}>

export default (): BydConfig => ({
  lang: '11000000',
  selectionLang: {
    english: true,
    chinese: true,
    japanese: false,
    korean: false,
    french: false,
    spanish: false,
    deutsch: false,
    others: false,
    matchAll: false
  },
  defaultUnfold: {
    english: true,
    chinese: true,
    japanese: true,
    korean: true,
    french: true,
    spanish: true,
    deutsch: true,
    others: true,
    matchAll: false
  },
  preferredHeight: 240,
  selectionWC: {
    min: 1,
    max: 5
  },
  options: {
    tense: true,
    phsym: true,
    cdef: true,
    related: true,
    sentence: 4
  }
})
