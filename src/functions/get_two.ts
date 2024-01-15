const getTwo = () => {
    const wiki: Window = window.open(
        'https://fr.wikipedia.org/wiki/Wikip%C3%A9dia:Accueil_principal',
    );
    wiki.addEventListener<'load'>(
        'load',
        () => {
            console.log('wiki charged');
        },
        true,
    );
};

export default getTwo;
