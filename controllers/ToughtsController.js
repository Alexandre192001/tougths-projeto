const Tought = require("../models/Tought")
const User = require("../models/User")
const {Op} = require('sequelize')

module.exports = class ToughtController {
    static async showToughts(req, res) {   
        let search = ''
        if(req.query.search){
            search=req.query.search
        }
        let order = 'DESC'
        if(req.query.order==='old'){         
            order = 'ASC'
        } else{
            order = 'DESC'
        }
        const toughtsData = await Tought.findAll({
            include:User,
            where:{
                title:{[Op.like]:`%${search}%`}
            },
            order:[['createdAt',order]]
        })
        const toughts = toughtsData.map((result)=>result.get({plain:true}))
        let toughtsQty = toughts.length
        if(toughtsQty===0){
            toughtsQty=false
        }
        res.render('toughts/home', {toughts,search,toughtsQty})}
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
        } catch (error) {console.log(error)}
    }
    static async removeTought(req,res){
        try {
            const id = req.body.id
            const UserId = req.session.userid
            await Tought.destroy({where:{id:id, UserId:UserId}})
            req.flash('message', 'Pensamento removido com sucesso !')
            req.session.save(() => {
                res.redirect('/toughts/dashboard')
            })
        } catch (error) {console.log(error) }
    }
    static async updateToughtSave(req,res){
        try {
            const id = req.body.id
            const tought = {
                title:req.body.title
            }
        await Tought.update(tought, {where:{id:id}})
        req.flash('message', 'Pensamento atualizado com sucesso !')
            req.session.save(() => {
                res.redirect('/toughts/dashboard')
        })  
        } catch (error) {console.log(error)}
    }
    static async updateTought(req,res){
        const id = req.params.id
        const tought = await Tought.findOne({raw:true,where:{id:id}})
        res.render('toughts/edit', {tought})
    }

    static createTought(req, res) {
        res.render('toughts/create')
    }
}