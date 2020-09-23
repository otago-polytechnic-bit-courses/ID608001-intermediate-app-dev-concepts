import React, { useState } from 'react'
import { CSSTransition } from 'react-transition-group'
import { ReactComponent as CogIcon } from '../icons/cog.svg'
import { ReactComponent as ArrowIcon } from '../icons/arrow.svg'
import { ReactComponent as ListIcon } from '../icons/list.svg'
import { ReactComponent as LockIcon } from '../icons/lock.svg'
import { ReactComponent as GlobeIcon } from '../icons/globe.svg'

const DropdownMenu = () => {
  const [activeMenu, setActiveMenu] = useState('main')
  const [menuHeight, setMenuHeight] = useState(null)

  const calcHeight = (el) => {
    const height = el.offsetHeight
    setMenuHeight(height)
  }

  const DropdownItem = (props) => {
    return (
      <a
        href='#'
        className='menu-item'
        onClick={() => props.goToMenu && setActiveMenu(props.goToMenu)}>
        <span className='icon-button'>{props.leftIcon}</span>
        {props.children}
      </a>
    )
  }

  return (
    <div className='dropdown' style={{ height: menuHeight }}>
      <CSSTransition
        in={activeMenu === 'main'}
        timeout={500}
        classNames='menu-primary'
        unmountOnExit
        onEnter={calcHeight}>
        <div className='menu'>
          <DropdownItem>Grayson Orr</DropdownItem>
          <hr />
          <DropdownItem leftIcon={<CogIcon />} goToMenu='settings'>
            Settings
          </DropdownItem>
        </div>
      </CSSTransition>

      <CSSTransition
        in={activeMenu === 'settings'}
        timeout={500}
        classNames='menu-secondary'
        unmountOnExit
        onEnter={calcHeight}>
        <div className='menu'>
          <DropdownItem goToMenu='main' leftIcon={<ArrowIcon />}>
            <h2>Settings & Privacy</h2>
          </DropdownItem>
          <DropdownItem leftIcon={<CogIcon />}>Settings</DropdownItem>
          <DropdownItem leftIcon={<LockIcon />}>Privacy Shortcuts</DropdownItem>
          <DropdownItem leftIcon={<ListIcon />}>Activity Log</DropdownItem>
          <DropdownItem leftIcon={<GlobeIcon />}>Language</DropdownItem>
        </div>
      </CSSTransition>
    </div>
  )
}

export default DropdownMenu
