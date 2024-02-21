import {CounterViewProps} from '../../types/types'
import MinusImage from '../../assets/minus.png'
import PlusImage from '../../assets/plus--v1.png'

const CounterView: React.FC<CounterViewProps> = ({num, setNum, part = 1, min = part, max = part * 100, children, selector = 'items little'}) => {
    return (
        <div className={selector}>
            <img onClick={() => num > min && setNum(num - part)} src={MinusImage} className='arrow' />
            {children}
            <img onClick={() => num < max && setNum(num + part)} src={PlusImage} className='arrow' />
        </div>
    )
}   

export default CounterView