import axios from 'axios';

export const cloudinary_cloud_name = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
export const cloudinary_upload_preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const uploadToCloudinary = async (file) => {
    try {
        console.log("cloudinary upload preset...")
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', cloudinary_upload_preset); // Replace with your Cloudinary upload preset

        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${cloudinary_cloud_name}/image/upload`, 
            formData
        );

        console.log("image uploaded to cloudinary , inside cloudinary() : ",response , response.data.secure_url );

        return response.data.secure_url; // Cloudinary returns a secure URL
    } catch (error) {
        console.error("Upload failed:", error);
        return null;
    }
};

export default uploadToCloudinary;
 