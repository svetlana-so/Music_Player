import { GrHomeRounded } from 'react-icons/gr'
import { useHoverEffect } from '../../../customHooks/useHoverEffect'
import { getIconStyle } from '../../../utils/iconStyles'

export const Home = () => {
  const { isHovered, handleMouseEnter, handleMouseLeave } = useHoverEffect()
  const iconStyle = getIconStyle(isHovered)

  return (
    <div className="flex flex-col justify-center items-center">
      <div>
        <GrHomeRounded
          size={30}
          style={iconStyle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      </div>
      <div className="text-xs text-gray-500">
        <p>Home</p>
      </div>
    </div>
  )
}
