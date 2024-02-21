import {gql} from '@apollo/client'

export const updateProfilePersonalInfoM = gql`
    mutation updateProfilePersonalInfo($account_id: String!, $main_photo: String!) {
        updateProfilePersonalInfo(account_id: $account_id, main_photo: $main_photo) 
    }
`

export const updateProfileGeoInfoM = gql`
    mutation updateProfileGeoInfo($account_id: String!, $region: String!, $cords: ICord!) {
        updateProfileGeoInfo(account_id: $account_id, region: $region, cords: $cords) 
    }
`

export const updateProfileCommonInfoM = gql`
    mutation updateProfileCommonInfo($account_id: String!, $timestamp: String!, $radius: Float!) {
        updateProfileCommonInfo(account_id: $account_id, timestamp: $timestamp, radius: $radius)
    }
`

export const updateProfilePasswordM = gql`
    mutation updateProfilePassword($account_id: String!, $password: String!) {
        updateProfilePassword(account_id: $account_id, password: $password)
    }
`


export const manageProfileServiceM = gql`
    mutation manageProfileService($account_id: String!, $option: String!, $title: String!, $category: String!, $level: String!, $cost: Float!, $image: String!, $coll_id: String!) {
        manageProfileService(account_id: $account_id, option: $option, title: $title, category: $category, level: $level, cost: $cost, image: $image, coll_id: $coll_id)
    }
`

export const createProfileM = gql`
    mutation createProfile($username: String!, $password: String!, $telegram: String!, $timestamp: String!, $radius: Float!, $region: String!, $cords: ICord!, $main_photo: String!) {
        createProfile(username: $username, password: $password, telegram: $telegram, timestamp: $timestamp, radius: $radius, region: $region, cords: $cords, main_photo: $main_photo) {
            account_id
            username
        }
    }
`

export const loginProfileM = gql`
    mutation loginProfile($password: String!) {
        loginProfile(password: $password) {
            account_id
            username
        }
    }
`
