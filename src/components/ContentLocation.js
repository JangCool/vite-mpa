import { reactive } from "vue"

export default {
    name: 'contentLocation',
    props:{
        locationName: {
            type: String,
            default: null
        },
        url: {
            type: String,
            default: null
        },
        data:{
            type: Object,
            default: ()=>[]
        }
    },
    setup (props) {

        const pageData = reactive({
            displayMenu: null,
            menuId: null,
            currentMenu : {},
            locations : props.data,
            isBookMark : false
        })

        return {
            pageData
        }
    }
}