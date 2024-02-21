import {FormPaginationProps} from '../../types/types'
import LeftArrow from '../../assets/left--v1.png'
import RightArrow from '../../assets/right--v1.png'

const FormPagination: React.FC<FormPaginationProps> = ({children, num, setNum, items = []}) => {
    return (
        <>
            <div className='items small form-back'>
                <img onClick={() => num > 0 && setNum(num - 1)} src={LeftArrow} className='icon' alt='prev' />
                {children}
                <img onClick={() => num < items.length - 1 && setNum(num + 1)} src={RightArrow} className='icon' alt='next' />
            </div>
            {items[num]}           
        </>
    )
}

export default FormPagination