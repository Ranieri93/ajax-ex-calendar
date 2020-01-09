$(document).ready(function() {

    // uso handlebars per facilitare la crazione del template:
    var source  = $("#calendarTemplate").html();
    var template = Handlebars.compile(source);

    // mi definisco la data di partenza:
    var startingDate = '2018-01-01';
    var startingMoment = moment(startingDate);
    // console.log(startingMoment.format('YYYY MM DD'));


    // console.log(startingMoment.month());

    writeDays(startingMoment)
    callApiHolidays(startingMoment)

    // vado ad aggiungere un mese attraverso il click:
    $('#nextMonth').click(function() {

        // uso la funzione add di moment per aggiungere un mese
        startingMoment.add(1,'M');
        // console.log(startingMoment.format('YYYY MM DD'));
        writeDays(startingMoment)


        callApiHolidays(startingMoment)


    });

    $('#prevMonth').click(function() {

        // uso la funzione add di moment per aggiungere un mese
        startingMoment.subtract(1,'M');
        // console.log(startingMoment.format('YYYY MM DD'));
        writeDays(startingMoment)


        callApiHolidays(startingMoment)

    });

    function writeDays (moment) {
        // faccio clear del div ad ogni click
        $('#calendar').empty();
        // recupero i giorni del mese corrente:
        var daysInMonth = moment.daysInMonth();
        // console.log(daysInMonth);
        // mi recupero il lettering del mese:
        var monthName = moment.format('MMMM');
        // console.log(monthName);

        // dovrò andare ad inserire la nuova variabile di handlebars. Creo quindi un clone del moment, perchè se non lo facessi andrei a modificarlo del tutto:

        var newMoment = moment.clone()// sono un coglione per la scelta della variabile...

        $('#currentMonth').text(monthName)

        // faccio un ciclo for per stamparmi tutti i numeri del mese:
        for (var i = 1 ; i <= daysInMonth ; i++) {
            // variabile del template
            var templateVariables = {
                days: i + ' ' + monthName,
                // vado quindi ad inserire il nuovo dato nella formattazione che ci serve:
                standardedDays: newMoment.format('YYYY-MM-DD')
            }
            var finalTemplate = template(templateVariables);

            $('#calendar').append(finalTemplate);
            // adesso posso aggiungere i giorni tranquillamente perchè sto lavorando su un clone:
            newMoment.add(1,'d')
        }
    };
    // vado ad effettuare la chiamata ajax per recuperare i le festività:

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
                    console.log(currentResponse);
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




});
