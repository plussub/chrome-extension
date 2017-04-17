var srtPlayer = srtPlayer || {};
if (typeof exports !== 'undefined') {
    exports.srtPlayer = srtPlayer;
    var messageBus = null;
    srtPlayer.Descriptor = require('./../../Descriptor.js').srtPlayer.Descriptor;
}

srtPlayer.MovieInformationService = srtPlayer.MovieInformationService || ((messageBusLocal = messageBus, fetch = window.fetch) => {

        var SERVICE_CHANNEL = messageBusLocal.channel(srtPlayer.Descriptor.CHANNEL.SERVICE);
        var SERVICE_CONST = srtPlayer.Descriptor.SERVICE.MOVIE_INFORMATION;
        // var console = srtPlayer.LogService.getLoggerFor(SERVICE_CONST.NAME);

        SERVICE_CHANNEL.subscribe({
            topic: SERVICE_CONST.SUB.SEARCH,
            callback: loadData
        });

        function loadData(query) {


            fetch('https://0e53p7322m.execute-api.eu-central-1.amazonaws.com/release/movie/search/'+ decodeURIComponent(query))
                .then((response) => {
                    if (response.status !== 200) {
                        console.log('Invalid Status Code: ' + response.status);
                        return;
                    }
                    // Examine the text in the response
                    response.json().then((data) => createOmdbInformationFrom(createImbdInformationFrom(data)));
                })
                .catch((err) => SERVICE_CHANNEL.publish({
                    topic: srtPlayer.Descriptor.SERVICE.NOTIFICATION.SUB.NOTIFY,
                    data: {
                        msg: "Something goes wrong with(IMDB)."
                    }
                }));
        }

        function createImbdInformationFrom(imdbResponse) {
            return Object.keys(imdbResponse).map((k) => imdbResponse[k]).reduce((p, c) => {
                p.push(...c);
                return p;
            }, []);
        }

        function createOmdbInformationFrom(imdbResult) {

            var missingPosterFb = "data:image/png;base64,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";
            var maxRequestedImdb = 10;
            var imdbResultPartial = imdbResult.slice(0, imdbResult.length > maxRequestedImdb ? maxRequestedImdb : imdbResult.length);

            Promise.all(imdbResultPartial.map((rawImdb) =>
                fetch('https://0e53p7322m.execute-api.eu-central-1.amazonaws.com/release/movie/information/' + rawImdb.id)
                    .then(response => response.json())
                    .catch((err) => SERVICE_CHANNEL.publish({
                        topic: srtPlayer.Descriptor.SERVICE.NOTIFICATION.SUB.NOTIFY,
                        data: {
                            msg: "Something goes wrong with (OMDB)."
                        }
                    }))
            )).then((responses) =>
                responses
                    .map(entry => entry.Poster == 'N/A' ? Object.assign(entry, {Poster: missingPosterFb}) : entry)
                    .map(entry => Object.assign(entry, {
                        valueField: JSON.stringify(entry)
                    }))
            ).then((values) => SERVICE_CHANNEL.publish({
                topic: SERVICE_CONST.PUB.SEARCH_RESULT,
                data: values
            }));
        }
    });

//instant service does not correct initialize messageBus (in testfiles)
if (typeof exports === 'undefined' && typeof srtPlayer.MovieInformationService === 'function') {
    srtPlayer.MovieInformationService = srtPlayer.MovieInformationService();
}
