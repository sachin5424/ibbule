const { models } = require("../models/_index")

exports.all_token_data = async(req,res)=>{
    try {
          let data = await models.tokenModel.aggregate([
               
            {
                $addFields:{
                    a:1
                }
            },
          
          ]);
            return res.status(200).json({
                status:200,
                message:"all list successfully",
                data
            })
    } catch (error) {
        console.log({error})
        res.status(500).json({status:500,message:error.message})
    }
}