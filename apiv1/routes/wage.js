const services = require('../../services')
const moment = require('moment')
const { extendMoment } = require('moment-range')
const router = require('express').Router()
const calcMinutes = require('./calculateMinutes')
const fs = require('fs')

const Moment = extendMoment(moment)

moment.locale('hu')

router.get('/:id', async (req, res) => {
    const users = []
    await services.firestore.collection(`users/${req.params.id}/worksheet`).get()
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

/*router.get('/add/all/:id', async (req, res) => {

    fs.readFile('./worksheet.json', 'utf8', async (err, data) => {
        if (err) return res.status(400).send(err.message)
        data = JSON.parse(data)
        await data.forEach(async d => {

            let date = d.date['$date'].substring(0, 10)
            let workStart = d.workStart
            let workEnd = d.workEnd
            let breaks = d.breakStart ? `${d.breakStart};${d.breakEnd}` : null
            let shiftMinutes = d.shiftMinutes

            workStart = moment(`${date} ${workStart}`)
            workEnd = moment(`${date} ${workEnd}`)

            breaks = breaks ? breaks.split('-').map(item => {
                let currentItem = item.split(';')
                return Moment.range(moment(`${date} ${currentItem[0]}`), moment(`${date} ${currentItem[1]}`)).toString()
            }) : null

            let worksheetItem = {
                date: moment(date).format(),
                workStart: workStart.format(),
                breaks: breaks,
                workEnd: workEnd.format(),
                shiftMinutes: shiftMinutes || 0
            }
            await services.firestore.collection(`users/${req.params.id}/worksheet`)
                .add(worksheetItem)
            console.log('added')

        });

        return res.status(200).send('works')
    })
})

*/

router.post('/add/:id', async (req, res) => {

    let {
        date,
        workStart,
        breaks,
        workEnd,
        shiftMinutes,
    } = req.body

    workStart = moment(`${date} ${workStart}`)
    workEnd = moment(`${date} ${workEnd}`)

    breaks = breaks ? breaks.split('-').map(item => {
        let currentItem = item.split(';')
        return Moment.range(moment(`${date} ${currentItem[0]}`), moment(`${date} ${currentItem[1]}`)).toString()
    }) : null

    let worksheetItem = {
        date: moment(date).format(),
        workStart: workStart.format(),
        breaks: breaks,
        workEnd: workEnd.format(),
        shiftMinutes: shiftMinutes || 0
    }
    await services.firestore.collection(`users/${req.params.id}/worksheet`)
        .add(worksheetItem)
    res.status(200).send(worksheetItem)
})

router.get('/getWage/:id-:month', async (req, res) => {
    let money
    let minutes = {
        0: 0,
        1: 0,
        2: 0,
        3: 0
    }
    let month = getMonth(moment().year(), req?.params?.month)
    await services.firestore.collection(`users/${req.params.id}/worksheet`)
        .orderBy("date")
        .startAt(month?.range?.start.format())
        .endAt(month?.range?.end.format())
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let data = doc.data()
                let currentMinutes = calcMinutes.calculate3(
                    data.date,
                    data.workStart,
                    data.workEnd,
                    data.breaks ? data.breaks : null
                )

                minutes[0] += currentMinutes[0]
                minutes[1] += currentMinutes[1]
                minutes[2] += currentMinutes[2]

                let day = moment(data.date).isoWeekday()
                let isWeekend = (day === 6) || (day === 0);
                if (isWeekend) minutes[3] += data.shiftMinutes
            });

        }).catch()

    await services.firestore.collection('users').doc(req.params.id).get()
        .then((querySnapshot) => {
            let salary = querySnapshot.data().salary
            money = ((minutes[2] * (salary / 60 * 1.30)) + (minutes[1] * (salary / 60)) + (minutes[0] * (salary / 60 * 1.40))) * 0.85
            if (minutes[3] >= 20 * 60) money += 10000
        }).catch()
    res.status(200).send(money.toString())
})

let getMonth = (year, monthID) => {
    let selectedMonth

    let months = [
        {
            id: "January",
            start: "01-01",
            end: "01-31"
        }, {
            id: "February",
            start: "02-01",
            end: moment().isLeapYear() ? "02-29" : "02-28"
        }, {
            id: "March",
            start: "03-01",
            end: "03-31"
        }, {
            id: "April",
            start: "04-01",
            end: "04-30"
        }, {
            id: "May",
            start: "05-01",
            end: "05-31"
        }, {
            id: "June",
            start: "06-01",
            end: "06-30"
        }, {
            id: "July",
            start: "07-01",
            end: "07-31"
        }, {
            id: "August",
            start: "08-01",
            end: "08-31"
        }, {
            id: "September",
            start: "09-01",
            end: "09-30"
        }, {
            id: "October",
            start: "10-01",
            end: "10-31"
        }, {
            id: "November",
            start: "11-01",
            end: "11-30"
        }, {
            id: "December",
            start: "12-01",
            end: "12-31"
        },
    ]

    let monthRanges = []

    months.forEach((item) => {
        let currentMonth = {
            id: item.id,
            range: Moment.range(moment(`${year}-${item.start}`, "YYYY-MM-DD"), moment(`${year}-${item.end}`, "YYYY-MM-DD"))
        }

        monthRanges.push(currentMonth)
    })

    selectedMonth = monthID && monthRanges.find(item => item.id/*.toLowerCase()*/ === monthID)

    return selectedMonth
}

module.exports = router