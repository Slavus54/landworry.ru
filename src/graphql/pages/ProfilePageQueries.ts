import {gql} from '@apollo/client'

export const getProfilesQ = gql`
    query {
        getProfiles {
            account_id
            username
            password
            telegram
            timestamp
            radius
            region
            cords {
                lat
                long
            }
            main_photo
            services {
                shortid
                title
                category
                level
                cost
                image
                likes
            }
            account_components {
                shortid
                title
                path
            }
        }
    }
`

export const getProfileM = gql`
    mutation getProfile($account_id: String!) {
        getProfile(account_id: $account_id) {
            account_id
            username
            password
            telegram
            timestamp
            radius
            region
            cords {
                lat
                long
            }
            main_photo
            services {
                shortid
                title
                category
                level
                cost
                image
                likes
            }
            account_components {
                shortid
                title
                path
            }
        }
    }
`