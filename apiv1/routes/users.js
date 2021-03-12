const services = require('../../services')
const router = require('express').Router()

router.get('/', async (req, res) => {
    const users = []
    await services.firestore.collection('users').get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let currentUser = {
                    id: doc.id,
                    data: doc.data()
                }
                users.push(currentUser)
            });

        }).catch()
    res.status(200).send(users)
})

router.get('/:id', async (req, res) => {
    const user = []
    await services.firestore.collection('users').doc(req.params.id).get()
        .then((querySnapshot) => {
            let currentUser = {
                id: querySnapshot.id,
                data: querySnapshot.data()
            }
            user.push(currentUser)

        }).catch()
    res.status(200).send(user)
})

module.exports = router