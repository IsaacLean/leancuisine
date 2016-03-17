$(function() {
    console.log('script start');

    function AppViewModel() {
        this.firstName = 'Bert';
        this.lastName = 'Bertington';
        this.dlData = ko.observable('dlData not downloaded yet...');
    }

    var appViewModelInstance = new AppViewModel();

    $.ajax({
        url: 'https://api.dev.medable.com/leancuisine/v2/accounts/login',
        type: 'POST',
        contentType: 'application/json; charset=UTF-8',
        dataType : 'json',
        headers: {
            'Medable-Client-Key': apiKey
        },
        data: JSON.stringify({
            'email': email,
            'password': pw,
            'location': {
                'verificationToken': '123456',
                'locationName': 'New Orleans',
                'singleUse': true
            }
        }),
        success: function(response) {
            console.log(AppViewModel);
            appViewModelInstance.dlData(JSON.stringify(response));
        }
    });

    ko.applyBindings(appViewModelInstance);
});