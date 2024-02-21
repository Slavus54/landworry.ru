// profile

export const SERVICE_TYPES = ['Газон', 'Ландшафт', 'Бетонирование']
export const LEVELS = ['Лёгкий', 'Средний', 'Тяжёлый']
export const DEFAULT_COST = 200


// area

export const AREA_TYPES = ['Газон', 'Тротуар', 'Сквер']
export const PROPERTY_FORMATS = ['Частный', 'Общественный']

export const NEED_TYPES = ['Материал', 'Услуга']
export const ARCHITECTURES = ['Классицизм', 'Модерн', 'Эклектика']

export const DEFAULT_NEED_COST = 1000

// product

export const PRODUCT_TYPES = ['Триммер', 'Семена', 'Цемент', 'Саженец', 'Одежда', 'Ресурс']
export const PRODUCT_LEVELS = ['Обычный', 'Премиальный']
export const COUNTRIES = ['США', 'Германия', 'Китай']
export const PRODUCT_STATUSES = ['В списке', 'Приобретено', 'В аренде']

export const CRITERIONS = ['Качество', 'Цена', 'Комфорт']
export const PRODUCT_INITIAL_COST = 1000

// cleaning

export const CLEANING_TYPES = ['Двор', 'Улица', 'Трасса']
export const SUBJECTS = ['Мешки', 'Провизия', 'Фотография']

export const RESULT_TYPES = ['Пластик', 'Стекло', 'Жесть']
export const TRASH_VOLUME_LIMIT = 200

// system

export const token = 'pk.eyJ1Ijoic2xhdnVzNTQiLCJhIjoiY2toYTAwYzdzMWF1dzJwbnptbGRiYmJqNyJ9.HzjnJX8t13sCZuVe2PiixA'
export const TG_ICON = 'https://img.icons8.com/color/48/telegram-app--v1.png'

export const change_window_title = (text) => document.title = `${text} | Landworry.ru`

export const VIEW_CONFIG = {
    latitude: 50.451,
    longitude: 30.522,
    width: '500px',
    height: '275px',
    zoom: 13
} 

export const CODE_ATTEMPTS = 3
export const WEBSERVER_URL = 'https://landworry-webserver.onrender.com'

export const SEARCH_PERCENT = 50
export const INITIAL_PERCENT = 10
export const COLLECTION_LIMIT = 10
export const PAGINATION_LIMIT = 4