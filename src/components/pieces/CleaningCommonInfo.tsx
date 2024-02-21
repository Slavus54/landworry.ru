import React from 'react'
import {CleaningCommonInfoType} from '../../types/types'

const CleaningCommonInfo: React.FC<CleaningCommonInfoType> = ({dateUp, time}) => {
    return (
        <div className='items small'>
            <h4 className='pale'>Дата: {dateUp}</h4>
            <h4 className='pale'>Начало в {time}</h4>
        </div>
    )
}

export default CleaningCommonInfo 