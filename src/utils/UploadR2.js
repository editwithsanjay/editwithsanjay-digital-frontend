import Axios from "./Axios";
import SummaryApi from "../common/SummaryApi";

const uploadToR2 = async (file) => {
    try {
        const formData = new FormData()
        formData.append('image', file)

        const response = await Axios({
            ...SummaryApi.uploadImageR2,
            data: formData
        })

        return response.data.data
    } catch (error) {
        return error
    }
}

export default uploadToR2
