import ApplicationError from '@/error/application-error'

const ICONS = new Map<string, string>([
  ['inu', 'animal_inu.png'],
  ['neko', 'animal_neko.png'],
  ['usagi', 'animal_usagi.png'],
  ['panda', 'animal_panda.png'],
  ['arupaka', 'animal_arupaka.png'],
  ['judge', 'judge.png']
])

Object.freeze(ICONS)
export { ICONS }

class Icon {
  public static get SELECTABLE_ICONS(): Map<string, string> {
    const newMap = new Map<string, string>()
    ICONS.forEach((v, k) => {
      if (k !== 'judge') {
        newMap.set(k, v)
      }
    })

    Object.freeze(newMap)
    return newMap
  }

  constructor(private _icon: string) {
    if (!ICONS.get(_icon)) {
      throw new ApplicationError('指定のアイコンが見つかりませんでした')
    }
  }

  public get icon(): string {
    return this._icon
  }

  public get icon_img(): string {
    return ICONS.get(this._icon) || ''
  }
}

export default Icon
