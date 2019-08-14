import React, { FC, useState, useEffect } from 'react'
import root from 'react-shadow'
import i18next from 'i18next'
import { number, boolean, color as colorKnob } from '@storybook/addon-knobs'
import SinonChrome from 'sinon-chrome'
import { Message } from '@/typings/message'

interface StyleWrapProps {
  style: string
}

export const browser: typeof SinonChrome = window.browser as any

export const StyleWrap: FC<StyleWrapProps> = props => {
  return (
    <div className="local-style-wrap">
      <style>{props.style}</style>
      {props.children}
    </div>
  )
}

/**
 * Workaround for {@link https://github.com/storybookjs/storybook/issues/729}
 */
export function withLocalStyle(style: object | string) {
  return function LocalStyle(fn) {
    return <StyleWrap style={style.toString()}>{fn()}</StyleWrap>
  }
}

export const I18nNS: FC<{ story: Function }> = props => {
  const [, setLang] = useState(i18next.language)

  useEffect(() => {
    const onLangChanged = (lang: string) => {
      setLang(lang)
    }

    i18next.on('languageChanged', onLangChanged)

    return () => i18next.off('languageChanged', onLangChanged)
  }, [])

  return <>{props.story()}</>
}

export function withi18nNS(ns: string | string[]) {
  // eslint-disable-next-line react/display-name
  return fn => {
    i18next.loadNamespaces(ns)
    return <I18nNS story={fn} />
  }
}

/**
 * Perform side effects and clean up when switching stroies
 * @param fn performs side effects and optionally returns a clean-up function
 */
export function withSideEffect(fn: React.EffectCallback) {
  const SideEffect: FC<{ story: Function }> = props => {
    useEffect(fn, [])
    return <>{props.story()}</>
  }
  // eslint-disable-next-line react/display-name
  return story => <SideEffect story={story} />
}

export function mockRuntimeMessage(fn: (message: Message) => Promise<any>) {
  return () => {
    browser.runtime.sendMessage.callsFake(fn)

    return () => {
      browser.runtime.sendMessage.callsFake(() => Promise.resolve())
    }
  }
}

export interface WithSaladictPanelOptions {
  /** before the story component */
  head?: React.ReactNode
  width?: number
  height?: number
  withAnimation?: boolean
  fontSize?: number
  color?: string
  backgroundColor?: string
}

/**
 * Fake salalict panel
 */
export function withSaladictPanel(options: WithSaladictPanelOptions) {
  return function SaladcitPanel(story: Function) {
    const width =
      options.width != null ? options.width : number('Panel Width', 450)

    const height =
      options.height != null
        ? options.height
        : number('Panel Height', 450 * 1.68)

    const withAnimation =
      options.withAnimation != null
        ? options.withAnimation
        : boolean('Enable Animation', true)

    const fontSize =
      options.fontSize != null
        ? options.fontSize
        : number('Panel Font Size', 13)

    const color =
      options.color != null ? options.color : colorKnob('Panel Color', '#333')

    const backgroundColor =
      options.backgroundColor != null
        ? options.backgroundColor
        : colorKnob('Panel Background Color', '#fff')

    return (
      <root.div style={{ width, margin: '10px auto' }}>
        <style>{require('@/_sass_global/_reset.scss').toString()}</style>
        <div
          className={withAnimation ? 'isAnimate' : ''}
          style={{
            fontSize,
            width,
            color,
            backgroundColor,
            '--panel-width': `${width}px`,
            '--panel-height': `${height}px`,
            '--panel-color': color,
            '--panel-background-color': backgroundColor
          }}
          // bug https://github.com/storybookjs/storybook/issues/6569
          onKeyDown={e => e.stopPropagation()}
        >
          {options.head}
          {story({
            width,
            height,
            fontSize,
            withAnimation
          })}
        </div>
      </root.div>
    )
  }
}