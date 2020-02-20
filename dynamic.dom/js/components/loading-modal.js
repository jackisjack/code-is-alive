function ShowLoading() {

    // Affichage du loading
    var modal = document.getElementById('loading-modal');
    modal.style.display = "block";

    // Masquage des menus
    $(".MenuACacher").hide();

}

function SetLoadingMessage(message) {

    if (message != '#hasard')
    {
        $("#loading-modal p:first").text(message);
    }
    else
    {
        ListeMessagesAttentesBidons = [
            'Calibrage du navigateur instantié',
            'Définition de la gravité ascensionnelle',
            'Libération des flux intemporels',
            'Chargement des éléments indistinguibles',
            'Recalibrage du module px-021',
            'Inversion des pôles bilatéraux',
            'Revalorisation de la nomenclature',
            'Encapulsation des membres internes du noyau',
            'Vidage du socle antinomique',
            'Analyse des vitesses invariables'
        ];

        MessageAuHasard = ListeMessagesAttentesBidons[Math.round(Math.random() * (ListeMessagesAttentesBidons.length - 1))];

        $("#loading-modal:first").text(MessageAuHasard);

    }

}

function HideLoading(message) {

    $("#loading-modal").fadeOut(500);
    
    $(".MenuACacher").show();

}
