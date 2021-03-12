const Moment = require('moment')
const { extendMoment } = require('moment-range')

const moment = extendMoment(Moment)
moment.locale('hu')

let minutes = {
    0: 0,
    1: 0,
    2: 0
}

let shiftMinutes = {
    0: 0,
    1: 0,
    2: 0,
}

let ranges = [
    moment.range(Moment("00:00:00", "HH:mm:ss"), Moment("06:00:00", "HH:mm:ss")),
    moment.range(Moment("06:00:00", "HH:mm:ss"), Moment("18:00:00", "HH:mm:ss")),
    moment.range(Moment("18:00:00", "HH:mm:ss"), Moment("23:59:00", "HH:mm:ss"))
]
calculate2 = (justMinutes, start, end, breaks, date) => {
    /*
        let beforeBreak
        let afterBreak
        let shift
        */
    let onlyMinutes = 0
    minutes = {
        0: 0,
        1: 0,
        2: 0
    }
    /*
        let breakRanges = breaks.map(item => {
            return moment.rangeFromISOString(item)
        })
    
        console.log(start)
        console.log(end)
    
        setRanges(date)
        let beforeBreak
        let afterBreak
        let shift
        if(breakStart != null && breakEnd != null){
            beforeBreak = moment.range(start, breakStart)
            afterBreak = moment.range(breakEnd, end)
        } else {
            shift = moment.range(start, end)
        }
        let startIndex = getPotlekRangeIndex(start)
        let endIndex = getPotlekRangeIndex(end)
        ranges.forEach((range, index) => {
            if (endIndex < startIndex) {
                end.add(1, 'days')
                afterBreak = moment.range(breakEnd, end)
                ranges[0].start.add(1, 'days')
                ranges[0].end.add(1, 'days')
            }
            if(shift == null){
                if (range.intersect(beforeBreak) !== null) {
                    minutes[index] += range.intersect(beforeBreak).diff('minutes')
                    //console.log(minutes[index])
                }
                if (range.intersect(afterBreak) !== null) {
                    minutes[index] += range.intersect(afterBreak).diff('minutes')
                    //console.log(minutes[index])
                }
            } else{
                if (range.intersect(shift) !== null) {
                    minutes[index] += range.intersect(shift).diff('minutes')
                    //console.log(minutes[index])
                }
            }
        })
    
        onlyMinutes = minutes[0] + minutes[1] + minutes[2]
        console.log(minutes)*/
    if (justMinutes) return onlyMinutes
    return minutes
}

setRanges = (date) => {
    ranges.forEach((range) => {
        range.start.date(date.date()).month(date.month()).year(date.year())
        range.end.date(date.date()).month(date.month()).year(date.year())
    })
}

getPotlekRangeIndex = (shift) => {
    let index = -1
    ranges.forEach((r, i) => {
        if (r.contains(shift)) index = i
    })

    return index
}

calculate3 = (date, start, end, breaks) => {
    setRanges(Moment(date))

    if (breaks) {
        let breakRanges = breaks.map(item => {
            return moment.rangeFromISOString(item)
        })

        ranges.forEach((range, r) => {
            breakRanges.forEach((_break, b) => {
                currentMinutes[r] -= range.intersect(_break) ? range.intersect(_break).diff('minutes') : 0
            })
        })
    }

    let currentMinutes = splitShiftToSalaryRange(moment.range(Moment(start), Moment(end)))
    //console.log(`${Moment(date).get('month') + 1}-${Moment(date).get('day')} ${JSON.stringify(currentMinutes)}`)
    return currentMinutes
}


splitShiftToSalaryRange = (shift) => {
    shiftMinutes = {
        0: 0,
        1: 0,
        2: 0,
    }
    ranges.forEach((range, r) => {
        shiftMinutes[r] += range.intersect(shift) ? range.intersect(shift).diff('minutes') : 0
    })

    return shiftMinutes
}

module.exports = {
    calculate2,
    calculate3,
    minutes
}