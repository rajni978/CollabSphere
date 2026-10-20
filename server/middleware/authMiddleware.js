import jwt from "jsonwebtoken";

const authMiddleware = (req,res,next) => {

    try{

        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith("Bearer ")){

            return res.status(401).json({
                message:"Authentication required .Please log in",

            });
        }

        const token = authHeader.split(" ")[1];

        const decode = jwt.verify(token,process.env.JWT_SECRET);

        req.userId = decode.userId;
        next();

    }catch(error){

        return res.status(401).json({
            message:"Invalid or expired token.Please log in again",
        });
    }
};

export default authMiddleware;