const Tought = require("../models/Tought")
const User = require("../models/User")

module.exports = class ToughtController {
    static async showToughts(req, res) {
        res.render('toughts/home')
    }

    static async dashboard(req, res) {

        const userid = req.session.userid
        const user = await User.findOne({
            where:{id:userid},
            include:Tought,
            plain:true,
        })

        if(!user){
            res.redirect('/login')
        }

        const toughts = user.Toughts.map((result)=>result.dataValues)

        res.render('toughts/dashboard',{toughts})
    }

    static async createTougthtCreate(req, res) {
        const toughts = {
            title: req.body.title,
            UserId: req.session.userid
        }

        try {
            await Tought.create(toughts)
            req.flash('message', 'Pensamento criado com sucesso !')
            req.session.save(() => {
                res.redirect('/toughts/dashboard')
            })

        } catch (error) {
            console.log(error)
        }
    }

    static createTought(req, res) {
        res.render('toughts/create')
    }
}