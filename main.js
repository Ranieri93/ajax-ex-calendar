$(document).ready(function() {

    // uso handlebars per facilitare la crazione del template:
    var source  = $("#calendarTemplate").html();
    var template = Handlebars.compile(source);

    // mi definisco la data di partenza:
    var startingDate = '2018-01-01';
    var startCalendar = '2018-01-01';
    var finalCalendar = '2018-12-01'; // uso il 1 di dicembre e non in 31 come fine del calendario poichè altrimenti il controllo successivo non avrebbe senso, data l'aggiunta del mese continua in risposta al click
    var startingMoment = moment(startingDate);
    // console.log(startingMoment.format('YYYY MM DD'));
    // console.log(startingMoment.year());

    writeDays(startingMoment)
    callApiHolidays(startingMoment)

    // vado ad aggiungere un mese attraverso il click:
    $('#nextMonth').click(function() {
        // console.log($('ul li:first-child').attr('data-day'));
        // uso la funzione add di moment per aggiungere un mese
        startingMoment.add(1,'M');
        // console.log(startingMoment.year());
        // console.log(startingMoment.format('YYYY MM DD'));
        writeDays(startingMoment)
        callApiHolidays(startingMoment)
    });

    $('#prevMonth').click(function() {
        // uso la funzione add di moment per aggiungere un mese
        startingMoment.subtract(1,'M');
        // console.log(startingMoment.year());
        // console.log(startingMoment.format('YYYY MM DD'));
        writeDays(startingMoment)
        callApiHolidays(startingMoment)
    });

    function writeDays (moment) {
        // faccio clear del div ad ogni click
        $('#calendar').empty();

        // recupero il numero del mese da inserire nella funzione di controllo dei button:
        checking_valid_month(moment.month())
        
        // recupero i giorni del mese corrente:
        var daysInMonth = moment.daysInMonth();
        // console.log(daysInMonth);
        // mi recupero il lettering del mese:
        var monthName = moment.format('MMMM');

        // dovrò andare ad inserire la nuova variabile di handlebars. Creo quindi un clone del moment, perchè se non lo facessi andrei a modificare la variabile di imput del tutto:

        var newMoment = moment.clone();

        var firstweekday = newMoment.weekday();
        console.log(firstweekday);
        // ho creato una funzione per aggiungere i quadratini bianchi:
        moveFirstDayCalendar(firstweekday)
        $('#currentMonth').text(monthName)
        // faccio un ciclo for per stamparmi tutti i numeri del mese:
        for (var i = 1 ; i <= daysInMonth ; i++) {
            // variabile del template
            var templateVariables = {
                days: i + ' ' + monthName + ' ' + newMoment.format('ddd'),
                // vado quindi ad inserire il nuovo dato nella formattazione che ci serve:
                standardedDays: newMoment.format('YYYY-MM-DD')
            }
            var finalTemplate = template(templateVariables);
            $('#calendar').append(finalTemplate);
            // adesso posso aggiungere i giorni tranquillamente perchè sto lavorando su un clone:
            newMoment.add(1,'d');
        }

    };
    // vado ad effettuare la chiamata ajax per recuperare i le festività:

    function moveFirstDayCalendar (number) {
        for (var i = 0; i < number; i++) {
            $('#calendar').prepend('<li></li>')
        }
    }

    function callApiHolidays ( monthDate ) {

        $.ajax ({
            'url':'https://flynn.boolean.careers/exercises/api/holidays',
            'data': {
                year: 2018,
                // mi recupero il numero del mese tramite la funzione .month
                month: monthDate.month()
            },
            'method':'GET',
            'success': function(data) {
                // mi devo andare a recuperare i dati dall' api:
                var responseAPI = data.response;
                // ci sono solo due parametri, che saranno:
                for (var i = 0; i < responseAPI.length; i++) {
                    var currentResponse = responseAPI[i];
                    var responseDate = currentResponse.date;
                    var responseName = currentResponse.name;
                    // tramite i selettori avanzati mi vado a cercare direttamente la corrispondenza tra le date:
                    $('#calendar [data-day="' + responseDate + '"]').addClass('holiday').append(' ' + responseName)
                }
            },
            'error': function () {
                alert('error')
            }
        });
    }

    function checking_valid_month(number) {
        $('#prevMonth').prop('disabled', false);
        $('#nextMonth').prop('disabled', false);
        if (number == 0) {
            $('#prevMonth').prop('disabled', true);
        } else if (number == 11) {
            $('#nextMonth').prop('disabled', true)
        }
    };
});
