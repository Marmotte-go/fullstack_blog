import './Switch.scss'
import { ThemeContext } from '../contexts/ThemeContext';
import { useContext } from 'react';

const Switch = () => {
  const {setTheme} = useContext(ThemeContext);

  const handleChange = (e) => {
    setTheme(e.target.checked? "light" : "dark")
  }

  return (
    <div className='switch'>
      <label htmlFor="toggleSwitch">
        <input type="checkbox" name="toggleSwitch" id="toggleSwitch"  onChange={handleChange}/>
        <span className='toggle'></span>
      </label>
    </div>
  )
}

export default Switch