const { format, addHours } = require('date-fns');
const { utcToZonedTime, format: formatTz } = require('date-fns-tz');

const time_zone = 'America/Sao_Paulo';

async function FormatDateTime(date) {
    try {
        const zoned_date = utcToZonedTime(date, time_zone);
        const correctedDate = addHours(zoned_date, -3);
        return formatTz(correctedDate, 'dd/MM/yyyy HH:mm:ss', { time_zone });
    } catch (error) {
        console.log('Erro ao formatar data: ', error)
        return null
    }
}

module.exports = { FormatDateTime };
