import AddressImage from '../../assets/address--v1.png'
import VisitImage from '../../assets/visit--v1.png'

const MapPicker = ({type = 'home'}) => {
    return type === 'home' ?  
        <img src={AddressImage} className='map_picker' /> 
    :  
        <img src={VisitImage} className='map_picker' />
}

export default MapPicker