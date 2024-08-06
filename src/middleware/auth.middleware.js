import { verify } from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export const checkToken = (req, res, next) => {
    let token = req.headers.authorization
    console.log('🚀 ~ file: auth.middleware.js:9 ~ checkToken ~ token:', token)
    // return res.status(200).json(token)
    if (!token) {
        return res.json({
            success: false,
            message: 'None of Token',
        })
    }
    token = token.slice(7) // Loại bỏ "Bearer " từ chuỗi token
    verify(token, process.env.SECRET_KEY || 'masterP', (err, decoded) => {
        if (err) {
            return res.json({
                success: false,
                message: 'Invalid token',
            })
        }
        req.user = decoded.result;
    })
    return next();
}

export default checkToken
